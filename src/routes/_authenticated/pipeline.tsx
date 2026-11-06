import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { StatusBadge } from "@/components/status-badge";
import { toast } from "sonner";
import { Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/status-badge";
import { brl, quoteCode, quoteTotals, STATUS_LABEL, useQuotes, type QuoteStatus } from "@/lib/data";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/pipeline")({
  head: () => ({ meta: [{ title: "Pipeline — Corus" }, { name: "description", content: "Painel de pipeline de orçamentos." }] }),
  component: Pipeline,
});

const COLS: QuoteStatus[] = ["pendente", "em_negociacao", "aprovado", "reprovado"];

function Pipeline() {
  const { data: all = [] } = useQuotes();
  const [owner, setOwner] = useState("");
  const { data: people = [] } = useQuery({ queryKey: ["users-min"], queryFn: async () => (await supabase.from("profiles").select("id, full_name, email").order("full_name")).data ?? [] });
  const quotes = owner ? all.filter((q) => q.created_by === owner) : all;
  const { can } = useMe();
  const qc = useQueryClient();
  async function move(id: string, s: QuoteStatus) {
    const { error } = await supabase.from("quotes").update({ status: s }).eq("id", id);
    if (error) { toast.error(error.message); return; }
    qc.invalidateQueries({ queryKey: ["quotes"] });
    qc.invalidateQueries({ queryKey: ["audit"] });
  }
  const drafts = quotes.filter((q) => q.status === "rascunho").length;
  return (
    <>
      <PageHeader title="Pipeline" subtitle={can.viewAllQuotes ? `${drafts} rascunho(s) fora do pipeline` : "Seus orçamentos — somente leitura"} actions={can.viewAllQuotes ? (
        <select aria-label="Orçamentista" className="h-9 rounded-md border border-input bg-card px-2 text-sm" value={owner} onChange={(e) => setOwner(e.target.value)}>
          <option value="">Todos os orçamentistas</option>{people.map((p) => <option key={p.id} value={p.id}>{p.full_name ?? p.email}</option>)}
        </select>) : undefined} />
      <div className="mb-4 flex gap-2 rounded-md border border-warning/40 bg-warning-soft p-3 text-sm">
        <Info className="h-4 w-4 shrink-0 text-warning" />
        Estados provisórios (Pendente, Em negociação, Aprovado, Reprovado). As regras de transição ainda dependem de validação de negócio — somente Administradores movem orçamentos, e cada movimento fica registrado na auditoria.
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLS.map((s) => {
          const items = quotes.filter((q) => q.status === s);
          return (
            <div key={s} className="rounded-md bg-muted/60 p-3">
              <div className="mb-3 flex items-baseline justify-between"><h2 className="text-sm font-semibold">{STATUS_LABEL[s]} <span className="text-muted-foreground">({items.length})</span></h2><span className="num text-xs">{brl(items.reduce((a, q) => a + quoteTotals(q).total, 0))}</span></div>
              <div className="space-y-2">
                {items.map((q) => (
                  <Card key={q.id}><CardContent className="space-y-2 p-3 text-sm">
                    <Link to="/orcamentos/$id" params={{ id: q.id }} className="num text-xs font-medium text-primary hover:underline">{quoteCode(q.number)}</Link>
                    <div className="font-medium">{q.part_name}</div>
                    <div className="text-xs text-muted-foreground">{q.clients?.name}</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="num font-semibold">{brl(quoteTotals(q).total)}</span>
                      {can.changeStatus && (
                        <select aria-label="Mover" className="h-7 rounded border border-input bg-card px-1 text-xs" value={s} onChange={(e) => move(q.id, e.target.value as QuoteStatus)}>
                          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                        </select>
                      )}
                      {!can.changeStatus && <StatusBadge status={s} />}
                    </div>
                  </CardContent></Card>
                ))}
                {items.length === 0 && <p className="py-4 text-center text-xs text-muted-foreground">Vazio</p>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
