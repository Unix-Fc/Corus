import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { m as quoteCode, x as useQuote } from "./data-BR025WEp.mjs";
import { a as PageHeader } from "./status-badge-CqsfqU9D.mjs";
import { t as Route } from "./orcamentos._id_.editar-For7gBXQ.mjs";
import { t as QuoteForm } from "./quote-form-BZEnvOAN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamentos._id_.editar-BQTldcKz.js
var import_jsx_runtime = require_jsx_runtime();
function Edit() {
	const { id } = Route.useParams();
	const { data, isLoading } = useQuote(id);
	if (isLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted-foreground",
		children: "Carregando…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
		title: `Editar ${quoteCode(data.number)}`,
		subtitle: data.part_name
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QuoteForm, { initial: data })] });
}
//#endregion
export { Edit as component };
