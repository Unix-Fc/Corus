// US-008 — critérios de pesquisa do histórico de orçamentos (AC-037 e AC-039).
// Funções puras, sem acesso ao banco, para poderem ser testadas isoladamente.

// Mesmo formato de `quoteCode` em data.ts (ORC-00012). Não importamos de lá
// porque data.ts carrega o cliente do Supabase, o que atrapalharia os testes.
const quoteCode = (n: number) => `ORC-${String(n).padStart(5, "0")}`;

export type QuoteSearch = {
  /** texto livre: nº, cliente, peça, código ou projeto */
  term: string;
  /** estado do orçamento ("" = todos) */
  status: string;
  /** data inicial (AAAA-MM-DD, "" = sem limite) */
  from: string;
  /** data final (AAAA-MM-DD, "" = sem limite) */
  to: string;
  /** id do responsável ("" = todos) */
  owner: string;
};

export const EMPTY_SEARCH: QuoteSearch = {
  term: "",
  status: "",
  from: "",
  to: "",
  owner: "",
};

/** Campos do orçamento usados na pesquisa. */
export type SearchableQuote = {
  number: number;
  part_name: string;
  part_code: string | null;
  project: string | null;
  status: string;
  created_at: string;
  created_by: string | null;
  clients?: { name: string } | null;
};

const DATE = /^\d{4}-\d{2}-\d{2}$/;

/** Problemas nos critérios de pesquisa. Lista vazia = critérios válidos. */
export function searchIssues(s: QuoteSearch): string[] {
  const issues: string[] = [];
  if (s.from && !DATE.test(s.from)) issues.push("Data inicial inválida.");
  if (s.to && !DATE.test(s.to)) issues.push("Data final inválida.");
  if (issues.length === 0 && s.from && s.to && s.from > s.to)
    issues.push("A data inicial não pode ser depois da data final.");
  return issues;
}

/** Indica se algum filtro foi informado. */
export function hasFilters(s: QuoteSearch): boolean {
  return Boolean(s.term.trim() || s.status || s.from || s.to || s.owner);
}

/** Data local (AAAA-MM-DD) de um timestamp. */
function localDay(iso: string): string {
  const d = new Date(iso);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Aplica os critérios de pesquisa. Critérios inválidos não retornam nada. */
export function filterQuotes<T extends SearchableQuote>(
  quotes: readonly T[],
  s: QuoteSearch,
): T[] {
  if (searchIssues(s).length > 0) return [];
  const term = s.term.trim().toLowerCase();
  return quotes.filter((q) => {
    if (s.status && q.status !== s.status) return false;
    if (s.owner && q.created_by !== s.owner) return false;
    const day = localDay(q.created_at);
    if (s.from && day < s.from) return false;
    if (s.to && day > s.to) return false;
    if (!term) return true;
    return [
      quoteCode(q.number),
      q.part_name,
      q.part_code,
      q.project,
      q.clients?.name,
    ].some((v) => v?.toLowerCase().includes(term));
  });
}
