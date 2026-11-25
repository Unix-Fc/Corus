import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionContext } from "@/hooks/use-auth-session";
import { permissionsFor, type Role } from "@/lib/permissions";
import { Route } from "@/routes/_authenticated/historico-materiais";

const { request, current } = vi.hoisted(() => ({
  request: vi.fn<typeof fetch>(),
  current: { roles: ["orcamentista"] as Role[] },
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
  useMe: () => ({ can: permissionsFor(current.roles), isPending: false }),
}));

vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

const material = {
  id: "b7804460-8550-4820-b2b1-735e8b720ea8",
  code: "MAT-001",
  name: "Aço 1045",
  unit: "kg",
  unit_cost: 51,
  active: true,
};
const date = "2026-11-22";

function historyEntry(n: number) {
  return {
    id: `00000000-0000-4000-8000-${String(27 - n).padStart(12, "0")}`,
    kind: n === 26 ? "referencia" : "compra",
    unit_price: 20 + n,
    unit: "kg",
    occurred_on: n === 26 ? null : date,
    source: `Documento ${n}`,
    material_name_snapshot: material.name,
  };
}

function renderHistory() {
  const Page = Route.options.component!;
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthSessionContext.Provider value={{ userId: material.id, revision: 1 }}>
        <Page />
      </AuthSessionContext.Provider>
    </QueryClientProvider>,
  );
}

async function selectMaterial() {
  fireEvent.change(await screen.findByLabelText("Material"), {
    target: { value: material.id },
  });
}

