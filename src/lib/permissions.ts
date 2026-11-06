export type Role = "admin" | "orcamentista" | "gerente";

export function permissionsFor(roles: readonly Role[]) {
  const admin = roles.includes("admin");
  const orc = roles.includes("orcamentista");
  return {
    access: admin || orc,
    editQuotes: admin || orc,
    changeStatus: admin,
    viewAllQuotes: admin,
    viewAudit: admin,
    editCatalog: admin,
    editParams: admin,
    manageUsers: admin,
    deleteQuotes: admin,
    deleteUsers: admin,
  };
}
