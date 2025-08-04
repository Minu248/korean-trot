import { createClient } from '@/lib/supabase/client';
import { Song } from '@/types/song';

/**
 * API를 통해 서버 사이드에서 랜덤 곡을 가져오는 함수 (RLS 대응)
 * API 접근 실패 시 기존 Supabase 직접 접근 방식으로 폴백
 * @param limit 가져올 곡의 개수 (기본값: 10)
 * @returns Promise<Song[]> 랜덤하게 선택된 곡 데이터 배열
 */
export const fetchRandomSongsFromAPI = async (limit: number = 10): Promise<Song[]> => {
  try {
    const response = await fetch(`/api/songs?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    return data.songs || [];
  } catch (error) {
    console.warn('API 접근 실패, 기존 Supabase 직접 접근 방식으로 폴백:', error);
    
    // API 접근 실패 시 기존 방식으로 폴백
    try {
      const fallbackSongs = await fetchRandomSongsFromSupabase(limit);
      return fallbackSongs;
    } catch (fallbackError) {
      console.error('폴백 방식도 실패:', fallbackError);
      throw fallbackError;
    }
  }
};

/**
 * Supabase에서 모든 곡 데이터를 가져오는 함수 (trot 사이트용)
 * @returns Promise<Song[]> 곡 데이터 배열
 */
export const fetchSongsFromSupabase = async (): Promise<Song[]> => {
  try {
    const supabase = createClient();
    
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
 * Supabase에서 랜덤하게 곡을 가져오는 함수 (trot 사이트용)
 * @param limit 가져올 곡의 개수 (기본값: 10)
 * @returns Promise<Song[]> 랜덤하게 선택된 곡 데이터 배열
 */
export const fetchRandomSongsFromSupabase = async (limit: number = 10): Promise<Song[]> => {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('songs')
      .select('title, artist, youtube_url')
      .eq('site_type', 'trot');

    if (error) {
      console.error('Supabase에서 곡 데이터를 가져오는 중 오류:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase에서 trot 곡 데이터가 없습니다.');
      return [];
    }

    // 프론트에서 랜덤 추출
    const shuffled = data.sort(() => Math.random() - 0.5);
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