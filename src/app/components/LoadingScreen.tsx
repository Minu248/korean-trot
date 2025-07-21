import React, { useEffect, useState } from "react";
import { TOAST_MESSAGES } from "@/config/constants";

export const LoadingScreen: React.FC = () => {
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev % 3) + 1); // 1 → 2 → 3 → 1 ...
    }, 500); // 0.5초마다 변경
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#060261] via-[#A901FD] to-[#07002F] px-4">
      <div className="flex flex-col items-center justify-center">
        <div className="w-64 h-64 md:w-[512px] md:h-[512px] mb-6">
          <img 
            src="/LP-vinyl.png" 
            alt="LP판" 
            className="w-full h-full animate-spin-slow"
          />
        </div>
        <div className="text-white text-2xl font-medium text-center">
          {`오늘 기분에 맞는`}<br />
          {`트로트 곡을 찾고 있어요${'.'.repeat(dotCount)}`}
        </div>
      </div>
    </main>
  );
}; 