import { createFileRoute, Link } from "@tanstack/react-router";
import { Printer, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useMe } from "@/hooks/use-me";
import {
  operationHours,
  orderedOperations,
  productionEstimate,
} from "@/lib/calc";
import {
  brl,
  n2,
  quoteCode,
  quoteClientName,
  quoteTotals,
  useCatalog,
  useParams,
  useQuote,
  type CatalogItem,
  type Quote,
} from "@/lib/data";

function validateProposalSearch(search: Record<string, unknown>) {
  return {
    tipo:
      search["tipo"] === "ordem" ? ("ordem" as const) : ("cliente" as const),
  };
}

export const Route = createFileRoute(
  "/_authenticated/orcamentos/$id_/proposta",
)({
  validateSearch: validateProposalSearch,
  head: () => ({
    meta: [
      { title: "Proposta comercial — Corus" },
      {
        name: "description",
        content: "Pré-visualização de documento do orçamento para impressão.",
      },
    ],
  }),
  component: Proposal,
});

function Proposal() {
  const { id } = Route.useParams();
  const quoteQuery = useQuote(id);
  const paramsQuery = useParams();
  const catalogQuery = useCatalog();
  const { can, isPending: isMePending, isError: isMeError } = useMe();
  const { tipo } = Route.useSearch();

  if (isMePending) {
    return <p role="status">Verificando permissões…</p>;
  }
  if (isMeError) {
    return (
      <p role="alert" className="text-destructive">
        Não foi possível confirmar suas permissões. Recarregue a página.
      </p>
    );
  }
  if (!can.printProposals) {
    return (
      <div className="space-y-4">
        <p role="alert" className="text-destructive">
          Somente administradores podem acessar os documentos de proposta.
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
  if (quoteQuery.isError) {
    return (
      <p role="alert" className="text-destructive">
        Não foi possível carregar o orçamento. Verifique o acesso ou recarregue
        a página.
      </p>
    );
  }
  if (paramsQuery.isError || (tipo === "ordem" && catalogQuery.isError)) {
    return (
      <p role="alert" className="text-destructive">
        Não foi possível carregar os parâmetros ou máquinas necessários ao
        documento.
      </p>
    );
  }
  if (paramsQuery.isPending || (tipo === "ordem" && catalogQuery.isPending)) {
    return <p role="status">Carregando dados do documento…</p>;
  }
  const q = quoteQuery.data;
  if (quoteQuery.isPending || !q) {
    return <p className="text-muted-foreground">Carregando…</p>;
  }
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

  const hoursPerDay = Number(
    paramsQuery.data?.find((p) => p.key === "horas_dia")?.value ?? 8,
  );
  const estimate = productionEstimate(q.operations, q.quantity, hoursPerDay);
  const estimateDays = Number(q.lead_time_days ?? estimate.days);

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
      <PrintDocument
        title={
          tipo === "ordem"
            ? `Ordem de produção ${quoteCode(q.number)}`
            : `Proposta ${quoteCode(q.number)}`
        }
      >
        {tipo === "ordem" ? (
          <ProductionOrder
            quote={q}
            catalog={catalogQuery.data}
            estimate={estimate}
          />
        ) : (
          <CustomerProposal quote={q} estimateDays={estimateDays} />
        )}
      </PrintDocument>
    </>
  );
}

function PrintDocument({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="mx-auto max-w-3xl rounded-md border bg-card p-8 shadow-sm print:max-w-none print:rounded-none print:border-0 print:p-0 print:shadow-none">
      <header className="flex items-center justify-between gap-4 border-b-2 border-primary pb-4">
        <img
          src="/corus-logo.png"
          alt="Corus Equipamentos Industriais"
          className="h-12 w-48 object-cover object-[center_42%]"
        />
        <div className="text-right text-sm">
          <div className="font-semibold">{title}</div>
          <div className="text-muted-foreground">
            {new Date().toLocaleDateString("pt-BR")}
          </div>
        </div>
      </header>
      {children}
      <footer className="mt-8 border-t pt-3 text-xs text-muted-foreground">
        Documento gerado pelo sistema de orçamentos Corus.
      </footer>
    </article>
  );
}

function ProductionOrder({
  quote,
  catalog,
  estimate,
}: {
  quote: Quote;
  catalog: CatalogItem[] | undefined;
  estimate: ReturnType<typeof productionEstimate>;
}) {
  const machineName = (
    id: string | null | undefined,
    snapshot: string | null | undefined,
  ) =>
    catalog?.find((item) => item.id === id)?.name ??
    snapshot ??
    "Não informado";

  return (
    <div className="mt-6 space-y-6 text-sm">
      <section className="grid gap-4 sm:grid-cols-2">
        <DocumentField label="Cliente" value={quoteClientName(quote)} />
        <DocumentField label="Projeto" value={quote.project || "—"} />
        <DocumentField
          label="Peça"
          value={`${quote.part_name}${quote.part_code ? ` (${quote.part_code})` : ""}`}
        />
        <DocumentField label="Quantidade" value={`${quote.quantity} peça(s)`} />
        <DocumentField label="Desenho" value={quote.specs.desenho || "—"} />
        <DocumentField
          label="Tolerância"
          value={quote.specs.tolerancia || "—"}
        />
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Roteiro de produção</h2>
        {quote.operations.length === 0 ? (
          <p className="text-muted-foreground">Nenhum processo cadastrado.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="py-2 pr-2">Processo</th>
                <th className="py-2 pr-2">Máquina</th>
                <th className="py-2 pr-2 text-right">Setup</th>
                <th className="py-2 pr-2 text-right">Tempo / peça</th>
                <th className="py-2 text-right">Tempo previsto</th>
              </tr>
            </thead>
            <tbody>
              {orderedOperations(quote.operations).map((operation) => (
                <tr
                  key={`${operation.sequence}-${operation.description}`}
                  className="border-b"
                >
                  <td className="py-2 pr-2">
                    {operation.sequence}. {operation.description}
                  </td>
                  <td className="py-2 pr-2">
                    {machineName(
                      operation.machine_id,
                      operation.machine_name_snapshot,
                    )}
                  </td>
                  <td className="py-2 pr-2 text-right num">
                    {n2(operation.setup_h)} h
                  </td>
                  <td className="py-2 pr-2 text-right num">
                    {n2(operation.time_min)} min
                  </td>
                  <td className="py-2 text-right num">
                    {n2(operationHours(operation, quote.quantity))} h
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {quote.materials.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">Materiais</h2>
          <ul className="space-y-1">
            {quote.materials.map((material, index) => (
              <li key={`${material.description}-${index}`}>
                {material.description} — {n2(material.qty)} {material.unit}
              </li>
            ))}
          </ul>
        </section>
      )}

      {quote.services.length > 0 && (
        <section>
          <h2 className="mb-2 font-semibold">
            Serviços externos / tratamentos
          </h2>
          <ul className="space-y-1">
            {quote.services.map((service, index) => (
              <li key={`${service.description}-${index}`}>
                {service.description} — {n2(service.qty)} {service.unit}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="rounded-md bg-muted p-4">
        <h2 className="font-semibold">Tempo de produção estimado</h2>
        <p className="mt-1 num">
          {n2(estimate.hours)} h (setup {n2(estimate.setup)} h + operação{" "}
          {n2(estimate.run)} h)
        </p>
      </section>

      {quote.notes && (
        <p>
          <span className="font-medium">Observações:</span> {quote.notes}
        </p>
      )}
    </div>
  );
}

function CustomerProposal({
  quote,
  estimateDays,
}: {
  quote: Quote;
  estimateDays: number;
}) {
  const totals = quoteTotals(quote);

  return (
    <div className="mt-6 space-y-6 text-sm">
      <section className="grid gap-4 sm:grid-cols-2">
        <DocumentField label="Cliente" value={quoteClientName(quote)} />
        <DocumentField label="Projeto" value={quote.project || "—"} />
        <DocumentField label="Quantidade" value={`${quote.quantity} peça(s)`} />
        <DocumentField label="Desenho" value={quote.specs.desenho || "—"} />
        <DocumentField
          label="Tolerância"
          value={quote.specs.tolerancia || "—"}
        />
        <DocumentField
          label="Tratamento térmico"
          value={
            quote.specs.tratamento_termico_aplicavel
              ? quote.specs.tratamento_termico || "A definir"
              : "Não aplicável"
          }
        />
      </section>

      <section className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 rounded-md border bg-muted p-4">
        <div className="min-w-0">
          <h2 className="text-xs uppercase text-muted-foreground">Peça</h2>
          <p className="mt-1 truncate font-medium">
            {quote.part_name}
            {quote.part_code && ` (${quote.part_code})`}
          </p>
        </div>
        <div className="text-right">
          <h2 className="text-xs uppercase text-muted-foreground">
            Valor total
          </h2>
          <p className="mt-1 text-lg font-semibold num">{brl(totals.total)}</p>
        </div>
      </section>

      <section className="rounded-md bg-muted p-4">
        <h2 className="text-xs uppercase text-muted-foreground">
          Prazo estimado
        </h2>
        <p className="mt-1 font-medium num">{n2(estimateDays)} dias úteis</p>
      </section>

      {quote.notes && (
        <p>
          <span className="font-medium">Observações:</span> {quote.notes}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Condições comerciais, impostos e margens sujeitos a validação.
      </p>
    </div>
  );
}

function DocumentField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  );
}
