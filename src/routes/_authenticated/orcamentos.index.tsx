import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, StatusBadge } from "@/components/status-badge";
import { technicalPendencies } from "@/lib/calc";
import {
  brl,
  dt,
  quoteCode,
  quoteTotals,
  STATUS_LABEL,
  useQuotes,
  type QuoteStatus,
} from "@/lib/data";
import { useMe } from "@/hooks/use-me";

export const Route = createFileRoute("/_authenticated/orcamentos/")({
  head: () => ({
    meta: [
      { title: "Orçamentos — Corus" },
      { name: "description", content: "Histórico e busca de orçamentos." },
    ],
  }),
  component: List,
});

function List() {
  const { data: quotes = [], isLoading } = useQuotes();
  const { can } = useMe();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<QuoteStatus | "">("");
  const term = q.toLowerCase();
  const rows = quotes.filter(
    (x) =>
      (!status || x.status === status) &&
      (!term ||
        [
          quoteCode(x.number),
          x.part_name,
          x.part_code,
          x.project,
          x.clients?.name,
        ].some((v) => v?.toLowerCase().includes(term))),
  );
  return (
    <>
      <PageHeader
        title="Orçamentos"
        subtitle="Histórico completo, busca e filtros"
        actions={
          can.editQuotes && (
            <Button asChild>
              <Link to="/orcamentos/novo">
                <Plus />
                Novo orçamento
              </Link>
            </Button>
          )
        }
      />
      <Card>
        <CardContent className="p-4">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Buscar por nº, cliente, peça, código ou projeto"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <select
              className="h-9 rounded-md border border-input bg-card px-2 text-sm"
              value={status}
              onChange={(e) => setStatus(e.target.value as QuoteStatus | "")}
            >
              <option value="">Todos os estados</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Nº</th>
                  <th className="px-3">Cliente</th>
                  <th className="px-3">Projeto / Peça</th>
                  <th className="whitespace-nowrap px-3 text-right">Qtd</th>
                  <th className="whitespace-nowrap px-3">Estado</th>
                  <th className="whitespace-nowrap px-3">Atualizado</th>
                  <th className="whitespace-nowrap pl-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Carregando…
                    </td>
                  </tr>
                )}
                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Nenhum orçamento encontrado.
                    </td>
                  </tr>
                )}
                {rows.map((x) => {
                  const pend = technicalPendencies(x.specs, {
                    materials: x.materials.length,
                    operations: x.operations.length,
                  });
                  return (
                    <tr
                      key={x.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-2.5 pr-3 num">
                        <Link
                          to="/orcamentos/$id"
                          params={{ id: x.id }}
                          className="font-medium text-primary hover:underline"
                        >
                          {quoteCode(x.number)}
                        </Link>
                      </td>
                      <td className="px-3">{x.clients?.name ?? "—"}</td>
                      <td className="px-3">
                        <div className="font-medium">
                          {x.part_name}{" "}
                          {pend.length > 0 && (
                            <AlertTriangle
                              className="inline h-3.5 w-3.5 text-warning"
                              aria-label="Pendências técnicas"
                            />
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {x.project} {x.part_code && `· ${x.part_code}`}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 text-right num">
                        {x.quantity}
                      </td>
                      <td className="whitespace-nowrap px-3">
                        <StatusBadge status={x.status} />
                      </td>
                      <td className="whitespace-nowrap px-3 text-xs text-muted-foreground">
                        {dt(x.updated_at)}
                      </td>
                      <td className="whitespace-nowrap pl-3 text-right num font-medium">
                        {brl(quoteTotals(x).total)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
