import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as PageHeader, n as CardContent, o as PendingTag, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { C as Compass } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/descoberta-DWwhypsp.js
var import_jsx_runtime = require_jsx_runtime();
var items = [
	{
		t: "Integração com ERP",
		d: "Sincronização de clientes, materiais, custos e pedidos aprovados. Sistema, escopo e direção dos dados a definir."
	},
	{
		t: "Acompanhamento de produção / PCP",
		d: "Converter orçamento aprovado em ordem de produção e comparar tempos orçados × realizados."
	},
	{
		t: "Fórmulas definitivas de cálculo",
		d: "Perdas de material, margem, impostos por regime tributário e rateio de custos indiretos. Hoje são percentuais configuráveis e não validados."
	},
	{
		t: "Regras de transição de estados",
		d: "Quem pode aprovar/reprovar, alçadas de desconto e validade da proposta."
	},
	{
		t: "Envio de proposta por e-mail",
		d: "Hoje a proposta é pré-visualizada e impressa/salva em PDF pelo navegador."
	}
];
function Disc() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: "Em descoberta",
		subtitle: "Itens mapeados que ainda não são capacidades implementadas neste MVP."
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 md:grid-cols-2",
		children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "border-dashed",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 font-medium",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "h-4 w-4 text-primary" }), i.t]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PendingTag, { children: "Em descoberta" })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: i.d
				})]
			})
		}, i.t))
	})] });
}
//#endregion
export { Disc as component };
