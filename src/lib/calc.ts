// Cálculo transparente do orçamento. Fórmulas de perda/margem/imposto são
// provisórias: percentuais configuráveis, padrão 0, pendentes de validação.

export type MaterialLine = {
  item_id?: string | null;
  description: string;
  unit: string;
  qty: number;
  unit_cost: number;
  raw_dimensions?: string;
  weight_kg?: number;
  cost_per_kg?: number;
  use_factor?: number;
  history_reference?: string;
  history_inconsistent?: boolean;
};
export type OperationLine = {
  machine_id?: string | null;
  tool_id?: string | null;
  cargo_id?: string | null;
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

export function hourlyCostFromMonthlySalary(salary: number) {
  return round2(Math.max(0, num(salary)) / 220);
}

export function materialCost(l: MaterialLine) {
  const hasConsumptionInputs =
    l.raw_dimensions !== undefined ||
    l.weight_kg !== undefined ||
    l.cost_per_kg !== undefined ||
    l.use_factor !== undefined;
  if (hasConsumptionInputs) {
    if (
      !hasText(l.raw_dimensions) ||
      !isPositive(l.weight_kg) ||
      !isPositive(l.cost_per_kg) ||
      !isPositive(l.use_factor) ||
      !isPositive(l.qty)
    )
      return 0;
    return round2(l.weight_kg * l.cost_per_kg * l.use_factor * l.qty);
  }
  return round2(num(l.qty) * num(l.unit_cost));
}

export function materialInputIssues(materials: MaterialLine[]) {
  return materials.flatMap((material, index) => {
    const item = index + 1;
    const issues: string[] = [];
    if (!hasText(material.description))
      issues.push(`Material ${item}: identifique a matéria-prima.`);
    if (!hasText(material.raw_dimensions))
      issues.push(`Material ${item}: informe as dimensões brutas.`);
    if (!isPositive(material.weight_kg))
      issues.push(`Material ${item}: informe um peso bruto maior que zero.`);
    if (!isPositive(material.cost_per_kg))
      issues.push(`Material ${item}: informe um custo por kg maior que zero.`);
    if (!isPositive(material.use_factor))
      issues.push(`Material ${item}: informe um fator de uso maior que zero.`);
    if (!isPositive(material.qty))
      issues.push(`Material ${item}: informe uma quantidade maior que zero.`);
    return issues;
  });
}

function isPositive(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function hasText(value: string | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}
export function operationHours(l: OperationLine, quantity: number) {
  return num(l.setup_h) + (num(l.time_min) / 60) * num(quantity);
}
export function operationHourlyCost(l: OperationLine) {
  const salaryCost =
    l.cargo_id && l.salary_monthly != null
      ? hourlyCostFromMonthlySalary(l.salary_monthly)
      : 0;
  return round2(num(l.cost_hour) + salaryCost);
}
export function operationCost(l: OperationLine, quantity: number) {
  return round2(operationHours(l, quantity) * operationHourlyCost(l));
}

export function computeQuote(input: {
  quantity: number;
  materials: MaterialLine[];
  operations: OperationLine[];
  services: ServiceLine[];
  adjustments?: Adjustments;
}) {
  const q = num(input.quantity);
  const materials = round2(
    input.materials.reduce((s, l) => s + materialCost(l), 0),
  );
  const operations = round2(
    input.operations.reduce((s, l) => s + operationCost(l, q), 0),
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
  return p;
}