describe("Histórico de compras e preços de materiais", () => {
  beforeEach(() => {
    current.roles = ["orcamentista"];
    request.mockReset();
  });

  it("lista a página seguinte, identifica a origem e separa o preço vigente", async () => {
    const rows = Array.from({ length: 26 }, (_, index) =>
      historyEntry(index + 1),
    );
    request.mockImplementation(async (input) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/catalog_items")) {
        expect(url.searchParams.get("kind")).toBe("eq.material");
        return Response.json([material]);
      }
      if (url.searchParams.get("material_id") === "is.null")
        return Response.json([]);
      expect(url.searchParams.get("material_id")).toBe(`eq.${material.id}`);
      expect(url.searchParams.get("limit")).toBe("26");
      expect(url.searchParams.get("order")).toBe(
        "occurred_on.desc.nullslast,id.desc",
      );
      const cursor = url.searchParams.get("or");
      if (!cursor) return Response.json(rows);
      expect(cursor).toBe(
        `(occurred_on.lt.${date},and(occurred_on.eq.${date},id.lt.${historyEntry(25).id}),occurred_on.is.null)`,
      );
      return Response.json(rows.slice(25));
    });

    renderHistory();
    await selectMaterial();
    expect(
      screen.getByRole("heading", { name: "Preço vigente no catálogo" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/51,00/)).toBeInTheDocument();
    const first = await screen.findByRole("row", { name: /Documento 1$/ });
    expect(within(first).getByText("Compra realizada")).toBeInTheDocument();
    expect(within(first).getByText("22/11/2026")).toBeInTheDocument();
    expect(within(first).getByText(/21,00/)).toBeInTheDocument();
    expect(screen.queryByText("Documento 26")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Registrar preço" }),
    ).not.toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: "Carregar mais registros" }),
    );
    const next = await screen.findByRole("row", { name: /Documento 26$/ });
    expect(within(next).getByText("Referência de preço")).toBeInTheDocument();
    expect(within(next).getByText("Não informada")).toBeInTheDocument();
    expect(screen.getByText("Documento 25")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Carregar mais registros" }),
    ).not.toBeInTheDocument();
  });

  it("distingue falha de consulta, histórico vazio e preço de referência ausente", async () => {
    let attempts = 0;
    request.mockImplementation(async (input) => {
      if (String(input).includes("/catalog_items?")) {
        return Response.json([{ ...material, unit_cost: 0 }]);
      }
      if (new URL(String(input)).searchParams.get("material_id") === "is.null")
        return Response.json([]);
      return ++attempts === 1
        ? Response.json({ message: "Falha na consulta" }, { status: 400 })
        : Response.json([]);
    });
    renderHistory();
    await selectMaterial();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível carregar o histórico.",
    );
    expect(
      screen.queryByText(/Nenhum registro de compra/),
    ).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Tentar novamente" }));
    expect(
      await screen.findByText(
        "Nenhum registro de compra ou preço para este material.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Nenhum preço de referência informado no catálogo."),
    ).toBeInTheDocument();
  });

  it("exibe a ausência de materiais cadastrados", async () => {
    request.mockResolvedValue(Response.json([]));
    renderHistory();
    expect(
      await screen.findByText("Nenhum material cadastrado."),
    ).toBeInTheDocument();
    expect(screen.queryByLabelText("Material")).not.toBeInTheDocument();
  });

  it("mantém visível o histórico de materiais excluídos", async () => {
    const archived = {
      ...historyEntry(1),
      material_name_snapshot: "Material removido",
    };
    request.mockImplementation(async (input) => {
      if (String(input).includes("/catalog_items?")) return Response.json([]);
      const url = new URL(String(input));
      expect(url.searchParams.get("material_id")).toBe("is.null");
      return Response.json([archived]);
    });

    renderHistory();
    expect(await screen.findByText("Material removido")).toBeInTheDocument();
    expect(screen.getByText("Documento 1")).toBeInTheDocument();
  });

  it.each(["inclusão", "exclusão"] as const)(
    "preserva os materiais existentes após %s antes do cursor",
    async (change) => {
      const sharedName = 'Aço, (liga). "A" \\ 50% & + / =';
      const first = Array.from({ length: 24 }, (_, index) => ({
        ...material,
        id: historyEntry(index + 1).id,
        name: `A ${String(index + 1).padStart(2, "0")}`,
      }));
      const boundary = {
        ...material,
        id: "00000000-0000-4000-8000-000000000100",
        name: sharedName,
      };
      const tied = { ...boundary, id: "00000000-0000-4000-8000-000000000101" };
      const last = { ...material, name: "Zinco" };
      let records = [...first, boundary, tied, last];
      let reads = 0;
      let failNext = change === "inclusão";
      request.mockImplementation(async (input) => {
        const url = new URL(String(input));
        if (!url.pathname.endsWith("/catalog_items")) {
          if (url.searchParams.get("material_id") === "is.null")
            return Response.json([]);
          return Response.json([historyEntry(1)]);
        }
        expect(url.searchParams.get("limit")).toBe("26");
        expect(url.searchParams.get("order")).toBe("name.asc,id.asc");
        expect(url.searchParams.has("offset")).toBe(false);
        if (++reads === 1) return Response.json(records.slice(0, 26));

        const quoted = JSON.stringify(sharedName);
        expect(url.searchParams.get("or")).toBe(
          `(name.gt.${quoted},and(name.eq.${quoted},id.gt.${boundary.id}))`,
        );
        if (failNext) {
          failNext = false;
          return Response.json(
            { message: "Página indisponível" },
            { status: 400 },
          );
        }
        return Response.json(
          records
            .filter(
              (row) =>
                row.name > boundary.name ||
                (row.name === boundary.name && row.id > boundary.id),
            )
            .slice(0, 26),
        );
      });

      renderHistory();
      const select =
        await screen.findByLabelText<HTMLSelectElement>("Material");
      const selected = first[1]!;
      fireEvent.change(select, { target: { value: selected.id } });
      expect(await screen.findByText("Documento 1")).toBeInTheDocument();
      expect(
        screen.getAllByRole("option", { name: /Aço, \(liga\)/ }),
      ).toHaveLength(1);

      records =
        change === "inclusão"
          ? [
              {
                ...material,
                id: "00000000-0000-4000-8000-000000000099",
                name: "A 00",
              },
              ...records,
            ]
          : records.slice(1);
      const load = () =>
        fireEvent.click(
          screen.getByRole("button", { name: "Carregar mais materiais" }),
        );
      load();
      if (change === "inclusão") {
        expect(await screen.findByRole("alert")).toHaveTextContent(
          "Não foi possível carregar mais materiais.",
        );
        expect(select).toHaveValue(selected.id);
        load();
      }

      expect(
        await screen.findByRole("option", { name: /Zinco/ }),
      ).toBeInTheDocument();
      expect(select).toHaveValue(selected.id);
      const ids = Array.from(select.options, (option) => option.value).filter(
        Boolean,
      );
      expect(ids).toEqual([...first, boundary, tied, last].map(({ id }) => id));
      expect(new Set(ids).size).toBe(ids.length);
      expect(
        screen.queryByRole("button", { name: "Carregar mais materiais" }),
      ).not.toBeInTheDocument();

      fireEvent.change(select, { target: { value: tied.id } });
      expect(await screen.findByText("Documento 1")).toBeInTheDocument();
      expect(
        request.mock.calls.some(
          ([input]) =>
            new URL(String(input)).searchParams.get("material_id") ===
            `eq.${tied.id}`,
        ),
      ).toBe(true);
    },
  );

  it("bloqueia perfil sem acesso antes de consultar dados", () => {
    current.roles = ["gerente"];
    renderHistory();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Seu perfil não permite consultar",
    );
    expect(request).not.toHaveBeenCalled();
  });

  it("permite ao administrador registrar uma compra apenas com preço válido e fonte identificável", async () => {
    current.roles = ["admin"];
    const saved = vi.fn();
    let rows: unknown[] = [];
    request.mockImplementation(async (input, init) => {
      if (String(input).includes("/catalog_items?"))
        return Response.json([material]);
      if (
        new URL(String(input)).searchParams.get("material_id") === "is.null"
      )
        return Response.json([]);
      if (init?.method === "POST") {
        const body = JSON.parse(String(init.body));
        saved(body);
        rows = [{ ...historyEntry(1), ...body }];
        return new Response(null, { status: 201 });
      }
      return Response.json(rows);
    });
    renderHistory();
    await selectMaterial();
    const price = screen.getByLabelText("Preço unitário em reais");
    const source = screen.getByLabelText("Fonte ou referência do documento");
    const submit = screen.getByRole("button", { name: "Registrar preço" });
    fireEvent.change(screen.getByLabelText("Tipo de registro"), {
      target: { value: "compra" },
    });
    fireEvent.change(price, { target: { value: "18,754" } });
    fireEvent.click(submit);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "até duas casas decimais",
    );
    fireEvent.change(price, { target: { value: "18,75" } });
    fireEvent.change(source, { target: { value: "\u00a0\u2003" } });
    fireEvent.click(submit);
    expect(
      await screen.findByText("Informe a fonte ou a referência do documento."),
    ).toBeInTheDocument();
    expect(saved).not.toHaveBeenCalled();
    fireEvent.change(screen.getByLabelText(/Data da compra/), {
      target: { value: date },
    });
    fireEvent.change(source, { target: { value: " Fornecedor · NF 410 " } });
    fireEvent.click(submit);
    expect(await screen.findByText("Fornecedor · NF 410")).toBeInTheDocument();
    expect(saved).toHaveBeenCalledWith({
      material_id: material.id,
      kind: "compra",
      occurred_on: date,
      source: "Fornecedor · NF 410",
      unit: "kg",
      unit_price: 18.75,
    });
    expect(screen.getByText(/51,00/)).toBeInTheDocument();
  });

  it("exibe o erro do servidor e preserva os campos quando o registro falha", async () => {
    current.roles = ["admin"];
    request.mockImplementation(async (input, init) => {
      if (String(input).includes("/catalog_items?"))
        return Response.json([material]);
      if (init?.method === "POST") {
        return Response.json({ message: "Acesso negado" }, { status: 403 });
      }
      return Response.json([]);
    });

    renderHistory();
    await selectMaterial();
    const price = screen.getByLabelText("Preço unitário em reais");
    const source = screen.getByLabelText("Fonte ou referência do documento");
    fireEvent.change(price, { target: { value: "18,75" } });
    fireEvent.change(source, { target: { value: "Fornecedor · NF 410" } });
    fireEvent.click(screen.getByRole("button", { name: "Registrar preço" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Não foi possível registrar o preço: Acesso negado",
    );
    expect(price).toHaveValue("18,75");
    expect(source).toHaveValue("Fornecedor · NF 410");
  });
});
