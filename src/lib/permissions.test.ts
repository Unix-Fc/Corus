import { describe, expect, it } from "vitest";
import { permissionsFor } from "./permissions";

describe("permissões", () => {
  it("orçamentista não altera estado nem vê auditoria", () => {
    const p = permissionsFor(["orcamentista"]);
    expect(p.changeStatus).toBe(false);
    expect(p.viewAudit).toBe(false);
    expect(p.viewAllQuotes).toBe(false);
  });
  it("só admin altera parâmetros, perfis e exclui", () => {
    const o = permissionsFor(["orcamentista"]);
    const a = permissionsFor(["admin"]);
    expect([
      o.editParams,
      o.editCatalog,
      o.manageUsers,
      o.deleteQuotes,
      o.deleteUsers,
    ]).toEqual([false, false, false, false, false]);
    expect([
      a.editParams,
      a.manageUsers,
      a.deleteQuotes,
      a.deleteUsers,
      a.changeStatus,
      a.viewAudit,
    ]).toEqual([true, true, true, true, true, true]);
  });
  it("administrador não precisa acumular o perfil de orçamentista", () => {
    expect(permissionsFor(["admin", "orcamentista"])).toEqual(
      permissionsFor(["admin"]),
    );
  });
  it("gerente não tem mais acesso", () => {
    expect(permissionsFor(["gerente"]).access).toBe(false);
  });
});
