import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Pencil } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { PageHeader } from "@/components/status-badge";
import { AuditList } from "@/components/audit-list";
import {
  brl,
  KIND_LABEL,
  useAudit,
  useCatalog,
  useClients,
  type CatalogKind,
} from "@/lib/data";
import { useMe } from "@/hooks/use-me";
import { requireAdminRoute } from "@/lib/admin-route";

export const Route = createFileRoute("/_authenticated/cadastros")({
  beforeLoad: requireAdminRoute,
  head: () => ({
    meta: [
      { title: "Cadastros — Corus" },
      {
        name: "description",
        content:
          "Clientes, materiais, máquinas, ferramentas, cargos e serviços.",
      },
    ],
  }),
  component: Cadastros,
});

type Tab = "clientes" | CatalogKind;
type Form = Record<string, string | number | boolean>;

function Cadastros() {
  const [tab, setTab] = useState<Tab>("clientes");
  const [q, setQ] = useState("");
  const [edit, setEdit] = useState<{ id?: string; f: Form } | null>(null);
  const [hist, setHist] = useState<{
    entity: string;
    id: string;
    name: string;
  } | null>(null);
  const { data: clients = [] } = useClients();
  const { data: catalog = [] } = useCatalog();
  const { can } = useMe();
  const qc = useQueryClient();
  const term = q.toLowerCase();

  const costLabel =
    tab === "maquina" || tab === "cargo" ? "Custo-hora" : "Custo unitário";

  async function save() {
    if (!edit) return;
    const f = edit.f;
    if (!String(f["name"] ?? "").trim()) {
      toast.error("Informe o nome.");
      return;
    }
    let error;
    if (tab === "clientes") {
      const p = {
        name: String(f["name"]),
        cnpj: String(f["cnpj"] ?? ""),
        contact: String(f["contact"] ?? ""),
        email: String(f["email"] ?? ""),
        phone: String(f["phone"] ?? ""),
        city: String(f["city"] ?? ""),
        active: !!f["active"],
      };
      ({ error } = edit.id
        ? await supabase.from("clients").update(p).eq("id", edit.id)
        : await supabase.from("clients").insert(p));
    } else {
      const details =
        tab === "maquina"
          ? { setup_padrao_h: Number(f["setup"] ?? 0) }
          : tab === "cargo"
            ? { salario_mensal: Number(f["salario"] ?? 0) }
            : tab === "servico"
              ? { fornecedor: String(f["fornecedor"] ?? "") }
              : {};
      const p = {
        kind: tab,
        code: String(f["code"] ?? ""),
        name: String(f["name"]),
        unit: String(f["unit"] ?? ""),
        unit_cost: Number(f["unit_cost"] ?? 0),
        active: !!f["active"],
        details,
      };
      ({ error } = edit.id
        ? await supabase.from("catalog_items").update(p).eq("id", edit.id)
        : await supabase.from("catalog_items").insert(p));
    }
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Cadastro salvo");
    setEdit(null);
    qc.invalidateQueries({
      queryKey: [tab === "clientes" ? "clients" : "catalog"],
    });
    qc.invalidateQueries({ queryKey: ["audit"] });
  }

  const set = (k: string, v: string | number | boolean) =>
    edit && setEdit({ ...edit, f: { ...edit.f, [k]: v } });

  return (
    <>
      <PageHeader
        title="Cadastros de referência"
        subtitle="Base de custos usada nos orçamentos. Inativos não aparecem para novos lançamentos."
        actions={
          can.editCatalog && (
            <Button
              onClick={() =>
                setEdit({
                  f: {
                    active: true,
                    unit: tab === "maquina" || tab === "cargo" ? "h" : "",
                  },
                })
              }
            >
              <Plus />
              Novo
            </Button>
          )
        }
      />
      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <TabsList className="h-auto flex-wrap">
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          {(Object.keys(KIND_LABEL) as CatalogKind[]).map((k) => (
            <TabsTrigger key={k} value={k}>
              {KIND_LABEL[k]}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <Card className="mt-4">
        <CardContent className="p-4">
          <Input
            className="mb-3 max-w-sm"
            placeholder="Buscar…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="overflow-x-auto">
            {tab === "clientes" ? (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Cliente</th>
                    <th>CNPJ</th>
                    <th>Contato</th>
                    <th>Cidade</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {clients
                    .filter((c) => !term || c.name.toLowerCase().includes(term))
                    .map((c) => (
                      <tr key={c.id} className="border-b last:border-0">
                        <td className="py-2.5 font-medium">{c.name}</td>
                        <td className="num text-xs">{c.cnpj}</td>
                        <td>
                          <div>{c.contact}</div>
                          <div className="text-xs text-muted-foreground">
                            {c.email}
                          </div>
                        </td>
                        <td>{c.city}</td>
                        <td>
                          <Active a={c.active} />
                        </td>
                        <td className="text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setHist({
                                entity: "clients",
                                id: c.id,
                                name: c.name,
                              })
                            }
                          >
                            Histórico
                          </Button>
                          {can.editCatalog && (
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setEdit({
                                  id: c.id,
                                  f: {
                                    name: c.name,
                                    cnpj: c.cnpj ?? "",
                                    contact: c.contact ?? "",
                                    email: c.email ?? "",
                                    phone: c.phone ?? "",
                                    city: c.city ?? "",
                                    active: c.active,
                                  },
                                })
                              }
                            >
                              <Pencil />
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2">Código</th>
                    <th>Descrição</th>
                    <th>Un.</th>
                    <th className="text-right">{costLabel}</th>
                    <th>Detalhe</th>
                    <th>Status</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {catalog
                    .filter(
                      (c) =>
                        c.kind === tab &&
                        (!term ||
                          `${c.code} ${c.name}`.toLowerCase().includes(term)),
                    )
                    .map((c) => {
                      const d = c.details as Record<string, string | number>;
                      return (
                        <tr key={c.id} className="border-b last:border-0">
                          <td className="py-2.5 num text-xs">{c.code}</td>
                          <td className="font-medium">{c.name}</td>
                          <td>{c.unit}</td>
                          <td className="text-right num">
                            {brl(Number(c.unit_cost))}
                          </td>
                          <td className="text-xs text-muted-foreground">
                            {d["setup_padrao_h"] !== undefined
                              ? `Setup padrão ${d["setup_padrao_h"]} h`
                              : d["salario_mensal"]
                                ? `Salário ${brl(Number(d["salario_mensal"]))}`
                                : (d["fornecedor"] ?? d["norma"] ?? "")}
                          </td>
                          <td>
                            <Active a={c.active} />
                          </td>
                          <td className="text-right whitespace-nowrap">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setHist({
                                  entity: "catalog_items",
                                  id: c.id,
                                  name: c.name,
                                })
                              }
                            >
                              Histórico
                            </Button>
                            {can.editCatalog && (
                              <Button
                                size="icon"
                                variant="ghost"
                                onClick={() =>
                                  setEdit({
                                    id: c.id,
                                    f: {
                                      code: c.code ?? "",
                                      name: c.name,
                                      unit: c.unit ?? "",
                                      unit_cost: Number(c.unit_cost),
                                      active: c.active,
                                      setup: Number(d["setup_padrao_h"] ?? 0),
                                      salario: Number(d["salario_mensal"] ?? 0),
                                      fornecedor: String(d["fornecedor"] ?? ""),
                                    },
                                  })
                                }
                              >
                                <Pencil />
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!edit} onOpenChange={(o) => !o && setEdit(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {edit?.id ? "Editar" : "Novo"} —{" "}
              {tab === "clientes" ? "Cliente" : KIND_LABEL[tab]}
            </DialogTitle>
          </DialogHeader>
          {edit && (
            <div className="grid gap-3 sm:grid-cols-2">
              {tab === "clientes" ? (
                <>
                  <F l="Razão social" k="name" f={edit.f} set={set} wide />
                  <F l="CNPJ" k="cnpj" f={edit.f} set={set} />
                  <F l="Contato" k="contact" f={edit.f} set={set} />
                  <F l="E-mail" k="email" f={edit.f} set={set} />
                  <F l="Telefone" k="phone" f={edit.f} set={set} />
                  <F l="Cidade/UF" k="city" f={edit.f} set={set} />
                </>
              ) : (
                <>
                  <F l="Código" k="code" f={edit.f} set={set} />
                  <F l="Unidade" k="unit" f={edit.f} set={set} />
                  <F l="Descrição" k="name" f={edit.f} set={set} wide />
                  <F
                    l={costLabel + " (R$)"}
                    k="unit_cost"
                    f={edit.f}
                    set={set}
                    num
                  />
                  {tab === "maquina" && (
                    <F
                      l="Setup padrão (h)"
                      k="setup"
                      f={edit.f}
                      set={set}
                      num
                    />
                  )}
                  {tab === "cargo" && (
                    <>
                      <F
                        l="Salário mensal do funcionário (R$)"
                        k="salario"
                        f={edit.f}
                        set={set}
                        num
                      />
                      <p className="text-xs text-muted-foreground sm:col-span-2">
                        Informe o salário mensal de referência para este cargo.
                      </p>
                    </>
                  )}
                  {tab === "servico" && (
                    <F l="Fornecedor" k="fornecedor" f={edit.f} set={set} />
                  )}
                </>
              )}
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <Switch
                  checked={!!edit.f["active"]}
                  onCheckedChange={(v) => set("active", v)}
                />
                Ativo
              </label>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEdit(null)}>
              Cancelar
            </Button>
            <Button onClick={save}>Salvar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={!!hist} onOpenChange={(o) => !o && setHist(null)}>
        <SheetContent className="overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Histórico — {hist?.name}</SheetTitle>
          </SheetHeader>
          {hist && <HistBody entity={hist.entity} id={hist.id} />}
        </SheetContent>
      </Sheet>
    </>
  );
}

function HistBody({ entity, id }: { entity: string; id: string }) {
  const { data = [] } = useAudit({ entity, entityId: id });
  return (
    <div className="mt-4 px-4">
      <AuditList rows={data} />
    </div>
  );
}
const Active = ({ a }: { a: boolean }) => (
  <span
    className={`text-xs font-medium ${a ? "text-success" : "text-muted-foreground"}`}
  >
    {a ? "Ativo" : "Inativo"}
  </span>
);
function F({
  l,
  k,
  f,
  set,
  wide,
  num,
}: {
  l: string;
  k: string;
  f: Form;
  set: (k: string, v: string | number) => void;
  wide?: boolean;
  num?: boolean;
}) {
  return (
    <div className={`space-y-1.5 ${wide ? "sm:col-span-2" : ""}`}>
      <Label>{l}</Label>
      <Input
        type={num ? "number" : "text"}
        step="0.01"
        className={num ? "num" : ""}
        value={String(f[k] ?? "")}
        onChange={(e) => set(k, num ? Number(e.target.value) : e.target.value)}
      />
    </div>
  );
}
