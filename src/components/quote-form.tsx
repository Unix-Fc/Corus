import { useMemo, useState, type ReactNode } from "react";
import { useMe } from "@/hooks/use-me";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Plus, Trash2, Save, Send, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json } from "@/integrations/supabase/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { PendingTag } from "@/components/status-badge";
import {
  computeQuote,
  hourlyCostFromMonthlySalary,
  materialCost,
  operationCost,
  productionEstimate,
  technicalPendencies,
  type Adjustments,
  type MaterialLine,
  type OperationLine,
  type ServiceLine,
  type Specs,
} from "@/lib/calc";
import {
  brl,
  n2,
  useCatalog,
  useClients,
  useParams,
  type Quote,
  type QuoteStatus,
} from "@/lib/data";
import { quoteIdentityIssues } from "@/lib/quote-validation";

const sel =
  "h-9 w-full rounded-md border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
const cell = "h-8 text-sm num";

export function QuoteForm({ initial }: { initial?: Quote }) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { data: clients = [] } = useClients();
  const { data: catalog = [] } = useCatalog();
  const { data: params = [] } = useParams();
  const p = (k: string) => Number(params.find((x) => x.key === k)?.value ?? 0);

  const [clientId, setClientId] = useState(initial?.client_id ?? "");
  const [project, setProject] = useState(initial?.project ?? "");
  const [partName, setPartName] = useState(initial?.part_name ?? "");
  const [partCode, setPartCode] = useState(initial?.part_code ?? "");
  const [quantity, setQuantity] = useState(initial?.quantity ?? 1);
  const [specs, setSpecs] = useState<Specs>(initial?.specs ?? {});
  const [materials, setMaterials] = useState<MaterialLine[]>(
    initial?.materials ?? [],
  );
  const [operations, setOperations] = useState<OperationLine[]>(
    initial?.operations ?? [],
  );
  const [services, setServices] = useState<ServiceLine[]>(
    initial?.services ?? [],
  );
  const [adj, setAdj] = useState<Adjustments | null>(
    initial?.adjustments && Object.keys(initial.adjustments).length
      ? initial.adjustments
      : null,
  );
  const [leadManual, setLeadManual] = useState(
    initial?.lead_time_manual ?? false,
  );
  const [leadDays, setLeadDays] = useState<number>(
    Number(initial?.lead_time_days ?? 0),
  );
  const [notes, setNotes] = useState(initial?.notes ?? "");
  const [saving, setSaving] = useState(false);

  const adjustments: Adjustments = adj ?? {
    perda_material_pct: p("perda_material_pct"),
    margem_pct: p("margem_pct"),
    imposto_pct: p("imposto_pct"),
  };
  const totals = useMemo(
    () =>
      computeQuote({ quantity, materials, operations, services, adjustments }),
    [quantity, materials, operations, services, adjustments],
  );
  const est = productionEstimate(operations, quantity, p("horas_dia") || 8);
  const pend = technicalPendencies(specs, {
    materials: materials.length,
    operations: operations.length,
  });

  const byKind = (k: string) => catalog.filter((c) => c.kind === k && c.active);
  const upd = <T,>(
    arr: T[],
    set: (v: T[]) => void,
    i: number,
    patch: Partial<T>,
  ) => set(arr.map((x, j) => (j === i ? { ...x, ...patch } : x)));

  const { can } = useMe();
  async function save(status: QuoteStatus) {
    const identityIssues = quoteIdentityIssues({
      clientId,
      project,
      partName,
    });
    if (identityIssues.length > 0) {
      toast.error(identityIssues.join(" "));
      return;
    }
    if (pend.length > 0) {
      toast.warning(
        `Existem pendências técnicas: ${pend.map((item) => item.message).join("; ")}.`,
      );
    }
    setSaving(true);
    const savedStatus = can.changeStatus
      ? status
      : initial
        ? initial.status === "rascunho" && status !== "rascunho"
          ? "pendente"
          : initial.status
        : status === "rascunho"
          ? "rascunho"
          : "pendente";
    const payload = {
      client_id: clientId || null,
      project,
      part_name: partName,
      part_code: partCode,
      quantity,
      specs: specs as Json,
      materials: materials as unknown as Json,
      operations: operations as unknown as Json,
      services: services as unknown as Json,
      adjustments: adjustments as Json,
      status: savedStatus,
      total: totals.total,
      lead_time_days: leadManual ? leadDays : est.days,
      lead_time_manual: leadManual,
      notes,
    };
    const res = initial
      ? await supabase
          .from("quotes")
          .update(payload)
          .eq("id", initial.id)
          .select("id")
          .single()
      : await supabase
          .from("quotes")
          .insert({
            ...payload,
            created_by: (await supabase.auth.getUser()).data.user?.id ?? null,
          })
          .select("id")
          .single();
    setSaving(false);
    if (res.error) {
      toast.error("Erro ao salvar: " + res.error.message);
      return;
    }
    toast.success(
      savedStatus === "rascunho" ? "Rascunho salvo" : "Orçamento salvo",
    );
    qc.invalidateQueries({ queryKey: ["quotes"] });
    qc.invalidateQueries({ queryKey: ["audit"] });
    navigate({ to: "/orcamentos/$id", params: { id: res.data.id } });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              Cliente e projeto / peça
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Cliente *</Label>
              <select
                className={sel}
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">— Selecione —</option>
                {clients
                  .filter((c) => c.active || c.id === clientId)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Projeto *</Label>
              <Input
                required
                value={project}
                onChange={(e) => setProject(e.target.value)}
                placeholder="Ex.: Redutor laminador L2"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Peça *</Label>
              <Input
                required
                value={partName}
                onChange={(e) => setPartName(e.target.value)}
                placeholder="Ex.: Eixo de transmissão"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Código da peça</Label>
              <Input
                value={partCode}
                onChange={(e) => setPartCode(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Quantidade</Label>
              <Input
                type="number"
                min={1}
                className="num"
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(0, Number(e.target.value)))
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Especificações técnicas</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Desenho (nº / revisão)</Label>
              <Input
                value={specs.desenho ?? ""}
                onChange={(e) =>
                  setSpecs({ ...specs, desenho: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Tolerância</Label>
              <Input
                value={specs.tolerancia ?? ""}
                onChange={(e) =>
                  setSpecs({ ...specs, tolerancia: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Acabamento superficial</Label>
              <Input
                value={specs.acabamento ?? ""}
                onChange={(e) =>
                  setSpecs({ ...specs, acabamento: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label>Tratamento térmico</Label>
                <label className="flex items-center gap-2 text-xs text-muted-foreground">
                  Aplicável
                  <Switch
                    checked={!!specs.tratamento_termico_aplicavel}
                    onCheckedChange={(v) =>
                      setSpecs({ ...specs, tratamento_termico_aplicavel: v })
                    }
                  />
                </label>
              </div>
              <Input
                disabled={!specs.tratamento_termico_aplicavel}
                value={specs.tratamento_termico ?? ""}
                onChange={(e) =>
                  setSpecs({ ...specs, tratamento_termico: e.target.value })
                }
                placeholder="Ex.: Têmpera 28-32 HRC"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label>Observações técnicas</Label>
              <Textarea
                rows={2}
                value={specs.observacoes ?? ""}
                onChange={(e) =>
                  setSpecs({ ...specs, observacoes: e.target.value })
                }
              />
            </div>
          </CardContent>
        </Card>

        <LineCard
          title="Materiais"
          total={totals.materials}
          onAdd={() =>
            setMaterials([
              ...materials,
              {
                item_id: null,
                description: "",
                unit: "kg",
                qty: 1,
                unit_cost: 0,
              },
            ])
          }
          head={["Material", "Un.", "Qtd", "Custo unit.", "Subtotal", ""]}
        >
          {materials.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="p-1.5 min-w-48">
                <select
                  className={sel}
                  value={m.item_id ?? ""}
                  onChange={(e) => {
                    const it = catalog.find((c) => c.id === e.target.value);
                    upd(
                      materials,
                      setMaterials,
                      i,
                      it
                        ? {
                            item_id: it.id,
                            description: it.name,
                            unit: it.unit ?? "",
                            unit_cost: Number(it.unit_cost),
                          }
                        : { item_id: null },
                    );
                  }}
                >
                  <option value="">{m.description || "— Material —"}</option>
                  {byKind("material").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.code} · {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-1.5 w-16">
                <Input
                  className={cell}
                  value={m.unit}
                  onChange={(e) =>
                    upd(materials, setMaterials, i, { unit: e.target.value })
                  }
                />
              </td>
              <td className="p-1.5 w-24">
                <Input
                  type="number"
                  step="0.01"
                  className={cell}
                  value={m.qty}
                  onChange={(e) =>
                    upd(materials, setMaterials, i, {
                      qty: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-1.5 w-28">
                <Input
                  type="number"
                  step="0.01"
                  className={cell}
                  value={m.unit_cost}
                  onChange={(e) =>
                    upd(materials, setMaterials, i, {
                      unit_cost: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-1.5 text-right num whitespace-nowrap">
                {brl(materialCost(m))}
              </td>
              <td className="p-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setMaterials(materials.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </LineCard>

        <LineCard
          title="Operações internas"
          total={totals.operations}
          tableClassName="min-w-[1080px]"
          onAdd={() =>
            setOperations([
              ...operations,
              {
                machine_id: null,
                tool_id: null,
                cargo_id: null,
                description: "",
                salary_monthly: null,
                setup_h: 0,
                time_min: 0,
                cost_hour: 0,
                time_source: "manual",
              },
            ])
          }
          head={[
            "Máquina / descrição",
            "Ferramenta",
            "Cargo / salário",
            "Setup (h)",
            "Tempo/peça (min)",
            "Custo-hora",
            "Subtotal",
            "",
          ]}
          footer="O custo-hora do cargo é calculado com o salário mensal cadastrado ÷ 220 horas/mês e somado ao custo-hora da máquina. Encargos e benefícios não são incluídos."
        >
          {operations.map((o, i) => (
            <tr key={i} className="border-t align-top">
              <td className="p-1.5 min-w-48 space-y-1">
                <select
                  className={sel}
                  value={o.machine_id ?? ""}
                  onChange={(e) => {
                    const it = catalog.find((c) => c.id === e.target.value);
                    const d = (it?.details ?? {}) as {
                      setup_padrao_h?: number;
                    };
                    upd(
                      operations,
                      setOperations,
                      i,
                      it
                        ? {
                            machine_id: it.id,
                            cost_hour: Number(it.unit_cost),
                            setup_h: Number(d.setup_padrao_h ?? o.setup_h),
                            time_source: "parametro",
                            description: o.description || it.name,
                          }
                        : { machine_id: null },
                    );
                  }}
                >
                  <option value="">— Máquina —</option>
                  {byKind("maquina").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <Input
                  className="h-8 text-sm"
                  placeholder="Descrição da operação"
                  value={o.description}
                  onChange={(e) =>
                    upd(operations, setOperations, i, {
                      description: e.target.value,
                    })
                  }
                />
              </td>
              <td className="p-1.5 min-w-36">
                <select
                  className={sel}
                  value={o.tool_id ?? ""}
                  onChange={(e) =>
                    upd(operations, setOperations, i, {
                      tool_id: e.target.value || null,
                    })
                  }
                >
                  <option value="">—</option>
                  {byKind("ferramenta").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-1.5 min-w-44">
                <select
                  className={sel}
                  aria-label={`Cargo de ${o.description || "funcionário"}`}
                  value={o.cargo_id ?? ""}
                  onChange={(e) => {
                    const cargo = catalog.find(
                      (item) => item.id === e.target.value,
                    );
                    const details = (cargo?.details ?? {}) as {
                      salario_mensal?: number;
                    };
                    const salary = Number(details.salario_mensal);
                    if (!cargo || !Number.isFinite(salary) || salary < 0) {
                      upd(operations, setOperations, i, {
                        cargo_id: null,
                        salary_monthly: null,
                      });
                      return;
                    }
                    upd(operations, setOperations, i, {
                      cargo_id: cargo.id,
                      salary_monthly: salary,
                    });
                  }}
                >
                  <option value="">
                    {byKind("cargo").length
                      ? "— Selecionar cargo —"
                      : "Cadastre cargos"}
                  </option>
                  {catalog
                    .filter(
                      (item) =>
                        item.kind === "cargo" &&
                        (item.active || item.id === o.cargo_id),
                    )
                    .map((item) => {
                      const details = item.details as {
                        salario_mensal?: number;
                      };
                      const salary = Number(details.salario_mensal);
                      return (
                        <option
                          key={item.id}
                          value={item.id}
                          disabled={!Number.isFinite(salary) || salary < 0}
                        >
                          {item.name} —{" "}
                          {Number.isFinite(salary) && salary >= 0
                            ? brl(salary)
                            : "salário não informado"}
                        </option>
                      );
                    })}
                </select>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {o.cargo_id && o.salary_monthly != null
                    ? `Salário: ${brl(o.salary_monthly)} · Custo-hora: ${brl(hourlyCostFromMonthlySalary(o.salary_monthly))}`
                    : "Salário conforme Cadastros"}
                </p>
              </td>
              <td className="p-1.5 w-20">
                <Input
                  type="number"
                  step="0.05"
                  className={cell}
                  value={o.setup_h}
                  onChange={(e) =>
                    upd(operations, setOperations, i, {
                      setup_h: Number(e.target.value),
                      time_source: "manual",
                    })
                  }
                />
              </td>
              <td className="p-1.5 w-24">
                <Input
                  type="number"
                  step="0.5"
                  className={cell}
                  value={o.time_min}
                  onChange={(e) =>
                    upd(operations, setOperations, i, {
                      time_min: Number(e.target.value),
                      time_source: "manual",
                    })
                  }
                />
                <div className="mt-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                  {o.time_source === "manual"
                    ? "Informado manualmente"
                    : "Baseado em parâmetro"}
                </div>
              </td>
              <td className="p-1.5 w-24">
                <Input
                  type="number"
                  step="0.01"
                  className={cell}
                  value={o.cost_hour}
                  onChange={(e) =>
                    upd(operations, setOperations, i, {
                      cost_hour: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-1.5 text-right num whitespace-nowrap">
                {brl(operationCost(o, quantity))}
              </td>
              <td className="p-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setOperations(operations.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </LineCard>

        <LineCard
          title="Serviços externos / tratamentos"
          total={totals.services}
          onAdd={() =>
            setServices([
              ...services,
              {
                item_id: null,
                description: "",
                unit: "un",
                qty: 1,
                unit_cost: 0,
              },
            ])
          }
          head={["Serviço", "Un.", "Qtd", "Custo unit.", "Subtotal", ""]}
        >
          {services.map((m, i) => (
            <tr key={i} className="border-t">
              <td className="p-1.5 min-w-48">
                <select
                  className={sel}
                  value={m.item_id ?? ""}
                  onChange={(e) => {
                    const it = catalog.find((c) => c.id === e.target.value);
                    upd(
                      services,
                      setServices,
                      i,
                      it
                        ? {
                            item_id: it.id,
                            description: it.name,
                            unit: it.unit ?? "",
                            unit_cost: Number(it.unit_cost),
                          }
                        : { item_id: null },
                    );
                  }}
                >
                  <option value="">{m.description || "— Serviço —"}</option>
                  {byKind("servico").map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </td>
              <td className="p-1.5 w-16">
                <Input
                  className={cell}
                  value={m.unit}
                  onChange={(e) =>
                    upd(services, setServices, i, { unit: e.target.value })
                  }
                />
              </td>
              <td className="p-1.5 w-24">
                <Input
                  type="number"
                  step="0.01"
                  className={cell}
                  value={m.qty}
                  onChange={(e) =>
                    upd(services, setServices, i, {
                      qty: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-1.5 w-28">
                <Input
                  type="number"
                  step="0.01"
                  className={cell}
                  value={m.unit_cost}
                  onChange={(e) =>
                    upd(services, setServices, i, {
                      unit_cost: Number(e.target.value),
                    })
                  }
                />
              </td>
              <td className="p-1.5 text-right num whitespace-nowrap">
                {brl(materialCost(m))}
              </td>
              <td className="p-1.5">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    setServices(services.filter((_, j) => j !== i))
                  }
                >
                  <Trash2 />
                </Button>
              </td>
            </tr>
          ))}
        </LineCard>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Observações comerciais</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </CardContent>
        </Card>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-16 lg:self-start">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Calculadora</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <Row label="Materiais" v={totals.materials} />
            <Row label="Operações internas" v={totals.operations} />
            <Row label="Serviços externos" v={totals.services} />
            <div className="border-t pt-1.5">
              <Row label="Subtotal" v={totals.subtotal} strong />
            </div>
            <div className="mt-3 rounded-md border border-warning/40 bg-warning-soft/50 p-2.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">
                  Ajustes configuráveis
                </span>
                <PendingTag />
              </div>
              {(
                [
                  ["perda_material_pct", "Perda s/ material %", totals.perda],
                  ["margem_pct", "Margem %", totals.margem],
                  ["imposto_pct", "Impostos %", totals.imposto],
                ] as const
              ).map(([k, l, v]) => (
                <div key={k} className="flex items-center gap-2">
                  <span className="flex-1 text-xs">{l}</span>
                  <Input
                    type="number"
                    step="0.01"
                    className="h-7 w-16 text-xs num"
                    value={adjustments[k] ?? 0}
                    onChange={(e) =>
                      setAdj({ ...adjustments, [k]: Number(e.target.value) })
                    }
                  />
                  <span className="w-24 text-right text-xs num">{brl(v)}</span>
                </div>
              ))}
            </div>
            <div className="border-t pt-2">
              <Row label="Total" v={totals.total} strong big />
            </div>
            <Row label={`Unitário (${quantity} pç)`} v={totals.unit} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Estimativa de produção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Setup total</span>
              <span className="num">{n2(est.setup)} h</span>
            </div>
            <div className="flex justify-between">
              <span>Operação total</span>
              <span className="num">{n2(est.run)} h</span>
            </div>
            <div className="flex justify-between font-medium">
              <span>Horas consolidadas</span>
              <span className="num">{n2(est.hours)} h</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {est.manual} op. manual · {est.parametro} op. por parâmetro ·{" "}
              {p("horas_dia") || 8} h/dia <PendingTag>provisório</PendingTag>
            </div>
            <div className="mt-2 flex items-center justify-between rounded-md bg-muted p-2">
              <label className="flex items-center gap-2 text-xs">
                <Switch checked={leadManual} onCheckedChange={setLeadManual} />
                Prazo manual
              </label>
              {leadManual ? (
                <Input
                  type="number"
                  step="0.5"
                  className="h-7 w-20 text-xs num"
                  value={leadDays}
                  onChange={(e) => setLeadDays(Number(e.target.value))}
                />
              ) : (
                <span className="num text-sm font-medium">{est.days} dias</span>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Pendências técnicas
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm">
            {pend.length === 0 ? (
              <p className="text-success">Nenhuma pendência.</p>
            ) : (
              <ul className="space-y-1">
                {pend.map((x) => (
                  <li key={x.field} className="flex gap-2">
                    <span
                      className={
                        x.severity === "alta"
                          ? "text-destructive"
                          : "text-warning-foreground"
                      }
                    >
                      ●
                    </span>
                    {x.message}
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-2 text-xs text-muted-foreground">
              Pendências são sinalizadas, mas não impedem salvar. A regra de
              bloqueio por insuficiência técnica ainda precisa ser validada.
            </p>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-2">
          <Button
            variant="outline"
            disabled={saving}
            onClick={() => save("rascunho")}
          >
            <Save />
            Salvar rascunho
          </Button>
          <Button
            disabled={saving}
            onClick={() =>
              save(
                initial && initial.status !== "rascunho"
                  ? initial.status
                  : "pendente",
              )
            }
          >
            <Send />
            Salvar orçamento
          </Button>
        </div>
      </aside>
    </div>
  );
}

function Row({
  label,
  v,
  strong,
  big,
}: {
  label: string;
  v: number;
  strong?: boolean;
  big?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${strong ? "font-semibold" : ""} ${big ? "text-lg" : ""}`}
    >
      <span>{label}</span>
      <span className="num">{brl(v)}</span>
    </div>
  );
}

function LineCard({
  title,
  total,
  onAdd,
  head,
  children,
  footer,
  tableClassName,
}: {
  title: string;
  total: number;
  onAdd: () => void;
  head: string[];
  children: ReactNode;
  footer?: string;
  tableClassName?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">{title}</CardTitle>
        <div className="flex items-center gap-3">
          <span className="num text-sm font-medium">{brl(total)}</span>
          <Button size="sm" variant="outline" onClick={onAdd}>
            <Plus />
            Adicionar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className={`w-full text-sm ${tableClassName ?? ""}`}>
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                {head.map((h) => (
                  <th key={h} className="p-1.5 font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>{children}</tbody>
          </table>
        </div>
        {footer && (
          <p className="mt-2 text-xs text-muted-foreground">{footer}</p>
        )}
      </CardContent>
    </Card>
  );
}
