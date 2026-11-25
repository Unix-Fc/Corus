import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import type { AuthChangeEvent, Session } from "@supabase/supabase-js";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionContext, useAuthSession } from "@/hooks/use-auth-session";
import { Route as ProtectedRoute } from "@/routes/_authenticated/route";
import { Route as PendenciesRoute } from "@/routes/_authenticated/pendencias";

const { auth, request } = vi.hoisted(() => ({
  auth: {
    userId: null as string | null,
    listener: undefined as
      ((event: AuthChangeEvent, session: Session | null) => void) | undefined,
  },
  request: vi.fn<typeof fetch>(),
}));

vi.mock("@/integrations/supabase/client", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const rest = createClient("http://127.0.0.1:54321", "test-key", {
    global: { fetch: request },
    auth: { persistSession: false },
  });
  return {
    supabase: {
      from: rest.from.bind(rest),
      auth: {
        getUser: async () => ({
          data: { user: auth.userId ? { id: auth.userId } : null },
          error: null,
        }),
        onAuthStateChange: (listener: typeof auth.listener) => {
          auth.listener = listener;
          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  auth.listener = undefined;
                },
              },
            },
          };
        },
      },
    },
  };
});

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  Outlet: () => {
    const Page = PendenciesRoute.options.component!;
    return <Page />;
  },
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
  useNavigate: () => vi.fn(),
  useRouterState: () => false,
}));

vi.mock("@/components/app-sidebar", () => ({ AppSidebar: () => null }));

const firstId = "3709eda6-8eb4-4414-aa08-bc879314595f";
const secondId = "1542fc6f-63c7-44e0-8fa0-7d80e599e5e1";
const firstQuoteId = "b7804460-8550-4820-b2b1-735e8b720ea8";
const secondQuoteId = "e8826f97-51e7-463e-9120-5af855a38edc";
const firstDescription = "Dúvida da primeira conta";
const secondDescription = "Dúvida da segunda conta";

function respond(input: RequestInfo | URL) {
  const path = new URL(String(input)).pathname;
  const first = auth.userId === firstId;
  const quote = {
    id: first ? firstQuoteId : secondQuoteId,
    number: first ? 101 : 202,
    part_name: first ? "Eixo da primeira conta" : "Mancal da segunda conta",
    specs: {},
    materials: [],
    operations: [],
    status: "rascunho",
  };
  if (path.endsWith("/profiles")) {
    return Response.json([{ id: auth.userId, access_enabled: true }]);
  }
  if (path.endsWith("/user_roles")) {
    return Response.json([{ role: first ? "admin" : "orcamentista" }]);
  }
  if (path.endsWith("/quotes")) return Response.json([quote]);
  return Response.json([
    {
      id: quote.id,
      quote_id: quote.id,
      description: first ? firstDescription : secondDescription,
      status: "aberta",
      clarification: null,
      quotes: quote,
      created_at: "2026-11-24T12:00:00Z",
    },
  ]);
}

function emit(event: AuthChangeEvent, userId: string | null, expiry?: number) {
  auth.userId = userId;
  act(() =>
    auth.listener?.(
      event,
      userId ? ({ user: { id: userId }, expires_at: expiry } as Session) : null,
    ),
  );
}

function renderProtectedPage() {
  const client = new QueryClient();
  function App() {
    const session = useAuthSession(client);
    const Layout = ProtectedRoute.options.component!;
    return (
      <QueryClientProvider client={client}>
        <AuthSessionContext.Provider value={session}>
          <Layout />
        </AuthSessionContext.Provider>
      </QueryClientProvider>
    );
  }
  render(<App />);
  return client;
}

function deferredResponse() {
  let resolve!: (response: Response) => void;
  const promise = new Promise<Response>((done) => {
    resolve = done;
  });
  return { promise, resolve };
}

