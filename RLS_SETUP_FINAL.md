# RLS (Row Level Security) 설정 완료 가이드

## ✅ 완료된 작업

### 1. 코드 수정 완료
- ✅ 서버 사이드 API 라우트 생성 (`/api/songs`)
- ✅ 클라이언트에서 API를 통해 데이터 접근하도록 수정
- ✅ 서비스 롤 키를 사용한 RLS 우회 구현
- ✅ 폴백 메커니즘 구현 (API 실패 시 기존 방식 사용)

### 2. 환경 변수 설정
`.env.local` 파일에 다음이 설정되어 있는지 확인:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 🔒 RLS 활성화 방법

### 1. Supabase 대시보드에서 RLS 활성화
1. Supabase 프로젝트 대시보드 접속
2. **Table Editor** → **songs** 테이블 선택
3. **RLS** 탭에서 **Enable RLS** 활성화

### 2. RLS 정책 설정 (선택사항)
SQL Editor에서 다음 정책들을 설정할 수 있습니다:

```sql
-- 읽기 정책 (필수)
CREATE POLICY "Allow public read access to trot songs" ON public.songs
    FOR SELECT
    USING (site_type = 'trot');

-- 쓰기 정책 (선택사항)
CREATE POLICY "Allow authenticated users to insert songs" ON public.songs
    FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');
```

## 🧪 테스트 방법

### 1. RLS 활성화 전 테스트
```bash
npm run dev
```
- 홈페이지에서 곡 추천 기능 정상 작동 확인

### 2. RLS 활성화 후 테스트
- 홈페이지에서 곡 추천 기능 정상 작동 확인
- API 라우트를 통해 데이터 접근 확인

## 🔧 작동 원리

### 1. 클라이언트 요청
1. 사용자가 곡 추천 버튼 클릭
2. `fetchRandomSongsFromAPI()` 함수 호출
3. `/api/songs` API 엔드포인트 요청

### 2. 서버 사이드 처리
1. API 라우트에서 `fetchRandomSongsFromSupabaseServer()` 호출
2. 서비스 롤 키를 사용하여 RLS 우회
3. `site_type = 'trot'`인 곡 데이터 필터링
4. 랜덤하게 선택하여 반환

### 3. 폴백 메커니즘
- API 접근 실패 시 기존 클라이언트 직접 접근 방식 사용
- 안정성과 호환성 보장

## 🎯 결과

- ✅ **보안 강화**: RLS 활성화로 데이터 접근 제어
- ✅ **기능 유지**: 곡 추천 기능 정상 작동
- ✅ **안정성**: 폴백 메커니즘으로 장애 대응
- ✅ **확장성**: 서버 사이드 API 구조로 향후 기능 확장 가능

## 📝 주의사항

- 서비스 롤 키는 절대 클라이언트에 노출하지 마세요
- 프로덕션 환경에서는 적절한 RLS 정책을 설정하세요
- 정기적으로 보안 설정을 점검하세요 