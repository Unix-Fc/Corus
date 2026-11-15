import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText, Wallet, TrendingUp, AlertTriangle, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, StatusBadge } from "@/components/status-badge";
import { technicalPendencies } from "@/lib/calc";
import { brl, quoteCode, quoteTotals, STATUS_LABEL, useQuotes, type QuoteStatus } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Corus Orçamentos" }, { name: "description", content: "Indicadores de orçamentos, custos e pipeline." }] }),
  component: Dashboard,
});

const ORDER: QuoteStatus[] = ["rascunho", "pendente", "em_negociacao", "aprovado", "reprovado"];

function Dashboard() {
  const { data: quotes = [], isLoading } = useQuotes();
  const rows = quotes.map((q) => ({ q, t: quoteTotals(q), p: technicalPendencies(q.specs, { materials: q.materials.length, operations: q.operations.length }) }));
  const open = rows.filter((r) => r.q.status === "pendente" || r.q.status === "em_negociacao");
  const approved = rows.filter((r) => r.q.status === "aprovado");
  const decided = rows.filter((r) => r.q.status === "aprovado" || r.q.status === "reprovado").length;
  const withPend = rows.filter((r) => r.p.length > 0);
  const sum = (a: typeof rows, k: "materials" | "operations" | "services" | "total") => a.reduce((s, r) => s + r.t[k], 0);
  const maxPipe = Math.max(1, ...ORDER.map((s) => sum(rows.filter((r) => r.q.status === s), "total")));

  return (
    <>
      <PageHeader title="Dashboard" subtitle="Visão geral dos orçamentos industriais" actions={<Button asChild><Link to="/orcamentos/novo"><Plus />Novo orçamento</Link></Button>} />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi icon={FileText} label="Orçamentos" value={String(quotes.length)} hint={`${open.length} em aberto`} />
        <Kpi icon={TrendingUp} label="Pipeline em aberto" value={brl(sum(open, "total"))} hint="Pendente + Em negociação" />
        <Kpi icon={Wallet} label="Aprovado" value={brl(sum(approved, "total"))} hint={decided ? `Taxa: ${Math.round((approved.length / decided) * 100)}% dos decididos` : "—"} />
        <Kpi icon={AlertTriangle} label="Pendências técnicas" value={String(withPend.length)} hint="orçamentos com ausências" warn={withPend.length > 0} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-base">Pipeline por estado</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {ORDER.map((s) => {
              const r = rows.filter((x) => x.q.status === s);
              const v = sum(r, "total");
              return (
                <div key={s}>
                  <div className="mb-1 flex justify-between text-sm"><span>{STATUS_LABEL[s]} <span className="text-muted-foreground">({r.length})</span></span><span className="num">{brl(v)}</span></div>
                  <div className="h-2 rounded-sm bg-muted"><div className="h-2 rounded-sm bg-primary" style={{ width: `${(v / maxPipe) * 100}%` }} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-base">Composição de custos (todos os orçamentos)</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {(["materials", "operations", "services"] as const).map((k, i) => {
              const tot = sum(rows, "materials") + sum(rows, "operations") + sum(rows, "services") || 1;
              const v = sum(rows, k);
              return (
                <div key={k}>
                  <div className="mb-1 flex justify-between text-sm"><span>{["Materiais", "Operações internas", "Serviços externos"][i]}</span><span className="num">{brl(v)} · {Math.round((v / tot) * 100)}%</span></div>
                  <div className="h-2 rounded-sm bg-muted"><div className="h-2 rounded-sm" style={{ width: `${(v / tot) * 100}%`, background: `var(--chart-${i + 1})` }} /></div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between space-y-0"><CardTitle className="text-base">Orçamentos recentes</CardTitle><Button variant="link" asChild><Link to="/orcamentos">Ver todos</Link></Button></CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? <p className="text-sm text-muted-foreground">Carregando…</p> : (
            <table className="w-full text-sm">
              <thead><tr className="text-left text-xs uppercase text-muted-foreground"><th className="py-2">Nº</th><th>Cliente</th><th>Peça</th><th>Estado</th><th className="text-right">Total</th></tr></thead>
              <tbody>
                {rows.slice(0, 6).map(({ q, t, p }) => (
                  <tr key={q.id} className="border-t hover:bg-muted/50">
                    <td className="py-2 num"><Link to="/orcamentos/$id" params={{ id: q.id }} className="text-primary hover:underline">{quoteCode(q.number)}</Link></td>
                    <td>{q.clients?.name ?? "—"}</td>
                    <td>{q.part_name} {p.length > 0 && <AlertTriangle className="inline h-3.5 w-3.5 text-warning" />}</td>
                    <td><StatusBadge status={q.status} /></td>
                    <td className="text-right num">{brl(t.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </>
  );
}

function Kpi({ icon: Icon, label, value, hint, warn }: { icon: typeof FileText; label: string; value: string; hint: string; warn?: boolean }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}<Icon className={`h-4 w-4 ${warn ? "text-warning" : "text-primary"}`} /></div>
        <div className="mt-2 text-2xl font-semibold num">{value}</div>
        <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
      </CardContent>
    </Card>
  );
}
