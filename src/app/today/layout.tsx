import { Metadata } from "next";

export const metadata: Metadata = {
  title: "오늘의 트로트 추천 | 매일 트로트",
  description: "매일 새로운 트로트 노래를 발견하세요.",
};

export default function TodayLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
} 