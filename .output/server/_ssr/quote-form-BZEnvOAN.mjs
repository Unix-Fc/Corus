import { n as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as computeQuote, b as useParams, c as materialCost, g as technicalPendencies, i as brl, l as n2, p as productionEstimate, s as hourlyCostFromMonthlySalary, u as operationCost, v as useCatalog, y as useClients } from "./data-BR025WEp.mjs";
import { i as CardTitle, n as CardContent, o as PendingTag, r as CardHeader, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { x as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { d as Save, i as TriangleAlert, l as Send, o as Trash2, p as Plus } from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quote-form-BZEnvOAN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Textarea.displayName = "Textarea";
var sel = "h-9 w-full rounded-md border border-input bg-card px-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";
var cell = "h-8 text-sm num";
function QuoteForm({ initial }) {
	const navigate = useNavigate();
	const qc = useQueryClient();
	const { data: clients = [] } = useClients();
	const { data: catalog = [] } = useCatalog();
	const { data: params = [] } = useParams();
	const p = (k) => Number(params.find((x) => x.key === k)?.value ?? 0);
	const [clientId, setClientId] = (0, import_react.useState)(initial?.client_id ?? "");
	const [project, setProject] = (0, import_react.useState)(initial?.project ?? "");
	const [partName, setPartName] = (0, import_react.useState)(initial?.part_name ?? "");
	const [partCode, setPartCode] = (0, import_react.useState)(initial?.part_code ?? "");
	const [quantity, setQuantity] = (0, import_react.useState)(initial?.quantity ?? 1);
	const [specs, setSpecs] = (0, import_react.useState)(initial?.specs ?? {});
	const [materials, setMaterials] = (0, import_react.useState)(initial?.materials ?? []);
	const [operations, setOperations] = (0, import_react.useState)(initial?.operations ?? []);
	const [services, setServices] = (0, import_react.useState)(initial?.services ?? []);
	const [adj, setAdj] = (0, import_react.useState)(initial?.adjustments && Object.keys(initial.adjustments).length ? initial.adjustments : null);
	const [leadManual, setLeadManual] = (0, import_react.useState)(initial?.lead_time_manual ?? false);
	const [leadDays, setLeadDays] = (0, import_react.useState)(Number(initial?.lead_time_days ?? 0));
	const [notes, setNotes] = (0, import_react.useState)(initial?.notes ?? "");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const adjustments = adj ?? {
		perda_material_pct: p("perda_material_pct"),
		margem_pct: p("margem_pct"),
		imposto_pct: p("imposto_pct")
	};
	const totals = (0, import_react.useMemo)(() => computeQuote({
		quantity,
		materials,
		operations,
		services,
		adjustments
	}), [
		quantity,
		materials,
		operations,
		services,
		adjustments
	]);
	const est = productionEstimate(operations, quantity, p("horas_dia") || 8);
	const pend = technicalPendencies(specs, {
		materials: materials.length,
		operations: operations.length
	});
	const byKind = (k) => catalog.filter((c) => c.kind === k && c.active);
	const upd = (arr, set, i, patch) => set(arr.map((x, j) => j === i ? {
		...x,
		...patch
	} : x));
	const { can } = useMe();
	async function save(status) {
		if (!partName.trim()) {
			toast.error("Informe o nome do projeto/peça.");
			return;
		}
		setSaving(true);
		const savedStatus = can.changeStatus ? status : initial ? initial.status === "rascunho" && status !== "rascunho" ? "pendente" : initial.status : status === "rascunho" ? "rascunho" : "pendente";
		const payload = {
			client_id: clientId || null,
			project,
			part_name: partName,
			part_code: partCode,
			quantity,
			specs,
			materials,
			operations,
			services,
			adjustments,
			status: savedStatus,
			total: totals.total,
			lead_time_days: leadManual ? leadDays : est.days,
			lead_time_manual: leadManual,
			notes
		};
		const res = initial ? await supabase.from("quotes").update(payload).eq("id", initial.id).select("id").single() : await supabase.from("quotes").insert({
			...payload,
			created_by: (await supabase.auth.getUser()).data.user?.id ?? null
		}).select("id").single();
		setSaving(false);
		if (res.error) {
			toast.error("Erro ao salvar: " + res.error.message);
			return;
		}
		toast.success(savedStatus === "rascunho" ? "Rascunho salvo" : "Orçamento salvo");
		qc.invalidateQueries({ queryKey: ["quotes"] });
		qc.invalidateQueries({ queryKey: ["audit"] });
		navigate({
			to: "/orcamentos/$id",
			params: { id: res.data.id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Cliente e projeto / peça"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Cliente" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								className: sel,
								value: clientId,
								onChange: (e) => setClientId(e.target.value),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									children: "— Selecione —"
								}), clients.filter((c) => c.active || c.id === clientId).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: c.id,
									children: c.name
								}, c.id))]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Projeto" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: project,
								onChange: (e) => setProject(e.target.value),
								placeholder: "Ex.: Redutor laminador L2"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Peça *" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: partName,
								onChange: (e) => setPartName(e.target.value),
								placeholder: "Ex.: Eixo de transmissão"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Código da peça" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: partCode,
								onChange: (e) => setPartCode(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Quantidade" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								min: 1,
								className: "num",
								value: quantity,
								onChange: (e) => setQuantity(Math.max(0, Number(e.target.value)))
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Especificações técnicas"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-4 sm:grid-cols-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Desenho (nº / revisão)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: specs.desenho ?? "",
								onChange: (e) => setSpecs({
									...specs,
									desenho: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tolerância" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: specs.tolerancia ?? "",
								onChange: (e) => setSpecs({
									...specs,
									tolerancia: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Acabamento superficial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								value: specs.acabamento ?? "",
								onChange: (e) => setSpecs({
									...specs,
									acabamento: e.target.value
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Tratamento térmico" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-xs text-muted-foreground",
									children: ["Aplicável", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
										checked: !!specs.tratamento_termico_aplicavel,
										onCheckedChange: (v) => setSpecs({
											...specs,
											tratamento_termico_aplicavel: v
										})
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								disabled: !specs.tratamento_termico_aplicavel,
								value: specs.tratamento_termico ?? "",
								onChange: (e) => setSpecs({
									...specs,
									tratamento_termico: e.target.value
								}),
								placeholder: "Ex.: Têmpera 28-32 HRC"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5 sm:col-span-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Observações técnicas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								rows: 2,
								value: specs.observacoes ?? "",
								onChange: (e) => setSpecs({
									...specs,
									observacoes: e.target.value
								})
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineCard, {
					title: "Materiais",
					total: totals.materials,
					onAdd: () => setMaterials([...materials, {
						item_id: null,
						description: "",
						unit: "kg",
						qty: 1,
						unit_cost: 0
					}]),
					head: [
						"Material",
						"Un.",
						"Qtd",
						"Custo unit.",
						"Subtotal",
						""
					],
					children: materials.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 min-w-48",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel,
									value: m.item_id ?? "",
									onChange: (e) => {
										const it = catalog.find((c) => c.id === e.target.value);
										upd(materials, setMaterials, i, it ? {
											item_id: it.id,
											description: it.name,
											unit: it.unit ?? "",
											unit_cost: Number(it.unit_cost)
										} : { item_id: null });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: m.description || "— Material —"
									}), byKind("material").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
										value: c.id,
										children: [
											c.code,
											" · ",
											c.name
										]
									}, c.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-16",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: cell,
									value: m.unit,
									onChange: (e) => upd(materials, setMaterials, i, { unit: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									className: cell,
									value: m.qty,
									onChange: (e) => upd(materials, setMaterials, i, { qty: Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-28",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									className: cell,
									value: m.unit_cost,
									onChange: (e) => upd(materials, setMaterials, i, { unit_cost: Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 text-right num whitespace-nowrap",
								children: brl(materialCost(m))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => setMaterials(materials.filter((_, j) => j !== i)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineCard, {
					title: "Operações internas",
					total: totals.operations,
					onAdd: () => setOperations([...operations, {
						machine_id: null,
						tool_id: null,
						cargo_id: null,
						description: "",
						salary_monthly: null,
						setup_h: 0,
						time_min: 0,
						cost_hour: 0,
						time_source: "manual"
					}]),
					head: [
						"Máquina / descrição",
						"Ferramenta",
						"Cargo / salário",
						"Setup (h)",
						"Tempo/peça (min)",
						"Custo-hora",
						"Subtotal",
						""
					],
					footer: "O custo-hora do cargo é calculado com o salário mensal cadastrado ÷ 220 horas/mês e somado ao custo-hora da máquina. Encargos e benefícios não são incluídos.",
					children: operations.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t align-top",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-1.5 min-w-48 space-y-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel,
									value: o.machine_id ?? "",
									onChange: (e) => {
										const it = catalog.find((c) => c.id === e.target.value);
										const d = it?.details ?? {};
										upd(operations, setOperations, i, it ? {
											machine_id: it.id,
											cost_hour: Number(it.unit_cost),
											setup_h: Number(d.setup_padrao_h ?? o.setup_h),
											time_source: "parametro",
											description: o.description || it.name
										} : { machine_id: null });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "— Máquina —"
									}), byKind("maquina").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.name
									}, c.id))]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: "h-8 text-sm",
									placeholder: "Descrição da operação",
									value: o.description,
									onChange: (e) => upd(operations, setOperations, i, { description: e.target.value })
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 min-w-36",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel,
									value: o.tool_id ?? "",
									onChange: (e) => upd(operations, setOperations, i, { tool_id: e.target.value || null }),
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "—"
									}), byKind("ferramenta").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.name
									}, c.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-1.5 min-w-44",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel,
									"aria-label": `Cargo de ${o.description || "funcionário"}`,
									value: o.cargo_id ?? "",
									onChange: (e) => {
										const cargo = catalog.find((item) => item.id === e.target.value);
										const details = cargo?.details ?? {};
										const salary = Number(details.salario_mensal);
										if (!cargo || !Number.isFinite(salary) || salary < 0) {
											upd(operations, setOperations, i, {
												cargo_id: null,
												salary_monthly: null
											});
											return;
										}
										upd(operations, setOperations, i, {
											cargo_id: cargo.id,
											salary_monthly: salary
										});
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: byKind("cargo").length ? "— Selecionar cargo —" : "Cadastre cargos"
									}), catalog.filter((item) => item.kind === "cargo" && (item.active || item.id === o.cargo_id)).map((item) => {
										const details = item.details;
										const salary = Number(details.salario_mensal);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: item.id,
											disabled: !Number.isFinite(salary) || salary < 0,
											children: [
												item.name,
												" —",
												" ",
												Number.isFinite(salary) && salary >= 0 ? brl(salary) : "salário não informado"
											]
										}, item.id);
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-[10px] text-muted-foreground",
									children: o.cargo_id && o.salary_monthly != null ? `Salário: ${brl(o.salary_monthly)} · Custo-hora: ${brl(hourlyCostFromMonthlySalary(o.salary_monthly))}` : "Salário conforme Cadastros"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-20",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.05",
									className: cell,
									value: o.setup_h,
									onChange: (e) => upd(operations, setOperations, i, {
										setup_h: Number(e.target.value),
										time_source: "manual"
									})
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-1.5 w-24",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.5",
									className: cell,
									value: o.time_min,
									onChange: (e) => upd(operations, setOperations, i, {
										time_min: Number(e.target.value),
										time_source: "manual"
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-1 text-[10px] uppercase tracking-wide text-muted-foreground",
									children: o.time_source === "manual" ? "Informado manualmente" : "Baseado em parâmetro"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									className: cell,
									value: o.cost_hour,
									onChange: (e) => upd(operations, setOperations, i, { cost_hour: Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 text-right num whitespace-nowrap",
								children: brl(operationCost(o, quantity))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => setOperations(operations.filter((_, j) => j !== i)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LineCard, {
					title: "Serviços externos / tratamentos",
					total: totals.services,
					onAdd: () => setServices([...services, {
						item_id: null,
						description: "",
						unit: "un",
						qty: 1,
						unit_cost: 0
					}]),
					head: [
						"Serviço",
						"Un.",
						"Qtd",
						"Custo unit.",
						"Subtotal",
						""
					],
					children: services.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 min-w-48",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
									className: sel,
									value: m.item_id ?? "",
									onChange: (e) => {
										const it = catalog.find((c) => c.id === e.target.value);
										upd(services, setServices, i, it ? {
											item_id: it.id,
											description: it.name,
											unit: it.unit ?? "",
											unit_cost: Number(it.unit_cost)
										} : { item_id: null });
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: m.description || "— Serviço —"
									}), byKind("servico").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: c.id,
										children: c.name
									}, c.id))]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-16",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									className: cell,
									value: m.unit,
									onChange: (e) => upd(services, setServices, i, { unit: e.target.value })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-24",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									className: cell,
									value: m.qty,
									onChange: (e) => upd(services, setServices, i, { qty: Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 w-28",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									step: "0.01",
									className: cell,
									value: m.unit_cost,
									onChange: (e) => upd(services, setServices, i, { unit_cost: Number(e.target.value) })
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5 text-right num whitespace-nowrap",
								children: brl(materialCost(m))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									variant: "ghost",
									size: "icon",
									onClick: () => setServices(services.filter((_, j) => j !== i)),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
								})
							})
						]
					}, i))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Observações comerciais"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
					rows: 3,
					value: notes,
					onChange: (e) => setNotes(e.target.value)
				}) })] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4 lg:sticky lg:top-16 lg:self-start",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Calculadora"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Materiais",
							v: totals.materials
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Operações internas",
							v: totals.operations
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: "Serviços externos",
							v: totals.services
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t pt-1.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Subtotal",
								v: totals.subtotal,
								strong: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 rounded-md border border-warning/40 bg-warning-soft/50 p-2.5 space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-medium",
									children: "Ajustes configuráveis"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingTag, {})]
							}), [
								[
									"perda_material_pct",
									"Perda s/ material %",
									totals.perda
								],
								[
									"margem_pct",
									"Margem %",
									totals.margem
								],
								[
									"imposto_pct",
									"Impostos %",
									totals.imposto
								]
							].map(([k, l, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "flex-1 text-xs",
										children: l
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
										type: "number",
										step: "0.01",
										className: "h-7 w-16 text-xs num",
										value: adjustments[k] ?? 0,
										onChange: (e) => setAdj({
											...adjustments,
											[k]: Number(e.target.value)
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "w-24 text-right text-xs num",
										children: brl(v)
									})
								]
							}, k))]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t pt-2",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
								label: "Total",
								v: totals.total,
								strong: true,
								big: true
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
							label: `Unitário (${quantity} pç)`,
							v: totals.unit
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Estimativa de produção"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Setup total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num",
								children: [n2(est.setup), " h"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Operação total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num",
								children: [n2(est.run), " h"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between font-medium",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Horas consolidadas" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num",
								children: [n2(est.hours), " h"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-xs text-muted-foreground",
							children: [
								est.manual,
								" op. manual · ",
								est.parametro,
								" op. por parâmetro ·",
								" ",
								p("horas_dia") || 8,
								" h/dia ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingTag, { children: "provisório" })
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex items-center justify-between rounded-md bg-muted p-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-xs",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
									checked: leadManual,
									onCheckedChange: setLeadManual
								}), "Prazo manual"]
							}), leadManual ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								type: "number",
								step: "0.5",
								className: "h-7 w-20 text-xs num",
								value: leadDays,
								onChange: (e) => setLeadDays(Number(e.target.value))
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "num text-sm font-medium",
								children: [est.days, " dias"]
							})]
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center gap-2 text-base",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4 text-warning" }), "Pendências técnicas"]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "text-sm",
					children: [pend.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-success",
						children: "Nenhuma pendência."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: pend.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: x.severity === "alta" ? "text-destructive" : "text-warning-foreground",
								children: "●"
							}), x.message]
						}, x.field))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Pendências não impedem salvar rascunho."
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-col gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "outline",
						disabled: saving,
						onClick: () => save("rascunho"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, {}), "Salvar rascunho"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						disabled: saving,
						onClick: () => save(initial && initial.status !== "rascunho" ? initial.status : "pendente"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, {}), "Salvar orçamento"]
					})]
				})
			]
		})]
	});
}
function Row({ label, v, strong, big }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `flex justify-between ${strong ? "font-semibold" : ""} ${big ? "text-lg" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num",
			children: brl(v)
		})]
	});
}
function LineCard({ title, total, onAdd, head, children, footer }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "flex flex-row items-center justify-between space-y-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "num text-sm font-medium",
				children: brl(total)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: onAdd,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Adicionar"]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "text-left text-xs uppercase tracking-wide text-muted-foreground",
				children: head.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "p-1.5 font-medium",
					children: h
				}, h))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children })]
		})
	}), footer && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "mt-2 text-xs text-muted-foreground",
		children: footer
	})] })] });
}
//#endregion
export { QuoteForm as t };
