-- Quote and question policies both depend on access_enabled.
-- Access changes are handled by the existing service-role operation.
REVOKE UPDATE ON public.profiles FROM PUBLIC, anon, authenticated;
GRANT UPDATE (full_name, email) ON public.profiles TO authenticated;

CREATE TYPE public.technical_question_status AS ENUM ('aberta', 'esclarecida');

CREATE TABLE public.technical_questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.quotes(id) ON DELETE CASCADE,
  description text NOT NULL,
  status public.technical_question_status NOT NULL DEFAULT 'aberta',
  clarification text,
  created_by uuid NOT NULL DEFAULT auth.uid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  -- Use C collation for the JavaScript trim() whitespace ranges.
  CONSTRAINT technical_questions_description_check
    CHECK (
      char_length(description) <= 4000
      AND description COLLATE pg_catalog."C"
        ~ U&'[^\0009-\000D\0020\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]'
    ),
  CONSTRAINT technical_questions_clarification_check
    CHECK (
      (status = 'aberta' AND clarification IS NULL)
      OR (
        status = 'esclarecida'
        AND clarification IS NOT NULL
        AND char_length(clarification) <= 4000
        AND clarification COLLATE pg_catalog."C"
          ~ U&'[^\0009-\000D\0020\00A0\1680\2000-\200A\2028\2029\202F\205F\3000\FEFF]'
      )
    )
);

CREATE INDEX technical_questions_quote_id_idx ON public.technical_questions (quote_id);

ALTER TABLE public.technical_questions ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.technical_questions FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.technical_questions TO authenticated;
GRANT INSERT (quote_id, description) ON public.technical_questions TO authenticated;
GRANT UPDATE (status, clarification) ON public.technical_questions TO authenticated;
GRANT ALL ON public.technical_questions TO service_role;

-- Visibility follows the existing quotes SELECT policy.
CREATE POLICY "technical questions read" ON public.technical_questions
  FOR SELECT TO authenticated USING (
    EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id)
  );

CREATE POLICY "technical questions insert" ON public.technical_questions
  FOR INSERT TO authenticated WITH CHECK (
    created_by = auth.uid()
    AND status = 'aberta'
    AND EXISTS (SELECT 1 FROM public.quotes q WHERE q.id = quote_id)
  );

-- Provisional workflow (OPEN-009).
CREATE POLICY "technical questions clarify" ON public.technical_questions
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND status = 'aberta')
  WITH CHECK (public.has_role(auth.uid(), 'admin') AND status = 'esclarecida');

CREATE TRIGGER audit_technical_questions
  BEFORE INSERT OR UPDATE OR DELETE ON public.technical_questions
  FOR EACH ROW EXECUTE FUNCTION public.audit_trigger();
