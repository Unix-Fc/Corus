import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as dt } from "./data-BR025WEp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-list-w60oRero.js
var import_jsx_runtime = require_jsx_runtime();
var FIELD = {
	status: "Estado",
	total: "Total",
	materials: "Materiais",
	operations: "Operações",
	services: "Serviços",
	specs: "Especificações",
	quantity: "Quantidade",
	part_name: "Peça",
	value: "Valor",
	validated: "Validado",
	adjustments: "Ajustes",
	unit_cost: "Custo unitário",
	active: "Ativo",
	name: "Nome",
	lead_time_days: "Prazo"
};
var ENTITY = {
	quotes: "Orçamento",
	calc_parameters: "Parâmetro",
	catalog_items: "Cadastro",
	clients: "Cliente"
};
function short(v) {
	if (v === null || v === void 0) return "—";
	if (typeof v === "object") return Array.isArray(v) ? `${v.length} itens` : "objeto";
	return String(v);
}
function AuditList({ rows, showEntity }) {
	if (rows.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Sem registros."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
		className: "space-y-3",
		children: rows.map((r) => {
			const ch = r.changes ?? {};
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				className: "border-l-2 border-primary/30 pl-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-baseline gap-x-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-medium capitalize",
							children: r.action
						}),
						showEntity && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted-foreground",
							children: [
								ENTITY[r.entity] ?? r.entity,
								" · ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "num text-xs",
									children: r.entity_id.slice(0, 18)
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-xs text-muted-foreground",
							children: [
								dt(r.created_at),
								" · ",
								r.user_email ?? "sistema / carga inicial"
							]
						})
					]
				}), r.action === "alterado" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-1 text-xs text-muted-foreground",
					children: Object.entries(ch).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-foreground",
							children: FIELD[k] ?? k
						}),
						": ",
						short(v.de),
						" → ",
						short(v.para)
					] }, k))
				})]
			}, r.id);
		})
	});
}
//#endregion
export { AuditList as t };
