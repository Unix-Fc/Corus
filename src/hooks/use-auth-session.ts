import type { QueryClient } from "@tanstack/react-query";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuthScope = { userId: string; revision: number };
type AuthSession = AuthScope | null | undefined;

export const AuthSessionContext = createContext<AuthSession>(undefined);

export function useAuthScope() {
  return useContext(AuthSessionContext);
}

export function useAuthSession(queryClient: QueryClient) {
  const [session, setSession] = useState<AuthSession>(undefined);

  useEffect(() => {
    let current: AuthSession;
    let revision = 0;
    let expiresAt: number | undefined;
    let timeout: number | undefined;
    let active = true;

    function changeUser(userId: string | null) {
      if (current !== undefined && (current?.userId ?? null) === userId) {
        return;
      }
      // Clearing destroys pending queries too. The revision also remounts
      // protected components and keeps their observers and form state isolated.
      queryClient.clear();
      current = userId ? { userId, revision: ++revision } : null;
      setSession(current);
    }

    function checkExpiration() {
      window.clearTimeout(timeout);
      if (expiresAt === undefined) return;
      const remaining = expiresAt - Date.now();
      if (remaining <= 0) {
        changeUser(null);
      } else {
        timeout = window.setTimeout(
          checkExpiration,
          Math.min(remaining, 2_147_483_647),
        );
      }
    }

    const { data } = supabase.auth.onAuthStateChange((event, next) => {
      if (!active) return;
      expiresAt =
        next?.expires_at === undefined ? undefined : next.expires_at * 1000;
      const expired = expiresAt !== undefined && expiresAt <= Date.now();
      changeUser(
        event === "SIGNED_OUT" || expired ? null : (next?.user.id ?? null),
      );
      checkExpiration();
      if (event === "USER_UPDATED" && current) {
        current = { ...current };
        setSession(current);
      }
    });
    window.addEventListener("focus", checkExpiration);
    document.addEventListener("visibilitychange", checkExpiration);
    return () => {
      active = false;
      data.subscription.unsubscribe();
      window.clearTimeout(timeout);
      window.removeEventListener("focus", checkExpiration);
      document.removeEventListener("visibilitychange", checkExpiration);
    };
  }, [queryClient]);

  return session;
}
