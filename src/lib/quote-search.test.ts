import { describe, expect, it } from "vitest";
import {
  EMPTY_SEARCH,
  filterQuotes,
  hasFilters,
  searchIssues,
  type SearchableQuote,
} from "./quote-search";

// datas ao meio-dia para não depender do fuso horário da máquina
const q = (over: Partial<SearchableQuote>): SearchableQuote => ({
  number: 1,
  part_name: "Eixo",
  part_code: null,
  project: null,
  status: "rascunho",
  created_at: "2026-11-10T12:00:00",
  created_by: "u1",
  clients: { name: "Hidrotec" },
  ...over,
});

const quotes = [
  q({ number: 12, part_name: "Eixo principal", project: "Redutor L2" }),
  q({
    number: 13,
    part_name: "Bucha",
    status: "aprovado",
    created_at: "2026-11-20T12:00:00",
    created_by: "u2",
    clients: { name: "Metalúrgica Sul" },
  }),
];

describe("histórico de orçamentos (US-008)", () => {
  it("sem filtros mostra todos os orçamentos (AC-036)", () => {
    expect(filterQuotes(quotes, EMPTY_SEARCH)).toHaveLength(2);
    expect(hasFilters(EMPTY_SEARCH)).toBe(false);
  });

  it("pesquisa por nº, cliente, peça e projeto (AC-037)", () => {
    const by = (term: string) =>
      filterQuotes(quotes, { ...EMPTY_SEARCH, term }).map((x) => x.number);
    expect(by("orc-00013")).toEqual([13]);
    expect(by("metalúrgica")).toEqual([13]);
    expect(by("EIXO")).toEqual([12]);
    expect(by("redutor")).toEqual([12]);
  });

  it("filtra por estado, responsável e período (AC-037)", () => {
    const nums = (s: Partial<typeof EMPTY_SEARCH>) =>
      filterQuotes(quotes, { ...EMPTY_SEARCH, ...s }).map((x) => x.number);
    expect(nums({ status: "aprovado" })).toEqual([13]);
    expect(nums({ owner: "u1" })).toEqual([12]);
    expect(nums({ from: "2026-11-15" })).toEqual([13]);
    expect(nums({ to: "2026-11-10" })).toEqual([12]);
    expect(nums({ from: "2026-11-10", to: "2026-11-20" })).toEqual([12, 13]);
  });

  it("pesquisa sem resultado retorna lista vazia (AC-039)", () => {
    const s = { ...EMPTY_SEARCH, term: "inexistente" };
    expect(filterQuotes(quotes, s)).toEqual([]);
    expect(hasFilters(s)).toBe(true);
  });

  it("rejeita período com data inicial depois da final", () => {
    const s = { ...EMPTY_SEARCH, from: "2026-12-01", to: "2026-11-01" };
    expect(searchIssues(s)).toEqual([
      "A data inicial não pode ser depois da data final.",
    ]);
    expect(filterQuotes(quotes, s)).toEqual([]);
    expect(searchIssues({ ...EMPTY_SEARCH, from: "01/11/2026" })).toEqual([
      "Data inicial inválida.",
    ]);
  });
});
