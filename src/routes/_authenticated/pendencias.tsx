import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, StatusBadge } from "@/components/status-badge";
import { technicalPendencies } from "@/lib/calc";
import { quoteCode, useQuotes } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/pendencias")({
  head: () => ({ meta: [{ title: "Pendências técnicas — Corus" }, { name: "description", content: "Ausências técnicas nos orçamentos." }] }),
  component: Pend,
});

function Pend() {
  const { data: quotes = [] } = useQuotes();
  const rows = quotes
    .map((q) => ({ q, p: technicalPendencies(q.specs, { materials: q.materials.length, operations: q.operations.length }) }))
    .filter((r) => r.p.length > 0);
  return (
    <>
      <PageHeader title="Pendências técnicas" subtitle="Desenho, tolerância, tratamento térmico e itens ausentes. Não bloqueiam rascunhos." />
      <Card><CardContent className="overflow-x-auto p-4">
        {rows.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma pendência técnica.</p> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b text-left text-xs uppercase text-muted-foreground"><th className="py-2">Orçamento</th><th>Peça / Cliente</th><th>Estado</th><th>Pendências</th></tr></thead>
            <tbody>{rows.map(({ q, p }) => (
              <tr key={q.id} className="border-b align-top last:border-0">
                <td className="py-2.5 num"><Link to="/orcamentos/$id/editar" params={{ id: q.id }} className="text-primary hover:underline">{quoteCode(q.number)}</Link></td>
                <td><div className="font-medium">{q.part_name}</div><div className="text-xs text-muted-foreground">{q.clients?.name}</div></td>
                <td><StatusBadge status={q.status} /></td>
                <td><ul className="space-y-0.5">{p.map((x) => <li key={x.field} className="flex gap-1.5"><span className={x.severity === "alta" ? "text-destructive" : "text-warning"}>●</span>{x.message}</li>)}</ul></td>
              </tr>
            ))}</tbody>
          </table>
        )}
      </CardContent></Card>
    </>
  );
}
