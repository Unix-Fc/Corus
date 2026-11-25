import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/_authenticated/orcamentos.$id_.proposta";

const { current, quote } = vi.hoisted(() => ({
  current: { authorized: true, tipo: "ordem" as "ordem" | "cliente" },
  quote: {
    id: "quote-1",
    number: 17,
    part_name: "Eixo",
    part_code: "EX-17",
    project: "Projeto alfa",
    quantity: 2,
    specs: {
      desenho: "DRW-17",
      tolerancia: "±0,1 mm",
      tratamento_termico_aplicavel: false,
      tratamento_termico: null,
    },
    materials: [{ description: "Aço 1020", qty: 2, unit: "kg", unit_cost: 20 }],
    operations: [
      {
        sequence: 1,
        description: "Torneamento",
        machine_id: "machine-1",
        machine_name_snapshot: null,
        tool_id: null,
        tool_name_snapshot: null,
        cargo_id: null,
        cargo_name_snapshot: null,
        salary_monthly: null,
        cost_hour: 10,
        setup_h: 1,
        time_min: 2,
        time_source: "manual",
      },
    ],
    services: [],
    adjustments: {},
    monthly_hours: 220,
    status: "aprovado",
    client_name_snapshot: "Cliente alfa",
    clients: null,
    lead_time_days: 5,
    lead_time_manual: true,
    notes: null,
  },
}));

vi.mock("@tanstack/react-router", () => ({
  createFileRoute: () => (options: Record<string, unknown>) => ({
    options,
    useParams: () => ({ id: "quote-1" }),
    useSearch: () => ({ tipo: current.tipo }),
  }),
  Link: ({ children }: { children: ReactNode }) => <a>{children}</a>,
}));

vi.mock("@/hooks/use-me", () => ({
  useMe: () => ({
    can: { printProposals: current.authorized },
    isPending: false,
    isError: false,
  }),
}));

vi.mock("@/lib/data", () => ({
  brl: (value: number) => `R$ ${value.toFixed(2)}`,
  n2: (value: number) => value.toFixed(2).replace(".", ","),
  quoteCode: () => "ORC-00017",
  quoteClientName: () => "Cliente alfa",
  quoteTotals: () => ({
    materials: 40,
    operations: 20,
    services: 0,
    subtotal: 60,
    perda: 0,
    margem: 0,
    imposto: 0,
    total: 60,
    unit: 30,
  }),
  useCatalog: () => ({
    data: [{ id: "machine-1", name: "Torno CNC" }],
  }),
  useParams: () => ({ data: [{ key: "horas_dia", value: "8" }] }),
  useQuote: () => ({ data: quote, isError: false, isPending: false }),
}));

vi.mock("@/lib/calc", () => ({
  materialCost: () => 40,
  operationCost: () => 20,
  operationHours: () => 5,
  orderedOperations: (operations: unknown[]) => operations,
  productionEstimate: () => ({
    setup: 1,
    run: 4,
    hours: 5,
    days: 2,
    manual: 1,
    parametro: 0,
  }),
}));

describe("proposal documents", () => {
  beforeEach(() => {
    current.authorized = true;
    current.tipo = "ordem";
  });

  function renderProposal() {
    const Page = Route.options.component!;
    return render(
      <QueryClientProvider client={new QueryClient()}>
        <Page />
      </QueryClientProvider>,
    );
  }

  it("prints production details without values", () => {
    renderProposal();

    expect(screen.getByText("Ordem de produção ORC-00017")).toBeInTheDocument();
    expect(
      screen.getByText("Torneamento", { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText("Torno CNC")).toBeInTheDocument();
    expect(
      screen.getByText("Tempo de produção estimado").parentElement,
    ).toHaveTextContent("5,00 h (setup 1,00 h + operação 4,00 h)");
    expect(screen.queryByText(/R\$/)).not.toBeInTheDocument();
    expect(screen.queryByText("Valor total")).not.toBeInTheDocument();
  });

  it("prints customer value and business-day deadline without production hours", () => {
    current.tipo = "cliente";
    renderProposal();

    expect(screen.getByText("Proposta ORC-00017")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Corus Equipamentos Industriais" }),
    ).toHaveAttribute("src", "/corus-logo.png");
    expect(screen.getByText("DRW-17")).toBeInTheDocument();
    expect(screen.getByText("±0,1 mm")).toBeInTheDocument();
    expect(
      screen.getByText(
        (_, element) =>
          element?.textContent?.replace(/\s+/g, " ").trim() ===
          "5,00 dias úteis",
      ),
    ).toBeInTheDocument();
    const pieceAndTotal = screen.getByText("Valor total").closest("section");
    expect(pieceAndTotal).toHaveClass("grid");
    expect(pieceAndTotal).toHaveTextContent("Eixo (EX-17)");
    expect(pieceAndTotal).toHaveTextContent("R$ 60.00");
    expect(screen.queryByText("Aço 1020")).not.toBeInTheDocument();
    expect(screen.queryByText(/Torneamento/)).not.toBeInTheDocument();
    expect(screen.queryByText("Torno CNC")).not.toBeInTheDocument();
    expect(screen.queryByText("Subtotal")).not.toBeInTheDocument();
    expect(screen.queryByText("Valor unitário")).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Tempo de produção estimado/),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/5,00 h/)).not.toBeInTheDocument();
  });

  it("blocks direct document access for non-administrators", () => {
    current.authorized = false;
    renderProposal();

    expect(
      screen.getByText(
        "Somente administradores podem acessar os documentos de proposta.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Ordem de produção ORC-00017"),
    ).not.toBeInTheDocument();
  });
});
