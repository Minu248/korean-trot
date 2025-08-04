// src/lib/supabase/server.ts

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Song } from '@/types/song';

export const createClient = async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};

// RLS를 우회하기 위한 서비스 롤 클라이언트
export const createServiceRoleClient = () => {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          // 서비스 롤 클라이언트는 쿠키를 사용하지 않음
        },
      },
    }
  );
};

/**
 * 서버 사이드에서 모든 곡 데이터를 가져오는 함수 (trot 사이트용)
 * @returns Promise<Song[]> 곡 데이터 배열
 */
export const fetchSongsFromSupabaseServer = async (): Promise<Song[]> => {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('songs')
      .select('title, artist, youtube_url')
      .eq('site_type', 'trot') // trot 사이트 데이터만 필터링
      .order('title', { ascending: true });

    if (error) {
      console.error('Supabase에서 곡 데이터를 가져오는 중 오류:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase에서 trot 곡 데이터가 없습니다.');
      return [];
    }

    // Supabase 데이터를 Song 타입으로 변환
    const songs: Song[] = data.map(item => ({
      "곡 제목": item.title || '',
      "아티스트": item.artist || '',
      "링크": item.youtube_url || ''
    }));

    return songs;
  } catch (error) {
    console.error('Supabase 곡 데이터 가져오기 실패:', error);
    throw error;
  }
};

/**
 * 서버 사이드에서 랜덤하게 곡을 가져오는 함수 (trot 사이트용)
 * @param limit 가져올 곡의 개수 (기본값: 10)
 * @returns Promise<Song[]> 랜덤하게 선택된 곡 데이터 배열
 */
export const fetchRandomSongsFromSupabaseServer = async (limit: number = 10): Promise<Song[]> => {
  try {
    // 서비스 롤 클라이언트 사용 (RLS 우회)
    const supabase = createServiceRoleClient();
    
    const { data, error } = await supabase
      .from('songs')
      .select('title, artist, youtube_url, site_type');

    if (error) {
      console.error('Supabase에서 곡 데이터를 가져오는 중 오류:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase에서 곡 데이터가 없습니다.');
      return [];
    }

    // site_type이 'trot'인 데이터만 필터링
    const trotSongs = data.filter(item => item.site_type === 'trot');

    if (trotSongs.length === 0) {
      console.warn('site_type이 trot인 곡이 없습니다. 모든 곡을 사용합니다.');
      // trot 곡이 없으면 모든 곡 사용
      const shuffled = data.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, limit);

      const songs: Song[] = selected.map(item => ({
        "곡 제목": item.title || '',
        "아티스트": item.artist || '',
        "링크": item.youtube_url || ''
      }));

      return songs;
    }

    // 프론트에서 랜덤 추출
    const shuffled = trotSongs.sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, limit);

    const songs: Song[] = selected.map(item => ({
      "곡 제목": item.title || '',
      "아티스트": item.artist || '',
      "링크": item.youtube_url || ''
    }));

    return songs;
  } catch (error) {
    console.error('Supabase 랜덤 곡 데이터 가져오기 실패:', error);
    throw error;
  }
};