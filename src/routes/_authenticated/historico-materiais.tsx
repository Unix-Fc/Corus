import { useState, type FormEvent } from "react";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuthScope } from "@/hooks/use-auth-session";
import { useMe } from "@/hooks/use-me";
import { brl } from "@/lib/data";
import {
  historyMaterialsQuery,
  materialHistoryQuery,
  MATERIAL_PRICE_KIND_LABEL,
  recordMaterialPrice,
  unlinkedMaterialHistoryQuery,
  type HistoryMaterial,
} from "@/lib/material-price-history";

export const Route = createFileRoute("/_authenticated/historico-materiais")({
  head: () => ({ meta: [{ title: "Histórico de materiais — Corus" }] }),
  component: MaterialPriceHistory,
});

const selectClass =
  "h-9 w-full rounded-md border border-input bg-card px-2 text-sm";

function MaterialPriceHistory() {
  const { can, isPending, isError, refetch } = useMe();
  return (
    <>
      <PageHeader
        title="Histórico de materiais"
        subtitle="Consulte compras e referências de preço por material."
      />
      {isPending ? (
        <p role="status">Verificando permissões…</p>
      ) : isError ? (
        <QueryError
          message="Não foi possível verificar suas permissões."
          retry={() => void refetch()}
        />
      ) : can.access ? (
        <>
          <MaterialPicker canRecord={can.editCatalog} />
          <UnlinkedMaterialHistory />
        </>
      ) : (
        <p role="alert">
          Seu perfil não permite consultar o histórico de materiais.
        </p>
      )}
    </>
  );
}

