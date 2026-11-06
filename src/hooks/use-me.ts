import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/data";
import { permissionsFor } from "@/lib/permissions";

export function useMe() {
  const q = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) return null;
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", user.id),
      ]);
      return {
        user,
        profile,
        roles: (roles ?? []).map((r) => r.role as AppRole),
      };
    },
  });
  const roles = q.data?.profile?.access_enabled
    ? (q.data.roles ?? []).filter(
        (r): r is "admin" | "orcamentista" => r !== "gerente",
      )
    : [];
  const has = (r: AppRole) => (roles as AppRole[]).includes(r);
  return {
    ...q,
    me: q.data,
    roles,
    has,
    can: permissionsFor(roles),
  };
}
