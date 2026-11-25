import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import type { ReactNode } from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AuthSessionContext } from "@/hooks/use-auth-session";
import { useQuotes } from "@/lib/data";

const request = vi.hoisted(() => vi.fn<typeof fetch>());
vi.mock("@/integrations/supabase/client", async () => {
  const { createClient } = await import("@supabase/supabase-js");
  return {
    supabase: createClient("http://127.0.0.1:54321", "test-key", {
      global: { fetch: request },
      auth: { persistSession: false },
    }),
  };
});

function mount() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return renderHook(() => useQuotes(), {
    wrapper: ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>
        <AuthSessionContext.Provider value={{ userId: "usuario", revision: 1 }}>
          {children}
        </AuthSessionContext.Provider>
      </QueryClientProvider>
    ),
  });
}

describe("consulta completa de orçamentos", () => {
  beforeEach(() => {
    request.mockReset();
  });

  it("percorre todas as páginas mesmo quando a API impõe um limite menor", async () => {
    const rows = [1, 4, null, 2, 3].map((number, index) => ({
      id: `00000000-0000-4000-8000-00000000000${index + 1}`,
      number,
    }));
    request.mockImplementation(async (input) => {
      const url = new URL(String(input));
      expect(url.searchParams.get("order")).toBe("id.asc");
      const cursor = url.searchParams.get("id")?.slice(3) ?? "";
      return Response.json(rows.filter((row) => row.id > cursor).slice(0, 2));
    });
    const { result } = mount();
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data?.map((row) => row.number)).toEqual([
      null,
      4,
      3,
      2,
      1,
    ]);
    expect(request).toHaveBeenCalledTimes(4);
  });

  it("não apresenta um resultado parcial quando uma página falha", async () => {
    request.mockImplementation(async (input) => {
      const cursor = new URL(String(input)).searchParams.get("id");
      return cursor
        ? Response.json(
            { message: "Falha na página seguinte" },
            { status: 500 },
          )
        : Response.json([
            { id: "00000000-0000-4000-8000-000000000001", number: 1 },
          ]);
    });
    const { result } = mount();
    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.data).toBeUndefined();
  });
});
