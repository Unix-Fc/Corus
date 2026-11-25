import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Route } from "@/routes/_authenticated/parametros";

const { request, saved, toast } = vi.hoisted(() => ({
  request: vi.fn<typeof fetch>(),
  saved: vi.fn(),
  toast: { error: vi.fn(), success: vi.fn() },
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
  useMe: () => ({
    can: {
      editParams: true,
    },
  }),
}));

vi.mock("sonner", () => ({ toast }));

const parameter = {
  key: "horas_mensais_cargo",
  label: "Horas mensais para custo-hora de cargo",
  value: 220,
  unit: "h/mês",
  validated: false,
  note: "Aplicado a novos orçamentos.",
};

function renderParameters() {
  const Page = Route.options.component!;
  return render(
    <QueryClientProvider
      client={new QueryClient({
        defaultOptions: { queries: { retry: false } },
      })}
    >
      <Page />
    </QueryClientProvider>,
  );
}

describe("Parâmetro de horas mensais", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    request.mockImplementation(async (input, init) => {
      const url = new URL(String(input));
      if (url.pathname.endsWith("/calc_parameters")) {
        if (init?.method === "PATCH") {
          expect(url.searchParams.get("key")).toBe(
            "eq.horas_mensais_cargo",
          );
          saved(JSON.parse(String(init.body)));
          return new Response(null, { status: 204 });
        }
        return Response.json([parameter]);
      }
      if (url.pathname.endsWith("/audit_log")) return Response.json([]);
      return Response.json([]);
    });
  });

  it("rejeita zero e salva o novo valor positivo", async () => {
    renderParameters();
    const field = await screen.findByLabelText(
      "Valor de Horas mensais para custo-hora de cargo",
    );
    const saveButton = screen.getByRole("button", { name: "Salvar" });

    fireEvent.change(field, { target: { value: "0" } });
    fireEvent.click(saveButton);
    expect(toast.error).toHaveBeenCalledWith(
      "Informe uma quantidade de horas mensais maior que zero.",
    );
    expect(saved).not.toHaveBeenCalled();

    fireEvent.change(field, { target: { value: "200" } });
    fireEvent.click(saveButton);
    await waitFor(() => expect(saved).toHaveBeenCalledWith({
      value: 200,
      validated: false,
    }));
  });
});