describe("Isolamento de dados por sessão", () => {
  beforeEach(() => {
    auth.userId = null;
    request.mockReset();
    request.mockImplementation(async (input) => respond(input));
  });

  afterEach(() => vi.useRealTimers());

  it.each(["SIGNED_OUT", "SIGNED_IN"] as const)(
    "isola os dados ao receber %s de outra aba, com páginas seguintes pendentes",
    async (event) => {
      request.mockImplementation(async (input) => {
        const response = respond(input);
        const path = new URL(String(input)).pathname;
        if (
          auth.userId !== firstId ||
          !/\/(quotes|technical_questions)$/.test(path)
        ) {
          return response;
        }
        const [first] = await response.json();
        return Response.json([
          first,
          ...Array.from({ length: 25 }, (_, index) => ({
            ...first,
            id: `00000000-0000-4000-8000-${String(25 - index).padStart(12, "0")}`,
            number: 100 - index,
            description: `Dúvida anterior ${index + 1}`,
          })),
        ]);
      });
      const client = renderProtectedPage();
      expect(screen.getByText("Verificando sessão…")).toBeInTheDocument();
      emit("INITIAL_SESSION", firstId);
      expect(await screen.findByText(firstDescription)).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /ORC-00101/ }),
      ).toBeInTheDocument();
      expect(screen.getAllByText("Registrar esclarecimento")).toHaveLength(25);

      const previousQuotes = deferredResponse();
      const previousQuestions = deferredResponse();
      const nextProfile = deferredResponse();
      const previousResponses = {
        quotes: respond("http://localhost/rest/v1/quotes"),
        questions: respond("http://localhost/rest/v1/technical_questions"),
      };
      const pending: AbortSignal[] = [];
      request.mockImplementation(async (input, init) => {
        const { pathname: path, searchParams } = new URL(String(input));
        if (auth.userId === firstId && path.endsWith("/quotes")) {
          expect(searchParams.get("number")).toBe("lt.77");
          pending.push(init!.signal!);
          return previousQuotes.promise;
        }
        if (auth.userId === firstId && path.endsWith("/technical_questions")) {
          expect(searchParams.get("or")).toContain(
            "id.lt.00000000-0000-4000-8000-000000000002",
          );
          pending.push(init!.signal!);
          return previousQuestions.promise;
        }
        if (path.endsWith("/profiles")) return nextProfile.promise;
        return respond(input);
      });

      fireEvent.click(
        screen.getByRole("button", { name: "Carregar mais orçamentos" }),
      );
      fireEvent.click(
        screen.getByRole("button", { name: "Carregar mais dúvidas" }),
      );
      await waitFor(() => expect(pending).toHaveLength(2));

      if (event === "SIGNED_OUT") {
        emit(event, null);
        expect(screen.getByText(/Sessão encerrada/)).toBeInTheDocument();
      }
      emit("SIGNED_IN", secondId);
      expect(screen.getByText("Verificando permissões…")).toBeInTheDocument();
      expect(screen.queryByText(firstDescription)).not.toBeInTheDocument();
      expect(
        screen.queryByRole("option", { name: /ORC-00101/ }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText("Registrar esclarecimento"),
      ).not.toBeInTheDocument();
      expect(pending.every((signal) => signal.aborted)).toBe(true);

      previousQuotes.resolve(previousResponses.quotes);
      previousQuestions.resolve(previousResponses.questions);
      nextProfile.resolve(
        Response.json({ message: "Consulta falhou" }, { status: 400 }),
      );
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Não foi possível verificar suas permissões.",
      );
      expect(
        client
          .getQueryCache()
          .getAll()
          .every(({ queryKey }) => !queryKey.includes(firstId)),
      ).toBe(true);

      request.mockImplementation(async (input) => respond(input));
      fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
      expect(await screen.findByText(secondDescription)).toBeInTheDocument();
      expect(
        screen.getByRole("option", { name: /ORC-00202/ }),
      ).toBeInTheDocument();
      expect(screen.queryByText(firstDescription)).not.toBeInTheDocument();
      expect(
        screen.queryByText("Registrar esclarecimento"),
      ).not.toBeInTheDocument();
    },
  );

  it("limpa dados e formulários ao expirar a sessão, mesmo sem receber SIGNED_OUT", async () => {
    const client = renderProtectedPage();
    emit("INITIAL_SESSION", firstId);
    expect(await screen.findByText(firstDescription)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Descrição da dúvida"), {
      target: { value: "Rascunho local" },
    });

    vi.useFakeTimers();
    const expiry = Math.floor(Date.now() / 1000) + 10;
    emit("TOKEN_REFRESHED", firstId, expiry);
    expect(screen.getByText(firstDescription)).toBeInTheDocument();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(10_000);
    });
    expect(screen.getByText(/Sessão encerrada/)).toBeInTheDocument();
    expect(screen.queryByText(firstDescription)).not.toBeInTheDocument();
    expect(client.getQueryCache().getAll()).toHaveLength(0);
    vi.useRealTimers();

    emit("SIGNED_IN", firstId);
    expect(await screen.findByText(firstDescription)).toBeInTheDocument();
    expect(screen.getByLabelText("Descrição da dúvida")).toHaveValue("");
  });

  it("oculta dados em cache quando a atualização de orçamentos e dúvidas falha", async () => {
    const client = renderProtectedPage();
    emit("INITIAL_SESSION", firstId);
    expect(await screen.findByText(firstDescription)).toBeInTheDocument();
    request.mockResolvedValueOnce(
      Response.json({ message: "Falha" }, { status: 400 }),
    );
    request.mockResolvedValueOnce(
      Response.json({ message: "Falha" }, { status: 400 }),
    );

    await act(async () => {
      await Promise.all([
        client.refetchQueries({ queryKey: ["quotes"] }),
        client.refetchQueries({ queryKey: ["technical-questions"] }),
      ]);
    });
    expect(
      await screen.findByText("Não foi possível carregar os orçamentos."),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Não foi possível carregar as dúvidas técnicas."),
    ).toBeInTheDocument();
    expect(screen.queryByText(firstDescription)).not.toBeInTheDocument();
    expect(
      screen.queryByRole("option", { name: /ORC-00101/ }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Pendências identificadas automaticamente"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText("Nenhuma dúvida técnica registrada."),
    ).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Recarregar dúvidas" }));
    fireEvent.click(
      screen.getByRole("button", { name: "Recarregar orçamentos" }),
    );
    expect(await screen.findByText(firstDescription)).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: /ORC-00101/ }),
    ).toBeInTheDocument();
  });

  it("retira a permissão administrativa anterior se a nova consulta de papéis falhar", async () => {
    const client = renderProtectedPage();
    emit("INITIAL_SESSION", firstId);
    expect(
      await screen.findByText("Registrar esclarecimento"),
    ).toBeInTheDocument();

    request.mockImplementation(async (input) => {
      if (String(input).includes("/user_roles?")) {
        return Response.json({ message: "Falha" }, { status: 400 });
      }
      return respond(input);
    });
    await act(async () => {
      await client.refetchQueries({ queryKey: ["me"] });
    });
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível verificar suas permissões.",
    );
    expect(
      screen.queryByText("Registrar esclarecimento"),
    ).not.toBeInTheDocument();
    expect(screen.queryByText(firstDescription)).not.toBeInTheDocument();
  });
});
