import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/status-badge";
import { ROLE_LABEL, type AppRole } from "@/lib/data";
import { useMe } from "@/hooks/use-me";
import { useServerFn } from "@tanstack/react-start";
import { Ban, Check, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createUser, deleteUser, setUserAccess } from "@/lib/users.functions";
import { requireAdminRoute } from "@/lib/admin-route";

export const Route = createFileRoute("/_authenticated/usuarios")({
  beforeLoad: requireAdminRoute,
  head: () => ({
    meta: [
      { title: "Usuários e perfis — Corus" },
      { name: "description", content: "Perfis de acesso e permissões." },
    ],
  }),
  component: Users,
});

type ManageableRole = Extract<AppRole, "admin" | "orcamentista">;
const ROLES: ManageableRole[] = ["admin", "orcamentista"];

function Users() {
  const { can, me } = useMe();
  const create = useServerFn(createUser);
  const del = useServerFn(deleteUser);
  const setAccess = useServerFn(setUserAccess);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [creating, setCreating] = useState(false);
  const qc = useQueryClient();

  async function add(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    try {
      await create({ data: { email, fullName, password } });
      toast.success("Usuário cadastrado como Orçamentista");
      setEmail("");
      setFullName("");
      setPassword("");
      await qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao cadastrar usuário");
    } finally {
      setCreating(false);
    }
  }

  async function remove(uid: string, label: string) {
    if (
      !confirm(`Excluir o usuário ${label}? Esta ação não pode ser desfeita.`)
    )
      return;
    try {
      await del({ data: { userId: uid } });
      toast.success("Usuário excluído");
      qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao excluir");
    }
  }
  async function changeAccess(uid: string, label: string, enabled: boolean) {
    const action = enabled ? "restaurar" : "suspender";
    if (!confirm(`Deseja ${action} o acesso de ${label}?`)) return;
    try {
      await setAccess({ data: { userId: uid, enabled } });
      toast.success(enabled ? "Acesso restaurado" : "Acesso suspenso");
      await qc.invalidateQueries({ queryKey: ["users"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao alterar acesso");
    }
  }
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const [
        { data: profiles, error: profilesError },
        { data: roles, error: rolesError },
      ] = await Promise.all([
        supabase.from("profiles").select("*").order("created_at"),
        supabase.from("user_roles").select("*"),
      ]);
      if (profilesError) throw profilesError;
      if (rolesError) throw rolesError;
      return (profiles ?? []).map((p) => ({
        ...p,
        roles: (roles ?? [])
          .filter((r) => r.user_id === p.id)
          .map((r) => r.role)
          .filter(
            (r): r is ManageableRole => r === "admin" || r === "orcamentista",
          ),
      }));
    },
  });
  async function toggle(uid: string, role: ManageableRole) {
    const { error } = await supabase.rpc("set_user_role", {
      _user_id: uid,
      _role: role,
    });
    if (error) {
      toast.error(error.message);
      return;
    }
    qc.invalidateQueries({ queryKey: ["users"] });
    qc.invalidateQueries({ queryKey: ["me"] });
  }
  return (
    <>
      <PageHeader
        title="Usuários e perfis"
        subtitle="Administrador e Orçamentista"
      />
      {can.manageUsers && (
        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="mb-4 text-sm font-semibold">Adicionar usuário</h2>
            <form
              onSubmit={add}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end"
            >
              <div className="space-y-1.5">
                <Label htmlFor="new-user-name">Nome</Label>
                <Input
                  id="new-user-name"
                  autoComplete="name"
                  required
                  maxLength={200}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-user-email">E-mail</Label>
                <Input
                  id="new-user-email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-user-password">Senha inicial</Label>
                <Input
                  id="new-user-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={72}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" disabled={creating}>
                <Plus />
                {creating ? "Cadastrando..." : "Cadastrar"}
              </Button>
            </form>
            <p className="mt-3 text-xs text-muted-foreground">
              O novo usuário recebe o perfil Orçamentista. Administradores podem
              alterar o perfil ou suspender o acesso.
            </p>
          </CardContent>
        </Card>
      )}
      <Card className="mb-6">
        <CardContent className="overflow-x-auto p-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                <th className="py-2">Usuário</th>
                <th>Perfil</th>
                <th>Acesso</th>
                {can.deleteUsers && <th />}
              </tr>
            </thead>
            <tbody>
              {(data ?? []).map((u) => (
                <tr key={u.id} className="border-b last:border-0">
                  <td className="py-2.5">
                    <div className="font-medium">{u.full_name}</div>
                    <div className="text-xs text-muted-foreground">
                      {u.email}
                    </div>
                  </td>
                  <td>
                    <select
                      aria-label={`Perfil de ${u.full_name ?? u.email ?? "usuário"}`}
                      className="h-9 rounded-md border border-input bg-card px-2 text-sm"
                      disabled={!can.manageUsers || u.id === me?.user.id}
                      value={u.roles[0] ?? ""}
                      onChange={(e) =>
                        toggle(u.id, e.target.value as ManageableRole)
                      }
                    >
                      {!u.roles.length && (
                        <option value="" disabled>
                          Sem perfil
                        </option>
                      )}
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABEL[r]}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <span
                      className={
                        u.access_enabled ? "text-success" : "text-destructive"
                      }
                    >
                      {u.access_enabled ? "Ativo" : "Suspenso"}
                    </span>
                  </td>
                  {can.deleteUsers && (
                    <td className="text-right">
                      {u.id !== me?.user.id && (
                        <div className="flex justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            aria-label={
                              u.access_enabled
                                ? "Suspender acesso"
                                : "Restaurar acesso"
                            }
                            onClick={() =>
                              changeAccess(
                                u.id,
                                u.full_name ?? u.email ?? "",
                                !u.access_enabled,
                              )
                            }
                          >
                            {u.access_enabled ? <Ban /> : <Check />}
                            {u.access_enabled ? "Suspender" : "Restaurar"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Excluir usuário"
                            onClick={() =>
                              remove(u.id, u.full_name ?? u.email ?? "")
                            }
                          >
                            <Trash2 className="text-destructive" />
                          </Button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {!can.manageUsers && (
            <p className="mt-3 text-xs text-muted-foreground">
              Somente Administradores alteram perfis.
            </p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
