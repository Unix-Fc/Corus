// Cálculo transparente do orçamento. Fórmulas de perda/margem/imposto são
// provisórias: percentuais configuráveis, padrão 0, pendentes de validação.

export type MaterialLine = {
  item_id?: string | null;
  description: string;
  unit: string;
  qty: number;
  unit_cost: number;
};
export type OperationLine = {
  sequence?: number;
  machine_id?: string | null;
  tool_id?: string | null;
  cargo_id?: string | null;
  machine_name_snapshot?: string | null;
  tool_name_snapshot?: string | null;
  cargo_name_snapshot?: string | null;
  description: string;
  salary_monthly?: number | null;
  setup_h: number;
  time_min: number; // minutos por peça
  cost_hour: number;
  time_source: "manual" | "parametro";
};
export type ServiceLine = MaterialLine;
export type Adjustments = {
  perda_material_pct?: number;
  margem_pct?: number;
  imposto_pct?: number;
};
export type Specs = {
  desenho?: string;
  tolerancia?: string;
  tratamento_termico_aplicavel?: boolean;
  tratamento_termico?: string;
  acabamento?: string;
  observacoes?: string;
};

export const round2 = (n: number) =>
  Math.round((Number(n) + Number.EPSILON) * 100) / 100;
const num = (n: unknown) => (Number.isFinite(Number(n)) ? Number(n) : 0);

export function monthlyHoursForQuote(
  savedSnapshot: number | null | undefined,
  configuredHours: number,
) {
  if (
    savedSnapshot != null &&
    Number.isFinite(savedSnapshot) &&
    savedSnapshot > 0
  ) {
    return savedSnapshot;
  }
  const configured = num(configuredHours);
  return configured > 0 ? configured : 220;
}

export function hourlyCostFromMonthlySalary(
  salary: number,
  monthlyHours = 220,
) {
  const hours = num(monthlyHours);
  return hours > 0 ? round2(Math.max(0, num(salary)) / hours) : 0;
}

export function materialCost(l: MaterialLine) {
  return round2(num(l.qty) * num(l.unit_cost));
}
export function operationHours(l: OperationLine, quantity: number) {
  return num(l.setup_h) + (num(l.time_min) / 60) * num(quantity);
}
export function operationHourlyCost(l: OperationLine, monthlyHours = 220) {
  const salaryCost =
    l.salary_monthly != null
      ? hourlyCostFromMonthlySalary(l.salary_monthly, monthlyHours)
      : 0;
  return round2(num(l.cost_hour) + salaryCost);
}
export function operationCost(
  l: OperationLine,
  quantity: number,
  monthlyHours = 220,
) {
  return round2(
    operationHours(l, quantity) * operationHourlyCost(l, monthlyHours),
  );
}

export function orderedOperations(operations: OperationLine[]) {
  return operations
    .map((operation, index) => ({
      ...operation,
      sequence: operation.sequence ?? index + 1,
      originalIndex: index,
    }))
    .sort(
      (a, b) => a.sequence - b.sequence || a.originalIndex - b.originalIndex,
    )
    .map(({ originalIndex: _originalIndex, ...operation }) => operation);
}

export function computeQuote(input: {
  quantity: number;
  materials: MaterialLine[];
  operations: OperationLine[];
  services: ServiceLine[];
  adjustments?: Adjustments;
  monthlyHours?: number;
}) {
  const q = num(input.quantity);
  const materials = round2(
    input.materials.reduce((s, l) => s + materialCost(l), 0),
  );
  const monthlyHours = input.monthlyHours ?? 220;
  const operations = round2(
    input.operations.reduce(
      (s, l) => s + operationCost(l, q, monthlyHours),
      0,
    ),
  );
  const services = round2(
    input.services.reduce((s, l) => s + materialCost(l), 0),
  );
  const subtotal = round2(materials + operations + services);
  const a = input.adjustments ?? {};
  const perda = round2((materials * num(a.perda_material_pct)) / 100);
  const margem = round2(((subtotal + perda) * num(a.margem_pct)) / 100);
  const imposto = round2(
    ((subtotal + perda + margem) * num(a.imposto_pct)) / 100,
  );
  const total = round2(subtotal + perda + margem + imposto);
  const unit = q > 0 ? round2(total / q) : 0;
  return {
    materials,
    operations,
    services,
    subtotal,
    perda,
    margem,
    imposto,
    total,
    unit,
  };
}

export function productionEstimate(
  operations: OperationLine[],
  quantity: number,
  hoursPerDay: number,
) {
  const setup = operations.reduce((s, l) => s + num(l.setup_h), 0);
  const run = operations.reduce(
    (s, l) => s + (num(l.time_min) / 60) * num(quantity),
    0,
  );
  const hours = round2(setup + run);
  const days =
    hoursPerDay > 0 ? Math.round((hours / hoursPerDay) * 10) / 10 : 0;
  const manual = operations.filter((o) => o.time_source === "manual").length;
  return {
    setup: round2(setup),
    run: round2(run),
    hours,
    days,
    manual,
    parametro: operations.length - manual,
  };
}

export type Pending = {
  field: string;
  message: string;
  severity: "alta" | "media";
};

export function technicalPendencies(
  specs: Specs,
  ctx: { materials: number; operations: number },
  ctx: {
    materials: number;
    operations: number;
    operationLines?: OperationLine[];
    monthlyHours?: number;
  },
): Pending[] {
  const p: Pending[] = [];
  if (!specs.desenho?.trim())
    p.push({
      field: "desenho",
      message: "Desenho técnico não informado",
      severity: "alta",
    });
  if (!specs.tolerancia?.trim())
    p.push({
      field: "tolerancia",
      message: "Tolerância não especificada",
      severity: "alta",
    });
  if (specs.tratamento_termico_aplicavel && !specs.tratamento_termico?.trim())
    p.push({
      field: "tratamento_termico",
      message: "Tratamento térmico aplicável, mas não especificado",
      severity: "media",
    });
  if (ctx.materials === 0)
    p.push({
      field: "materiais",
      message: "Nenhum material lançado",
      severity: "media",
    });
  if (ctx.operations === 0)
    p.push({
      field: "operacoes",
      message: "Nenhuma operação interna lançada",
      severity: "media",
    });
  if (ctx.operationLines) {
    const seenSequences = new Set<number>();
    orderedOperations(ctx.operationLines).forEach((operation, index) => {
      const sequence = operation.sequence ?? index + 1;
      const field = `operacao-${sequence}`;
      const issues: string[] = [];
      if (!Number.isInteger(sequence) || sequence < 1)
        issues.push("sequência inválida");
      if (seenSequences.has(sequence)) issues.push("sequência duplicada");
      seenSequences.add(sequence);
      if (!operation.description.trim()) issues.push("descrição não informada");
      if (!operation.machine_id) issues.push("máquina não selecionada");
      if (!Number.isFinite(operation.setup_h) || operation.setup_h < 0)
        issues.push("setup inválido");
      if (!Number.isFinite(operation.time_min) || operation.time_min <= 0)
        issues.push("tempo por peça deve ser maior que zero");
      if (
        !Number.isFinite(operation.cost_hour) ||
        operation.cost_hour < 0 ||
        operationHourlyCost(operation, ctx.monthlyHours) <= 0
      )
        issues.push("custo-hora aplicável não informado");
      if (issues.length > 0) {
        p.push({
          field,
          message: `Operação ${sequence}: ${issues.join(", ")}`,
          severity: "alta",
        });
      }
    });
  }
  return p;
}
