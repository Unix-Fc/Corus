globalThis.__nitro_main__ = import.meta.url;
import { i as HTTPError, n as defineLazyEventHandler, t as H3Core } from "./_libs/h3+rou3+srvx.mjs";
import { t as HookableCore } from "./_libs/hookable.mjs";
import { r as FastResponse } from "./_libs/h3-v2+rou3+srvx.mjs";
//#region #nitro-vite-setup
function lazyService(loader) {
	let promise, mod;
	return { fetch(req) {
		if (mod) return mod.fetch(req);
		if (!promise) promise = loader().then((_mod) => mod = _mod.default || _mod);
		return promise.then((mod) => mod.fetch(req));
	} };
}
var services = { ["ssr"]: lazyService(() => import("./_ssr/ssr.mjs")) };
globalThis.__nitro_vite_envs__ = services;
//#endregion
//#region #nitro/virtual/public-assets-data
var public_assets_data_default = {
	"/favicon.ico": {
		"type": "image/vnd.microsoft.icon",
		"etag": "\"4f95-3RXc3p2mhEAs1WBwaIvE0Y0uu0Y\"",
		"mtime": "2026-11-04T17:17:44.927Z",
		"size": 20373,
		"path": "../public/favicon.ico"
	},
	"/robots.txt": {
		"type": "text/plain; charset=utf-8",
		"etag": "\"a0-CKGXSIe7TSsqDTmGm/nY1t/o5d0\"",
		"mtime": "2026-11-04T17:17:49.194Z",
		"size": 160,
		"path": "../public/robots.txt"
	},
	"/assets/audit-list-BddlNKnD.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"673-KNiU3CuPJhl02DGCwOpfE1IY+og\"",
		"mtime": "2026-11-05T00:43:41.886Z",
		"size": 1651,
		"path": "../public/assets/audit-list-BddlNKnD.js"
	},
	"/assets/auditoria-qgMjSwUn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"502-tyX1b7yVUOzb/l7E7Iiq8IGJIAE\"",
		"mtime": "2026-11-05T00:43:41.888Z",
		"size": 1282,
		"path": "../public/assets/auditoria-qgMjSwUn.js"
	},
	"/assets/auth--lYu3DbT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1a7b-XvWSES97orvVPCfYOhXTmT2h/vw\"",
		"mtime": "2026-11-05T00:43:41.889Z",
		"size": 6779,
		"path": "../public/assets/auth--lYu3DbT.js"
	},
	"/assets/button-BeExvV6g.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1355-R0SszbuzhhchdJ09a3VIFaaFk8A\"",
		"mtime": "2026-11-05T00:43:41.889Z",
		"size": 4949,
		"path": "../public/assets/button-BeExvV6g.js"
	},
	"/assets/cadastros-B5Oc7BrO.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6684-/L5ZOGKaSxvjKAExc4oCn7BLwx8\"",
		"mtime": "2026-11-05T00:43:41.890Z",
		"size": 26244,
		"path": "../public/assets/cadastros-B5Oc7BrO.js"
	},
	"/assets/client-S1nsjwqC.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"38285-njwGJ4jsTJ2epQPFuI1fsTaMmIU\"",
		"mtime": "2026-11-05T00:43:41.890Z",
		"size": 230021,
		"path": "../public/assets/client-S1nsjwqC.js"
	},
	"/assets/createLucideIcon-CqokrnQJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4a6-KyIjYuPTIveeaDoHrOUu93FWkWc\"",
		"mtime": "2026-11-05T00:43:41.891Z",
		"size": 1190,
		"path": "../public/assets/createLucideIcon-CqokrnQJ.js"
	},
	"/assets/dashboard-CyYDgm2A.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"15b5-k3W6Drcu/s3otvjJqwwIjtJzQ3g\"",
		"mtime": "2026-11-05T00:43:41.891Z",
		"size": 5557,
		"path": "../public/assets/dashboard-CyYDgm2A.js"
	},
	"/assets/data-DA4hlHgj.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2d79-4t5W/dPHcq0G7QvCaTRZkHcNf+c\"",
		"mtime": "2026-11-05T00:43:41.893Z",
		"size": 11641,
		"path": "../public/assets/data-DA4hlHgj.js"
	},
	"/assets/dist-Bdwu_Qnn.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2bb-WiUnQPRzbIsFYgT4S9y+pP62G6g\"",
		"mtime": "2026-11-05T00:43:41.895Z",
		"size": 699,
		"path": "../public/assets/dist-Bdwu_Qnn.js"
	},
	"/assets/descoberta-Dx2gTnqR.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6e9-fmy+gkN+lCuKZuR/0KzHQqXHdbM\"",
		"mtime": "2026-11-05T00:43:41.895Z",
		"size": 1769,
		"path": "../public/assets/descoberta-Dx2gTnqR.js"
	},
	"/assets/dist-DOZlGmW6.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"137a-DCcq9XHEMB7hzO7agGzBKFn2ChE\"",
		"mtime": "2026-11-05T00:43:41.896Z",
		"size": 4986,
		"path": "../public/assets/dist-DOZlGmW6.js"
	},
	"/assets/index-CrdsF6mI.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"5da2b-wc7ESzhUV1hYtFTXBQnisNRB9TQ\"",
		"mtime": "2026-11-05T00:43:41.886Z",
		"size": 383531,
		"path": "../public/assets/index-CrdsF6mI.js"
	},
	"/assets/factory-CJqmF1Ej.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"197-S8kDJ+6863JC9T296ipq+YpiDng\"",
		"mtime": "2026-11-05T00:43:41.896Z",
		"size": 407,
		"path": "../public/assets/factory-CJqmF1Ej.js"
	},
	"/assets/file-text-B7J99HAk.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"181-okWiymr9YMNbFCgW36bfo/wVMgQ\"",
		"mtime": "2026-11-05T00:43:41.897Z",
		"size": 385,
		"path": "../public/assets/file-text-B7J99HAk.js"
	},
	"/assets/info-DFP_zqhA.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"cc-WghB3TsyQmv2USuLz+1VHR0G4Ew\"",
		"mtime": "2026-11-05T00:43:41.897Z",
		"size": 204,
		"path": "../public/assets/info-DFP_zqhA.js"
	},
	"/assets/input-CiyW0WoE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"268-YD04+aqAk1Abe30MWKE1ZBfnKJg\"",
		"mtime": "2026-11-05T00:43:41.897Z",
		"size": 616,
		"path": "../public/assets/input-CiyW0WoE.js"
	},
	"/assets/invariant-DEEwAagU.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"3c-eVh/3DMi1s3cxf4N/OJar+ew1jA\"",
		"mtime": "2026-11-05T00:43:41.898Z",
		"size": 60,
		"path": "../public/assets/invariant-DEEwAagU.js"
	},
	"/assets/label-DJX4iAOG.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2ca-5+WOwDEkp8pzWvFWxATd25q5Yzg\"",
		"mtime": "2026-11-05T00:43:41.898Z",
		"size": 714,
		"path": "../public/assets/label-DJX4iAOG.js"
	},
	"/assets/orcamentos.index-D-6dz7QV.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"ee2-gObGVAw+nl5WrRNqPDQA2beaczs\"",
		"mtime": "2026-11-05T00:43:41.900Z",
		"size": 3810,
		"path": "../public/assets/orcamentos.index-D-6dz7QV.js"
	},
	"/assets/link-C0D3RxAx.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2c00-hY2NPiZsOHT2iuwT1p0bCIpvc9M\"",
		"mtime": "2026-11-05T00:43:41.899Z",
		"size": 11264,
		"path": "../public/assets/link-C0D3RxAx.js"
	},
	"/assets/not-found-DIgawKw1.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"37-RTB6YH5iXRKeXz1Sn6ZQ+vS0lnc\"",
		"mtime": "2026-11-05T00:43:41.899Z",
		"size": 55,
		"path": "../public/assets/not-found-DIgawKw1.js"
	},
	"/assets/orcamentos.novo-Cf4oYzPT.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"176-Z+tsPaH0SYEyrhk29mYkqtHcZmo\"",
		"mtime": "2026-11-05T00:43:41.901Z",
		"size": 374,
		"path": "../public/assets/orcamentos.novo-Cf4oYzPT.js"
	},
	"/assets/orcamentos._id-BnxqlhrW.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1f74-nvwCPm5hDWg8SN1KSfw8GLpj/tk\"",
		"mtime": "2026-11-05T00:43:41.899Z",
		"size": 8052,
		"path": "../public/assets/orcamentos._id-BnxqlhrW.js"
	},
	"/assets/orcamentos._id_.editar-_lD8WJyE.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"213-1HzI7eJSlNSr9rQFIblW/TMYKWQ\"",
		"mtime": "2026-11-05T00:43:41.900Z",
		"size": 531,
		"path": "../public/assets/orcamentos._id_.editar-_lD8WJyE.js"
	},
	"/assets/orcamentos._id_.proposta-AHGh875U.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"199c-vOgCjFXRrWMqYRl5oNFaBe+iqew\"",
		"mtime": "2026-11-05T00:43:41.900Z",
		"size": 6556,
		"path": "../public/assets/orcamentos._id_.proposta-AHGh875U.js"
	},
	"/assets/parametros-DwRusgpJ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"9a8-wS0h5Rqwzsi9Lb/mK12vKGmCdAE\"",
		"mtime": "2026-11-05T00:43:41.901Z",
		"size": 2472,
		"path": "../public/assets/parametros-DwRusgpJ.js"
	},
	"/assets/pencil-JoRueBGb.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"114-PXBgp0e9fbZ4MsSLeJW9vCmYm5k\"",
		"mtime": "2026-11-05T00:43:41.901Z",
		"size": 276,
		"path": "../public/assets/pencil-JoRueBGb.js"
	},
	"/assets/pendencias-SMNXsSus.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"781-B1olx3cvdcSgxwEUSzo8xrJeI6g\"",
		"mtime": "2026-11-05T00:43:41.902Z",
		"size": 1921,
		"path": "../public/assets/pendencias-SMNXsSus.js"
	},
	"/assets/pipeline-DvCXSg1d.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d69-ldBWrq6HGWTDIG9YuIqhIl6iMA4\"",
		"mtime": "2026-11-05T00:43:41.902Z",
		"size": 3433,
		"path": "../public/assets/pipeline-DvCXSg1d.js"
	},
	"/assets/plus-CTYhm7Dw.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"99-l6ubhhwnP4IzryCzcfpvri5o4Rs\"",
		"mtime": "2026-11-05T00:43:41.902Z",
		"size": 153,
		"path": "../public/assets/plus-CTYhm7Dw.js"
	},
	"/assets/preload-helper-5j1uieTd.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"132d-lXRfNiArt6V/Z/ZJSVIiR/F8CBg\"",
		"mtime": "2026-11-05T00:43:41.903Z",
		"size": 4909,
		"path": "../public/assets/preload-helper-5j1uieTd.js"
	},
	"/assets/printer-q4mNWBa4.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"13f-0c9+TP98f454ozO5ahEQiwsQm3E\"",
		"mtime": "2026-11-05T00:43:41.903Z",
		"size": 319,
		"path": "../public/assets/printer-q4mNWBa4.js"
	},
	"/assets/quote-form-fOmTtgVv.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"4810-W6UgBSo+hJJsynr3My3AxKe4U+o\"",
		"mtime": "2026-11-05T00:43:41.903Z",
		"size": 18448,
		"path": "../public/assets/quote-form-fOmTtgVv.js"
	},
	"/assets/react-dom-BrkA9CBo.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"f12-pQHuxigY5pvrAgYTup1O7qwY9zc\"",
		"mtime": "2026-11-05T00:43:41.904Z",
		"size": 3858,
		"path": "../public/assets/react-dom-BrkA9CBo.js"
	},
	"/assets/redirect-DmtLUW0N.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"184-TRM49T5nvIhX8okm9YKQe/jdlzE\"",
		"mtime": "2026-11-05T00:43:41.904Z",
		"size": 388,
		"path": "../public/assets/redirect-DmtLUW0N.js"
	},
	"/assets/route-C1S8sfls.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"d31e-WIRODCJFvXuwGkT4tKE0st/ZjrM\"",
		"mtime": "2026-11-05T00:43:41.904Z",
		"size": 54046,
		"path": "../public/assets/route-C1S8sfls.js"
	},
	"/assets/sheet-CUu8Rwwa.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"7f9a-Ee2sS7NlHxruc7YFMVMAedWtf24\"",
		"mtime": "2026-11-05T00:43:41.904Z",
		"size": 32666,
		"path": "../public/assets/sheet-CUu8Rwwa.js"
	},
	"/assets/status-badge-BHZqSeGu.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"8d4-lUfjXtmdzR2H+ZEfAEf5x+XXNUo\"",
		"mtime": "2026-11-05T00:43:41.905Z",
		"size": 2260,
		"path": "../public/assets/status-badge-BHZqSeGu.js"
	},
	"/assets/styles-BSWZKgpl.css": {
		"type": "text/css; charset=utf-8",
		"etag": "\"132d5-5E2aSv1s95TFC2xgtZAxEUDDIJg\"",
		"mtime": "2026-11-05T00:43:41.911Z",
		"size": 78549,
		"path": "../public/assets/styles-BSWZKgpl.css"
	},
	"/assets/switch-DGhL4tqg.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"1149-iw7vtz9NB4oaiB/mkOOgZCX5iPc\"",
		"mtime": "2026-11-05T00:43:41.905Z",
		"size": 4425,
		"path": "../public/assets/switch-DGhL4tqg.js"
	},
	"/assets/trash-2-BEd47D2J.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"148-BXJSOzRNzd1eImInC1aQ50qYiZ4\"",
		"mtime": "2026-11-05T00:43:41.905Z",
		"size": 328,
		"path": "../public/assets/trash-2-BEd47D2J.js"
	},
	"/assets/triangle-alert-Cc5onF84.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"109-aIRguG46ZsUNFQd1eoAEQzaRXhM\"",
		"mtime": "2026-11-05T00:43:41.906Z",
		"size": 265,
		"path": "../public/assets/triangle-alert-Cc5onF84.js"
	},
	"/assets/use-me-a2F46LAN.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"318-SR7WYAEI/Q90l718ygj9D9975iI\"",
		"mtime": "2026-11-05T00:43:41.906Z",
		"size": 792,
		"path": "../public/assets/use-me-a2F46LAN.js"
	},
	"/assets/useMatch-DxKhHt5q.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"277-/IOuIrvkS/zWZWam/NbjMpIWhZE\"",
		"mtime": "2026-11-05T00:43:41.906Z",
		"size": 631,
		"path": "../public/assets/useMatch-DxKhHt5q.js"
	},
	"/assets/useNavigate-CAoCd_RZ.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"df-V2eU0Xc20hj4aRxLMrR//Jbh0T8\"",
		"mtime": "2026-11-05T00:43:41.907Z",
		"size": 223,
		"path": "../public/assets/useNavigate-CAoCd_RZ.js"
	},
	"/assets/useRouter-C6Udzlen.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"92-29jPOd4Jhlp2caSSf1dVKpqUqaM\"",
		"mtime": "2026-11-05T00:43:41.907Z",
		"size": 146,
		"path": "../public/assets/useRouter-C6Udzlen.js"
	},
	"/assets/usuarios-CNXyFRyi.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"2acf-lLKuEJU+qpJEFVubFnPIjMfC15A\"",
		"mtime": "2026-11-05T00:43:41.909Z",
		"size": 10959,
		"path": "../public/assets/usuarios-CNXyFRyi.js"
	},
	"/assets/utils-4jUIYOBc.js": {
		"type": "text/javascript; charset=utf-8",
		"etag": "\"6bed-90NGITyc+kEKvxUkUtkYHgO1XH4\"",
		"mtime": "2026-11-05T00:43:41.911Z",
		"size": 27629,
		"path": "../public/assets/utils-4jUIYOBc.js"
	}
};
//#endregion
//#region #nitro/virtual/public-assets
var publicAssetBases = {};
function isPublicAssetURL(id = "") {
	if (public_assets_data_default[id]) return true;
	for (const base in publicAssetBases) if (id.startsWith(base)) return true;
	return false;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/route-rules.mjs
var headers = ((m) => function headersRouteRule(event) {
	for (const [key, value] of Object.entries(m.options || {})) event.res.headers.set(key, value);
});
//#endregion
//#region #nitro/virtual/routing
var findRouteRules = /* @__PURE__ */ (() => {
	const $0 = [{
		name: "headers",
		route: "/assets/**",
		handler: headers,
		options: { "cache-control": "public, max-age=31536000, immutable" }
	}];
	return (m, p) => {
		let r = [];
		if (p.charCodeAt(p.length - 1) === 47) p = p.slice(0, -1) || "/";
		let s = p.split("/");
		if (s.length > 1) {
			if (s[1] === "assets") r.unshift({
				data: $0,
				params: { "_": s.slice(2).join("/") }
			});
		}
		return r;
	};
})();
var _lazy_cX8hrJ = defineLazyEventHandler(() => import("./_chunks/ssr-renderer.mjs"));
var findRoute = /* @__PURE__ */ (() => {
	const data = {
		route: "/**",
		handler: _lazy_cX8hrJ
	};
	return ((_m, p) => {
		return {
			data,
			params: { "_": p.slice(1) }
		};
	});
})();
[].filter(Boolean);
//#endregion
//#region node_modules/nitro/dist/runtime/internal/error/prod.mjs
var errorHandler = (error, event) => {
	const res = defaultHandler(error, event);
	return new FastResponse(typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2), res);
};
function defaultHandler(error, event) {
	const unhandled = error.unhandled ?? !HTTPError.isError(error);
	const { status = 500, statusText = "" } = unhandled ? {} : error;
	if (status === 404) {
		const url = event.url || new URL(event.req.url);
		const baseURL = "/";
		if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) return {
			status: 302,
			headers: new Headers({ location: `${baseURL}${url.pathname.slice(1)}${url.search}` })
		};
	}
	const headers = new Headers(unhandled ? {} : error.headers);
	headers.set("content-type", "application/json; charset=utf-8");
	return {
		status,
		statusText,
		headers,
		body: {
			error: true,
			...unhandled ? {
				status,
				unhandled: true
			} : typeof error.toJSON === "function" ? error.toJSON() : {
				status,
				statusText,
				message: error.message
			}
		}
	};
}
//#endregion
//#region #nitro/virtual/error-handler
var errorHandlers = [errorHandler];
async function error_handler_default(error, event) {
	for (const handler of errorHandlers) try {
		const response = await handler(error, event, { defaultHandler });
		if (response) return response;
	} catch (error) {
		console.error(error);
	}
}
//#endregion
//#region #nitro/virtual/app
function createNitroApp() {
	const captureError = (error, errorCtx) => {
		if (errorCtx?.event) {
			const errors = errorCtx.event.req.context?.nitro?.errors;
			if (errors) errors.push({
				error,
				context: errorCtx
			});
		}
	};
	const h3App = createH3App({ onError(error, event) {
		return error_handler_default(error, event);
	} });
	let appHandler = (req) => {
		req.context ||= {};
		req.context.nitro = req.context.nitro || { errors: [] };
		return h3App.fetch(req);
	};
	return {
		fetch: appHandler,
		h3: h3App,
		hooks: void 0,
		captureError
	};
}
function createH3App(config) {
	const h3App = new H3Core(config);
	h3App["~findRoute"] = (event) => findRoute(event.req.method, event.url.pathname);
	h3App["~getMiddleware"] = (event, route) => {
		const pathname = event.url.pathname;
		const method = event.req.method;
		const middleware = [];
		const routeRules = getRouteRules(method, pathname);
		event.context.routeRules = routeRules?.routeRules;
		if (routeRules?.routeRuleMiddleware.length) middleware.push(...routeRules.routeRuleMiddleware);
		if (route?.data?.middleware?.length) middleware.push(...route.data.middleware);
		return middleware;
	};
	return h3App;
}
//#endregion
//#region node_modules/nitro/dist/runtime/internal/app.mjs
var APP_ID = "default";
function useNitroApp() {
	let instance = useNitroApp._instance;
	if (instance) return instance;
	instance = useNitroApp._instance = createNitroApp();
	globalThis.__nitro__ = globalThis.__nitro__ || {};
	globalThis.__nitro__[APP_ID] = instance;
	return instance;
}
function useNitroHooks() {
	const nitroApp = useNitroApp();
	const hooks = nitroApp.hooks;
	if (hooks) return hooks;
	return nitroApp.hooks = new HookableCore();
}
function getRouteRules(method, pathname) {
	const m = findRouteRules(method, pathname);
	if (!m?.length) return { routeRuleMiddleware: [] };
	const routeRules = {};
	for (const layer of m) for (const rule of layer.data) {
		const currentRule = routeRules[rule.name];
		if (currentRule) {
			if (rule.options === false) {
				delete routeRules[rule.name];
				continue;
			}
			if (typeof currentRule.options === "object" && typeof rule.options === "object") currentRule.options = {
				...currentRule.options,
				...rule.options
			};
			else currentRule.options = rule.options;
			currentRule.route = rule.route;
			currentRule.params = {
				...currentRule.params,
				...layer.params
			};
		} else if (rule.options !== false) routeRules[rule.name] = {
			...rule,
			params: layer.params
		};
	}
	const middleware = [];
	const orderedRules = Object.values(routeRules).sort((a, b) => (a.handler?.order || 0) - (b.handler?.order || 0));
	for (const rule of orderedRules) {
		if (rule.options === false || !rule.handler) continue;
		middleware.push(rule.handler(rule));
	}
	return {
		routeRules,
		routeRuleMiddleware: middleware
	};
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/_module-handler.mjs
function createHandler(hooks) {
	const nitroApp = useNitroApp();
	const nitroHooks = useNitroHooks();
	return {
		async fetch(request, env, context) {
			globalThis.__env__ = env;
			augmentReq(request, {
				env,
				context
			});
			const ctxExt = {};
			const url = new URL(request.url);
			if (hooks.fetch) {
				const res = await hooks.fetch(request, env, context, url, ctxExt);
				if (res) return res;
			}
			return await nitroApp.fetch(request);
		},
		scheduled(controller, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:scheduled", {
				controller,
				env,
				context
			}) || Promise.resolve());
		},
		email(message, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:email", {
				message,
				event: message,
				env,
				context
			}) || Promise.resolve());
		},
		queue(batch, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:queue", {
				batch,
				event: batch,
				env,
				context
			}) || Promise.resolve());
		},
		tail(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:tail", {
				traces,
				env,
				context
			}) || Promise.resolve());
		},
		trace(traces, env, context) {
			globalThis.__env__ = env;
			context.waitUntil(nitroHooks.callHook("cloudflare:trace", {
				traces,
				env,
				context
			}) || Promise.resolve());
		}
	};
}
function augmentReq(cfReq, ctx) {
	const req = cfReq;
	req.ip = cfReq.headers.get("cf-connecting-ip") || void 0;
	req.runtime ??= { name: "cloudflare" };
	req.runtime.cloudflare = {
		...req.runtime.cloudflare,
		...ctx
	};
	req.waitUntil = ctx.context?.waitUntil.bind(ctx.context);
}
//#endregion
//#region node_modules/nitro/dist/presets/cloudflare/runtime/cloudflare-module.mjs
var cloudflare_module_default = createHandler({ fetch(cfRequest, env, context, url) {
	if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(cfRequest);
} });
//#endregion
export { cloudflare_module_default as default };
