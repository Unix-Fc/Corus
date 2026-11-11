export type QuoteIdentityFields = {
  clientId: string;
  project: string;
  partName: string;
};

export function quoteIdentityIssues(fields: QuoteIdentityFields): string[] {
  const issues: string[] = [];
  if (!fields.clientId.trim()) issues.push("Selecione um cliente.");
  if (!fields.project.trim()) issues.push("Informe o projeto.");
  if (!fields.partName.trim()) issues.push("Informe o nome do projeto/peça.");
  return issues;
}
