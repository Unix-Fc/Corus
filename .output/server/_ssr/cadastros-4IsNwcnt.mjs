import { n as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as supabase } from "./client-BAK4cUwb.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { c as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { r as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { _ as useAudit, i as brl, t as KIND_LABEL, v as useCatalog, y as useClients } from "./data-BR025WEp.mjs";
import { a as PageHeader, n as CardContent, t as Card } from "./status-badge-CqsfqU9D.mjs";
import { t as AuditList } from "./audit-list-w60oRero.mjs";
import { t as useMe } from "./use-me-BUVxWzms.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as Input } from "./input-B8Q2ztVi.mjs";
import { t as Label } from "./label-DBD1bRRP.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { m as Pencil, p as Plus, t as X } from "../_libs/lucide-react.mjs";
import { t as Switch } from "./switch-Cn1w-cIH.mjs";
import { a as SheetTitle, i as SheetHeader, n as SheetContent, t as Sheet } from "./sheet-nNBP-y5w.mjs";
import { i as TabsTrigger$1, n as TabsContent$1, r as TabsList$1, t as Tabs$1 } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cadastros-4IsNwcnt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Tabs$1;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsList$1, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = TabsList$1.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger$1, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = TabsTrigger$1.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent$1, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = TabsContent$1.displayName;
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
function Cadastros() {
	const [tab, setTab] = (0, import_react.useState)("clientes");
	const [q, setQ] = (0, import_react.useState)("");
	const [edit, setEdit] = (0, import_react.useState)(null);
	const [hist, setHist] = (0, import_react.useState)(null);
	const { data: clients = [] } = useClients();
	const { data: catalog = [] } = useCatalog();
	const { can } = useMe();
	const qc = useQueryClient();
	const term = q.toLowerCase();
	const costLabel = tab === "maquina" || tab === "cargo" ? "Custo-hora" : "Custo unitário";
	async function save() {
		if (!edit) return;
		const f = edit.f;
		if (!String(f["name"] ?? "").trim()) {
			toast.error("Informe o nome.");
			return;
		}
		let error;
		if (tab === "clientes") {
			const p = {
				name: String(f["name"]),
				cnpj: String(f["cnpj"] ?? ""),
				contact: String(f["contact"] ?? ""),
				email: String(f["email"] ?? ""),
				phone: String(f["phone"] ?? ""),
				city: String(f["city"] ?? ""),
				active: !!f["active"]
			};
			({error} = edit.id ? await supabase.from("clients").update(p).eq("id", edit.id) : await supabase.from("clients").insert(p));
		} else {
			const details = tab === "maquina" ? { setup_padrao_h: Number(f["setup"] ?? 0) } : tab === "cargo" ? { salario_mensal: Number(f["salario"] ?? 0) } : tab === "servico" ? { fornecedor: String(f["fornecedor"] ?? "") } : {};
			const p = {
				kind: tab,
				code: String(f["code"] ?? ""),
				name: String(f["name"]),
				unit: String(f["unit"] ?? ""),
				unit_cost: Number(f["unit_cost"] ?? 0),
				active: !!f["active"],
				details
			};
			({error} = edit.id ? await supabase.from("catalog_items").update(p).eq("id", edit.id) : await supabase.from("catalog_items").insert(p));
		}
		if (error) {
			toast.error(error.message);
			return;
		}
		toast.success("Cadastro salvo");
		setEdit(null);
		qc.invalidateQueries({ queryKey: [tab === "clientes" ? "clients" : "catalog"] });
		qc.invalidateQueries({ queryKey: ["audit"] });
	}
	const set = (k, v) => edit && setEdit({
		...edit,
		f: {
			...edit.f,
			[k]: v
		}
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			title: "Cadastros de referência",
			subtitle: "Base de custos usada nos orçamentos. Inativos não aparecem para novos lançamentos.",
			actions: can.editCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				onClick: () => setEdit({ f: {
					active: true,
					unit: tab === "maquina" || tab === "cargo" ? "h" : ""
				} }),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {}), "Novo"]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tabs, {
			value: tab,
			onValueChange: (v) => setTab(v),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
				className: "h-auto flex-wrap",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: "clientes",
					children: "Clientes"
				}), Object.keys(KIND_LABEL).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
					value: k,
					children: KIND_LABEL[k]
				}, k))]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					className: "mb-3 max-w-sm",
					placeholder: "Buscar…",
					value: q,
					onChange: (e) => setQ(e.target.value)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "overflow-x-auto",
					children: tab === "clientes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b text-left text-xs uppercase text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Cliente"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "CNPJ" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Contato" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Cidade" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: clients.filter((c) => !term || c.name.toLowerCase().includes(term)).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b last:border-0",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "py-2.5 font-medium",
									children: c.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "num text-xs",
									children: c.cnpj
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: c.contact }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-xs text-muted-foreground",
									children: c.email
								})] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.city }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Active, { a: c.active }) }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "text-right whitespace-nowrap",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "sm",
										variant: "ghost",
										onClick: () => setHist({
											entity: "clients",
											id: c.id,
											name: c.name
										}),
										children: "Histórico"
									}), can.editCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										size: "icon",
										variant: "ghost",
										onClick: () => setEdit({
											id: c.id,
											f: {
												name: c.name,
												cnpj: c.cnpj ?? "",
												contact: c.contact ?? "",
												email: c.email ?? "",
												phone: c.phone ?? "",
												city: c.city ?? "",
												active: c.active
											}
										}),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
									})]
								})
							]
						}, c.id)) })]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
						className: "w-full text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b text-left text-xs uppercase text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "py-2",
									children: "Código"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Descrição" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Un." }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "text-right",
									children: costLabel
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Detalhe" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
							]
						}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: catalog.filter((c) => c.kind === tab && (!term || `${c.code} ${c.name}`.toLowerCase().includes(term))).map((c) => {
							const d = c.details;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "border-b last:border-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "py-2.5 num text-xs",
										children: c.code
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "font-medium",
										children: c.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.unit }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-right num",
										children: brl(Number(c.unit_cost))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
										className: "text-xs text-muted-foreground",
										children: d["setup_padrao_h"] !== void 0 ? `Setup padrão ${d["setup_padrao_h"]} h` : d["salario_mensal"] ? `Salário ${brl(Number(d["salario_mensal"]))}` : d["fornecedor"] ?? d["norma"] ?? ""
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Active, { a: c.active }) }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
										className: "text-right whitespace-nowrap",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "sm",
											variant: "ghost",
											onClick: () => setHist({
												entity: "catalog_items",
												id: c.id,
												name: c.name
											}),
											children: "Histórico"
										}), can.editCatalog && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											size: "icon",
											variant: "ghost",
											onClick: () => setEdit({
												id: c.id,
												f: {
													code: c.code ?? "",
													name: c.name,
													unit: c.unit ?? "",
													unit_cost: Number(c.unit_cost),
													active: c.active,
													setup: Number(d["setup_padrao_h"] ?? 0),
													salario: Number(d["salario_mensal"] ?? 0),
													fornecedor: String(d["fornecedor"] ?? "")
												}
											}),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
										})]
									})
								]
							}, c.id);
						}) })]
					})
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!edit,
			onOpenChange: (o) => !o && setEdit(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: [
					edit?.id ? "Editar" : "Novo",
					" —",
					" ",
					tab === "clientes" ? "Cliente" : KIND_LABEL[tab]
				] }) }),
				edit && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [tab === "clientes" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Razão social",
							k: "name",
							f: edit.f,
							set,
							wide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "CNPJ",
							k: "cnpj",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Contato",
							k: "contact",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "E-mail",
							k: "email",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Telefone",
							k: "phone",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Cidade/UF",
							k: "city",
							f: edit.f,
							set
						})
					] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Código",
							k: "code",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Unidade",
							k: "unit",
							f: edit.f,
							set
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Descrição",
							k: "name",
							f: edit.f,
							set,
							wide: true
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: costLabel + " (R$)",
							k: "unit_cost",
							f: edit.f,
							set,
							num: true
						}),
						tab === "maquina" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Setup padrão (h)",
							k: "setup",
							f: edit.f,
							set,
							num: true
						}),
						tab === "cargo" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Salário mensal do funcionário (R$)",
							k: "salario",
							f: edit.f,
							set,
							num: true
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground sm:col-span-2",
							children: "Informe o salário mensal de referência para este cargo."
						})] }),
						tab === "servico" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(F, {
							l: "Fornecedor",
							k: "fornecedor",
							f: edit.f,
							set
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex items-center gap-2 text-sm sm:col-span-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
							checked: !!edit.f["active"],
							onCheckedChange: (v) => set("active", v)
						}), "Ativo"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					onClick: () => setEdit(null),
					children: "Cancelar"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: save,
					children: "Salvar"
				})] })
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
			open: !!hist,
			onOpenChange: (o) => !o && setHist(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
				className: "overflow-y-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, { children: ["Histórico — ", hist?.name] }) }), hist && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistBody, {
					entity: hist.entity,
					id: hist.id
				})]
			})
		})
	] });
}
function HistBody({ entity, id }) {
	const { data = [] } = useAudit({
		entity,
		entityId: id
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mt-4 px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuditList, { rows: data })
	});
}
var Active = ({ a }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
	className: `text-xs font-medium ${a ? "text-success" : "text-muted-foreground"}`,
	children: a ? "Ativo" : "Inativo"
});
function F({ l, k, f, set, wide, num }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `space-y-1.5 ${wide ? "sm:col-span-2" : ""}`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: l }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			type: num ? "number" : "text",
			step: "0.01",
			className: num ? "num" : "",
			value: String(f[k] ?? ""),
			onChange: (e) => set(k, num ? Number(e.target.value) : e.target.value)
		})]
	});
}
//#endregion
export { Cadastros as component };
