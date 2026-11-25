import { dt } from "@/lib/data";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["audit_log"]["Row"];

const FIELD: Record<string, string> = {
  status: "Estado",
  total: "Total",
  materials: "Materiais",
  operations: "Operações",
  services: "Serviços",
  specs: "Especificações",
  quantity: "Quantidade",
  part_name: "Peça",
  part_code: "Código da peça",
  project: "Projeto",
  client_id: "Cliente",
  value: "Valor",
  validated: "Validado",
  adjustments: "Ajustes e percentuais",
  unit_cost: "Custo unitário",
  cost_hour: "Custo por hora",
  time_min: "Tempo por peça",
  setup_h: "Tempo de preparação",
  time_source: "Origem do tempo",
  active: "Ativo",
  name: "Nome",
  lead_time_days: "Prazo",
  lead_time_manual: "Prazo informado manualmente",
  created_by: "Responsável",
  number: "Número do orçamento",
};
const ENTITY: Record<string, string> = {
  quotes: "Orçamento",
  calc_parameters: "Parâmetro",
  catalog_items: "Cadastro",
  clients: "Cliente",
};

function short(v: unknown) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object")
    return Array.isArray(v)
      ? `${v.length} ${v.length === 1 ? "item" : "itens"}`
      : "detalhes";
  return String(v);
}

export function AuditList({
  rows,
  showEntity,
}: {
  rows: Row[];
  showEntity?: boolean;
}) {
  if (rows.length === 0)
    return <p className="text-sm text-muted-foreground">Sem registros.</p>;
  return (
    <ol className="space-y-3">
      {rows.map((r) => {
        const changes = (r.changes ?? {}) as Record<string, unknown>;
        return (
          <li key={r.id} className="border-l-2 border-primary/30 pl-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium capitalize">{r.action}</span>
              {showEntity && (
                <span className="text-muted-foreground">
                  {ENTITY[r.entity] ?? r.entity} ·{" "}
                  <span className="num text-xs">
                    {r.entity_id.slice(0, 18)}
                  </span>
                </span>
              )}
              <span className="text-xs text-muted-foreground">
                {dt(r.created_at)} · {r.user_email ?? "sistema / carga inicial"}
              </span>
            </div>
            {Object.keys(changes).length > 0 && (
              <details className="mt-1 text-xs text-muted-foreground">
                <summary className="w-fit cursor-pointer">
                  {r.action === "alterado"
                    ? "Ver valores anteriores e novos"
                    : "Ver dados registrados"}
                </summary>
                <ul className="mt-1 space-y-1">
                  {Object.entries(changes).map(([key, value]) => {
                    const isDifference =
                      value !== null &&
                      typeof value === "object" &&
                      !Array.isArray(value) &&
                      "de" in value &&
                      "para" in value;
                    const difference = isDifference
                      ? (value as { de: unknown; para: unknown })
                      : undefined;
                    return (
                      <li key={key}>
                        <span className="text-foreground">
                          {FIELD[key] ?? key}
                        </span>
                        {difference ? (
                          <>
                            : {short(difference.de)} → {short(difference.para)}
                            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded bg-muted p-2 text-[11px]">
                              {JSON.stringify(difference, null, 2)}
                            </pre>
                          </>
                        ) : (
                          <>
                            : {short(value)}
                            {typeof value === "object" && value !== null && (
                              <pre className="mt-1 overflow-x-auto whitespace-pre-wrap break-words rounded bg-muted p-2 text-[11px]">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            )}
                          </>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </details>
            )}
          </li>
        );
      })}
    </ol>
  );
}
