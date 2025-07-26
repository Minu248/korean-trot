# Korean Trot Music Recommendation App

한국 트로트 음악 추천 애플리케이션입니다.

## 프로젝트 개요

이 프로젝트는 Supabase를 사용하여 트로트 음악을 추천하는 웹 애플리케이션입니다. 
여러 사이트가 하나의 Supabase 프로젝트를 공유하며, `site_type` 필드를 통해 사이트별 데이터를 구분합니다.

## 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 환경 변수를 설정하세요:

```bash
# Supabase 설정
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# NextAuth 설정 (필요시)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# 기타 환경 변수들
NEXT_PUBLIC_APP_VERSION=1.0.0
```

## Supabase 데이터베이스 구조

### songs 테이블
- `id`: 고유 식별자 (자동 증가)
- `title`: 곡 제목
- `artist`: 아티스트명
- `youtube_url`: YouTube 링크
- `site_type`: 사이트 구분 ('trot', 'other_site' 등)
- `created_at`: 생성 시간
- `updated_at`: 수정 시간

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## 주요 기능

- 하루에 한 번 10곡의 트로트 음악 추천
- YouTube, Spotify, Apple Music 등 다양한 플랫폼 링크 제공
- 좋아요 기능으로 플레이리스트 관리
- 공유 기능으로 음악 추천 공유

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
