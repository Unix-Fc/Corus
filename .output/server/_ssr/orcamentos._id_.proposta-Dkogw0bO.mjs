import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { b as useParams, c as materialCost, h as quoteTotals, i as brl, l as n2, m as quoteCode, p as productionEstimate, u as operationCost, x as useQuote } from "./data-BR025WEp.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { E as ArrowLeft, f as Printer, x as Factory } from "../_libs/lucide-react.mjs";
import { t as Route } from "./orcamentos._id_.proposta-CsnluH4t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamentos._id_.proposta-Dkogw0bO.js
var import_jsx_runtime = require_jsx_runtime();
function Proposal() {
	const { id } = Route.useParams();
	const { data: q } = useQuote(id);
	const { data: params = [] } = useParams();
	if (!q) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Carregando…"
	});
	if (q.status !== "aprovado") return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-muted-foreground",
			children: "A proposta só pode ser impressa após a aprovação do orçamento."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orcamentos/$id",
				params: { id },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Voltar ao orçamento"]
			})
		})]
	});
	const t = quoteTotals(q);
	const est = productionEstimate(q.operations, q.quantity, Number(params.find((p) => p.key === "horas_dia")?.value ?? 8));
	const days = Number(q.lead_time_days ?? est.days);
	const items = [
		...q.materials.map((m) => ({
			g: "Material",
			d: m.description,
			qtd: `${n2(m.qty)} ${m.unit}`,
			v: materialCost(m)
		})),
		...q.operations.map((o) => ({
			g: "Usinagem / processo",
			d: o.description,
			qtd: `${n2(o.setup_h + o.time_min / 60 * q.quantity)} h`,
			v: operationCost(o, q.quantity)
		})),
		...q.services.map((m) => ({
			g: "Serviço externo",
			d: m.description,
			qtd: `${n2(m.qty)} ${m.unit}`,
			v: materialCost(m)
		}))
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "no-print mb-4 flex justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "ghost",
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orcamentos/$id",
				params: { id },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, {}), "Voltar"]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: () => window.print(),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, {}), "Imprimir / PDF"]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl rounded-md border bg-card p-8 shadow-sm print:border-0 print:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between border-b-2 border-primary pb-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Factory, { className: "h-7 w-7 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-lg font-bold tracking-widest text-primary",
						children: "CORUS"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: "Equipamentos Industriais"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "text-right text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-semibold",
						children: ["Proposta ", quoteCode(q.number)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-muted-foreground",
						children: (/* @__PURE__ */ new Date()).toLocaleDateString("pt-BR")
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 text-sm sm:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Cliente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: q.clients?.name ?? "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Projeto"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: q.project || "—"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Peça"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium",
						children: [
							q.part_name,
							" ",
							q.part_code && `(${q.part_code})`
						]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Quantidade"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "font-medium num",
						children: [q.quantity, " peça(s)"]
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Desenho / tolerância"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						q.specs.desenho || "—",
						" · ",
						q.specs.tolerancia || "—"
					] })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs uppercase text-muted-foreground",
						children: "Tratamento térmico"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: q.specs.tratamento_termico_aplicavel ? q.specs.tratamento_termico || "A definir" : "Não aplicável" })] })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "mt-6 w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b text-left text-xs uppercase text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "Item"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Grupo" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Qtd"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Valor"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: items.map((i, k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "py-2",
							children: i.d
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-muted-foreground",
							children: i.g
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right num",
							children: i.qtd
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-right num",
							children: brl(i.v)
						})
					]
				}, k)) })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "ml-auto mt-4 w-full max-w-xs space-y-1 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: brl(t.subtotal)
						})]
					}),
					t.perda + t.margem + t.imposto > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Ajustes" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: brl(t.perda + t.margem + t.imposto)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between border-t-2 border-primary pt-2 text-base font-semibold",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Valor total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: brl(t.total)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex justify-between text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Valor unitário" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num",
							children: brl(t.unit)
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 rounded-md bg-muted p-4 text-sm sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase text-muted-foreground",
					children: "Tempo de produção estimado"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium num",
					children: [
						n2(est.hours),
						" h (setup ",
						n2(est.setup),
						" h + operação",
						" ",
						n2(est.run),
						" h)"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs uppercase text-muted-foreground",
					children: "Prazo estimado"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "font-medium num",
					children: [n2(days), " dias úteis"]
				})] })]
			}),
			q.notes && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: "Observações:"
					}),
					" ",
					q.notes
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-8 text-xs text-muted-foreground",
				children: "Documento gerado pelo sistema de orçamentos Corus (MVP). Condições comerciais, impostos e margens sujeitos a validação."
			})
		]
	})] });
}
//#endregion
export { Proposal as component };
