import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/_authenticated/orcamentos.$id";

const { quote, current } = vi.hoisted(() => ({
  current: { role: "orcamentista" },
  quote: {
    id: "quote-1",
    number: 1,
    part_name: "Peça de teste",
    part_code: "PT-1",
    project: "Projeto de teste",
    quantity: 1,
    specs: {},
    materials: [],
    operations: [
      {
        sequence: 1,
        description: "Operação de teste",
        machine_id: null,
        machine_name_snapshot: null,
        tool_id: null,
        tool_name_snapshot: null,
        cargo_id: null,
        cargo_name_snapshot: null,
        salary_monthly: null,
        cost_hour: 0,
        setup_h: 0,
        time_min: 0,
        time_source: "manual",
      },
    ],
    services: [],
    adjustments: {},
    monthly_hours: 220,
    status: "rascunho",
    client_name_snapshot: "Cliente de teste",
    clients: null,
    lead_time_days: null,
    lead_time_manual: false,
  },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useParams: () => ({ id: "quote-1" }),
  }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { from: vi.fn() },
}));

vi.mock("@/hooks/use-me", () => ({
  useMe: () => ({
    can: {
      changeStatus: false,
      editQuotes: false,
      printProposals: current.role === "admin",
    },
  }),
}));

vi.mock("@/lib/data", () => ({
  STATUS_LABEL: { rascunho: "Rascunho" },
  brl: () => "R$ 0,00",
  n2: () => "0,00",
  quoteCode: () => "ORC-00001",
  quoteClientName: () => "Cliente de teste",
  quoteTotals: () => ({
    materials: 0,
    operations: 0,
    services: 0,
    subtotal: 0,
    perda: 0,
    margem: 0,
    imposto: 0,
    total: 0,
    unit: 0,
  }),
  useAudit: () => ({ data: [] }),
  useCatalog: () => ({ data: [] }),
  useParams: () => ({ data: [] }),
  useQuote: () => ({ data: quote, isLoading: false, isError: false }),
}));

vi.mock("@/lib/calc", () => ({
  hourlyCostFromMonthlySalary: () => 0,
  materialCost: () => 0,
  operationCost: () => 0,
  operationHourlyCost: () => 0,
  operationHours: () => 0,
  orderedOperations: (operations: unknown[]) => operations,
  productionEstimate: () => ({
    setup: 0,
    run: 0,
    hours: 0,
    days: 0,
    manual: 0,
    parametro: 0,
  }),
  technicalPendencies: () => [],
}));

describe("quote detail layout", () => {
  beforeEach(() => {
    current.role = "orcamentista";
    quote.status = "rascunho";
  });

  it("contains wide tables inside their card instead of the page layout", () => {
    const Page = Route.options.component!;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Page />
      </QueryClientProvider>,
    );

    const tableRegion = screen.getByRole("region", {
      name: "Tabela: Operações internas",
    });

    expect(tableRegion).toHaveClass("min-w-0", "overflow-x-auto");
    expect(tableRegion.querySelector("table")).toHaveClass("min-w-max");
    expect(tableRegion.closest(".grid.min-w-0")).toHaveClass(
      "lg:grid-cols-[minmax(0,1fr)_320px]",
    );
  });

  it("shows both print options to an administrator on an approved quote", () => {
    current.role = "admin";
    quote.status = "aprovado";
    const Page = Route.options.component!;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Page />
      </QueryClientProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Proposta" }));

    const chooser = screen.getByRole("dialog");
    expect(chooser).toHaveTextContent("Ordem de produção");
    expect(chooser).toHaveTextContent("Proposta para o cliente");
  });

  it("does not show proposal actions to a non-administrator", () => {
    quote.status = "aprovado";
    const Page = Route.options.component!;
    render(
      <QueryClientProvider client={new QueryClient()}>
        <Page />
      </QueryClientProvider>,
    );

    expect(
      screen.queryByRole("button", { name: "Proposta" }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Proposta após aprovação" }),
    ).not.toBeInTheDocument();
  });
});
