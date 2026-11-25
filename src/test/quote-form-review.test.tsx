import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { QuoteForm } from "@/components/quote-form";
import { AuthSessionContext } from "@/hooks/use-auth-session";
import type { Quote } from "@/lib/data";

const { request, notify, account } = vi.hoisted(() => ({
  request: vi.fn<typeof fetch>(),
  notify: { error: vi.fn(), warning: vi.fn(), success: vi.fn() },
  account: {
    userId: "6a3abc97-320b-4ad6-b846-4503039280ef",
    unavailable: false,
  },
}));

vi.mock("@/integrations/supabase/client", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  const client = createClient("http://127.0.0.1:54321", "test-key", {
    global: { fetch: request },
    auth: { persistSession: false },
  });
  return {
    supabase: {
      from: client.from.bind(client),
      auth: {
        getUser: async () =>
          account.unavailable
            ? {
                data: { user: null },
                error: new Error("Falha de autenticação"),
              }
            : { data: { user: { id: account.userId } }, error: null },
      },
    },
  };
});

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  useNavigate: () => vi.fn(),
}));
vi.mock("sonner", () => ({ toast: notify }));

const quote = {
  id: "d8a6df36-2fbd-439d-a221-6296aef1981c",
  number: 1,
  client_id: "68d39575-6bf1-4085-a6d5-41da2f81ba0f",
  project: "Projeto",
  part_name: "Peça",
  part_code: "",
  quantity: 1,
  status: "rascunho",
  specs: {},
  materials: [],
  operations: [],
  services: [],
  adjustments: {},
  lead_time_days: 0,
  lead_time_manual: false,
  notes: "",
  created_at: "2026-01-01T00:00:00Z",
  updated_at: "2026-01-01T00:00:00Z",
  created_by: account.userId,
  total: 0,
} as Quote;

function renderForm(initial: Quote | null = quote) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  render(
    <QueryClientProvider client={client}>
      <AuthSessionContext.Provider
        value={{ userId: account.userId, revision: 1 }}
      >
        {initial ? <QuoteForm initial={initial} /> : <QuoteForm />}
      </AuthSessionContext.Provider>
    </QueryClientProvider>,
  );
  return client;
}

function responseFor(input: RequestInfo | URL, init?: RequestInit) {
  const path = new URL(String(input)).pathname;
  if (init?.method === "PATCH") return Response.json([{ id: quote.id }]);
  if (path.endsWith("/profiles"))
    return Response.json([{ id: account.userId, access_enabled: true }]);
  if (path.endsWith("/user_roles")) return Response.json([{ role: "admin" }]);
  if (path.endsWith("/clients"))
    return Response.json([
      { id: quote.client_id, name: "Cliente", active: true },
    ]);
  if (path.endsWith("/catalog_items")) return Response.json([]);
  if (path.endsWith("/calc_parameters"))
    return Response.json([{ key: "margem_pct", value: 10 }]);
  throw new Error(`Consulta inesperada: ${path}`);
}

describe("segurança ao salvar orçamentos", () => {
  beforeEach(() => {
    request.mockReset();
    vi.clearAllMocks();
    account.unavailable = false;
    request.mockImplementation(async (input, init) => responseFor(input, init));
  });

  it("impede o salvamento quando os parâmetros falham e permite tentar novamente", async () => {
    let failParams = true;
    request.mockImplementation(async (input, init) => {
      if (
        new URL(String(input)).pathname.endsWith("/calc_parameters") &&
        failParams
      )
        return Response.json({ message: "Falha" }, { status: 500 });
      return responseFor(input, init);
    });
    renderForm();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar os dados necessários",
    );
    expect(
      screen.queryByRole("button", { name: "Salvar orçamento" }),
    ).toBeNull();
    expect(
      request.mock.calls.some(([, init]) => init?.method === "PATCH"),
    ).toBe(false);
    failParams = false;
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    const save = await screen.findByRole("button", {
      name: "Salvar orçamento",
    });
    fireEvent.click(save);
    await waitFor(() =>
      expect(notify.success).toHaveBeenCalledWith("Orçamento salvo"),
    );
  });

  it.each(["0", "1.5"])("não salva quantidade inválida %s", async (value) => {
    renderForm();
    const quantity = await screen.findByLabelText("Quantidade");
    fireEvent.change(quantity, { target: { value } });
    fireEvent.click(screen.getByRole("button", { name: "Salvar orçamento" }));
    await waitFor(() => expect(notify.error).toHaveBeenCalled());
    expect(
      request.mock.calls.some(([, init]) => init?.method === "PATCH"),
    ).toBe(false);
  });

  it("mantém o preenchimento ao recuperar uma falha durante a atualização", async () => {
    let failParams = false;
    request.mockImplementation(async (input, init) => {
      if (
        new URL(String(input)).pathname.endsWith("/calc_parameters") &&
        failParams
      )
        return Response.json({ message: "Falha" }, { status: 500 });
      return responseFor(input, init);
    });
    const client = renderForm();
    fireEvent.change(await screen.findByLabelText("Quantidade"), {
      target: { value: "3" },
    });
    failParams = true;
    await client.invalidateQueries({ queryKey: ["params"] });
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    failParams = false;
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(await screen.findByLabelText("Quantidade")).toHaveValue(3);
  });

  it("não cria orçamento sem confirmar a conta atual", async () => {
    renderForm(null);
    fireEvent.change(await screen.findByLabelText("Cliente *"), {
      target: { value: quote.client_id },
    });
    fireEvent.change(screen.getByLabelText("Projeto *"), {
      target: { value: "Projeto" },
    });
    fireEvent.change(screen.getByLabelText("Peça *"), {
      target: { value: "Peça" },
    });
    account.unavailable = true;
    fireEvent.click(screen.getByRole("button", { name: "Salvar orçamento" }));
    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith(
        "Não foi possível confirmar a conta. Tente entrar novamente.",
      ),
    );
    expect(request.mock.calls.some(([, init]) => init?.method === "POST")).toBe(
      false,
    );
    expect(
      screen.getByRole("button", { name: "Salvar orçamento" }),
    ).toBeEnabled();
  });

  it("preserva a edição se o orçamento mudou depois de abrir o formulário", async () => {
    const savedWithoutVersion = vi.fn();
    request.mockImplementation(async (input, init) => {
      if (init?.method === "PATCH") {
        const version = new URL(String(input)).searchParams.get("updated_at");
        if (version === "eq." + quote.updated_at) return Response.json([]);
        savedWithoutVersion();
      }
      return responseFor(input, init);
    });
    renderForm();
    fireEvent.change(await screen.findByLabelText("Projeto *"), {
      target: { value: "Projeto revisado" },
    });

    fireEvent.click(screen.getByRole("button", { name: "Salvar orçamento" }));
    await waitFor(() =>
      expect(notify.error).toHaveBeenCalledWith(
        "O orçamento mudou ou ficou indisponível. Abra a versão atual antes de salvar.",
      ),
    );
    expect(savedWithoutVersion).not.toHaveBeenCalled();
    expect(notify.success).not.toHaveBeenCalled();
    expect(screen.getByLabelText("Projeto *")).toHaveValue("Projeto revisado");
  });
});
