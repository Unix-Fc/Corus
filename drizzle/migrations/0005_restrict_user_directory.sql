-- Sign-in still needs to read the user's own profile to check access_enabled.
ALTER POLICY "profiles read" ON public.profiles USING (
  id = (SELECT auth.uid())
  OR (SELECT public.has_role(auth.uid(), 'admin'))
);

ALTER POLICY "roles read" ON public.user_roles USING (
  user_id = (SELECT auth.uid())
  OR (SELECT public.has_role(auth.uid(), 'admin'))
);
