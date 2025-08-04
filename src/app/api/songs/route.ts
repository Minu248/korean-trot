import { NextRequest, NextResponse } from 'next/server';
import { fetchRandomSongsFromSupabaseServer } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    
    const songs = await fetchRandomSongsFromSupabaseServer(limit);
    
    return NextResponse.json({ songs });
  } catch (error) {
    console.error('API 오류:', error);
    return NextResponse.json(
      { error: '곡 데이터를 가져오는 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 