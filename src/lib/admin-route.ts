import { redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export async function requireAdminRoute() {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError) throw userError;
  if (!user) throw redirect({ to: "/auth" });

  const { data: isAdmin, error } = await supabase.rpc("has_role", {
    _user_id: user.id,
    _role: "admin",
  });
  if (error) throw error;
  if (!isAdmin) throw redirect({ to: "/dashboard" });
}
