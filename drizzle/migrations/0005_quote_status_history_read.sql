CREATE POLICY "audit read own quote history"
  ON public.audit_log
  FOR SELECT
  TO authenticated
  USING (
    entity = 'quotes'
    AND EXISTS (
      SELECT 1
      FROM public.quotes q
      WHERE q.id::text = audit_log.entity_id
        AND q.created_by = auth.uid()
    )
  );
