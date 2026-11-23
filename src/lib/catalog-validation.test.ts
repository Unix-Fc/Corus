import { describe, expect, it } from "vitest";
import { cadastroIssues } from "./catalog-validation";

const maquinaOk = {
  code: "MQ-01",
  name: "Torno CNC",
  unit: "h",
  unit_cost: 185,
  setup: 1.5,
  tipo: "Torno CNC",
  potencia: 15,
};

describe("validação dos cadastros (US-007)", () => {
  it("aceita um cadastro de máquina completo", () => {
    expect(cadastroIssues("maquina", maquinaOk)).toEqual([]);
  });

  it("exige código, descrição, unidade e custo (AC-032)", () => {
    expect(cadastroIssues("material", { unit_cost: "" })).toEqual([
      "Informe o código.",
      "Informe a descrição.",
      "Informe a unidade.",
      "Informe um custo maior que zero.",
    ]);
  });

  it("rejeita custo zero ou negativo (AC-033)", () => {
    const base = { code: "MAT-1", name: "Aço", unit: "kg" };
    expect(cadastroIssues("material", { ...base, unit_cost: 0 })).toEqual([
      "Informe um custo maior que zero.",
    ]);
    expect(cadastroIssues("material", { ...base, unit_cost: -5 })).toEqual([
      "Informe um custo maior que zero.",
    ]);
  });

  it("rejeita setup e potência negativos na máquina", () => {
    expect(
      cadastroIssues("maquina", { ...maquinaOk, setup: -1, potencia: -2 }),
    ).toEqual([
      "Setup padrão não pode ser negativo.",
      "Potência não pode ser negativa.",
    ]);
  });

  it("rejeita salário negativo no cargo", () => {
    expect(
      cadastroIssues("cargo", {
        code: "CG-1",
        name: "Torneiro",
        unit: "h",
        unit_cost: 40,
        salario: -100,
      }),
    ).toEqual(["Salário não pode ser negativo."]);
  });

  it("não permite código repetido no mesmo grupo", () => {
    const existing = [{ id: "a", kind: "maquina", code: "mq-01" }];
    expect(cadastroIssues("maquina", maquinaOk, existing)).toEqual([
      "Já existe um cadastro com o código MQ-01.",
    ]);
    // editando o próprio registro não acusa duplicidade
    expect(cadastroIssues("maquina", maquinaOk, existing, "a")).toEqual([]);
    // mesmo código em outro grupo é permitido
    expect(
      cadastroIssues("maquina", maquinaOk, [
        { id: "b", kind: "ferramenta", code: "MQ-01" },
      ]),
    ).toEqual([]);
  });

  it("valida cliente: razão social, CNPJ e e-mail", () => {
    expect(
      cadastroIssues("clientes", { name: " ", cnpj: "123", email: "x@" }),
    ).toEqual([
      "Informe a razão social.",
      "CNPJ deve ter 14 dígitos.",
      "E-mail inválido.",
    ]);
    expect(
      cadastroIssues("clientes", {
        name: "Hidrotec",
        cnpj: "56.789.012/0001-34",
        email: "marcos@hidrotec.com.br",
      }),
    ).toEqual([]);
  });
});
