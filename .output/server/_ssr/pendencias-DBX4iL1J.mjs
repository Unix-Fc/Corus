import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as useQuotes, g as technicalPendencies, m as quoteCode } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, s as StatusBadge, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pendencias-DBX4iL1J.js
var import_jsx_runtime = require_jsx_runtime();
function Pend() {
	const { data: quotes = [] } = useQuotes();
	const rows = quotes.map((q) => ({
		q,
		p: technicalPendencies(q.specs, {
			materials: q.materials.length,
			operations: q.operations.length
		})
	})).filter((r) => r.p.length > 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Pendências técnicas",
		subtitle: "Desenho, tolerância, tratamento térmico e itens ausentes. Não bloqueiam rascunhos."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "overflow-x-auto p-4",
		children: rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Nenhuma pendência técnica."
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b text-left text-xs uppercase text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "py-2",
						children: "Orçamento"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Peça / Cliente" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Estado" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Pendências" })
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map(({ q, p }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b align-top last:border-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
						className: "py-2.5 num",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/orcamentos/$id/editar",
							params: { id: q.id },
							className: "text-primary hover:underline",
							children: quoteCode(q.number)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-medium",
						children: q.part_name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-xs text-muted-foreground",
						children: q.clients?.name
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: q.status }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-0.5",
						children: p.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "flex gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: x.severity === "alta" ? "text-destructive" : "text-warning",
								children: "●"
							}), x.message]
						}, x.field))
					}) })
				]
			}, q.id)) })]
		})
	}) })] });
}
//#endregion
export { Pend as component };
