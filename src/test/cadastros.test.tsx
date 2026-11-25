import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionContext } from "@/hooks/use-auth-session";
import { permissionsFor, type Role } from "@/lib/permissions";
import { Route } from "@/routes/_authenticated/cadastros";

const { request, current, deletions } = vi.hoisted(() => ({
  request: vi.fn<typeof fetch>(),
  current: { roles: ["admin"] as Role[] },
  deletions: [] as string[],
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
  useMe: () => ({ can: permissionsFor(current.roles) }),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const client = {
  id: "b7804460-8550-4820-b2b1-735e8b720ea8",
  name: "Cliente de teste",
  cnpj: null,
  contact: null,
  email: null,
  phone: null,
  city: null,
  active: true,
};
const material = {
  id: "da8edef8-a67f-42a3-ad1e-6f280063edb1",
  kind: "material",
  code: "MAT-001",
  name: "Aço 1045",
  unit: "kg",
  unit_cost: 51,
  details: {},
  active: true,
};

function renderCatalogs() {
  const Page = Route.options.component!;
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <AuthSessionContext.Provider value={{ userId: client.id, revision: 1 }}>
        <Page />
      </AuthSessionContext.Provider>
    </QueryClientProvider>,
  );
}

describe("exclusão de cadastros de referência", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    deletions.length = 0;
    current.roles = ["admin"];
    request.mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (init?.method === "DELETE") {
        deletions.push(url.pathname);
        return new Response(null, { status: 204 });
      }
      if (url.pathname.endsWith("/clients")) {
        return Response.json(
          deletions.includes("/rest/v1/clients") ? [] : [client],
        );
      }
      if (url.pathname.endsWith("/catalog_items")) {
        return Response.json(
          deletions.includes("/rest/v1/catalog_items") ? [] : [material],
        );
      }
      return Response.json([]);
    });
  });

  it("exige confirmação antes de excluir um cliente", async () => {
    renderCatalogs();
    fireEvent.click(
      await screen.findByRole("button", {
        name: "Excluir cliente Cliente de teste",
      }),
    );

    const dialog = await screen.findByRole("alertdialog");
    expect(
      within(dialog).getByText(/orçamentos e históricos serão preservados/),
    ).toBeInTheDocument();
    expect(deletions).toHaveLength(0);

    fireEvent.click(within(dialog).getByRole("button", { name: "Excluir" }));
    await waitFor(() => expect(deletions).toEqual(["/rest/v1/clients"]));
  });

  it("permite excluir um material pelo cadastro após confirmação", async () => {
    renderCatalogs();
    fireEvent.keyDown(await screen.findByRole("tab", { name: "Clientes" }), {
      key: "ArrowRight",
    });
    expect(await screen.findByText("Aço 1045")).toBeInTheDocument();
    fireEvent.click(
      await screen.findByRole("button", { name: "Excluir Materiais Aço 1045" }),
    );
    const dialog = await screen.findByRole("alertdialog");
    fireEvent.click(within(dialog).getByRole("button", { name: "Excluir" }));
    await waitFor(() => expect(deletions).toEqual(["/rest/v1/catalog_items"]));
  });

  it("não oferece exclusão a orçamentistas", async () => {
    current.roles = ["orcamentista"];
    renderCatalogs();
    expect(await screen.findByText("Cliente de teste")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Excluir cliente/ }),
    ).not.toBeInTheDocument();
  });
});