function MaterialPicker({ canRecord }: { canRecord: boolean }) {
  const scope = useAuthScope();
  const materials = useInfiniteQuery(historyMaterialsQuery(scope));
  const [materialId, setMaterialId] = useState("");

  if (materials.isPending) return <p role="status">Carregando materiais…</p>;
  if (materials.isError && !materials.isFetchNextPageError) {
    return (
      <QueryError
        message="Não foi possível carregar os materiais."
        retry={() => void materials.refetch()}
      />
    );
  }

  // A rename can move an already loaded material past the next cursor.
  const rows = Array.from(
    new Map(
      materials.data?.pages.flatMap((page) =>
        page.rows.map((row) => [row.id, row] as const),
      ),
    ).values(),
  );
  if (rows.length === 0) return <p>Nenhum material cadastrado.</p>;
  const selected = rows.find((material) => material.id === materialId);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-3 p-4">
          <label className="block space-y-1 text-sm">
            <span>Material</span>
            <select
              className={selectClass}
              value={selected?.id ?? ""}
              onChange={(event) => setMaterialId(event.target.value)}
            >
              <option value="">Selecione um material</option>
              {rows.map((material) => (
                <option key={material.id} value={material.id}>
                  {[
                    material.code,
                    material.name,
                    material.active ? null : "Inativo",
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                </option>
              ))}
            </select>
          </label>
          {materials.hasNextPage && (
            <LoadMore
              label="materiais"
              failed={materials.isFetchNextPageError}
              busy={materials.isFetching}
              load={() =>
                void materials.fetchNextPage({ cancelRefetch: false })
              }
            />
          )}
        </CardContent>
      </Card>
      {selected && (
        <SelectedMaterial
          key={selected.id}
          material={selected}
          canRecord={canRecord}
        />
      )}
    </div>
  );
}

function UnlinkedMaterialHistory() {
  const scope = useAuthScope();
  const history = useInfiniteQuery(unlinkedMaterialHistoryQuery(scope));
  const failed = history.isError && !history.isFetchNextPageError;
  const rows = failed
    ? []
    : (history.data?.pages.flatMap((page) => page.rows) ?? []);

  if (history.isPending) return <p role="status">Carregando históricos preservados…</p>;
  if (failed) {
    return (
      <QueryError
        message="Não foi possível carregar históricos de materiais excluídos."
        retry={() => void history.refetch()}
      />
    );
  }
  if (rows.length === 0) return null;

  return (
    <Card className="mt-6">
      <CardContent className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">
          Histórico de materiais excluídos
        </h2>
        <p className="text-sm text-muted-foreground">
          Os registros foram preservados após a exclusão do cadastro de origem.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b">
                <th scope="col" className="p-2">
                  Material
                </th>
                <th scope="col" className="p-2">
                  Tipo
                </th>
                <th scope="col" className="p-2">
                  Data
                </th>
                <th scope="col" className="p-2">
                  Preço unitário
                </th>
                <th scope="col" className="p-2">
                  Origem
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b align-top last:border-0">
                  <td className="p-2">{row.material_name_snapshot}</td>
                  <td className="p-2">{MATERIAL_PRICE_KIND_LABEL[row.kind]}</td>
                  <td className="p-2 whitespace-nowrap">
                    {row.occurred_on
                      ? row.occurred_on.split("-").reverse().join("/")
                      : "Não informada"}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    {brl(row.unit_price)} / {row.unit}
                  </td>
                  <td className="p-2 wrap-anywhere">{row.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {history.hasNextPage && (
          <LoadMore
            label="registros"
            failed={history.isFetchNextPageError}
            busy={history.isFetching}
            load={() => void history.fetchNextPage({ cancelRefetch: false })}
          />
        )}
      </CardContent>
    </Card>
  );
}

function SelectedMaterial({
  material,
  canRecord,
}: {
  material: HistoryMaterial;
  canRecord: boolean;
}) {
  const scope = useAuthScope();
  const options = materialHistoryQuery(scope, material.id);
  const history = useInfiniteQuery(options);
  const failed = history.isError && !history.isFetchNextPageError;
  const rows = failed
    ? []
    : (history.data?.pages.flatMap((page) => page.rows) ?? []);

  return (
    <>
      <Card>
        <CardContent className="space-y-2 p-4">
          <h2 className="text-lg font-semibold">
            {material.active
              ? "Preço vigente no catálogo"
              : "Preço no catálogo · material inativo"}
          </h2>
          {material.unit_cost > 0 ? (
            <>
              <p className="text-lg font-medium">
                {brl(material.unit_cost)}
                {material.unit ? ` / ${material.unit}` : ""}
              </p>
              <p className="text-sm text-muted-foreground">
                Cadastro de materiais. Data e fonte original do preço
                indisponíveis.
              </p>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhum preço de referência informado no catálogo.
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 p-4">
          <h2 className="text-lg font-semibold">Compras e preços históricos</h2>
          {history.isPending && <p role="status">Carregando histórico…</p>}
          {failed && (
            <QueryError
              message="Não foi possível carregar o histórico."
              retry={() => void history.refetch()}
            />
          )}
          {history.isSuccess && rows.length === 0 && (
            <p>Nenhum registro de compra ou preço para este material.</p>
          )}
          {rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="p-2">
                      Tipo
                    </th>
                    <th scope="col" className="p-2">
                      Data
                    </th>
                    <th scope="col" className="p-2">
                      Preço unitário
                    </th>
                    <th scope="col" className="p-2">
                      Origem
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr
                      key={row.id}
                      className="border-b align-top last:border-0"
                    >
                      <td className="p-2">
                        {MATERIAL_PRICE_KIND_LABEL[row.kind]}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {row.occurred_on
                          ? row.occurred_on.split("-").reverse().join("/")
                          : "Não informada"}
                      </td>
                      <td className="p-2 whitespace-nowrap">
                        {brl(row.unit_price)} / {row.unit}
                      </td>
                      <td className="p-2 wrap-anywhere">{row.source}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!failed && history.hasNextPage && (
            <LoadMore
              label="registros"
              failed={history.isFetchNextPageError}
              busy={history.isFetching}
              load={() => void history.fetchNextPage({ cancelRefetch: false })}
            />
          )}
        </CardContent>
      </Card>

      {canRecord && (
        <RegisterPrice material={material} queryKey={options.queryKey} />
      )}
    </>
  );
}

function RegisterPrice({
  material,
  queryKey,
}: {
  material: HistoryMaterial;
  queryKey: readonly unknown[];
}) {
  const qc = useQueryClient();
  const registration = useMutation({ mutationFn: recordMaterialPrice });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (registration.isPending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    registration.mutate(
      {
        material_id: material.id,
        kind: String(fields.get("kind") ?? ""),
        unit_price: String(fields.get("unit_price") ?? ""),
        unit: String(fields.get("unit") ?? ""),
        occurred_on: String(fields.get("occurred_on") ?? ""),
        source: String(fields.get("source") ?? ""),
      },
      {
        onSuccess: () => {
          form.reset();
          toast.success("Preço registrado no histórico.");
          void qc.invalidateQueries({ queryKey });
          void qc.invalidateQueries({ queryKey: ["audit"] });
        },
      },
    );
  }

  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <h2 className="text-lg font-semibold">
          Registrar compra ou referência
        </h2>
        <form onSubmit={submit} noValidate>
          <fieldset disabled={registration.isPending} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span>Tipo de registro</span>
                <select
                  name="kind"
                  className={selectClass}
                  defaultValue="referencia"
                >
                  {Object.entries(MATERIAL_PRICE_KIND_LABEL).map(
                    ([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ),
                  )}
                </select>
              </label>
              <label className="space-y-1 text-sm">
                <span>Data da compra ou da referência (opcional)</span>
                <Input name="occurred_on" type="date" />
              </label>
              <label className="space-y-1 text-sm">
                <span>Preço unitário em reais</span>
                <Input
                  name="unit_price"
                  inputMode="decimal"
                  placeholder="0,00"
                  required
                />
              </label>
              <label className="space-y-1 text-sm">
                <span>Unidade do preço</span>
                <Input
                  name="unit"
                  defaultValue={material.unit ?? ""}
                  placeholder="kg, m ou un"
                  required
                />
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span>Fonte ou referência do documento</span>
              <Input
                name="source"
                placeholder="Ex.: fornecedor e número da nota ou cotação"
                required
              />
            </label>
            {registration.error && (
              <p role="alert" className="text-sm text-destructive">
                {registration.error.message}
              </p>
            )}
            <Button type="submit">
              {registration.isPending ? "Registrando…" : "Registrar preço"}
            </Button>
          </fieldset>
        </form>
      </CardContent>
    </Card>
  );
}

function QueryError({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="space-y-2">
      <p role="alert" className="text-sm text-destructive">
        {message}
      </p>
      <Button variant="outline" size="sm" onClick={retry}>
        Tentar novamente
      </Button>
    </div>
  );
}

function LoadMore({
  label,
  failed,
  busy,
  load,
}: {
  label: "materiais" | "registros";
  failed: boolean;
  busy: boolean;
  load: () => void;
}) {
  return (
    <div className="space-y-2">
      {failed && (
        <p role="alert" className="text-sm text-destructive">
          Não foi possível carregar mais {label}.
        </p>
      )}
      <Button variant="outline" size="sm" disabled={busy} onClick={load}>
        {busy ? "Carregando…" : `Carregar mais ${label}`}
      </Button>
    </div>
  );
}
