export const dynamic = "force-dynamic";

import { Suspense } from 'react';
import SharedSongContent from './SharedSongContent';

export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  const title = params?.title;
  const artist = params?.artist;
  
  if (title && artist) {
    return {
      title: `${title} - ${artist} | 친구가 추천한 곡 | 매일 트로트`,
      description: `친구가 추천한 트로트 노래: ${title} - ${artist}. 지금 바로 들어보세요!`,
      metadataBase: new URL('https://korean-trot.vercel.app/'),
      openGraph: {
        title: `${title} - ${artist}`,
        description: `친구가 추천한 트로트 노래: ${title} - ${artist}`,
        url: `https://korean-trot.vercel.app/shared`,
        type: "website",
        siteName: "매일 트로트",
        images: [
          {
            url: "https://korean-trot.vercel.app/og-image.png",
            width: 885,
            height: 460,
            alt: `${title} - ${artist} 친구 추천 곡`
          }
        ]
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} - ${artist}`,
        description: `친구가 추천한 트로트 노래: ${title} - ${artist}`,
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
    title: "친구가 추천한 곡 | 매일 트로트",
    description: "친구가 추천한 트로트 노래를 들어보세요!",
    metadataBase: new URL('https://korean-trot.vercel.app/'),
    openGraph: {
      title: "친구가 추천한 곡 | 매일 트로트",
      description: "친구가 추천한 트로트 노래를 들어보세요!",
      url: "https://korean-trot.vercel.app/shared",
      type: "website",
      siteName: "매일 트로트",
      images: [
        {
          url: "https://korean-trot.vercel.app/og-image.png",
          width: 885,
          height: 460,
          alt: "친구가 추천한 곡 - 매일 트로트"
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      title: "친구가 추천한 곡 | 매일 트로트",
      description: "친구가 추천한 트로트 노래를 들어보세요!",
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

export default function SharedPage() {
  return (
    <Suspense fallback={<div />}>
      <SharedSongContent />
    </Suspense>
  );
} 