import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  FileText,
  KanbanSquare,
  AlertTriangle,
  Database,
  SlidersHorizontal,
  History,
  Users,
  Factory,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useMe } from "@/hooks/use-me";
import { ROLE_LABEL } from "@/lib/data";

const groups = [
  {
    label: "Operação",
    items: [
      { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
      { title: "Orçamentos", url: "/orcamentos", icon: FileText },
      { title: "Pipeline", url: "/pipeline", icon: KanbanSquare },
      { title: "Pendências técnicas", url: "/pendencias", icon: AlertTriangle },
    ],
  },
  {
    label: "Configuração",
    items: [
      { title: "Cadastros", url: "/cadastros", icon: Database },
      {
        title: "Parâmetros de cálculo",
        url: "/parametros",
        icon: SlidersHorizontal,
      },
      { title: "Auditoria", url: "/auditoria", icon: History, adminOnly: true },
      { title: "Usuários e perfis", url: "/usuarios", icon: Users },
    ],
  },
] as {
  label: string;
  items: {
    title: string;
    url: string;
    icon: typeof Factory;
    adminOnly?: boolean;
  }[];
}[];

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });
  const { me, roles, can } = useMe();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2">
          <Factory className="h-5 w-5 shrink-0 text-sidebar-primary" />
          <div className="leading-tight group-data-[collapsible=icon]:hidden">
            <div className="text-sm font-bold tracking-widest text-sidebar-accent-foreground">
              CORUS
            </div>
            <div className="text-[11px] opacity-70">Orçamentos industriais</div>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {groups
          .filter((g) => g.label !== "Configuração" || can.manageUsers)
          .map((g) => (
            <SidebarGroup key={g.label}>
              <SidebarGroupLabel>{g.label}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {g.items
                    .filter((it) => !it.adminOnly || can.viewAudit)
                    .map((it) => (
                      <SidebarMenuItem key={it.url}>
                        <SidebarMenuButton
                          asChild
                          isActive={path.startsWith(it.url)}
                          tooltip={it.title}
                        >
                          <Link to={it.url as "/dashboard"}>
                            <it.icon />
                            <span>{it.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>
      <SidebarFooter>
        <div className="px-2 pb-2 text-xs group-data-[collapsible=icon]:hidden">
          <div className="truncate font-medium text-sidebar-accent-foreground">
            {me?.profile?.full_name ?? me?.user.email}
          </div>
          <div className="opacity-70">
            {roles.map((r) => ROLE_LABEL[r]).join(", ") || "Sem perfil"}
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
