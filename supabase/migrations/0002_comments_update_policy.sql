-- 댓글 수정 기능 추가에 따른 RLS 정책 보완
-- Supabase SQL Editor에서 실행하세요.

create policy "authors can update their comments"
  on public.comments for update
  using (auth.uid() = author_id);
