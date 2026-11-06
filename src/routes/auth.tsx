import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { Factory } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
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
  const [loading, setLoading] = useState(false);

  async function signIn(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error("Não foi possível entrar: " + error.message); return; }
    navigate({ to: "/dashboard" });
  }
  async function google() {
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) { toast.error("Falha no login com Google"); return; }
    if (r.redirected) return;
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
          <p className="mt-4 max-w-md text-sm">
            Materiais, operações de usinagem, serviços externos e estimativa de produção em um cálculo transparente e auditável.
          </p>
        </div>
        <p className="text-xs opacity-60">MVP — fórmulas de margem, impostos e perdas em validação.</p>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="mb-6 text-2xl font-semibold">Acesso ao sistema</h1>
          <form onSubmit={signIn} className="mt-4 space-y-4">
            <div className="space-y-1.5"><Label>E-mail</Label><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Senha</Label><Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <Button className="w-full" disabled={loading}>Entrar</Button>
          </form>
          <div className="my-4 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />ou<div className="h-px flex-1 bg-border" /></div>
          <Button variant="outline" className="w-full" onClick={google}>Continuar com Google</Button>
        </div>
      </div>
    </div>
  );
}
