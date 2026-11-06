import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { _ as useAudit, b as useParams } from "./data-BR025WEp.mjs";
import { a as PageHeader, i as CardTitle, n as CardContent, o as PendingTag, r as CardHeader, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as AuditList } from "./audit-list-w60oRero.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/parametros-DYdAcBn4.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Params() {
	const { data = [] } = useParams();
	const { data: audit = [] } = useAudit({ entity: "calc_parameters" });
	const { can } = useMe();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Parâmetros de cálculo",
			subtitle: "Valores padrão aplicados a novos orçamentos. Fórmulas definitivas ainda em descoberta."
		}),
		!can.editParams && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-4 text-sm text-muted-foreground",
			children: "Somente Administradores podem alterar parâmetros."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-6 lg:grid-cols-[1fr_380px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: data.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParamRow, {
					p,
					editable: can.editParams
				}, p.key))
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "Histórico de parâmetros"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditList, { rows: audit }) })] })]
		})
	] });
}
function ParamRow({ p, editable }) {
	const [v, setV] = (0, import_react.useState)(Number(p.value));
	const [validated, setValidated] = (0, import_react.useState)(p.validated);
	const qc = useQueryClient();
	async function save() {
		const { error } = await supabase.from("calc_parameters").update({
			value: v,
			validated
		}).eq("key", p.key);
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Parâmetro atualizado");
		qc.invalidateQueries({ queryKey: ["params"] });
		qc.invalidateQueries({ queryKey: ["audit"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
		className: "flex flex-col gap-3 p-4 sm:flex-row sm:items-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 font-medium",
				children: [
					p.label,
					" ",
					!p.validated && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingTag, {})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "text-xs text-muted-foreground",
				children: p.note
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.01",
					disabled: !editable,
					className: "w-24 num",
					value: v,
					onChange: (e) => setV(Number(e.target.value))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-4 text-sm text-muted-foreground",
					children: p.unit
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-1.5 text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
						disabled: !editable,
						checked: validated,
						onCheckedChange: setValidated
					}), "Validado"]
				}),
				editable && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					onClick: save,
					children: "Salvar"
				})
			]
		})]
	}) });
}
//#endregion
export { Params as component };
