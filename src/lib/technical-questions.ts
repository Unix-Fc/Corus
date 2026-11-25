import { infiniteQueryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { AuthScope } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";
import type { Quote } from "./data";

const maxLength = 4000;
const pageSize = 25;

function pageOf<T, Cursor>(records: T[], cursorFor: (row: T) => Cursor) {
  const rows = records.slice(0, pageSize);
  const last = rows.at(-1);
  return {
    rows,
    next: records.length > pageSize && last ? cursorFor(last) : undefined,
  };
}

function questionText(requiredMessage: string) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((text) => [...text].length <= maxLength, {
      message: `Use até ${maxLength} caracteres.`,
    });
}

type QuestionCursor = { created_at: string; id: string };

async function listTechnicalQuestions({
  signal,
  pageParam,
}: {
  signal: AbortSignal;
  pageParam: QuestionCursor | null;
}) {
  const query = supabase
    .from("technical_questions")
    .select(
      "id, quote_id, description, status, clarification, created_at, updated_at, quotes!inner(number, project, part_name)",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(pageSize + 1)
    .abortSignal(signal);
  if (pageParam) {
    // The id breaks ties between questions created at the same time.
    query.or(
      `created_at.lt.${pageParam.created_at},and(created_at.eq.${pageParam.created_at},id.lt.${pageParam.id})`,
    );
  }
  const { data, error } = await query;
  if (error) throw error;
  return pageOf(data, ({ created_at, id }) => ({ created_at, id }));
}

export function technicalQuestionsQuery(session: AuthScope | null | undefined) {
  return infiniteQueryOptions({
    queryKey: ["technical-questions", session?.userId, session?.revision],
    enabled: Boolean(session),
    retry: false,
    queryFn: listTechnicalQuestions,
    initialPageParam: null as QuestionCursor | null,
    getNextPageParam: (page) => page.next,
  });
}

export type TechnicalQuestion = Awaited<
  ReturnType<typeof listTechnicalQuestions>
>["rows"][number];

export type PendencyQuote = Pick<
  Quote,
  | "id"
  | "number"
  | "part_name"
  | "project"
  | "specs"
  | "materials"
  | "operations"
  | "status"
  | "clients"
>;

async function listPendencyQuotes({
  signal,
  pageParam,
}: {
  signal: AbortSignal;
  pageParam: number | null;
}) {
  const query = supabase
    .from("quotes")
    .select(
      "id, number, part_name, project, specs, materials, operations, status, clients(name)",
    )
    .order("number", { ascending: false })
    .limit(pageSize + 1)
    .abortSignal(signal);
  if (pageParam !== null) query.lt("number", pageParam);
  const { data, error } = await query;
  if (error) throw error;
  return pageOf(data as unknown as PendencyQuote[], ({ number }) => number);
}

export function pendencyQuotesQuery(session: AuthScope | null | undefined) {
  return infiniteQueryOptions({
    queryKey: ["quotes", session?.userId, session?.revision, "pendency-pages"],
    enabled: Boolean(session),
    retry: false,
    queryFn: listPendencyQuotes,
    initialPageParam: null as number | null,
    getNextPageParam: (page) => page.next,
  });
}

const newQuestion = z.object({
  quote_id: z.string().uuid("Selecione um orçamento."),
  description: questionText("Informe a descrição da dúvida."),
});

export async function registerTechnicalQuestion(
  input: z.input<typeof newQuestion>,
) {
  const result = newQuestion.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);

  const { error } = await supabase
    .from("technical_questions")
    .insert(result.data);
  if (error)
    throw new Error(
      "Não foi possível registrar a dúvida. Verifique o acesso ao orçamento e tente novamente.",
    );
}

const clarificationText = questionText("Informe o esclarecimento.");

export async function clarifyTechnicalQuestion(id: string, input: string) {
  const result = clarificationText.safeParse(input);
  if (!result.success) throw new Error(result.error.issues[0]?.message);

  const { data, error } = await supabase
    .from("technical_questions")
    .update({ status: "esclarecida", clarification: result.data })
    .eq("id", id)
    .eq("status", "aberta")
    .select("id")
    .maybeSingle();
  if (error)
    throw new Error(
      "Não foi possível salvar o esclarecimento. Tente novamente.",
    );
  return Boolean(data);
}
