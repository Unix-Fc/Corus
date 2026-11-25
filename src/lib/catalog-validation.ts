// US-007 — validação dos cadastros de referência (AC-032 e AC-033).
// Funções puras, sem acesso ao banco, para poderem ser testadas isoladamente.

export type CadastroTab =
  "clientes" | "material" | "maquina" | "ferramenta" | "cargo" | "servico";

export type CadastroForm = Record<string, string | number | boolean>;

/** Registro já existente, usado para impedir códigos repetidos. */
export type ExistingItem = { id: string; kind: string; code: string | null };

const text = (v: unknown) => String(v ?? "").trim();

/** Converte o valor do formulário em número; campo vazio vira `null`. */
function num(v: unknown): number | null {
  if (v === "" || v === undefined || v === null) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Retorna a lista de problemas do formulário. Lista vazia = pode salvar.
 * @param tab grupo de cadastro selecionado
 * @param f valores do formulário
 * @param existing registros já cadastrados (para checar código duplicado)
 * @param editingId id do registro em edição (não conta como duplicado)
 */
export function cadastroIssues(
  tab: CadastroTab,
  f: CadastroForm,
  existing: readonly ExistingItem[] = [],
  editingId?: string,
): string[] {
  const issues: string[] = [];

  if (tab === "clientes") {
    if (!text(f["name"])) issues.push("Informe a razão social.");
    const cnpj = text(f["cnpj"]).replace(/\D/g, "");
    if (cnpj && cnpj.length !== 14) issues.push("CNPJ deve ter 14 dígitos.");
    const email = text(f["email"]);
    if (email && !EMAIL.test(email)) issues.push("E-mail inválido.");
    return issues;
  }

  // Campos obrigatórios (AC-032)
  const code = text(f["code"]);
  if (!code) issues.push("Informe o código.");
  if (!text(f["name"])) issues.push("Informe a descrição.");
  if (!text(f["unit"])) issues.push("Informe a unidade.");

  // Valores inválidos (AC-033)
  const cost = num(f["unit_cost"]);
  if (cost === null || Number.isNaN(cost) || cost <= 0)
    issues.push("Informe um custo maior que zero.");

  if (tab === "maquina") {
    const setup = num(f["setup"]);
    if (setup !== null && (Number.isNaN(setup) || setup < 0))
      issues.push("Setup padrão não pode ser negativo.");
    const pot = num(f["potencia"]);
    if (pot !== null && (Number.isNaN(pot) || pot < 0))
      issues.push("Potência não pode ser negativa.");
  }

  if (tab === "cargo") {
    const sal = num(f["salario"]);
    if (sal !== null && (Number.isNaN(sal) || sal < 0))
      issues.push("Salário não pode ser negativo.");
  }

  // Código único dentro do mesmo grupo
  if (code) {
    const dup = existing.some(
      (e) =>
        e.kind === tab &&
        e.id !== editingId &&
        text(e.code).toLowerCase() === code.toLowerCase(),
    );
    if (dup) issues.push(`Já existe um cadastro com o código ${code}.`);
  }

  return issues;
}
