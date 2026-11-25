import { useQuery } from "@tanstack/react-query";
import { useAuthScope } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";
import type { AppRole } from "@/lib/data";
import { permissionsFor } from "@/lib/permissions";

export function useMe() {
  const session = useAuthScope();
  const q = useQuery({
    queryKey: ["me", session?.userId, session?.revision],
    enabled: Boolean(session),
    retry: false,
    staleTime: 0,
    queryFn: async ({ signal }) => {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const user = data.user;
      signal.throwIfAborted();
      if (!user || user.id !== session?.userId) {
        throw new Error("Não foi possível confirmar a conta da sessão.");
      }
      const [profile, roles] = await Promise.all([
        supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .abortSignal(signal)
          .maybeSingle(),
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", user.id)
          .abortSignal(signal),
      ]);
      if (profile.error) throw profile.error;
      if (roles.error) throw roles.error;
      return {
        user,
        profile: profile.data,
        roles: roles.data.map((r) => r.role),
      };
    },
  });
  const me = q.isSuccess ? q.data : undefined;
  const roles = me?.profile?.access_enabled
    ? me.roles.filter((r): r is "admin" | "orcamentista" => r !== "gerente")
    : [];
  const has = (r: AppRole) => (roles as AppRole[]).includes(r);
  return {
    ...q,
    data: me,
    me,
    roles,
    has,
    can: permissionsFor(roles),
  };
}
