import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/status-badge";
import { QuoteForm } from "@/components/quote-form";

export const Route = createFileRoute("/_authenticated/orcamentos/novo")({
  head: () => ({ meta: [{ title: "Novo orçamento — Corus" }, { name: "description", content: "Criar orçamento industrial." }] }),
  component: () => (
    <>
      <PageHeader title="Novo orçamento" subtitle="Preencha cliente, peça, materiais, operações e serviços. Rascunho pode ser salvo a qualquer momento." />
      <QuoteForm />
    </>
  ),
});
