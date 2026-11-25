DROP POLICY IF EXISTS "technical questions read"
  ON public.technical_questions;

CREATE POLICY "technical questions read"
  ON public.technical_questions
  FOR SELECT TO authenticated
  USING (
    created_by = auth.uid()
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX technical_questions_owner_created_idx
  ON public.technical_questions (created_by, created_at DESC, id DESC);
