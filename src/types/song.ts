/**
 * 음악 관련 타입 정의
 */
export interface Song {
  "곡 제목": string;
  "아티스트": string;
  "링크": string;
}

/**
 * Supabase songs 테이블 구조 타입 정의
 */
export interface SupabaseSong {
  id?: number;
  title: string;
  artist: string;
  youtube_url: string;
  site_type: string;
  created_at?: string;
  updated_at?: string;
}

/**
 * 음악 플랫폼 관련 타입 정의
 */
export type MusicPlatform = 'youtube' | 'spotify' | 'apple' | 'vibe' | 'melon';

/**
 * 슬라이더 관련 타입 정의
 */
export interface SongSliderProps {
  songsData: Song[];
  isYouTubeAPIReady: boolean;
  onLike: (song: Song) => void;
  onShare: (song: Song) => void;
}

/**
 * 슬라이드 상태 타입 정의
 */
export type SlidePosition = 'current' | 'previous' | 'next' | 'idle'; 