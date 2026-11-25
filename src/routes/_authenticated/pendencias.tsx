import { useId, useState, type FormEvent, type ReactNode } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader, StatusBadge } from "@/components/status-badge";
import { useAuthScope } from "@/hooks/use-auth-session";
import { useMe } from "@/hooks/use-me";
import { technicalPendencies } from "@/lib/calc";
import { dt, quoteCode } from "@/lib/data";
import {
  clarifyTechnicalQuestion,
  pendencyQuotesQuery,
  registerTechnicalQuestion,
  technicalQuestionsQuery,
  type PendencyQuote,
  type TechnicalQuestion,
} from "@/lib/technical-questions";

export const Route = createFileRoute("/_authenticated/pendencias")({
  head: () => ({
    meta: [
      { title: "Pendências técnicas — Corus" },
      {
        name: "description",
        content: "Dúvidas e pendências técnicas dos orçamentos.",
      },
    ],
  }),
  component: Pend,
});

function Pend() {
  const { can, isPending, isError, refetch } = useMe();
  if (isPending)
    return (
      <p role="status" className="text-muted-foreground">
        Verificando permissões…
      </p>
    );
  if (isError) {
    return (
      <div className="space-y-2">
        <p role="alert" className="text-sm text-destructive">
          Não foi possível verificar suas permissões.
        </p>
        <Button variant="outline" size="sm" onClick={() => void refetch()}>
          Tentar novamente
        </Button>
      </div>
    );
  }
  if (!can.access) {
    return (
      <PageHeader
        title="Acesso restrito"
        subtitle="Seu perfil não permite acessar as pendências técnicas."
      />
    );
  }

  return <Pendencies canClarify={can.clarifyTechnicalQuestions} />;
}

function Pendencies({ canClarify }: { canClarify: boolean }) {
  const scope = useAuthScope();
  const quotes = useInfiniteQuery(pendencyQuotesQuery(scope));
  const questions = useInfiniteQuery(technicalQuestionsQuery(scope));
  const quotesFailed = quotes.isError && !quotes.isFetchNextPageError;
  const questionsFailed = questions.isError && !questions.isFetchNextPageError;
  const quoteRows = quotesFailed
    ? []
    : (quotes.data?.pages.flatMap((page) => page.rows) ?? []);
  const questionRows = questionsFailed
    ? []
    : (questions.data?.pages.flatMap((page) => page.rows) ?? []);

  return (
    <>
      <PageHeader
        title="Pendências técnicas"
        subtitle="Registre e acompanhe dúvidas vinculadas aos orçamentos."
      />
      <div className="space-y-6">
        <Card>
          <CardContent className="space-y-3 p-4">
            <h2 className="text-lg font-semibold">Registrar dúvida técnica</h2>
            {quotes.isPending ? (
              <p role="status" className="text-sm text-muted-foreground">
                Carregando orçamentos…
              </p>
            ) : quotesFailed ? (
              <div className="space-y-2">
                <p role="alert" className="text-sm text-destructive">
                  Não foi possível carregar os orçamentos.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void quotes.refetch()}
                >
                  Recarregar orçamentos
                </Button>
              </div>
            ) : quoteRows.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Nenhum orçamento disponível para registrar uma dúvida.
              </p>
            ) : (
              <RegisterQuestion quotes={quoteRows}>
                {quotes.hasNextPage && (
                  <LoadMore
                    label="orçamentos"
                    failed={quotes.isFetchNextPageError}
                    fetching={quotes.isFetching}
                    onLoad={() =>
                      void quotes.fetchNextPage({ cancelRefetch: false })
                    }
                  />
                )}
              </RegisterQuestion>
            )}
          </CardContent>
        </Card>

        <section aria-labelledby="duvidas-registradas" className="space-y-3">
          <h2 id="duvidas-registradas" className="text-lg font-semibold">
            Dúvidas registradas
          </h2>
          {questions.isPending && (
            <p role="status" className="text-sm text-muted-foreground">
              Carregando dúvidas…
            </p>
          )}
          {questionsFailed && (
            <div className="space-y-2">
              <p role="alert" className="text-sm text-destructive">
                Não foi possível carregar as dúvidas técnicas.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void questions.refetch()}
              >
                Recarregar dúvidas
              </Button>
            </div>
          )}
          {questions.isSuccess && questionRows.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma dúvida técnica registrada.
            </p>
          )}
          {questionRows.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              canClarify={canClarify}
            />
          ))}
          {!questionsFailed && questions.hasNextPage && (
            <LoadMore
              label="dúvidas"
              failed={questions.isFetchNextPageError}
              fetching={questions.isFetching}
              onLoad={() =>
                void questions.fetchNextPage({ cancelRefetch: false })
              }
            />
          )}
        </section>

        {!quotesFailed && quotes.data && (
          <QuotePendencies quotes={quoteRows} hasMore={quotes.hasNextPage} />
        )}
      </div>
    </>
  );
}

