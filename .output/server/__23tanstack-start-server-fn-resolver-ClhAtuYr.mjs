//#region node_modules/.nitro/vite/services/ssr/assets/__23tanstack-start-server-fn-resolver-ClhAtuYr.js
var manifest = {
	"1b36e79fb17473cbea5838cc48bfefe7de129ef1bef3a743aa78716aa93765db": {
		functionName: "deleteUser_createServerFn_handler",
		importer: () => import("./_ssr/users.functions-jwzDJc8w.mjs")
	},
	"39d053ca3c166648240f19533479adb240c32f2d28b6e9dda4814e0fad8105f2": {
		functionName: "createUser_createServerFn_handler",
		importer: () => import("./_ssr/users.functions-jwzDJc8w.mjs")
	},
	"a4b99db0cc5f4fb08268b4df8bc79f361bad428bad067de2b9227b0dcdb1ce39": {
		functionName: "setUserAccess_createServerFn_handler",
		importer: () => import("./_ssr/users.functions-jwzDJc8w.mjs")
	}
};
async function getServerFnById(id, access) {
	const serverFnInfo = manifest[id];
	if (!serverFnInfo) throw new Error("Server function info not found for " + id);
	const fnModule = serverFnInfo.module ??= await serverFnInfo.importer();
	if (!fnModule) throw new Error("Server function module not resolved for " + id);
	const action = fnModule[serverFnInfo.functionName];
	if (!action) throw new Error("Server function module export not resolved for serverFn ID: " + id);
	return action;
}
//#endregion
export { getServerFnById as t };
