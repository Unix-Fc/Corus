import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-badge";
import { QuoteForm } from "@/components/quote-form";
import { quoteCode, useQuote } from "@/lib/data";

export const Route = createFileRoute("/_authenticated/orcamentos/$id_/editar")({
  head: () => ({
    meta: [
      { title: "Editar orçamento — Corus" },
      { name: "description", content: "Editar orçamento industrial." },
    ],
  }),
  component: Edit,
});

function Edit() {
  const { id } = Route.useParams();
  const { data, isLoading, isError } = useQuote(id);
  if (isError)
    return (
      <p role="alert" className="text-destructive">
        Não foi possível carregar o orçamento. Verifique o acesso ou recarregue
        a página.
      </p>
    );
  if (isLoading || !data)
    return <p className="text-muted-foreground">Carregando…</p>;
  return (
    <>
      <PageHeader
        title={`Editar ${quoteCode(data.number)}`}
        subtitle={data.part_name}
      />
      <QuoteForm key={data.id} initial={data} />
    </>
  );
}
