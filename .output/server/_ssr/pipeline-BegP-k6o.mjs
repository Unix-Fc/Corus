import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as useQuotes, h as quoteTotals, i as brl, m as quoteCode, r as STATUS_LABEL } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, s as StatusBadge, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { b as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { v as Info } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pipeline-BegP-k6o.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var COLS = [
	"pendente",
	"em_negociacao",
	"aprovado",
	"reprovado"
];
function Pipeline() {
	const { data: all = [] } = useQuotes();
	const [owner, setOwner] = (0, import_react.useState)("");
	const { data: people = [] } = useQuery({
		queryKey: ["users-min"],
		queryFn: async () => (await supabase.from("profiles").select("id, full_name, email").order("full_name")).data ?? []
	});
	const quotes = owner ? all.filter((q) => q.created_by === owner) : all;
	const { can } = useMe();
	const qc = useQueryClient();
	async function move(id, s) {
		const { error } = await supabase.from("quotes").update({ status: s }).eq("id", id);
		if (error) {
			toast.error(error.message);
			return;
		}
		qc.invalidateQueries({ queryKey: ["quotes"] });
		qc.invalidateQueries({ queryKey: ["audit"] });
	}
	const drafts = quotes.filter((q) => q.status === "rascunho").length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Pipeline",
			subtitle: can.viewAllQuotes ? `${drafts} rascunho(s) fora do pipeline` : "Seus orçamentos — somente leitura",
			actions: can.viewAllQuotes ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
				"aria-label": "Orçamentista",
				className: "h-9 rounded-md border border-input bg-card px-2 text-sm",
				value: owner,
				onChange: (e) => setOwner(e.target.value),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Todos os orçamentistas"
				}), people.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: p.id,
					children: p.full_name ?? p.email
				}, p.id))]
			}) : void 0
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex gap-2 rounded-md border border-warning/40 bg-warning-soft p-3 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Info, { className: "h-4 w-4 shrink-0 text-warning" }), "Estados provisórios (Pendente, Em negociação, Aprovado, Reprovado). As regras de transição ainda dependem de validação de negócio — somente Administradores movem orçamentos, e cada movimento fica registrado na auditoria."]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4 md:grid-cols-2 xl:grid-cols-4",
			children: COLS.map((s) => {
				const items = quotes.filter((q) => q.status === s);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md bg-muted/60 p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold",
							children: [
								STATUS_LABEL[s],
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										"(",
										items.length,
										")"
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "num text-xs",
							children: brl(items.reduce((a, q) => a + quoteTotals(q).total, 0))
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-2",
						children: [items.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
							className: "space-y-2 p-3 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/orcamentos/$id",
									params: { id: q.id },
									className: "num text-xs font-medium text-primary hover:underline",
									children: quoteCode(q.number)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: q.part_name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: q.clients?.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "num font-semibold",
											children: brl(quoteTotals(q).total)
										}),
										can.changeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											"aria-label": "Mover",
											className: "h-7 rounded border border-input bg-card px-1 text-xs",
											value: s,
											onChange: (e) => move(q.id, e.target.value),
											children: Object.entries(STATUS_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: k,
												children: v
											}, k))
										}),
										!can.changeStatus && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: s })
									]
								})
							]
						}) }, q.id)), items.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "py-4 text-center text-xs text-muted-foreground",
							children: "Vazio"
						})]
					})]
				}, s);
			})
		})
	] });
}
//#endregion
export { Pipeline as component };
