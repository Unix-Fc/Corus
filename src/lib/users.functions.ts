import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const createUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (data: { email: string; fullName: string; password: string }) => {
      if (
        !data ||
        typeof data.email !== "string" ||
        typeof data.fullName !== "string" ||
        typeof data.password !== "string"
      ) {
        throw new Error("Preencha e-mail, nome e senha");
      }

      const email = data.email.trim().toLowerCase();
      const fullName = data.fullName.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        throw new Error("Informe um e-mail válido");
      if (!fullName || fullName.length > 200)
        throw new Error("Informe um nome válido");
      if (data.password.length < 6 || data.password.length > 72)
        throw new Error("A senha deve ter entre 6 e 72 caracteres");

      return { email, fullName, password: data.password };
    },
  )
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin)
      throw new Error("Somente administradores podem cadastrar usuários");

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { data: created, error: createError } =
      await supabaseAdmin.auth.admin.createUser({
        email: data.email,
        password: data.password,
        email_confirm: true,
        user_metadata: { full_name: data.fullName },
      });
    if (createError) throw new Error(createError.message);
    if (!created.user)
      throw new Error("O Supabase não retornou o usuário criado");

    const { error: roleError } = await supabaseAdmin
      .from("user_roles")
      .upsert(
        { user_id: created.user.id, role: "orcamentista" },
        { onConflict: "user_id,role" },
      );
    if (roleError) {
      const { error: rollbackError } =
        await supabaseAdmin.auth.admin.deleteUser(created.user.id);
      if (rollbackError) {
        throw new Error(
          `Usuário criado, mas não foi possível atribuir o perfil nem desfazer a criação: ${roleError.message}; ${rollbackError.message}`,
        );
      }
      throw new Error(
        `Não foi possível atribuir o perfil. O cadastro foi desfeito: ${roleError.message}`,
      );
    }

    return { id: created.user.id, email: created.user.email };
  });

export const setUserAccess = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; enabled: boolean }) => {
    if (
      !data ||
      typeof data.userId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(data.userId) ||
      typeof data.enabled !== "boolean"
    ) {
      throw new Error("Dados de acesso inválidos");
    }
    return data;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin)
      throw new Error("Somente administradores podem alterar acessos");
    if (data.userId === context.userId)
      throw new Error("Você não pode suspender seu próprio acesso");

    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("access_enabled")
      .eq("id", data.userId)
      .single();
    if (profileError) throw new Error(profileError.message);

    const { error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({ access_enabled: data.enabled })
      .eq("id", data.userId);
    if (profileUpdateError) throw new Error(profileUpdateError.message);

    const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      data.userId,
      {
        ban_duration: data.enabled ? "none" : "876000h",
      },
    );
    if (authError) {
      const { error: rollbackError } = await supabaseAdmin
        .from("profiles")
        .update({ access_enabled: profile.access_enabled })
        .eq("id", data.userId);
      if (rollbackError) {
        throw new Error(
          `Não foi possível atualizar o acesso: ${authError.message}. Também falhou ao restaurar o estado anterior: ${rollbackError.message}`,
        );
      }
      throw new Error(authError.message);
    }

    return { ok: true };
  });

export const deleteUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: { userId: string }) => {
    if (
      !d ||
      typeof d.userId !== "string" ||
      !/^[0-9a-f-]{36}$/i.test(d.userId)
    )
      throw new Error("Usuário inválido");
    return d;
  })
  .handler(async ({ data, context }) => {
    const { data: isAdmin, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error || !isAdmin)
      throw new Error("Somente administradores podem excluir usuários");
    if (data.userId === context.userId)
      throw new Error("Você não pode excluir a si mesmo");
    const { supabaseAdmin } =
      await import("@/integrations/supabase/client.server");
    const { error: delErr } = await supabaseAdmin.auth.admin.deleteUser(
      data.userId,
    );
    if (delErr) throw new Error(delErr.message);
    return { ok: true };
  });