function LoadMore({
  label,
  failed,
  fetching,
  onLoad,
}: {
  label: "orçamentos" | "dúvidas";
  failed: boolean;
  fetching: boolean;
  onLoad: () => void;
}) {
  return (
    <div className="space-y-1.5">
      {failed && (
        <p role="alert" className="text-sm text-destructive">
          Não foi possível carregar mais {label}.
        </p>
      )}
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={fetching}
        onClick={onLoad}
      >
        {fetching ? `Carregando ${label}…` : `Carregar mais ${label}`}
      </Button>
    </div>
  );
}

function RegisterQuestion({
  quotes,
  children,
}: {
  quotes: PendencyQuote[];
  children?: ReactNode;
}) {
  const [quoteId, setQuoteId] = useState("");
  const [description, setDescription] = useState("");
  const qc = useQueryClient();
  const { queryKey } = technicalQuestionsQuery(useAuthScope());
  const registration = useMutation({
    mutationFn: async (input: { quote_id: string; description: string }) => {
      if (!quotes.some((quote) => quote.id === input.quote_id)) {
        throw new Error("Selecione um orçamento disponível.");
      }
      await registerTechnicalQuestion(input);
    },
  });

  function register(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registration.isPending) return;
    registration.mutate(
      { quote_id: quoteId, description },
      {
        onSuccess: () => {
          setDescription("");
          toast.success("Dúvida registrada.");
          void qc.invalidateQueries({ queryKey });
          void qc.invalidateQueries({ queryKey: ["audit"] });
        },
      },
    );
  }

  return (
    <form className="space-y-3" onSubmit={register} noValidate>
      <div className="space-y-1.5">
        <label htmlFor="orcamento-duvida" className="block text-sm">
          Orçamento
        </label>
        <select
          id="orcamento-duvida"
          className="h-9 w-full rounded-md border border-input bg-card px-2 text-sm"
          value={quoteId}
          onChange={(event) => {
            setQuoteId(event.target.value);
            if (registration.isError) registration.reset();
          }}
          disabled={registration.isPending}
          required
        >
          <option value="">Selecione um orçamento</option>
          {quotes.map((quote) => (
            <option key={quote.id} value={quote.id}>
              {[quoteCode(quote.number), quote.project, quote.part_name]
                .filter(Boolean)
                .join(" · ")}
            </option>
          ))}
        </select>
        {children}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="descricao-duvida" className="block text-sm">
          Descrição da dúvida
        </label>
        <Textarea
          id="descricao-duvida"
          placeholder="Descreva sua dúvida técnica..."
          value={description}
          onChange={(event) => {
            setDescription(event.target.value);
            if (registration.isError) registration.reset();
          }}
          disabled={registration.isPending}
          required
        />
      </div>

      {registration.error && (
        <p role="alert" className="text-sm text-destructive">
          {registration.error.message}
        </p>
      )}
      <Button type="submit" disabled={registration.isPending}>
        {registration.isPending ? "Registrando…" : "Registrar dúvida"}
      </Button>
    </form>
  );
}

