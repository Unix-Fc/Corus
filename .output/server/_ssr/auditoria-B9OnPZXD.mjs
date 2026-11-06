import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as useAudit } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as AuditList } from "./audit-list-w60oRero.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/auditoria-B9OnPZXD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Audit() {
	const { can, isLoading } = useMe();
	const [entity, setEntity] = (0, import_react.useState)("");
	const { data = [] } = useAudit(entity ? { entity } : void 0);
	if (isLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Carregando…"
	});
	if (!can.viewAudit) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Acesso restrito",
		subtitle: "Somente Administradores podem ver a auditoria."
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Auditoria",
		subtitle: "Registros automáticos das últimas 200 alterações relevantes",
		actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
			className: "h-9 rounded-md border border-input bg-card px-2 text-sm",
			value: entity,
			onChange: (e) => setEntity(e.target.value),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "",
					children: "Todas as entidades"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "quotes",
					children: "Orçamentos"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "calc_parameters",
					children: "Parâmetros"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "catalog_items",
					children: "Cadastros"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
					value: "clients",
					children: "Clientes"
				})
			]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
		className: "p-5",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditList, {
			rows: data,
			showEntity: true
		})
	}) })] });
}
//#endregion
export { Audit as component };
