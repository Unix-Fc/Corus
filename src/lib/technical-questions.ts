import { queryOptions } from "@tanstack/react-query";
import { z } from "zod";
import type { AuthScope } from "@/hooks/use-auth-session";
import { supabase } from "@/integrations/supabase/client";

const maxLength = 4000;

function questionText(requiredMessage: string) {
  return z
    .string()
    .trim()
    .min(1, requiredMessage)
    .refine((text) => [...text].length <= maxLength, {
      message: `Use até ${maxLength} caracteres.`,
    });
}

async function listTechnicalQuestions({ signal }: { signal: AbortSignal }) {
  const { data, error } = await supabase
    .from("technical_questions")
    .select(
      "id, quote_id, description, status, clarification, created_at, updated_at, quotes!inner(number, project, part_name)",
    )
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .abortSignal(signal);
  if (error) throw error;
  return data;
}

export function technicalQuestionsQuery(session: AuthScope | null | undefined) {
  return queryOptions({
    queryKey: ["technical-questions", session?.userId, session?.revision],
    enabled: Boolean(session),
    retry: false,
    queryFn: listTechnicalQuestions,
  });
}

export type TechnicalQuestion = Awaited<
  ReturnType<typeof listTechnicalQuestions>
>[number];

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
