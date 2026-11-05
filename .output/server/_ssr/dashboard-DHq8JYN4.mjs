import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as useQuotes, g as technicalPendencies, h as quoteTotals, i as brl, m as quoteCode, r as STATUS_LABEL } from "./data-BR025WEp.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, r as CardHeader, s as StatusBadge, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as TrendingUp, b as FileText, i as TriangleAlert, n as Wallet, p as Plus } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard-DHq8JYN4.js
var import_jsx_runtime = require_jsx_runtime();
var ORDER = [
	"rascunho",
	"pendente",
	"em_negociacao",
	"aprovado",
	"reprovado"
];
function Dashboard() {
	const { data: quotes = [], isLoading } = useQuotes();
	const rows = quotes.map((q) => ({
		q,
		t: quoteTotals(q),
		p: technicalPendencies(q.specs, {
			materials: q.materials.length,
			operations: q.operations.length
		})
	}));
	const open = rows.filter((r) => r.q.status === "pendente" || r.q.status === "em_negociacao");
	const approved = rows.filter((r) => r.q.status === "aprovado");
	const decided = rows.filter((r) => r.q.status === "aprovado" || r.q.status === "reprovado").length;
	const withPend = rows.filter((r) => r.p.length > 0);
	const sum = (a, k) => a.reduce((s, r) => s + r.t[k], 0);
	const maxPipe = Math.max(1, ...ORDER.map((s) => sum(rows.filter((r) => r.q.status === s), "total")));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Dashboard",
			subtitle: "Visão geral dos orçamentos industriais",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/orcamentos/novo",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Novo orçamento"]
				})
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: FileText,
					label: "Orçamentos",
					value: String(quotes.length),
					hint: `${open.length} em aberto`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: TrendingUp,
					label: "Pipeline em aberto",
					value: brl(sum(open, "total")),
					hint: "Pendente + Em negociação"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: Wallet,
					label: "Aprovado",
					value: brl(sum(approved, "total")),
					hint: decided ? `Taxa: ${Math.round(approved.length / decided * 100)}% dos decididos` : "—"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Kpi, {
					icon: TriangleAlert,
					label: "Pendências técnicas",
					value: String(withPend.length),
					hint: "orçamentos com ausências",
					warn: withPend.length > 0
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Pipeline por estado"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: ORDER.map((s) => {
					const r = rows.filter((x) => x.q.status === s);
					const v = sum(r, "total");
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							STATUS_LABEL[s],
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-muted-foreground",
								children: [
									"(",
									r.length,
									")"
								]
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: brl(v)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-sm bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-sm bg-primary",
							style: { width: `${v / maxPipe * 100}%` }
						})
					})] }, s);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Composição de custos (todos os orçamentos)"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: [
					"materials",
					"operations",
					"services"
				].map((k, i) => {
					const tot = sum(rows, "materials") + sum(rows, "operations") + sum(rows, "services") || 1;
					const v = sum(rows, k);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1 flex justify-between text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: [
							"Materiais",
							"Operações internas",
							"Serviços externos"
						][i] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "num",
							children: [
								brl(v),
								" · ",
								Math.round(v / tot * 100),
								"%"
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "h-2 rounded-sm bg-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "h-2 rounded-sm",
							style: {
								width: `${v / tot * 100}%`,
								background: `var(--chart-${i + 1})`
							}
						})
					})] }, k);
				})
			})] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex flex-row items-center justify-between space-y-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "Orçamentos recentes"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "link",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/orcamentos",
						children: "Ver todos"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "overflow-x-auto",
				children: isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Carregando…"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "text-left text-xs uppercase text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Nº"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cliente" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Peça" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Estado" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "text-right",
								children: "Total"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.slice(0, 6).map(({ q, t, p }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t hover:bg-muted/50",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-2 num",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/orcamentos/$id",
									params: { id: q.id },
									className: "text-primary hover:underline",
									children: quoteCode(q.number)
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: q.clients?.name ?? "—" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [
								q.part_name,
								" ",
								p.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "inline h-3.5 w-3.5 text-warning" })
							] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: q.status }) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right num",
								children: brl(t.total)
							})
						]
					}, q.id)) })]
				})
			})]
		})
	] });
}
function Kpi({ icon: Icon, label, value, hint, warn }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between text-xs font-medium uppercase tracking-wide text-muted-foreground",
				children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `h-4 w-4 ${warn ? "text-warning" : "text-primary"}` })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-2 text-2xl font-semibold num",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-1 text-xs text-muted-foreground",
				children: hint
			})
		]
	}) });
}
//#endregion
export { Dashboard as component };
