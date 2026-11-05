import { dt } from "@/lib/data";
import type { Database } from "@/integrations/supabase/types";

type Row = Database["public"]["Tables"]["audit_log"]["Row"];

const FIELD: Record<string, string> = {
  status: "Estado", total: "Total", materials: "Materiais", operations: "Operações", services: "Serviços",
  specs: "Especificações", quantity: "Quantidade", part_name: "Peça", value: "Valor", validated: "Validado",
  adjustments: "Ajustes", unit_cost: "Custo unitário", active: "Ativo", name: "Nome", lead_time_days: "Prazo",
};
const ENTITY: Record<string, string> = { quotes: "Orçamento", calc_parameters: "Parâmetro", catalog_items: "Cadastro", clients: "Cliente" };

function short(v: unknown) {
  if (v === null || v === undefined) return "—";
  if (typeof v === "object") return Array.isArray(v) ? `${v.length} itens` : "objeto";
  return String(v);
}

export function AuditList({ rows, showEntity }: { rows: Row[]; showEntity?: boolean }) {
  if (rows.length === 0) return <p className="text-sm text-muted-foreground">Sem registros.</p>;
  return (
    <ol className="space-y-3">
      {rows.map((r) => {
        const ch = (r.changes ?? {}) as Record<string, { de?: unknown; para?: unknown }>;
        return (
          <li key={r.id} className="border-l-2 border-primary/30 pl-3 text-sm">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="font-medium capitalize">{r.action}</span>
              {showEntity && <span className="text-muted-foreground">{ENTITY[r.entity] ?? r.entity} · <span className="num text-xs">{r.entity_id.slice(0, 18)}</span></span>}
              <span className="text-xs text-muted-foreground">{dt(r.created_at)} · {r.user_email ?? "sistema / carga inicial"}</span>
            </div>
            {r.action === "alterado" && (
              <ul className="mt-1 text-xs text-muted-foreground">
                {Object.entries(ch).map(([k, v]) => (
                  <li key={k}><span className="text-foreground">{FIELD[k] ?? k}</span>: {short(v.de)} → {short(v.para)}</li>
                ))}
              </ul>
            )}
          </li>
        );
      })}
    </ol>
  );
}
