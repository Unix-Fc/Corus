import { t as supabase } from "./client-BAK4cUwb.mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { _ as useAudit, b as useParams, c as materialCost, d as operationHourlyCost, f as operationHours, g as technicalPendencies, h as quoteTotals, i as brl, l as n2, m as quoteCode, p as productionEstimate, r as STATUS_LABEL, s as hourlyCostFromMonthlySalary, u as operationCost, v as useCatalog, x as useQuote } from "./data-BR025WEp.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, o as PendingTag, r as CardHeader, s as StatusBadge, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as AuditList } from "./audit-list-w60oRero.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as Printer, i as TriangleAlert, m as Pencil, v as Info } from "../_libs/lucide-react.mjs";
import { t as Route } from "./orcamentos._id-DqWs5xmN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamentos._id-pHKHcLbW.js
var import_jsx_runtime = require_jsx_runtime();
function Detail() {
	const { id } = Route.useParams();
	const { data: q, isLoading } = useQuote(id);
	const { data: catalog = [] } = useCatalog();
	const { data: params = [] } = useParams();
	const { data: audit = [] } = useAudit({
		entity: "quotes",
		entityId: id
	});
	const { can } = useMe();
	const qc = useQueryClient();
	if (isLoading || !q) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Carregando…"
	});
	const t = quoteTotals(q);
	const hpd = Number(params.find((p) => p.key === "horas_dia")?.value ?? 8);
	const est = productionEstimate(q.operations, q.quantity, hpd);
	const pend = technicalPendencies(q.specs, {
		materials: q.materials.length,
		operations: q.operations.length
	});
	const name = (cid) => catalog.find((c) => c.id === cid)?.name ?? "—";
	async function setStatus(s) {
		const { error } = await supabase.from("quotes").update({ status: s }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success(`Estado alterado para ${STATUS_LABEL[s]}`);
		qc.invalidateQueries({ queryKey: ["quotes"] });
		qc.invalidateQueries({ queryKey: ["audit"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: `${quoteCode(q.number)} · ${q.part_name}`,
		subtitle: `${q.clients?.name ?? "Sem cliente"} · ${q.project ?? ""}`,
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [can.editQuotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orcamentos/$id/editar",
				params: { id },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {}), "Editar"]
			})
		}), q.status === "aprovado" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orcamentos/$id/proposta",
				params: { id },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Proposta"]
			})
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			disabled: true,
			title: "A proposta só pode ser impressa após a aprovação",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Proposta após aprovação"]
		})] })
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-6 lg:grid-cols-[1fr_320px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-6",
			children: [
				pend.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-3 rounded-md border border-warning/40 bg-warning-soft p-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-5 w-5 shrink-0 text-warning" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: "Pendências técnicas"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "list-disc pl-4",
						children: pend.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: p.message }, p.field))
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Especificações"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "grid gap-3 text-sm sm:grid-cols-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Código",
							v: q.part_code
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Quantidade",
							v: String(q.quantity)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Desenho",
							v: q.specs.desenho
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Tolerância",
							v: q.specs.tolerancia
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Acabamento",
							v: q.specs.acabamento
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Spec, {
							l: "Tratamento térmico",
							v: q.specs.tratamento_termico_aplicavel ? q.specs.tratamento_termico || "Aplicável — não especificado" : "Não aplicável"
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					title: "Materiais",
					head: [
						"Material",
						"Qtd",
						"Custo unit.",
						"Subtotal"
					],
					rows: q.materials.map((m) => [
						m.description,
						`${n2(m.qty)} ${m.unit}`,
						brl(m.unit_cost),
						brl(materialCost(m))
					]),
					total: t.materials
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					title: "Operações internas",
					head: [
						"Operação",
						"Máquina",
						"Ferramenta",
						"Salário mensal",
						"Custo-hora máquina",
						"Custo-hora salário",
						"Custo-hora total",
						"Setup",
						"Tempo/pç",
						"Horas",
						"Origem",
						"Subtotal"
					],
					rows: q.operations.map((o) => [
						o.description,
						name(o.machine_id),
						name(o.tool_id),
						o.salary_monthly == null ? "—" : brl(o.salary_monthly),
						brl(o.cost_hour),
						o.cargo_id && o.salary_monthly != null ? brl(hourlyCostFromMonthlySalary(o.salary_monthly)) : "—",
						brl(operationHourlyCost(o)),
						`${n2(o.setup_h)} h`,
						`${n2(o.time_min)} min`,
						`${n2(operationHours(o, q.quantity))} h`,
						o.time_source === "manual" ? "Manual" : "Parâmetro",
						brl(operationCost(o, q.quantity))
					]),
					total: t.operations
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Table, {
					title: "Serviços externos / tratamentos",
					head: [
						"Serviço",
						"Qtd",
						"Custo unit.",
						"Subtotal"
					],
					rows: q.services.map((m) => [
						m.description,
						`${n2(m.qty)} ${m.unit}`,
						brl(m.unit_cost),
						brl(materialCost(m))
					]),
					total: t.services
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Histórico de alterações"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditList, { rows: audit }) })] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, {
						className: "flex items-center justify-between text-base",
						children: ["Estado ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: q.status })]
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-2",
					children: [can.changeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						className: "h-9 w-full rounded-md border border-input bg-card px-2 text-sm",
						value: q.status,
						onChange: (e) => setStatus(e.target.value),
						children: Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "flex gap-1.5 text-xs text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-3.5 w-3.5 shrink-0" }), "Estados provisórios: transições ainda dependem de validação de negócio."]
					})]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Totais"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Materiais",
							v: brl(t.materials)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Operações",
							v: brl(t.operations)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Serviços",
							v: brl(t.services)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t pt-1.5 font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
								l: "Subtotal",
								v: brl(t.subtotal)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs",
								children: "Ajustes"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingTag, {})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: `Perda (${q.adjustments.perda_material_pct ?? 0}%)`,
							v: brl(t.perda)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: `Margem (${q.adjustments.margem_pct ?? 0}%)`,
							v: brl(t.margem)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: `Impostos (${q.adjustments.imposto_pct ?? 0}%)`,
							v: brl(t.imposto)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "border-t pt-2 text-lg font-semibold",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
								l: "Total",
								v: brl(t.total)
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Unitário",
							v: brl(t.unit)
						})
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-base",
						children: "Produção"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "space-y-1.5 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Setup",
							v: `${n2(est.setup)} h`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Operação",
							v: `${n2(est.run)} h`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Total",
							v: `${n2(est.hours)} h`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(L, {
							l: "Prazo",
							v: `${n2(Number(q.lead_time_days ?? est.days))} dias`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								q.lead_time_manual ? "Prazo informado manualmente." : `Prazo baseado em parâmetro (${hpd} h/dia).`,
								" ",
								est.manual,
								" op. com tempo manual, ",
								est.parametro,
								" por parâmetro."
							]
						})
					]
				})] })
			]
		})]
	})] });
}
var L = ({ l, v }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
	className: "flex justify-between",
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: l }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "num",
		children: v
	})]
});
var Spec = ({ l, v }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "text-xs uppercase tracking-wide text-muted-foreground",
	children: l
}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: v ? "" : "text-warning-foreground italic",
	children: v || "Não informado"
})] });
function Table({ title, head, rows, total }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
		className: "flex flex-row items-center justify-between space-y-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-base",
			children: title
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "num text-sm font-medium",
			children: brl(total)
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "overflow-x-auto",
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhum item."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "text-left text-xs uppercase text-muted-foreground",
				children: head.map((h, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: `py-1.5 pr-3 font-medium ${i > 0 ? "whitespace-nowrap" : ""}`,
					children: h
				}, h))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
				className: "border-t",
				children: r.map((c, j) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `py-2 pr-3 ${j > 0 ? "num whitespace-nowrap" : ""} ${j === r.length - 1 ? "text-right" : ""}`,
					children: c
				}, j))
			}, i)) })]
		})
	})] });
}
//#endregion
export { Detail as component };
