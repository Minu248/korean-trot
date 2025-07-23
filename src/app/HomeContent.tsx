'use client';
import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Song } from "@/types/song";
import { 
  TOAST_MESSAGES, 
  ANIMATION_TIMING 
} from "@/config/constants";
import { fetchRandomSongsFromSupabase } from "@/utils/supabaseUtils";
import { 
  getTodayRecommendedSongs, 
  addTodayRecommendedSong 
} from "@/utils/localStorage";
import { useToast } from "@/utils/hooks/useToast";
import { useRecommendationManager } from "@/utils/hooks/useRecommendationManager";
import { useAuth } from "@/utils/hooks/useAuth";
import { LoadingScreen } from "@/app/components/LoadingScreen";
import { Toast } from "@/app/components/Toast";
import { Footer } from "@/app/components/Footer";
import Image from "next/image";

export default function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toastMessage, showToast, isVisible } = useToast();
  const { canRecommend, recommendCount, processRecommendation } = useRecommendationManager();
  const { user, loading: authLoading, signInWithGoogle, signOut } = useAuth();
  
  const [isSharedMode, setIsSharedMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // URL 파라미터에서 공유된 곡 정보 확인
  useEffect(() => {
    const title = searchParams.get("title");
    const artist = searchParams.get("artist");
    const link = searchParams.get("link");
    
    if (title && artist && link) {
      setIsSharedMode(true);
    }
  }, [searchParams]);

  const fetchSongAndRedirect = async () => {
    try {
      setIsLoading(true);
      
      // Supabase에서 랜덤 곡 데이터 가져오기
      const fetchPromise = fetchRandomSongsFromSupabase(10);
      
      // 최소 4초는 로딩 화면을 보여주기 위해 Promise.all 사용
      const [songs] = await Promise.all([
        fetchPromise,
        new Promise(resolve => setTimeout(resolve, ANIMATION_TIMING.LOADING_SCREEN_DURATION))
      ]);
      
      if (songs.length === 0) throw new Error("곡 데이터가 없습니다");
      
      // 이미 추천된 곡 필터링
      const recommendedSongs = getTodayRecommendedSongs();
      const filteredSongs = songs.filter(song => !recommendedSongs.find(s => s["링크"] === song["링크"]));
      
      if (filteredSongs.length === 0) {
        setIsLoading(false);
        showToast(TOAST_MESSAGES.NO_MORE_SONGS);
        return;
      }
      
      // 추천 처리
      processRecommendation(filteredSongs);
      setIsSharedMode(false);
      
      // 로딩 상태를 유지한 채로 바로 /today로 이동
      router.push(`/today`);
      
    } catch (error) {
      console.error("fetchSong 에러:", error);
      setIsLoading(false);
      showToast(TOAST_MESSAGES.FETCH_ERROR);
    }
  };

  const handleRecommendClick = () => {
    if (!canRecommend) {
      showToast(TOAST_MESSAGES.ALREADY_RECOMMENDED);
      return;
    }
    fetchSongAndRedirect();
  };

  // 로딩 중일 때 로딩 화면 표시
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-gradient-to-b from-[#060261] via-[#A901FD] to-[#07002F] px-4">
      <div className="flex-grow w-full flex flex-col items-center justify-center">
        <div className="text-center mb-8">
          <div className="text-2xl text-white/90 mb-3">나를 울리고 웃기는</div>
          <div className="text-5xl font-bold text-white drop-shadow">매일 트로트</div>
        </div>
        
        <button
          className={`w-50 h-50 md:w-50 md:h-50 ${canRecommend ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-400/20 hover:bg-gray-400/30'} text-white rounded-full shadow-lg transition mb-4 flex items-center justify-center text-6xl md:text-6xl border-2 border-white/40 backdrop-blur`}
          onClick={handleRecommendClick}
          aria-label="오늘의 트로트 추천받기"
        >
          {canRecommend ? '🎵' : '⏰'}
        </button>
        
        <div className="mt-1 mb-2 text-white/90 text-2xl text-center font-medium">
          당신을 위한 새로운 곡이<br /> 준비되어 있어요
        </div>
        
        {recommendCount > 0 && (
          <Link href="/today" className="w-full flex justify-center mb-4">
            <button className="w-full max-w-xs bg-[#FC01C5] text-white rounded-full px-6 py-3 shadow-md hover:bg-[#7c25c9] transition text-base font-medium">
              오늘 추천 받은 곡 보기
            </button>
          </Link>
        )}
        
        {/* 구글 로그인/로그아웃 버튼 - 일시적으로 숨김 */}
        {/*
        {!authLoading && (
          <div className="mb-6 flex justify-center">
            {!user ? (
              <button
                onClick={() => signInWithGoogle()}
                className="w-full max-w-xs flex items-center gap-3 bg-white hover:bg-gray-300 text-gray-700 font-medium text-base py-3 px-18 rounded-full shadow-md transition-colors duration-200"
              >
                <Image
                  src="/Google logo.png"
                  alt="Google logo"
                  width={20}
                  height={20}
                  className="w-5 h-5"
                />
                <span>Sign in with Google</span>
              </button>
            ) : (
              <button
                onClick={() => signOut()}
                className="w-full max-w-xs bg-white/20 hover:bg-white/30 text-white font-medium text-base py-3 px-6 rounded-full shadow-md transition-colors duration-200 border border-white/40"
              >
                로그아웃
              </button>
            )}
          </div>
        )}
        */}
      </div>
      
      <Footer />
      
      <Toast message={toastMessage} isVisible={isVisible} />
    </main>
  );
} 