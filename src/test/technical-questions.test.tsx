import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionContext } from "@/hooks/use-auth-session";
import { permissionsFor, type Role } from "@/lib/permissions";
import { Route } from "@/routes/_authenticated/pendencias";

const { request, currentUser } = vi.hoisted(() => ({
  request: vi.fn<typeof fetch>(),
  currentUser: { role: "admin" as Role },
}));

vi.mock("@/integrations/supabase/client", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  return {
    supabase: createClient("http://127.0.0.1:54321", "test-key", {
      global: { fetch: request },
      auth: { persistSession: false },
    }),
  };
});

vi.mock("@/hooks/use-me", () => ({
  useMe: () => ({ can: permissionsFor([currentUser.role]), isPending: false }),
}));

vi.mock("@tanstack/react-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@tanstack/react-router")>()),
  Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
}));

vi.mock("sonner", () => ({ toast: { error: vi.fn(), success: vi.fn() } }));

const quoteId = "b7804460-8550-4820-b2b1-735e8b720ea8";
const questionId = "da8edef8-a67f-42a3-ad1e-6f280063edb1";
const date = "2026-11-24T12:00:00.000Z";
const quote = {
  id: quoteId,
  number: 24,
  project: "Esteira",
  part_name: "Eixo",
  specs: {},
  materials: [],
  operations: [],
  status: "rascunho",
};
const description = "Qual a tolerância do eixo?";
const clarification = "Usar tolerância h7 conforme o desenho.";
const openQuestion = {
  id: questionId,
  quote_id: quoteId,
  quotes: quote,
  description,
  clarification: null,
  created_at: date,
  updated_at: date,
  status: "aberta",
};

function renderPendencies() {
  const Page = Route.options.component!;
  return render(
    <QueryClientProvider
      client={
        new QueryClient({ defaultOptions: { queries: { retry: false } } })
      }
    >
      <AuthSessionContext.Provider value={{ userId: quoteId, revision: 1 }}>
        <Page />
      </AuthSessionContext.Provider>
    </QueryClientProvider>,
  );
}

describe("Dúvidas técnicas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    currentUser.role = "admin";
  });

<<<<<<< Updated upstream
=======
  it("consulta dúvidas da página seguinte mesmo quando o horário de cadastro é igual", async () => {
    const createdAt = "2026-11-24T12:00:00+00:00";
    const records = Array.from({ length: 26 }, (_, index) => ({
      ...openQuestion,
      id: recordId(26 - index),
      description: `Dúvida técnica ${index + 1}`,
      created_at: createdAt,
    }));
    let attempts = 0;
    request.mockImplementation(async (input) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/quotes")) return Response.json([quote]);
      expect(url.searchParams.has("created_by")).toBe(false);
      expect(url.searchParams.get("order")).toBe("created_at.desc,id.desc");
      expect(url.searchParams.get("limit")).toBe("26");
      const cursor = url.searchParams.get("or");
      if (!cursor) return Response.json(records);
      expect(cursor).toBe(
        `(created_at.lt.${createdAt},and(created_at.eq.${createdAt},id.lt.${recordId(2)}))`,
      );
      if (++attempts === 1) {
        return Response.json({ message: "Falha na página" }, { status: 400 });
      }
      return Response.json(records.slice(25));
    });

    renderPendencies();
    const load = await screen.findByRole("button", {
      name: "Carregar mais dúvidas",
    });
    expect(screen.queryByText("Dúvida técnica 26")).not.toBeInTheDocument();
    fireEvent.click(load);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar mais dúvidas.",
    );
    expect(screen.getByText("Dúvida técnica 25")).toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Carregar mais dúvidas" }),
    );
    expect(await screen.findByText("Dúvida técnica 26")).toBeInTheDocument();
    expect(screen.getByText("Dúvida técnica 25")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Carregar mais dúvidas" }),
    ).not.toBeInTheDocument();
  });

  it("carrega mais orçamentos, preserva a seleção e salva uma dúvida de uma página posterior", async () => {
    const records = Array.from({ length: 26 }, (_, index) => ({
      ...quote,
      id: recordId(26 - index),
      number: 26 - index,
    }));
    const posted = vi.fn();
    request.mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/quotes")) {
        expect(url.searchParams.get("order")).toBe("number.desc");
        expect(url.searchParams.get("limit")).toBe("26");
        if (!url.searchParams.has("number")) return Response.json(records);
        expect(url.searchParams.get("number")).toBe("lt.2");
        return Response.json(records.slice(25));
      }
      if (init?.method === "POST") {
        posted(JSON.parse(String(init.body)));
        return new Response(null, { status: 201 });
      }
      return Response.json([]);
    });

    renderPendencies();
    const select = await screen.findByLabelText("Orçamento");
    fireEvent.change(select, { target: { value: recordId(26) } });
    expect(
      screen.queryByRole("option", { name: /ORC-00001/ }),
    ).not.toBeInTheDocument();
    fireEvent.click(
      screen.getByRole("button", { name: "Carregar mais orçamentos" }),
    );
    expect(
      await screen.findByRole("option", { name: /ORC-00001/ }),
    ).toBeInTheDocument();
    expect(select).toHaveValue(recordId(26));
    expect(
      screen.queryByRole("button", { name: "Carregar mais orçamentos" }),
    ).not.toBeInTheDocument();
    fireEvent.change(select, { target: { value: recordId(1) } });
    fireEvent.change(screen.getByLabelText("Descrição da dúvida"), {
      target: { value: description },
    });
    fireEvent.click(screen.getByRole("button", { name: "Registrar dúvida" }));
    await screen.findByRole("button", { name: "Registrar dúvida" });
    expect(posted).toHaveBeenCalledWith({ quote_id: recordId(1), description });
  });

