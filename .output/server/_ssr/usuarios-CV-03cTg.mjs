import { n as __toESM } from "../_runtime.mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient, t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as ROLE_LABEL } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { G as isRedirect, S as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { T as Ban, o as Trash2, p as Plus, w as Check } from "../_libs/lucide-react.mjs";
import { a as TSS_SERVER_FUNCTION, l as createServerFn } from "./createServerFn-BhqelEmK.mjs";
import { t as getServerFnById } from "../__23tanstack-start-server-fn-resolver-ClhAtuYr.mjs";
import { t as requireSupabaseAuth } from "./auth-middleware-CMevzYJH.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usuarios-CV-03cTg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function useServerFn(serverFn) {
	const router = useRouter();
	return import_react.useCallback(async (...args) => {
		try {
			const res = await serverFn(...args);
			if (isRedirect(res)) throw res;
			return res;
		} catch (err) {
			if (isRedirect(err)) {
				err.options._fromLocation = router.stores.location.get();
				return router.navigate(router.resolveRedirect(err).options);
			}
			throw err;
		}
	}, [router, serverFn]);
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var createUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!data || typeof data.email !== "string" || typeof data.fullName !== "string" || typeof data.password !== "string") throw new Error("Preencha e-mail, nome e senha");
	const email = data.email.trim().toLowerCase();
	const fullName = data.fullName.trim();
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Informe um e-mail válido");
	if (!fullName || fullName.length > 200) throw new Error("Informe um nome válido");
	if (data.password.length < 6 || data.password.length > 72) throw new Error("A senha deve ter entre 6 e 72 caracteres");
	return {
		email,
		fullName,
		password: data.password
	};
}).handler(createSsrRpc("39d053ca3c166648240f19533479adb240c32f2d28b6e9dda4814e0fad8105f2"));
var setUserAccess = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((data) => {
	if (!data || typeof data.userId !== "string" || !/^[0-9a-f-]{36}$/i.test(data.userId) || typeof data.enabled !== "boolean") throw new Error("Dados de acesso inválidos");
	return data;
}).handler(createSsrRpc("a4b99db0cc5f4fb08268b4df8bc79f361bad428bad067de2b9227b0dcdb1ce39"));
var deleteUser = createServerFn({ method: "POST" }).middleware([requireSupabaseAuth]).inputValidator((d) => {
	if (!d || typeof d.userId !== "string" || !/^[0-9a-f-]{36}$/i.test(d.userId)) throw new Error("Usuário inválido");
	return d;
}).handler(createSsrRpc("1b36e79fb17473cbea5838cc48bfefe7de129ef1bef3a743aa78716aa93765db"));
var ROLES = ["admin", "orcamentista"];
function Users() {
	const { can, me } = useMe();
	const create = useServerFn(createUser);
	const del = useServerFn(deleteUser);
	const setAccess = useServerFn(setUserAccess);
	const [email, setEmail] = (0, import_react.useState)("");
	const [fullName, setFullName] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [creating, setCreating] = (0, import_react.useState)(false);
	const qc = useQueryClient();
	async function add(e) {
		e.preventDefault();
		setCreating(true);
		try {
			await create({ data: {
				email,
				fullName,
				password
			} });
			toast.success("Usuário cadastrado como Orçamentista");
			setEmail("");
			setFullName("");
			setPassword("");
			await qc.invalidateQueries({ queryKey: ["users"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao cadastrar usuário");
		} finally {
			setCreating(false);
		}
	}
	async function remove(uid, label) {
		if (!confirm(`Excluir o usuário ${label}? Esta ação não pode ser desfeita.`)) return;
		try {
			await del({ data: { userId: uid } });
			toast.success("Usuário excluído");
			qc.invalidateQueries({ queryKey: ["users"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao excluir");
		}
	}
	async function changeAccess(uid, label, enabled) {
		if (!confirm(`Deseja ${enabled ? "restaurar" : "suspender"} o acesso de ${label}?`)) return;
		try {
			await setAccess({ data: {
				userId: uid,
				enabled
			} });
			toast.success(enabled ? "Acesso restaurado" : "Acesso suspenso");
			await qc.invalidateQueries({ queryKey: ["users"] });
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Erro ao alterar acesso");
		}
	}
	const { data } = useQuery({
		queryKey: ["users"],
		queryFn: async () => {
			const [{ data: profiles, error: profilesError }, { data: roles, error: rolesError }] = await Promise.all([supabase.from("profiles").select("*").order("created_at"), supabase.from("user_roles").select("*")]);
			if (profilesError) throw profilesError;
			if (rolesError) throw rolesError;
			return (profiles ?? []).map((p) => ({
				...p,
				roles: (roles ?? []).filter((r) => r.user_id === p.id).map((r) => r.role).filter((r) => r === "admin" || r === "orcamentista")
			}));
		}
	});
	async function toggle(uid, role) {
		const { error } = await supabase.rpc("set_user_role", {
			_user_id: uid,
			_role: role
		});
		if (error) {
			toast.error(error.message);
			return;
		}
		qc.invalidateQueries({ queryKey: ["users"] });
		qc.invalidateQueries({ queryKey: ["me"] });
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Usuários e perfis",
			subtitle: "Administrador e Orçamentista"
		}),
		can.manageUsers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-4 text-sm font-semibold",
						children: "Adicionar usuário"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						onSubmit: add,
						className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-user-name",
									children: "Nome"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-user-name",
									autoComplete: "name",
									required: true,
									maxLength: 200,
									value: fullName,
									onChange: (e) => setFullName(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-user-email",
									children: "E-mail"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-user-email",
									type: "email",
									autoComplete: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
									htmlFor: "new-user-password",
									children: "Senha inicial"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									id: "new-user-password",
									type: "password",
									autoComplete: "new-password",
									minLength: 6,
									maxLength: 72,
									required: true,
									value: password,
									onChange: (e) => setPassword(e.target.value)
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "submit",
								disabled: creating,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), creating ? "Cadastrando..." : "Cadastrar"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-xs text-muted-foreground",
						children: "O novo usuário recebe o perfil Orçamentista. Administradores podem alterar o perfil ou suspender o acesso."
					})
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "overflow-x-auto p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b text-left text-xs uppercase text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "py-2",
								children: "Usuário"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Perfil" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Acesso" }),
							can.deleteUsers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (data ?? []).map((u) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "py-2.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "font-medium",
									children: u.full_name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: u.email
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								"aria-label": `Perfil de ${u.full_name ?? u.email ?? "usuário"}`,
								className: "h-9 rounded-md border border-input bg-card px-2 text-sm",
								disabled: !can.manageUsers || u.id === me?.user.id,
								value: u.roles[0] ?? "",
								onChange: (e) => toggle(u.id, e.target.value),
								children: [!u.roles.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "",
									disabled: true,
									children: "Sem perfil"
								}), ROLES.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: r,
									children: ROLE_LABEL[r]
								}, r))]
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: u.access_enabled ? "text-success" : "text-destructive",
								children: u.access_enabled ? "Ativo" : "Suspenso"
							}) }),
							can.deleteUsers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "text-right",
								children: u.id !== me?.user.id && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
										size: "sm",
										variant: "outline",
										"aria-label": u.access_enabled ? "Suspender acesso" : "Restaurar acesso",
										onClick: () => changeAccess(u.id, u.full_name ?? u.email ?? "", !u.access_enabled),
										children: [u.access_enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Ban, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {}), u.access_enabled ? "Suspender" : "Restaurar"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										"aria-label": "Excluir usuário",
										onClick: () => remove(u.id, u.full_name ?? u.email ?? ""),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "text-destructive" })
									})]
								})
							})
						]
					}, u.id)) })]
				}), !can.manageUsers && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted-foreground",
					children: "Somente Administradores alteram perfis."
				})]
			})
		})
	] });
}
//#endregion
export { Users as component };
