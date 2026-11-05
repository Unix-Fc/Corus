import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { STATUS_LABEL, type QuoteStatus } from "@/lib/data";

const styles: Record<QuoteStatus, string> = {
  rascunho: "bg-muted text-muted-foreground border-border",
  pendente: "bg-warning-soft text-warning-foreground border-warning/40",
  em_negociacao: "bg-info-soft text-primary border-primary/30",
  aprovado: "bg-success-soft text-success border-success/40",
  reprovado: "bg-destructive/10 text-destructive border-destructive/30",
};

export function StatusBadge({ status }: { status: QuoteStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-medium", styles[status])}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function PendingTag({ children = "Pendente de validação" }: { children?: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-sm border border-warning/40 bg-warning-soft px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-warning-foreground">
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}
