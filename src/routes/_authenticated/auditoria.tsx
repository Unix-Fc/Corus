import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/status-badge";
import { AuditList } from "@/components/audit-list";
import { useAudit } from "@/lib/data";
import { useMe } from "@/hooks/use-me";
import { requireAdminRoute } from "@/lib/admin-route";

export const Route = createFileRoute("/_authenticated/auditoria")({
  beforeLoad: requireAdminRoute,
  head: () => ({
    meta: [
      { title: "Auditoria — Corus" },
      {
        name: "description",
        content:
          "Histórico de alterações de orçamentos, cadastros e parâmetros.",
      },
    ],
  }),
  component: Audit,
});

function Audit() {
  const { can, isLoading } = useMe();
  const [entity, setEntity] = useState("");
  const { data = [] } = useAudit(entity ? { entity } : undefined);
  if (isLoading) return <p className="text-muted-foreground">Carregando…</p>;
  if (!can.viewAudit)
    return (
      <PageHeader
        title="Acesso restrito"
        subtitle="Somente Administradores podem ver a auditoria."
      />
    );
  return (
    <>
      <PageHeader
        title="Auditoria"
        subtitle="Registros automáticos das últimas 200 alterações relevantes"
        actions={
          <select
            className="h-9 rounded-md border border-input bg-card px-2 text-sm"
            value={entity}
            onChange={(e) => setEntity(e.target.value)}
          >
            <option value="">Todas as entidades</option>
            <option value="quotes">Orçamentos</option>
            <option value="calc_parameters">Parâmetros</option>
            <option value="catalog_items">Cadastros</option>
            <option value="clients">Clientes</option>
          </select>
        }
      />
      <Card>
        <CardContent className="p-5">
          <AuditList rows={data} showEntity />
        </CardContent>
      </Card>
    </>
  );
}
