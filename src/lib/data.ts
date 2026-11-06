import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";
import type { Adjustments, MaterialLine, OperationLine, ServiceLine, Specs } from "./calc";
import { computeQuote } from "./calc";

export type Client = Database["public"]["Tables"]["clients"]["Row"];
export type CatalogItem = Database["public"]["Tables"]["catalog_items"]["Row"];
export type CatalogKind = Database["public"]["Enums"]["catalog_kind"];
export type CalcParam = Database["public"]["Tables"]["calc_parameters"]["Row"];
export type QuoteStatus = Database["public"]["Enums"]["quote_status"];
export type AppRole = Database["public"]["Enums"]["app_role"];
type QuoteRow = Database["public"]["Tables"]["quotes"]["Row"];
export type Quote = Omit<QuoteRow, "specs" | "materials" | "operations" | "services" | "adjustments"> & {
  specs: Specs;
  materials: MaterialLine[];
  operations: OperationLine[];
  services: ServiceLine[];
  adjustments: Adjustments;
  clients?: { name: string } | null;
};

export const STATUS_LABEL: Record<QuoteStatus, string> = {
  rascunho: "Rascunho",
  pendente: "Pendente",
  em_negociacao: "Em negociação",
  aprovado: "Aprovado",
  reprovado: "Reprovado",
};
export const KIND_LABEL: Record<CatalogKind, string> = {
  material: "Materiais",
  maquina: "Máquinas",
  ferramenta: "Ferramentas",
  cargo: "Cargos / salários",
  servico: "Serviços externos",
};
export const ROLE_LABEL: Record<AppRole, string> = {
  admin: "Administrador",
  orcamentista: "Orçamentista",
  gerente: "Gerente (obsoleto)",
};

export const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(n) || 0);
export const n2 = (n: number) =>
  new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(Number(n) || 0);
export const dt = (s: string) => new Date(s).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
export const quoteCode = (n: number) => `ORC-${String(n).padStart(5, "0")}`;

export function quoteTotals(q: Quote) {
  return computeQuote(q);
}

export function useQuotes() {
  return useQuery({
    queryKey: ["quotes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("quotes")
        .select("*, clients(name)")
        .order("number", { ascending: false });
      if (error) throw error;
      return data as unknown as Quote[];
    },
  });
}
export function useQuote(id: string) {
  return useQuery({
    queryKey: ["quotes", id],
    queryFn: async () => {
      const { data, error } = await supabase.from("quotes").select("*, clients(name)").eq("id", id).single();
      if (error) throw error;
      return data as unknown as Quote;
    },
  });
}
export function useClients() {
  return useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clients").select("*").order("name");
      if (error) throw error;
      return data;
    },
  });
}
export function useCatalog() {
  return useQuery({
    queryKey: ["catalog"],
    queryFn: async () => {
      const { data, error } = await supabase.from("catalog_items").select("*").order("code");
      if (error) throw error;
      return data;
    },
  });
}
export function useParams() {
  return useQuery({
    queryKey: ["params"],
    queryFn: async () => {
      const { data, error } = await supabase.from("calc_parameters").select("*").order("key");
      if (error) throw error;
      return data;
    },
  });
}
export function useAudit(filter?: { entity?: string; entityId?: string }) {
  return useQuery({
    queryKey: ["audit", filter?.entity ?? "all", filter?.entityId ?? "all"],
    queryFn: async () => {
      let q = supabase.from("audit_log").select("*").order("created_at", { ascending: false }).limit(200);
      if (filter?.entity) q = q.eq("entity", filter.entity);
      if (filter?.entityId) q = q.eq("entity_id", filter.entityId);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },
  });
}
