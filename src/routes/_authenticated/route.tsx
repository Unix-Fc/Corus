import {
  createFileRoute,
  Outlet,
  Link,
  redirect,
  useRouterState,
  useNavigate,
} from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) throw redirect({ to: "/auth" });
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("access_enabled")
      .eq("id", data.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!profile?.access_enabled) {
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) throw signOutError;
      throw redirect({ to: "/auth" });
    }
  },
  component: Layout,
});

function Layout() {
  const qc = useQueryClient();
  const navigate = useNavigate();
  const isQuotePage = useRouterState({
    select: (state) => state.location.pathname.startsWith("/orcamentos"),
  });
  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {!isQuotePage && <AppSidebar />}
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="no-print sticky top-0 z-10 flex h-12 items-center justify-between border-b bg-card/95 px-3 backdrop-blur">
            {isQuotePage ? (
              <Button variant="ghost" size="sm" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <SidebarTrigger />
            )}
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut /> Sair
            </Button>
          </header>
          <main
            className={`mx-auto w-full flex-1 p-4 md:p-6 ${
              isQuotePage ? "max-w-none" : "max-w-7xl"
            }`}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
