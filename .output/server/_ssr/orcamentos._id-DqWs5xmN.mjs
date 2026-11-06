import { _ as lazyRouteComponent, v as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orcamentos._id-DqWs5xmN.js
var $$splitComponentImporter = () => import("./orcamentos._id-pHKHcLbW.mjs");
var Route = createFileRoute("/_authenticated/orcamentos/$id")({
	head: () => ({ meta: [{ title: "Orçamento — Corus" }, {
		name: "description",
		content: "Detalhe do orçamento."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
