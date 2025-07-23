import { createClient } from '@/lib/supabase/client';
import { Song } from '@/types/song';

/**
 * Supabase에서 모든 곡 데이터를 가져오는 함수
 * @returns Promise<Song[]> 곡 데이터 배열
 */
export const fetchSongsFromSupabase = async (): Promise<Song[]> => {
  try {
    const supabase = createClient();
    
    const { data, error } = await supabase
      .from('songs') // 테이블명을 'songs'로 가정
      .select('title, artist, youtube_url')
      .order('title', { ascending: true });

    if (error) {
      console.error('Supabase에서 곡 데이터를 가져오는 중 오류:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase에서 곡 데이터가 없습니다.');
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
 * Supabase에서 랜덤하게 곡을 가져오는 함수
 * @param limit 가져올 곡의 개수 (기본값: 10)
 * @returns Promise<Song[]> 랜덤하게 선택된 곡 데이터 배열
 */
export const fetchRandomSongsFromSupabase = async (limit: number = 10): Promise<Song[]> => {
  try {
    const supabase = createClient();
    
    // 전체 곡 개수를 먼저 확인
    const { count, error: countError } = await supabase
      .from('songs')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('곡 개수 확인 중 오류:', countError);
      throw countError;
    }

    if (!count || count === 0) {
      console.warn('Supabase에 곡 데이터가 없습니다.');
      return [];
    }

    // 랜덤 오프셋 계산
    const offset = Math.floor(Math.random() * Math.max(0, count - limit));
    
    const { data, error } = await supabase
      .from('songs')
      .select('title, artist, youtube_url')
      .range(offset, offset + limit - 1)
      .order('title', { ascending: true });

    if (error) {
      console.error('Supabase에서 랜덤 곡 데이터를 가져오는 중 오류:', error);
      throw error;
    }

    if (!data || data.length === 0) {
      console.warn('Supabase에서 랜덤 곡 데이터가 없습니다.');
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
    console.error('Supabase 랜덤 곡 데이터 가져오기 실패:', error);
    throw error;
  }
}; 