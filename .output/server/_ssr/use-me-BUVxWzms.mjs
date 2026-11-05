import { t as supabase } from "./client-BAK4cUwb.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/use-me-BUVxWzms.js
function permissionsFor(roles) {
	const admin = roles.includes("admin");
	const orc = roles.includes("orcamentista");
	return {
		access: admin || orc,
		editQuotes: admin || orc,
		changeStatus: admin,
		viewAllQuotes: admin,
		viewAudit: admin,
		editCatalog: admin,
		editParams: admin,
		manageUsers: admin,
		deleteQuotes: admin,
		deleteUsers: admin
	};
}
function useMe() {
	const q = useQuery({
		queryKey: ["me"],
		queryFn: async () => {
			const { data } = await supabase.auth.getUser();
			const user = data.user;
			if (!user) return null;
			const [{ data: profile }, { data: roles }] = await Promise.all([supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(), supabase.from("user_roles").select("role").eq("user_id", user.id)]);
			return {
				user,
				profile,
				roles: (roles ?? []).map((r) => r.role)
			};
		}
	});
	const roles = q.data?.profile?.access_enabled ? (q.data.roles ?? []).filter((r) => r !== "gerente") : [];
	const has = (r) => roles.includes(r);
	return {
		...q,
		me: q.data,
		roles,
		has,
		can: permissionsFor(roles)
	};
}
//#endregion
export { useMe as t };
