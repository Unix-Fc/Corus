import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
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
import {
  EMPTY_SEARCH,
  filterQuotes,
  hasFilters,
  searchIssues,
  type QuoteSearch,
} from "@/lib/quote-search";

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
  // US-008 — critérios de pesquisa do histórico
  const [s, setS] = useState<QuoteSearch>(EMPTY_SEARCH);
  const set = (k: keyof QuoteSearch, v: string) => setS({ ...s, [k]: v });
  // mesma consulta de responsáveis usada no Pipeline
  const { data: people = [] } = useQuery({
    queryKey: ["users-min"],
    queryFn: async () =>
      (
        await supabase
          .from("profiles")
          .select("id, full_name, email")
          .order("full_name")
      ).data ?? [],
  });
  const personName = (id: string | null) => {
    const p = people.find((x) => x.id === id);
    return p ? (p.full_name ?? p.email ?? "—") : "—";
  };
  const issues = searchIssues(s);
  const filtering = hasFilters(s);
  const rows = filterQuotes(quotes, s);
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
                value={s.term}
                onChange={(e) => set("term", e.target.value)}
              />
            </div>
            <select
              aria-label="Estado"
              className="h-9 rounded-md border border-input bg-card px-2 text-sm"
              value={s.status}
              onChange={(e) => set("status", e.target.value as QuoteStatus | "")}
            >
              <option value="">Todos os estados</option>
              {Object.entries(STATUS_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              Criado de
              <Input
                type="date"
                className="w-auto"
                value={s.from}
                onChange={(e) => set("from", e.target.value)}
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-muted-foreground">
              até
              <Input
                type="date"
                className="w-auto"
                value={s.to}
                onChange={(e) => set("to", e.target.value)}
              />
            </label>
            {/* orçamentista só enxerga os próprios orçamentos (AC-040) */}
            {can.viewAllQuotes && (
              <select
                aria-label="Responsável"
                className="h-9 rounded-md border border-input bg-card px-2 text-sm"
                value={s.owner}
                onChange={(e) => set("owner", e.target.value)}
              >
                <option value="">Todos os responsáveis</option>
                {people.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.full_name ?? p.email}
                  </option>
                ))}
              </select>
            )}
            <div className="flex items-center gap-2 sm:ml-auto">
              <span className="text-sm text-muted-foreground">
                {rows.length} de {quotes.length} orçamento(s)
              </span>
              {filtering && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setS(EMPTY_SEARCH)}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          </div>
          {issues.length > 0 && (
            <p className="mb-4 text-sm text-destructive">{issues.join(" ")}</p>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-3">Nº</th>
                  <th className="px-3">Cliente</th>
                  <th className="px-3">Projeto / Peça</th>
                  <th className="whitespace-nowrap px-3 text-right">Qtd</th>
                  <th className="whitespace-nowrap px-3">Estado</th>
                  <th className="whitespace-nowrap px-3">Responsável</th>
                  <th className="whitespace-nowrap px-3">Criado</th>
                  <th className="whitespace-nowrap px-3">Atualizado</th>
                  <th className="whitespace-nowrap pl-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {isLoading && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-6 text-center text-muted-foreground"
                    >
                      Carregando…
                    </td>
                  </tr>
                )}
                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={9}
                      className="py-6 text-center text-muted-foreground"
                    >
                      {/* AC-039: deixa claro por que a lista está vazia */}
                      {issues.length > 0
                        ? "Corrija o período informado para pesquisar."
                        : filtering
                          ? "Nenhum orçamento encontrado para os filtros informados."
                          : "Nenhum orçamento salvo ainda."}
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
                      <td className="whitespace-nowrap px-3 text-xs">
                        {personName(x.created_by)}
                      </td>
                      <td className="whitespace-nowrap px-3 text-xs text-muted-foreground">
                        {dt(x.created_at)}
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