>>>>>>> Stashed changes
  it("valida a descrição e atualiza a lista após registrar uma dúvida", async () => {
    currentUser.role = "orcamentista";
    let questions: (typeof openQuestion)[] = [];
    request.mockImplementation(async (input, init) => {
      if (String(input).includes("/quotes?")) return Response.json([quote]);
      if (init?.method === "POST") {
        expect(JSON.parse(String(init.body))).toEqual({
          quote_id: quoteId,
          description,
        });
        questions = [openQuestion];
        return new Response(null, { status: 201 });
      }
      expect(new URL(String(input)).searchParams.get("created_by")).toBe(
        `eq.${quoteId}`,
      );
      return Response.json(questions);
    });

    const page = renderPendencies();
    await screen.findByText("Nenhuma dúvida técnica registrada.");
    const register = await screen.findByRole("button", {
      name: "Registrar dúvida",
    });
    fireEvent.click(register);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Selecione um orçamento disponível.",
    );
    fireEvent.change(await screen.findByLabelText("Orçamento"), {
      target: { value: quoteId },
    });
    const field = screen.getByLabelText("Descrição da dúvida");

    for (const blank of ["", " \n\u00a0 "]) {
      fireEvent.change(field, { target: { value: blank } });
      fireEvent.click(register);
      expect(await screen.findByRole("alert")).toHaveTextContent(
        "Informe a descrição da dúvida.",
      );
    }
    expect(questions).toHaveLength(0);

    fireEvent.change(field, { target: { value: `  ${description}  ` } });
    fireEvent.click(register);
    expect(await screen.findByText("Aberta")).toBeInTheDocument();
    expect(screen.getByText(description)).toBeInTheDocument();
    expect(field).toHaveValue("");
    expect(screen.queryByText("Registrar esclarecimento")).toBeNull();
    expect(
      screen.getByRole("heading", {
        name: "Pendências identificadas automaticamente",
      }),
    ).toBeInTheDocument();

    page.unmount();
    renderPendencies();
    const list = within(
      screen.getByRole("region", { name: "Dúvidas registradas" }),
    );
    expect(await list.findByText(description)).toBeInTheDocument();
    expect(
      list.getByRole("heading", { name: "ORC-00024 · Esteira · Eixo" }),
    ).toBeInTheDocument();
    expect(list.getByText("Aguardando esclarecimento.")).toBeInTheDocument();
  });

  it("salva o esclarecimento e exibe a situação atualizada para o administrador", async () => {
    let question = { ...openQuestion, clarification: null as string | null };
    request.mockImplementation(async (input, init) => {
      if (String(input).includes("/quotes?")) return Response.json([quote]);
      if (init?.method === "PATCH") {
        const url = new URL(String(input));
        expect(url.searchParams.get("status")).toBe("eq.aberta");
        expect(url.searchParams.get("id")).toBe(`eq.${questionId}`);
        expect(JSON.parse(String(init.body))).toEqual({
          status: "esclarecida",
          clarification,
        });
        question = { ...question, status: "esclarecida", clarification };
        return Response.json([{ id: questionId }]);
      }
      return Response.json([question]);
    });

    renderPendencies();
    const list = within(
      screen.getByRole("region", { name: "Dúvidas registradas" }),
    );
    fireEvent.click(await list.findByText("Registrar esclarecimento"));
    const save = list.getByRole("button", {
      name: "Salvar e marcar como esclarecida",
    });
    fireEvent.click(save);
    expect(await list.findByRole("alert")).toHaveTextContent(
      "Informe o esclarecimento.",
    );

    fireEvent.change(list.getByLabelText("Esclarecimento"), {
      target: { value: clarification },
    });
    fireEvent.click(save);

    expect(await list.findByText("Esclarecida")).toBeInTheDocument();
    expect(list.getByText(clarification)).toBeInTheDocument();
    expect(list.queryByText("Registrar esclarecimento")).toBeNull();
  });

  it("diferencia uma lista vazia de falhas de consulta", async () => {
    request.mockImplementation(async (input) => {
      if (String(input).includes("/quotes?")) return Response.json([]);
      return Response.json({ message: "Falha na consulta" }, { status: 500 });
    });

    renderPendencies();
    expect(
      await screen.findByText(
        "Nenhum orçamento disponível para registrar uma dúvida.",
      ),
    ).toBeInTheDocument();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar as dúvidas técnicas.",
    );
    expect(
      screen.queryByText("Nenhuma dúvida técnica registrada."),
    ).not.toBeInTheDocument();
  });

  it("informa a falha no cadastro e mantém a descrição para nova tentativa", async () => {
    request.mockImplementation(async (input, init) => {
      if (String(input).includes("/quotes?")) return Response.json([quote]);
      if (init?.method === "POST") {
        return Response.json({ message: "Acesso negado" }, { status: 403 });
      }
      return Response.json([]);
    });

    renderPendencies();
    fireEvent.change(await screen.findByLabelText("Orçamento"), {
      target: { value: quoteId },
    });
    const field = screen.getByLabelText("Descrição da dúvida");
    fireEvent.change(field, { target: { value: description } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar dúvida" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível registrar a dúvida.",
    );
    expect(field).toHaveValue(description);
    expect(
      screen.getByText("Nenhuma dúvida técnica registrada."),
    ).toBeInTheDocument();
  });
});
