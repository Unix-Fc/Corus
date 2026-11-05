import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as useQuotes, g as technicalPendencies, h as quoteTotals, i as brl, m as quoteCode, o as dt, r as STATUS_LABEL } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, s as StatusBadge, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as TriangleAlert, p as Plus, u as Search } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamentos.index-DepKeIoq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function List() {
	const { data: quotes = [], isLoading } = useQuotes();
	const { can } = useMe();
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("");
	const term = q.toLowerCase();
	const rows = quotes.filter((x) => (!status || x.status === status) && (!term || [
		quoteCode(x.number),
		x.part_name,
		x.part_code,
		x.project,
		x.clients?.name
	].some((v) => v?.toLowerCase().includes(term))));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Orçamentos",
		subtitle: "Histórico completo, busca e filtros",
		actions: can.editQuotes && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/orcamentos/novo",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Novo orçamento"]
			})
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex flex-col gap-2 sm:flex-row",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "pl-8",
					placeholder: "Buscar por nº, cliente, peça, código ou projeto",
					value: q,
					onChange: (e) => setQ(e.target.value)
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				className: "h-9 rounded-md border border-input bg-card px-2 text-sm",
				value: status,
				onChange: (e) => setStatus(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Todos os estados"
				}), Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: k,
					children: v
				}, k))]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "w-full text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "border-b text-left text-xs uppercase text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "py-2",
							children: "Nº"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cliente" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Projeto / Peça" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Qtd"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Estado" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Atualizado" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "text-right",
							children: "Total"
						})
					]
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
					isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "py-6 text-center text-muted-foreground",
						children: "Carregando…"
					}) }),
					!isLoading && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						colSpan: 7,
						className: "py-6 text-center text-muted-foreground",
						children: "Nenhum orçamento encontrado."
					}) }),
					rows.map((x) => {
						const pend = technicalPendencies(x.specs, {
							materials: x.materials.length,
							operations: x.operations.length
						});
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b last:border-0 hover:bg-muted/50",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 num",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/orcamentos/$id",
										params: { id: x.id },
										className: "font-medium text-primary hover:underline",
										children: quoteCode(x.number)
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: x.clients?.name ?? "—" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "font-medium",
									children: [
										x.part_name,
										" ",
										pend.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
											className: "inline h-3.5 w-3.5 text-warning",
											"aria-label": "Pendências técnicas"
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "text-xs text-muted-foreground",
									children: [
										x.project,
										" ",
										x.part_code && `· ${x.part_code}`
									]
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-right num",
									children: x.quantity
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: x.status }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-xs text-muted-foreground",
									children: dt(x.updated_at)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "text-right num font-medium",
									children: brl(quoteTotals(x).total)
								})
							]
						}, x.id);
					})
				] })]
			})
		})]
	}) })] });
}
//#endregion
export { List as component };
