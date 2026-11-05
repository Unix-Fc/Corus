import { createFileRoute } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader, PendingTag } from "@/components/status-badge";

export const Route = createFileRoute("/_authenticated/descoberta")({
  head: () => ({ meta: [{ title: "Em descoberta — Corus" }, { name: "description", content: "Capacidades ainda em descoberta, não implementadas." }] }),
  component: Disc,
});

const items = [
  { t: "Integração com ERP", d: "Sincronização de clientes, materiais, custos e pedidos aprovados. Sistema, escopo e direção dos dados a definir." },
  { t: "Acompanhamento de produção / PCP", d: "Converter orçamento aprovado em ordem de produção e comparar tempos orçados × realizados." },
  { t: "Fórmulas definitivas de cálculo", d: "Perdas de material, margem, impostos por regime tributário e rateio de custos indiretos. Hoje são percentuais configuráveis e não validados." },
  { t: "Regras de transição de estados", d: "Quem pode aprovar/reprovar, alçadas de desconto e validade da proposta." },
  { t: "Envio de proposta por e-mail", d: "Hoje a proposta é pré-visualizada e impressa/salva em PDF pelo navegador." },
];

function Disc() {
  return (
    <>
      <PageHeader title="Em descoberta" subtitle="Itens mapeados que ainda não são capacidades implementadas neste MVP." />
      <div className="grid gap-4 md:grid-cols-2">
        {items.map((i) => (
          <Card key={i.t} className="border-dashed"><CardContent className="space-y-2 p-5">
            <div className="flex items-center justify-between"><div className="flex items-center gap-2 font-medium"><Compass className="h-4 w-4 text-primary" />{i.t}</div><PendingTag>Em descoberta</PendingTag></div>
            <p className="text-sm text-muted-foreground">{i.d}</p>
          </CardContent></Card>
        ))}
      </div>
    </>
  );
}
