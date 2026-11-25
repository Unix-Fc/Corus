import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AuditList } from "@/components/audit-list";
import type { Database } from "@/integrations/supabase/types";

type AuditRow = Database["public"]["Tables"]["audit_log"]["Row"];

const row: AuditRow = {
  id: 1,
  entity: "quotes",
  entity_id: "quote-1",
  action: "criado",
  changes: {
    quantity: 2,
    total: 140,
    adjustments: { margem_pct: 10 },
    operations: [{ cost_hour: 50, time_min: 30, time_source: "parametro" }],
  },
  user_id: "user-1",
  user_email: "orcamentista@example.com",
  created_at: "2026-11-25T12:00:00.000Z",
};

describe("histórico de orçamento", () => {
  it("expõe os parâmetros e valores iniciais registrados na criação", () => {
    render(<AuditList rows={[row]} />);

    fireEvent.click(screen.getByText("Ver dados registrados"));

    expect(screen.getByText("Ajustes e percentuais")).toBeInTheDocument();
    expect(screen.getByText(/margem_pct/)).toBeInTheDocument();
    expect(screen.getByText(/time_source/)).toBeInTheDocument();
    expect(screen.getByText(/orcamentista@example.com/)).toBeInTheDocument();
  });

  it("permite expandir os valores anteriores e novos de uma alteração", () => {
    render(
      <AuditList
        rows={[
          {
            ...row,
            action: "alterado",
            changes: { total: { de: 120, para: 140 } },
          },
        ]}
      />,
    );

    fireEvent.click(screen.getByText("Ver valores anteriores e novos"));

    expect(screen.getByText("Total").parentElement).toHaveTextContent(
      "120 → 140",
    );
  });
});
