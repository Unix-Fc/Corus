import { createFileRoute, Link } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Printer, AlertTriangle, Info } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader, PendingTag, StatusBadge } from "@/components/status-badge";
import { AuditList } from "@/components/audit-list";
import {
  hourlyCostFromMonthlySalary,
  materialCost,
  operationCost,
  operationHourlyCost,
  operationHours,
  productionEstimate,
  technicalPendencies,
} from "@/lib/calc";
import {
  brl,
  n2,
  quoteCode,
  quoteTotals,
  STATUS_LABEL,
  useAudit,
  useCatalog,
  useParams,
  useQuote,
  type QuoteStatus,
} from "@/lib/data";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/orcamentos/$id")({
  head: () => ({
    meta: [
      { title: "Orçamento — Corus" },
      { name: "description", content: "Detalhe do orçamento." },
    ],
  }),
  component: Detail,
});

function Detail() {
  const { id } = Route.useParams();
  const { data: q, isLoading } = useQuote(id);
  const { data: catalog = [] } = useCatalog();
  const { data: params = [] } = useParams();
  const { data: audit = [] } = useAudit({ entity: "quotes", entityId: id });
  const { can } = useMe();
  const qc = useQueryClient();
  if (isLoading || !q)
    return <p className="text-muted-foreground">Carregando…</p>;
  const t = quoteTotals(q);
  const hpd = Number(params.find((p) => p.key === "horas_dia")?.value ?? 8);
  const est = productionEstimate(q.operations, q.quantity, hpd);
  const pend = technicalPendencies(q.specs, {
    materials: q.materials.length,
    operations: q.operations.length,
  });
  const name = (cid?: string | null) =>
    catalog.find((c) => c.id === cid)?.name ?? "—";

  async function setStatus(s: QuoteStatus) {
    const { error } = await supabase
      .from("quotes")
      .update({ status: s })
      .eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Estado alterado para ${STATUS_LABEL[s]}`);
    qc.invalidateQueries({ queryKey: ["quotes"] });
    qc.invalidateQueries({ queryKey: ["audit"] });
  }

  return (
    <>
      <PageHeader
        title={`${quoteCode(q.number)} · ${q.part_name}`}
        subtitle={`${q.clients?.name ?? "Sem cliente"} · ${q.project ?? ""}`}
        actions={
          <>
            {can.editQuotes && (
              <Button variant="outline" asChild>
                <Link to="/orcamentos/$id/editar" params={{ id }}>
                  <Pencil />
                  Editar
                </Link>
              </Button>
            )}
            {q.status === "aprovado" ? (
              <Button asChild>
                <Link to="/orcamentos/$id/proposta" params={{ id }}>
                  <Printer />
                  Proposta
                </Link>
              </Button>
            ) : (
              <Button
                disabled
                title="A proposta só pode ser impressa após a aprovação"
              >
                <Printer />
                Proposta após aprovação
              </Button>
            )}
          </>
        }
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          {pend.length > 0 && (
            <div className="flex gap-3 rounded-md border border-warning/40 bg-warning-soft p-3 text-sm">
              <AlertTriangle className="h-5 w-5 shrink-0 text-warning" />
              <div>
                <div className="font-medium">Pendências técnicas</div>
                <ul className="list-disc pl-4">
                  {pend.map((p) => (
                    <li key={p.field}>{p.message}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Especificações</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
              <Spec l="Código" v={q.part_code} />
              <Spec l="Quantidade" v={String(q.quantity)} />
              <Spec l="Desenho" v={q.specs.desenho} />
              <Spec l="Tolerância" v={q.specs.tolerancia} />
              <Spec l="Acabamento" v={q.specs.acabamento} />
              <Spec
                l="Tratamento térmico"
                v={
                  q.specs.tratamento_termico_aplicavel
                    ? q.specs.tratamento_termico ||
                      "Aplicável — não especificado"
                    : "Não aplicável"
                }
              />
            </CardContent>
          </Card>
          <Table
            title="Materiais"
            head={["Material", "Qtd", "Custo unit.", "Subtotal"]}
            rows={q.materials.map((m) => [
              m.description,
              `${n2(m.qty)} ${m.unit}`,
              brl(m.unit_cost),
              brl(materialCost(m)),
            ])}
            total={t.materials}
          />
          <Table
            title="Operações internas"
            head={[
              "Operação",
              "Máquina",
              "Ferramenta",
              "Salário mensal",
              "Custo-hora máquina",
              "Custo-hora salário",
              "Custo-hora total",
              "Setup",
              "Tempo/pç",
              "Horas",
              "Origem",
              "Subtotal",
            ]}
            rows={q.operations.map((o) => [
              o.description,
              name(o.machine_id),
              name(o.tool_id),
              o.salary_monthly == null ? "—" : brl(o.salary_monthly),
              brl(o.cost_hour),
              o.cargo_id && o.salary_monthly != null
                ? brl(hourlyCostFromMonthlySalary(o.salary_monthly))
                : "—",
              brl(operationHourlyCost(o)),
              `${n2(o.setup_h)} h`,
              `${n2(o.time_min)} min`,
              `${n2(operationHours(o, q.quantity))} h`,
              o.time_source === "manual" ? "Manual" : "Parâmetro",
              brl(operationCost(o, q.quantity)),
            ])}
            total={t.operations}
          />
          <Table
            title="Serviços externos / tratamentos"
            head={["Serviço", "Qtd", "Custo unit.", "Subtotal"]}
            rows={q.services.map((m) => [
              m.description,
              `${n2(m.qty)} ${m.unit}`,
              brl(m.unit_cost),
              brl(materialCost(m)),
            ])}
            total={t.services}
          />
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Histórico de alterações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AuditList rows={audit} />
            </CardContent>
          </Card>
        </div>
        <aside className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between text-base">
                Estado <StatusBadge status={q.status} />
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {can.changeStatus && (
                <select
                  className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
                  value={q.status}
                  onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                >
                  {Object.entries(STATUS_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>
                      {v}
                    </option>
                  ))}
                </select>
              )}
              <p className="flex gap-1.5 text-xs text-muted-foreground">
                <Info className="h-3.5 w-3.5 shrink-0" />
                Estados provisórios: transições ainda dependem de validação de
                negócio.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Totais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <L l="Materiais" v={brl(t.materials)} />
              <L l="Operações" v={brl(t.operations)} />
              <L l="Serviços" v={brl(t.services)} />
              <div className="border-t pt-1.5 font-semibold">
                <L l="Subtotal" v={brl(t.subtotal)} />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs">Ajustes</span>
                <PendingTag />
              </div>
              <L
                l={`Perda (${q.adjustments.perda_material_pct ?? 0}%)`}
                v={brl(t.perda)}
              />
              <L
                l={`Margem (${q.adjustments.margem_pct ?? 0}%)`}
                v={brl(t.margem)}
              />
              <L
                l={`Impostos (${q.adjustments.imposto_pct ?? 0}%)`}
                v={brl(t.imposto)}
              />
              <div className="border-t pt-2 text-lg font-semibold">
                <L l="Total" v={brl(t.total)} />
              </div>
              <L l="Unitário" v={brl(t.unit)} />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Produção</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 text-sm">
              <L l="Setup" v={`${n2(est.setup)} h`} />
              <L l="Operação" v={`${n2(est.run)} h`} />
              <L l="Total" v={`${n2(est.hours)} h`} />
              <L
                l="Prazo"
                v={`${n2(Number(q.lead_time_days ?? est.days))} dias`}
              />
              <p className="text-xs text-muted-foreground">
                {q.lead_time_manual
                  ? "Prazo informado manualmente."
                  : `Prazo baseado em parâmetro (${hpd} h/dia).`}{" "}
                {est.manual} op. com tempo manual, {est.parametro} por
                parâmetro.
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </>
  );
}

const L = ({ l, v }: { l: string; v: string }) => (
  <div className="flex justify-between">
    <span>{l}</span>
    <span className="num">{v}</span>
  </div>
);
const Spec = ({ l, v }: { l: string; v?: string | null | undefined }) => (
  <div>
    <div className="text-xs uppercase tracking-wide text-muted-foreground">
      {l}
    </div>
    <div className={v ? "" : "text-warning-foreground italic"}>
      {v || "Não informado"}
    </div>
  </div>
);
function Table({
  title,
  head,
  rows,
  total,
}: {
  title: string;
  head: string[];
  rows: string[][];
  total: number;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <span className="num text-sm font-medium">{brl(total)}</span>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhum item.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground">
                {head.map((h, i) => (
                  <th
                    key={h}
                    className={`py-1.5 pr-3 font-medium ${i > 0 ? "whitespace-nowrap" : ""}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="border-t">
                  {r.map((c, j) => (
                    <td
                      key={j}
                      className={`py-2 pr-3 ${j > 0 ? "num whitespace-nowrap" : ""} ${j === r.length - 1 ? "text-right" : ""}`}
                    >
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  );
}
