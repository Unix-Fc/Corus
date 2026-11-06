import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { PageHeader, PendingTag } from "@/components/status-badge";
import { AuditList } from "@/components/audit-list";
import { useAudit, useParams, type CalcParam } from "@/lib/data";
import { useMe } from "@/hooks/use-me";
import { requireAdminRoute } from "@/lib/admin-route";

export const Route = createFileRoute("/_authenticated/parametros")({
  beforeLoad: requireAdminRoute,
  head: () => ({
    meta: [
      { title: "Parâmetros de cálculo — Corus" },
      {
        name: "description",
        content:
          "Parâmetros configuráveis de perda, margem, impostos e jornada.",
      },
    ],
  }),
  component: Params,
});

function Params() {
  const { data = [] } = useParams();
  const { data: audit = [] } = useAudit({ entity: "calc_parameters" });
  const { can } = useMe();
  return (
    <>
      <PageHeader
        title="Parâmetros de cálculo"
        subtitle="Valores padrão aplicados a novos orçamentos. Fórmulas definitivas ainda em descoberta."
      />
      {!can.editParams && (
        <p className="mb-4 text-sm text-muted-foreground">
          Somente Administradores podem alterar parâmetros.
        </p>
      )}
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-3">
          {data.map((p) => (
            <ParamRow key={p.key} p={p} editable={can.editParams} />
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Histórico de parâmetros</CardTitle>
          </CardHeader>
          <CardContent>
            <AuditList rows={audit} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function ParamRow({ p, editable }: { p: CalcParam; editable: boolean }) {
  const [v, setV] = useState(Number(p.value));
  const [validated, setValidated] = useState(p.validated);
  const qc = useQueryClient();
  async function save() {
    const { error } = await supabase
      .from("calc_parameters")
      .update({ value: v, validated })
      .eq("key", p.key);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Parâmetro atualizado");
    qc.invalidateQueries({ queryKey: ["params"] });
    qc.invalidateQueries({ queryKey: ["audit"] });
  }
  return (
    <Card>
      <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex items-center gap-2 font-medium">
            {p.label} {!p.validated && <PendingTag />}
          </div>
          <div className="text-xs text-muted-foreground">{p.note}</div>
        </div>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            step="0.01"
            disabled={!editable}
            className="w-24 num"
            value={v}
            onChange={(e) => setV(Number(e.target.value))}
          />
          <span className="w-4 text-sm text-muted-foreground">{p.unit}</span>
          <label className="flex items-center gap-1.5 text-xs">
            <Switch
              disabled={!editable}
              checked={validated}
              onCheckedChange={setValidated}
            />
            Validado
          </label>
          {editable && (
            <Button size="sm" onClick={save}>
              Salvar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
