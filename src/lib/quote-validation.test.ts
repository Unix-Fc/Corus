import { describe, expect, it } from "vitest";
import { quoteIdentityIssues } from "./quote-validation";

describe("identificação do orçamento", () => {
  it("exige cliente, projeto e peça", () => {
    expect(
      quoteIdentityIssues({ clientId: "", project: " ", partName: "" }),
    ).toEqual([
      "Selecione um cliente.",
      "Informe o projeto.",
      "Informe o nome do projeto/peça.",
    ]);
  });

  it("aceita os dados mínimos preenchidos", () => {
    expect(
      quoteIdentityIssues({
        clientId: "client-1",
        project: "Redutor L2",
        partName: "Eixo",
      }),
    ).toEqual([]);
  });
});
