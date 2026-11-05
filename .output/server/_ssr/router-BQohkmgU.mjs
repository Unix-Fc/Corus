import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { S as useRouter, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, q as redirect, v as createFileRoute, y as createRootRouteWithContext } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { t as Route$14 } from "./orcamentos._id-DqWs5xmN.mjs";
import { t as Route$15 } from "./orcamentos._id_.editar-For7gBXQ.mjs";
import { t as Route$16 } from "./orcamentos._id_.proposta-CsnluH4t.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-BQohkmgU.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-BSWZKgpl.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
	const stack = error instanceof Error ? error.stack : void 0;
	window.__lovableReportRuntimeError?.({
		message: describeThrown(error),
		...stack !== void 0 && { stack },
		filename: window.location.pathname
	});
}
var MAX_SERIALIZED_LENGTH = 2e3;
function describeThrown(error) {
	if (error instanceof Response) return `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`;
	if (error instanceof Error) return error.message;
	if (typeof error === "string") return error;
	const { message } = error ?? {};
	if (typeof message === "string" && message.length > 0) return message;
	try {
		return JSON.stringify(error)?.slice(0, MAX_SERIALIZED_LENGTH) ?? String(error);
	} catch {
		return String(error);
	}
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Página não encontrada"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "A página procurada não existe ou foi movida."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Voltar ao início"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "Esta página não carregou"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Algo deu errado. Tente novamente ou volte ao início."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Tentar novamente"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-accent",
						children: "Início"
					})]
				})
			]
		})
	});
}
var Route$13 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Corus — Controle de Orçamentos Industriais" },
			{
				name: "description",
				content: "Sistema de cálculo e controle de orçamentos da Corus Equipamentos Industriais."
			},
			{
				property: "og:title",
				content: "Corus — Controle de Orçamentos Industriais"
			},
			{
				property: "og:description",
				content: "Sistema de cálculo e controle de orçamentos da Corus Equipamentos Industriais."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=IBM+Plex+Sans:wght@400;500;600;700&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "pt-BR",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$13.useRouteContext();
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		const { data } = supabase.auth.onAuthStateChange((event) => {
			if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
			router.invalidate();
			if (event !== "SIGNED_OUT") queryClient.invalidateQueries();
		});
		return () => data.subscription.unsubscribe();
	}, [router, queryClient]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
			richColors: true,
			position: "top-right"
		})]
	});
}
var Route$12 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Corus — Controle de Orçamentos Industriais" },
		{
			name: "description",
			content: "Acesse o sistema de orçamentos industriais da Corus Equipamentos."
		},
		{
			property: "og:title",
			content: "Corus — Controle de Orçamentos Industriais"
		},
		{
			property: "og:description",
			content: "Acesse o sistema de orçamentos industriais da Corus Equipamentos."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	beforeLoad: () => {
		throw redirect({ to: "/dashboard" });
	}
});
var $$splitComponentImporter$11 = () => import("./route-BkdAxsiR.mjs");
var Route$11 = createFileRoute("/_authenticated")({
	ssr: false,
	beforeLoad: async () => {
		const { data } = await supabase.auth.getUser();
		if (!data.user) throw redirect({ to: "/auth" });
		const { data: profile, error } = await supabase.from("profiles").select("access_enabled").eq("id", data.user.id).maybeSingle();
		if (error) throw error;
		if (!profile?.access_enabled) {
			const { error: signOutError } = await supabase.auth.signOut();
			if (signOutError) throw signOutError;
			throw redirect({ to: "/auth" });
		}
	},
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./auth-Du3B92vA.mjs");
var Route$10 = createFileRoute("/auth")({
	head: () => ({ meta: [
		{ title: "Entrar — Corus Orçamentos" },
		{
			name: "description",
			content: "Acesso ao sistema de orçamentos da Corus Equipamentos Industriais."
		},
		{
			property: "og:title",
			content: "Entrar — Corus Orçamentos"
		},
		{
			property: "og:description",
			content: "Acesso ao sistema de orçamentos da Corus Equipamentos Industriais."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
async function requireAdminRoute() {
	const { data: { user }, error: userError } = await supabase.auth.getUser();
	if (userError) throw userError;
	if (!user) throw redirect({ to: "/auth" });
	const { data: isAdmin, error } = await supabase.rpc("has_role", {
		_user_id: user.id,
		_role: "admin"
	});
	if (error) throw error;
	if (!isAdmin) throw redirect({ to: "/dashboard" });
}
var $$splitComponentImporter$9 = () => import("./auditoria-B9OnPZXD.mjs");
var Route$9 = createFileRoute("/_authenticated/auditoria")({
	beforeLoad: requireAdminRoute,
	head: () => ({ meta: [{ title: "Auditoria — Corus" }, {
		name: "description",
		content: "Histórico de alterações de orçamentos, cadastros e parâmetros."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./cadastros-4IsNwcnt.mjs");
var Route$8 = createFileRoute("/_authenticated/cadastros")({
	beforeLoad: requireAdminRoute,
	head: () => ({ meta: [{ title: "Cadastros — Corus" }, {
		name: "description",
		content: "Clientes, materiais, máquinas, ferramentas, cargos e serviços."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./dashboard-DHq8JYN4.mjs");
var Route$7 = createFileRoute("/_authenticated/dashboard")({
	head: () => ({ meta: [{ title: "Dashboard — Corus Orçamentos" }, {
		name: "description",
		content: "Indicadores de orçamentos, custos e pipeline."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./descoberta-DWwhypsp.mjs");
var Route$6 = createFileRoute("/_authenticated/descoberta")({
	head: () => ({ meta: [{ title: "Em descoberta — Corus" }, {
		name: "description",
		content: "Capacidades ainda em descoberta, não implementadas."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./parametros-DYdAcBn4.mjs");
var Route$5 = createFileRoute("/_authenticated/parametros")({
	beforeLoad: requireAdminRoute,
	head: () => ({ meta: [{ title: "Parâmetros de cálculo — Corus" }, {
		name: "description",
		content: "Parâmetros configuráveis de perda, margem, impostos e jornada."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./pendencias-DBX4iL1J.mjs");
var Route$4 = createFileRoute("/_authenticated/pendencias")({
	head: () => ({ meta: [{ title: "Pendências técnicas — Corus" }, {
		name: "description",
		content: "Ausências técnicas nos orçamentos."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./pipeline-BegP-k6o.mjs");
var Route$3 = createFileRoute("/_authenticated/pipeline")({
	head: () => ({ meta: [{ title: "Pipeline — Corus" }, {
		name: "description",
		content: "Painel de pipeline de orçamentos."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./usuarios-CV-03cTg.mjs");
var Route$2 = createFileRoute("/_authenticated/usuarios")({
	beforeLoad: requireAdminRoute,
	head: () => ({ meta: [{ title: "Usuários e perfis — Corus" }, {
		name: "description",
		content: "Perfis de acesso e permissões."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./orcamentos.index-DepKeIoq.mjs");
var Route$1 = createFileRoute("/_authenticated/orcamentos/")({
	head: () => ({ meta: [{ title: "Orçamentos — Corus" }, {
		name: "description",
		content: "Histórico e busca de orçamentos."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./orcamentos.novo-BKellWbl.mjs");
var Route = createFileRoute("/_authenticated/orcamentos/novo")({
	head: () => ({ meta: [{ title: "Novo orçamento — Corus" }, {
		name: "description",
		content: "Criar orçamento industrial."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$12.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$13
});
var AuthenticatedRouteRoute = Route$11.update({
	id: "/_authenticated",
	getParentRoute: () => Route$13
});
var AuthRoute = Route$10.update({
	id: "/auth",
	path: "/auth",
	getParentRoute: () => Route$13
});
var AuthenticatedAuditoriaRoute = Route$9.update({
	id: "/auditoria",
	path: "/auditoria",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedCadastrosRoute = Route$8.update({
	id: "/cadastros",
	path: "/cadastros",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDashboardRoute = Route$7.update({
	id: "/dashboard",
	path: "/dashboard",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedDescobertaRoute = Route$6.update({
	id: "/descoberta",
	path: "/descoberta",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedParametrosRoute = Route$5.update({
	id: "/parametros",
	path: "/parametros",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPendenciasRoute = Route$4.update({
	id: "/pendencias",
	path: "/pendencias",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedPipelineRoute = Route$3.update({
	id: "/pipeline",
	path: "/pipeline",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedUsuariosRoute = Route$2.update({
	id: "/usuarios",
	path: "/usuarios",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedOrcamentosIndexRoute = Route$1.update({
	id: "/orcamentos/",
	path: "/orcamentos/",
	getParentRoute: () => AuthenticatedRouteRoute
});
var AuthenticatedRouteRouteChildren = {
	AuthenticatedAuditoriaRoute,
	AuthenticatedCadastrosRoute,
	AuthenticatedDashboardRoute,
	AuthenticatedDescobertaRoute,
	AuthenticatedParametrosRoute,
	AuthenticatedPendenciasRoute,
	AuthenticatedPipelineRoute,
	AuthenticatedUsuariosRoute,
	AuthenticatedOrcamentosIdRoute: Route$14.update({
		id: "/orcamentos/$id",
		path: "/orcamentos/$id",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedOrcamentosNovoRoute: Route.update({
		id: "/orcamentos/novo",
		path: "/orcamentos/novo",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedOrcamentosIndexRoute,
	AuthenticatedOrcamentosIdEditarRoute: Route$15.update({
		id: "/orcamentos/$id_/editar",
		path: "/orcamentos/$id/editar",
		getParentRoute: () => AuthenticatedRouteRoute
	}),
	AuthenticatedOrcamentosIdPropostaRoute: Route$16.update({
		id: "/orcamentos/$id_/proposta",
		path: "/orcamentos/$id/proposta",
		getParentRoute: () => AuthenticatedRouteRoute
	})
};
var rootRouteChildren = {
	IndexRoute,
	AuthenticatedRouteRoute: AuthenticatedRouteRoute._addFileChildren(AuthenticatedRouteRouteChildren),
	AuthRoute
};
var routeTree = Route$13._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