function QuestionCard({
  question,
  canClarify,
}: {
  question: TechnicalQuestion;
  canClarify: boolean;
}) {
  const clarified = question.status === "esclarecida";

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-sm font-medium">
            <Link
              to="/orcamentos/$id"
              params={{ id: question.quote_id }}
              className="text-primary hover:underline"
            >
              {[
                quoteCode(question.quotes.number),
                question.quotes.project,
                question.quotes.part_name,
              ]
                .filter(Boolean)
                .join(" · ")}
            </Link>
          </h3>
          <Badge variant={clarified ? "secondary" : "outline"}>
            {clarified ? "Esclarecida" : "Aberta"}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground">
          Registrada em {dt(question.created_at)}
        </p>
        <p className="whitespace-pre-wrap wrap-anywhere text-sm">
          {question.description}
        </p>

        {clarified ? (
          <div className="space-y-1 border-t pt-3">
            <h4 className="text-sm font-medium">Esclarecimento</h4>
            <p className="whitespace-pre-wrap wrap-anywhere text-sm">
              {question.clarification}
            </p>
            <p className="text-xs text-muted-foreground">
              Esclarecida em {dt(question.updated_at)}
            </p>
          </div>
        ) : canClarify ? (
          <ClarificationForm questionId={question.id} />
        ) : (
          <p className="text-sm text-muted-foreground">
            Aguardando esclarecimento.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function ClarificationForm({ questionId }: { questionId: string }) {
  const fieldId = useId();
  const [clarification, setClarification] = useState("");
  const qc = useQueryClient();
  const { queryKey } = technicalQuestionsQuery(useAuthScope());
  const resolution = useMutation({
    mutationFn: (text: string) => clarifyTechnicalQuestion(questionId, text),
  });

  function resolve(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (resolution.isPending) return;
    resolution.mutate(clarification, {
      onSuccess: (saved) => {
        if (saved) {
          toast.success("Esclarecimento registrado.");
          void qc.invalidateQueries({ queryKey: ["audit"] });
        } else {
          toast.error(
            "Esta dúvida já foi esclarecida ou não está mais disponível.",
          );
        }
        void qc.invalidateQueries({ queryKey });
      },
    });
  }

  return (
    <details className="border-t pt-3">
      <summary className="cursor-pointer text-sm font-medium text-primary">
        Registrar esclarecimento
      </summary>
      <form className="mt-3 space-y-3" onSubmit={resolve} noValidate>
        <div className="space-y-1.5">
          <label htmlFor={fieldId} className="block text-sm">
            Esclarecimento
          </label>
          <Textarea
            id={fieldId}
            value={clarification}
            onChange={(event) => {
              setClarification(event.target.value);
              if (resolution.isError) resolution.reset();
            }}
            disabled={resolution.isPending}
            required
          />
        </div>
        {resolution.error && (
          <p role="alert" className="text-sm text-destructive">
            {resolution.error.message}
          </p>
        )}
        <Button type="submit" size="sm" disabled={resolution.isPending}>
          {resolution.isPending
            ? "Salvando…"
            : "Salvar e marcar como esclarecida"}
        </Button>
      </form>
    </details>
  );
}

function QuotePendencies({
  quotes,
  hasMore,
}: {
  quotes: PendencyQuote[];
  hasMore: boolean;
}) {
  const rows = quotes
    .map((q) => ({
      q,
      p: technicalPendencies(q.specs, {
        materials: q.materials.length,
        operations: q.operations,
      }),
    }))
    .filter((r) => r.p.length > 0);

  return (
    <section aria-labelledby="pendencias-automaticas" className="space-y-3">
      <h2 id="pendencias-automaticas" className="text-lg font-semibold">
        Pendências identificadas automaticamente
      </h2>
      <p className="text-sm text-muted-foreground">
        Desenho, tolerância, tratamento térmico, materiais e operações. Não
        bloqueiam rascunhos.
      </p>
      {hasMore && (
        <p className="text-sm text-muted-foreground">
          Para consultar os próximos orçamentos, use “Carregar mais orçamentos”
          no formulário.
        </p>
      )}
      <Card>
        <CardContent className="overflow-x-auto p-4">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma pendência técnica nos orçamentos carregados.
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Orçamento</th>
                  <th>Peça / Cliente</th>
                  <th>Estado</th>
                  <th>Pendências</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(({ q, p }) => (
                  <tr key={q.id} className="border-b align-top last:border-0">
                    <td className="py-2.5 num">
                      <Link
                        to="/orcamentos/$id/editar"
                        params={{ id: q.id }}
                        className="text-primary hover:underline"
                      >
                        {quoteCode(q.number)}
                      </Link>
                    </td>
                    <td>
                      <div className="font-medium">{q.part_name}</div>
                      <div className="text-xs text-muted-foreground">
                        {q.clients?.name}
                      </div>
                    </td>
                    <td>
                      <StatusBadge status={q.status} />
                    </td>
                    <td>
                      <ul className="space-y-0.5">
                        {p.map((x) => (
                          <li key={x.field} className="flex gap-1.5">
                            <span
                              className={
                                x.severity === "alta"
                                  ? "text-destructive"
                                  : "text-warning"
                              }
                            >
                              ●
                            </span>
                            {x.message}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
