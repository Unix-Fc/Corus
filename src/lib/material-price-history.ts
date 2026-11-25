import { infiniteQueryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { AuthScope } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";
import { Constants } from "@/integrations/supabase/types";

export const MATERIAL_PRICE_KIND_LABEL = {
  compra: "Compra realizada",
  referencia: "Referência de preço",
};

const pageSize = 25;
type HistoryCursor = { id: string; occurred_on: string | null };

async function listHistory(
  materialId: string | null,
  cursor: HistoryCursor | null,
  signal: AbortSignal,
) {
  const query = supabase
    .from("material_price_history")
    .select(
      "id, kind, unit_price, unit, occurred_on, source, material_name_snapshot",
    )
    .order("occurred_on", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1)
    .abortSignal(signal);
  if (materialId) query.eq("material_id", materialId);
  else query.is("material_id", null);

  if (cursor?.occurred_on === null) {
    query.is("occurred_on", null).lt("id", cursor.id);
  } else if (cursor) {
    const { occurred_on, id } = cursor;
    query.or(
      `occurred_on.lt.${occurred_on},and(occurred_on.eq.${occurred_on},id.lt.${id}),occurred_on.is.null`,
    );
  }

  const { data, error } = await query;
  if (error) throw error;
  const rows = data.slice(0, pageSize);
  const last = rows.at(-1);
  return {
    rows,
    next:
      data.length > pageSize && last
        ? { id: last.id, occurred_on: last.occurred_on }
        : undefined,
  };
}

export function materialHistoryQuery(
  scope: AuthScope | null | undefined,
  materialId: string,
) {
  return infiniteQueryOptions({
    queryKey: [
      "material-price-history",
      scope?.userId,
      scope?.revision,
      materialId,
    ],
    enabled: Boolean(scope && materialId),
    retry: false,
    initialPageParam: null as HistoryCursor | null,
    queryFn: ({
      pageParam,
      signal,
    }: {
      pageParam: HistoryCursor | null;
      signal: AbortSignal;
    }) => listHistory(materialId, pageParam, signal),
    getNextPageParam: (page) => page.next,
  });
}

export function unlinkedMaterialHistoryQuery(
  scope: AuthScope | null | undefined,
) {
  return infiniteQueryOptions({
    queryKey: [
      "material-price-history",
      scope?.userId,
      scope?.revision,
      "unlinked",
    ],
    enabled: Boolean(scope),
    retry: false,
    initialPageParam: null as HistoryCursor | null,
    queryFn: ({
      pageParam,
      signal,
    }: {
      pageParam: HistoryCursor | null;
      signal: AbortSignal;
    }) => listHistory(null, pageParam, signal),
    getNextPageParam: (page) => page.next,
  });
}

type MaterialCursor = { name: string; id: string };

async function listMaterials(
  cursor: MaterialCursor | null,
  signal: AbortSignal,
) {
  const query = supabase
    .from("catalog_items")
    .select("id, code, name, unit, unit_cost, active")
    .eq("kind", "material")
    .order("name")
    .order("id")
    .limit(pageSize + 1)
    .abortSignal(signal);
  if (cursor) {
    // Quote the name for PostgREST's logic grammar before URL encoding.
    const name = `"${cursor.name.replace(/["\\]/g, "\\$&")}"`;
    query.or(`name.gt.${name},and(name.eq.${name},id.gt.${cursor.id})`);
  }
  const { data, error } = await query;
  if (error) throw error;
  const rows = data.slice(0, pageSize);
  const last = rows.at(-1);
  return {
    rows,
    next:
      data.length > pageSize && last
        ? { name: last.name, id: last.id }
        : undefined,
  };
}

export type HistoryMaterial = Awaited<
  ReturnType<typeof listMaterials>
>["rows"][number];

export function historyMaterialsQuery(scope: AuthScope | null | undefined) {
  return infiniteQueryOptions({
    queryKey: [
      "catalog",
      scope?.userId,
      scope?.revision,
      "material-history-picker",
    ],
    enabled: Boolean(scope),
    retry: false,
    initialPageParam: null as MaterialCursor | null,
    queryFn: ({
      pageParam,
      signal,
    }: {
      pageParam: MaterialCursor | null;
      signal: AbortSignal;
    }) => listMaterials(pageParam, signal),
    getNextPageParam: (page) => page.next,
  });
}

function requiredText(label: string, max: number) {
  return z
    .string()
    .trim()
    .min(1, `Informe ${label}.`)
    .refine(
      (value) => [...value].length <= max,
      `${label.charAt(0).toUpperCase() + label.slice(1)} deve ter até ${max} caracteres.`,
    );
}

const materialPrice = z.object({
  material_id: z.string().uuid("Selecione um material."),
  kind: z.string().pipe(z.enum(Constants.public.Enums.material_price_kind)),
  unit_price: z
    .string()
    .trim()
    .regex(
      /^\d{1,12}(?:[.,]\d{1,2})?$/,
      "Informe um preço com até duas casas decimais.",
    )
    .transform((value) => Number(value.replace(",", ".")))
    .refine((value) => value > 0, "O preço deve ser maior que zero."),
  unit: requiredText("a unidade do preço", 24),
  occurred_on: z.union([
    z.literal("").transform(() => null),
    z
      .string()
      .date("Informe uma data válida.")
      .refine((value) => !value.startsWith("0000"), "Informe uma data válida."),
  ]),
  source: requiredText("a fonte ou a referência do documento", 400),
});

export type MaterialPriceInput = z.input<typeof materialPrice>;

export async function recordMaterialPrice(input: MaterialPriceInput) {
  const result = materialPrice.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);

  const { error } = await supabase
    .from("material_price_history")
    .insert(result.data);
  if (error) {
    throw new Error(
      `Não foi possível registrar o preço: ${error.message}`,
    );
  }
}
