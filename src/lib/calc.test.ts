import { describe, expect, it } from "vitest";
import {
  computeQuote,
  hourlyCostFromMonthlySalary,
  monthlyHoursForQuote,
  operationCost,
  operationHourlyCost,
  orderedOperations,
  productionEstimate,
  technicalPendencies,
} from "./calc";

const base = {
  quantity: 4,
  materials: [{ description: "4140", unit: "kg", qty: 96, unit_cost: 21.5 }],
  operations: [
    {
      description: "Torno",
      setup_h: 1.5,
      time_min: 95,
      cost_hour: 185,
      time_source: "manual" as const,
    },
  ],
  services: [{ description: "Têmpera", unit: "kg", qty: 80, unit_cost: 14.5 }],
};

describe("cálculo do orçamento", () => {
  it("soma material, operações (setup + tempo × qtd × custo-hora) e serviços com 2 casas", () => {
    const r = computeQuote(base);
    expect(r.materials).toBe(2064);
    expect(r.operations).toBe(1449.17); // (1.5 + 95/60*4) * 185
    expect(r.services).toBe(1160);
    expect(r.total).toBe(4673.17);
  });

  it("não aplica perda/margem/imposto quando não configurados", () => {
    const r = computeQuote(base);
    expect(r.perda + r.margem + r.imposto).toBe(0);
  });

  it("converte salário mensal em custo-hora usando 220 horas", () => {
    expect(hourlyCostFromMonthlySalary(4400)).toBe(20);
    expect(hourlyCostFromMonthlySalary(-100)).toBe(0);
  });

  it("aplica o parâmetro de horas mensais sem alterar o padrão existente", () => {
    expect(hourlyCostFromMonthlySalary(4400, 200)).toBe(22);
    expect(hourlyCostFromMonthlySalary(4400, 0)).toBe(0);
    expect(hourlyCostFromMonthlySalary(4400)).toBe(20);
    expect(monthlyHoursForQuote(220, 180)).toBe(220);
    expect(monthlyHoursForQuote(null, 180)).toBe(180);
    expect(monthlyHoursForQuote(undefined, 0)).toBe(220);
  });

  it("soma o custo-hora do cargo cadastrado ao custo da máquina", () => {
    const operation = {
      description: "Torno",
      cargo_id: "cargo-1",
      salary_monthly: 4400,
      setup_h: 1,
      time_min: 0,
      cost_hour: 10,
      time_source: "manual" as const,
    };
    expect(operationHourlyCost(operation)).toBe(30);
    expect(operationCost(operation, 1)).toBe(30);
    expect(operationHourlyCost(operation, 200)).toBe(32);
    expect(operationCost(operation, 1, 200)).toBe(32);
    expect(
      operationHourlyCost({ ...operation, cargo_id: null }, 200),
    ).toBe(32);
  });

  it("aplica percentuais apenas quando configurados", () => {
    const r = computeQuote({ ...base, adjustments: { margem_pct: 10 } });
    expect(r.margem).toBe(467.32);
  });

  it("consolida setup e tempo de operação na estimativa", () => {
    const e = productionEstimate(base.operations, 4, 8);
    expect(e.hours).toBe(7.83);
    expect(e.days).toBe(1);
  });

  it("aponta tratamento térmico ausente sem bloquear", () => {
    const p = technicalPendencies(
      { desenho: "D1", tolerancia: "h7", tratamento_termico_aplicavel: true },
      { materials: 1, operations: 1 },
    );
    expect(p.map((x) => x.field)).toEqual(["tratamento_termico"]);
  });

  it("mantém as operações em sequência na visualização", () => {
    const operation = {
      description: "Torno",
      setup_h: 1.5,
      time_min: 95,
      cost_hour: 185,
      time_source: "manual" as const,
    };
    const operations = [
      { ...operation, sequence: 2 },
      { ...operation, sequence: 1 },
    ];
    expect(
      orderedOperations(operations).map((operation) => operation.sequence),
    ).toEqual([1, 2]);
  });

  it("sinaliza operações sem parâmetros ou custo aplicável", () => {
    const p = technicalPendencies(
      { desenho: "D1", tolerancia: "h7" },
      {
        materials: 1,
        operations: 1,
        operationLines: [
          {
            description: "",
            setup_h: -1,
            time_min: 0,
            cost_hour: 0,
            time_source: "manual",
          },
        ],
      },
    );
    expect(p).toHaveLength(1);
    const issue = p[0];
    expect(issue?.message).toContain("descrição não informada");
    expect(issue?.message).toContain("máquina não selecionada");
    expect(issue?.message).toContain("tempo por peça deve ser maior que zero");
    expect(issue?.message).toContain("custo-hora aplicável não informado");
  });
});
