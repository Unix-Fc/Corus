import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, ArrowLeft, Factory } from "lucide-react";
import { Button } from "@/components/ui/button";
import { materialCost, operationCost, productionEstimate } from "@/lib/calc";
import {
  brl,
  n2,
  quoteCode,
  quoteTotals,
  useParams,
  useQuote,
} from "@/lib/data";

export const Route = createFileRoute(
  "/_authenticated/orcamentos/$id_/proposta",
)({
  head: () => ({
    meta: [
      { title: "Proposta comercial — Corus" },
      {
        name: "description",
        content: "Pré-visualização da proposta para impressão.",
      },
    ],
  }),
  component: Proposal,
});

function Proposal() {
  const { id } = Route.useParams();
  const { data: q } = useQuote(id);
  const { data: params = [] } = useParams();
  if (!q) return <p className="text-muted-foreground">Carregando…</p>;
  if (q.status !== "aprovado") {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">
          A proposta só pode ser impressa após a aprovação do orçamento.
        </p>
        <Button variant="outline" asChild>
          <Link to="/orcamentos/$id" params={{ id }}>
            <ArrowLeft />
            Voltar ao orçamento
          </Link>
        </Button>
      </div>
    );
  }
  const t = quoteTotals(q);
  const est = productionEstimate(
    q.operations,
    q.quantity,
    Number(params.find((p) => p.key === "horas_dia")?.value ?? 8),
  );
  const days = Number(q.lead_time_days ?? est.days);
  const items = [
    ...q.materials.map((m) => ({
      g: "Material",
      d: m.description,
      qtd: `${n2(m.qty)} ${m.unit}`,
      v: materialCost(m),
    })),
    ...q.operations.map((o) => ({
      g: "Usinagem / processo",
      d: o.description,
      qtd: `${n2(o.setup_h + (o.time_min / 60) * q.quantity)} h`,
      v: operationCost(o, q.quantity),
    })),
    ...q.services.map((m) => ({
      g: "Serviço externo",
      d: m.description,
      qtd: `${n2(m.qty)} ${m.unit}`,
      v: materialCost(m),
    })),
  ];
  return (
    <>
      <div className="no-print mb-4 flex justify-between">
        <Button variant="ghost" asChild>
          <Link to="/orcamentos/$id" params={{ id }}>
            <ArrowLeft />
            Voltar
          </Link>
        </Button>
        <Button onClick={() => window.print()}>
          <Printer />
          Imprimir / PDF
        </Button>
      </div>
      <div className="mx-auto max-w-3xl rounded-md border bg-card p-8 shadow-sm print:border-0 print:shadow-none">
        <div className="flex items-start justify-between border-b-2 border-primary pb-4">
          <div className="flex items-center gap-2">
            <Factory className="h-7 w-7 text-primary" />
            <div>
              <div className="text-lg font-bold tracking-widest text-primary">
                CORUS
              </div>
              <div className="text-xs text-muted-foreground">
                Equipamentos Industriais
              </div>
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">Proposta {quoteCode(q.number)}</div>
            <div className="text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR")}
            </div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Cliente
            </div>
            <div className="font-medium">{q.clients?.name ?? "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Projeto
            </div>
            <div className="font-medium">{q.project || "—"}</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">Peça</div>
            <div className="font-medium">
              {q.part_name} {q.part_code && `(${q.part_code})`}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Quantidade
            </div>
            <div className="font-medium num">{q.quantity} peça(s)</div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Desenho / tolerância
            </div>
            <div>
              {q.specs.desenho || "—"} · {q.specs.tolerancia || "—"}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Tratamento térmico
            </div>
            <div>
              {q.specs.tratamento_termico_aplicavel
                ? q.specs.tratamento_termico || "A definir"
                : "Não aplicável"}
            </div>
          </div>
        </div>
        <table className="mt-6 w-full text-sm">
          <thead>
            <tr className="border-b text-left text-xs uppercase text-muted-foreground">
              <th className="py-2">Item</th>
              <th>Grupo</th>
              <th className="text-right">Qtd</th>
              <th className="text-right">Valor</th>
            </tr>
          </thead>
          <tbody>
            {items.map((i, k) => (
              <tr key={k} className="border-b">
                <td className="py-2">{i.d}</td>
                <td className="text-muted-foreground">{i.g}</td>
                <td className="text-right num">{i.qtd}</td>
                <td className="text-right num">{brl(i.v)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="ml-auto mt-4 w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="num">{brl(t.subtotal)}</span>
          </div>
          {t.perda + t.margem + t.imposto > 0 && (
            <div className="flex justify-between">
              <span>Ajustes</span>
              <span className="num">{brl(t.perda + t.margem + t.imposto)}</span>
            </div>
          )}
          <div className="flex justify-between border-t-2 border-primary pt-2 text-base font-semibold">
            <span>Valor total</span>
            <span className="num">{brl(t.total)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Valor unitário</span>
            <span className="num">{brl(t.unit)}</span>
          </div>
        </div>
        <div className="mt-6 grid gap-4 rounded-md bg-muted p-4 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Tempo de produção estimado
            </div>
            <div className="font-medium num">
              {n2(est.hours)} h (setup {n2(est.setup)} h + operação{" "}
              {n2(est.run)} h)
            </div>
          </div>
          <div>
            <div className="text-xs uppercase text-muted-foreground">
              Prazo estimado
            </div>
            <div className="font-medium num">{n2(days)} dias úteis</div>
          </div>
        </div>
        {q.notes && (
          <p className="mt-4 text-sm">
            <span className="font-medium">Observações:</span> {q.notes}
          </p>
        )}
        <p className="mt-8 text-xs text-muted-foreground">
          Documento gerado pelo sistema de orçamentos Corus (MVP). Condições
          comerciais, impostos e margens sujeitos a validação.
        </p>
      </div>
    </>
  );
}
