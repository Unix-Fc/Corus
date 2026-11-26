import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Eye, EyeOff, Factory } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Entrar — Corus Orçamentos" },
      { name: "description", content: "Acesso ao sistema de orçamentos da Corus Equipamentos Industriais." },
      { property: "og:title", content: "Entrar — Corus Orçamentos" },
      { property: "og:description", content: "Acesso ao sistema de orçamentos da Corus Equipamentos Industriais." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error("Não foi possível entrar: " + error.message); return; }
    navigate({ to: "/dashboard" });
  }
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden flex-col justify-between bg-sidebar p-10 text-sidebar-foreground lg:flex">
        <div className="flex items-center gap-2 text-sidebar-accent-foreground">
          <Factory className="h-6 w-6 text-sidebar-primary" />
          <span className="text-lg font-semibold tracking-wide">CORUS</span>
          <span className="text-sm opacity-70">Equipamentos Industriais</span>
        </div>
        <div>
          <h2 className="text-3xl font-semibold leading-tight text-sidebar-accent-foreground">
            Controle de Cálculo de<br />Orçamento Industrial
          </h2>
        </div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <img
            src="/corus-logo.png"
            alt="Corus"
            className="mx-auto mb-4 h-10 w-40 -translate-y-1 rounded-sm object-cover object-[center_42%]"
          />
          <h1 className="mb-6 text-xl font-semibold">Acesse sua conta</h1>
          <form onSubmit={signIn} className="mt-4 space-y-4">
            <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5">
              <Label>Senha</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  {showPassword ? (
                    <EyeOff aria-hidden="true" className="h-4 w-4" />
                  ) : (
                    <Eye aria-hidden="true" className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            <Button className="w-full" disabled={loading}>Entrar</Button>
          </form>
        </div>
      </div>
    </div>
  );
}
