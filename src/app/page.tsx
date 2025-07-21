export const dynamic = "force-dynamic";

import HomeContent from './HomeContent';
import { Suspense } from 'react';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const title = params?.title;
  const artist = params?.artist;
  
  if (title && artist) {
    return {
      title: `${title} - ${artist} | 매일 트로트`,
      description: `친구가 추천한 트로트 노래: ${title} - ${artist}`,
      metadataBase: new URL('https://korean-trot.vercel.app/'),
      openGraph: {
        title: `${title} - ${artist}`,
        description: `친구가 추천한 트로트 노래: ${title} - ${artist}`,
        url: "https://korean-trot.vercel.app/",
        type: "website",
        siteName: "매일 트로트",
        images: [
          {
            url: "https://korean-trot.vercel.app/og-image.png",
            width: 885,
            height: 460,
            alt: `${title} - ${artist} 오픈그래프 이미지`
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - ${artist}`,
        description: `친구가 추천한 트로트트 노래: ${title} - ${artist}`,
        images: ["https://korean-trot.vercel.app/og-image.png"],
      },
      icons: {
        icon: [
          { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
          { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
        ],
        shortcut: '/favicon.png',
        apple: '/icon-512x512.png',
      },
    };
  }
  
  return {
    // SEO: 기본 타이틀과 메타디스크립션
    title: "매일 트로트, 당신을 위한 새로운 트로트",
    description: "오늘 기분에 맞는 새로운 트로트 곡을 발견하세요.",
    metadataBase: new URL('https://korean-trot.vercel.app/'),
    openGraph: {
      title: "매일 트로트, 당신을 위한 새로운 트로트",
      description: "오늘 기분에 맞는 새로운 트로트 곡을 발견하세요.",
      url: "https://korean-trot.vercel.app/",
      type: "website",
      siteName: "매일 트로트",
      images: [
        {
          url: "https://korean-trot.vercel.app/og-image.png",
          width: 885,
          height: 460,
          alt: "매일 트로트 오픈그래프 이미지"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "매일 트로트, 당신을 위한 새로운 트로트",
      description: "오늘 기분에 맞는 새로운 트로트 곡을 발견하세요.",
      images: ["https://korean-trot.vercel.app/og-image.png"],
    },
    icons: {
      icon: [
        { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
        { url: '/icon-512x512.png', sizes: '512x512', type: 'image/png' }
      ],
      shortcut: '/favicon.png',
      apple: '/icon-512x512.png',
    },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div />}>
      <HomeContent />
    </Suspense>
  );
}