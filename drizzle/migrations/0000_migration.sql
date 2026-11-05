create type public.app_role as enum ('admin','orcamentista','gerente');
create type public.quote_status as enum ('rascunho','pendente','em_negociacao','aprovado','reprovado');
create type public.catalog_kind as enum ('material','maquina','ferramenta','cargo','servico');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text, email text, created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;
create policy "profiles read" on public.profiles for select to authenticated using (true);
create policy "profiles update own" on public.profiles for update to authenticated using (auth.uid() = id);

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null, unique (user_id, role)
);
grant select, insert, update, delete on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create or replace function public.has_any_role(_user_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id) $$;

create policy "roles read" on public.user_roles for select to authenticated using (true);
create policy "roles admin write" on public.user_roles for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email,'@',1)), new.email);
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'orcamentista');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

create table public.clients (
  id uuid primary key default gen_random_uuid(),
  name text not null, cnpj text, contact text, email text, phone text, city text,
  active boolean not null default true, notes text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.catalog_items (
  id uuid primary key default gen_random_uuid(),
  kind public.catalog_kind not null, code text, name text not null, unit text,
  unit_cost numeric(14,2) not null default 0, details jsonb not null default '{}'::jsonb,
  active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.calc_parameters (
  key text primary key, label text not null, value numeric(14,4) not null default 0,
  unit text, validated boolean not null default false, note text,
  updated_at timestamptz not null default now()
);
create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  number serial unique,
  client_id uuid references public.clients(id),
  project text, part_name text not null, part_code text, quantity integer not null default 1,
  specs jsonb not null default '{}'::jsonb,
  materials jsonb not null default '[]'::jsonb,
  operations jsonb not null default '[]'::jsonb,
  services jsonb not null default '[]'::jsonb,
  adjustments jsonb not null default '{}'::jsonb,
  status public.quote_status not null default 'rascunho',
  lead_time_days numeric(8,1), lead_time_manual boolean not null default false,
  total numeric(14,2) not null default 0, notes text,
  created_by uuid, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.audit_log (
  id bigserial primary key, entity text not null, entity_id text not null, action text not null,
  changes jsonb, user_id uuid, user_email text, created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.clients, public.catalog_items, public.calc_parameters, public.quotes to authenticated;
grant select on public.audit_log to authenticated;
grant usage on sequence public.quotes_number_seq to authenticated;
grant all on public.clients, public.catalog_items, public.calc_parameters, public.quotes, public.audit_log to service_role;

alter table public.clients enable row level security;
alter table public.catalog_items enable row level security;
alter table public.calc_parameters enable row level security;
alter table public.quotes enable row level security;
alter table public.audit_log enable row level security;

create policy "clients read" on public.clients for select to authenticated using (public.has_any_role(auth.uid()));
create policy "clients write" on public.clients for all to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'orcamentista'))
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'orcamentista'));
create policy "catalog read" on public.catalog_items for select to authenticated using (public.has_any_role(auth.uid()));
create policy "catalog write" on public.catalog_items for all to authenticated
  using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'orcamentista'))
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'orcamentista'));
create policy "params read" on public.calc_parameters for select to authenticated using (public.has_any_role(auth.uid()));
create policy "params admin write" on public.calc_parameters for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
create policy "quotes read" on public.quotes for select to authenticated using (public.has_any_role(auth.uid()));
create policy "quotes insert" on public.quotes for insert to authenticated
  with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'orcamentista'));
create policy "quotes update" on public.quotes for update to authenticated using (public.has_any_role(auth.uid()));
create policy "quotes delete" on public.quotes for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "audit read" on public.audit_log for select to authenticated using (public.has_any_role(auth.uid()));

create or replace function public.audit_trigger() returns trigger
language plpgsql security definer set search_path = public as $$
declare diff jsonb := '{}'::jsonb; k text; o jsonb; n jsonb; eid text;
begin
  if tg_op = 'DELETE' then o := to_jsonb(old); eid := coalesce(o->>'id', o->>'key');
    insert into public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    values (tg_table_name, eid, 'excluído', o, auth.uid(), (select email from public.profiles where id = auth.uid()));
    return old;
  end if;
  n := to_jsonb(new); eid := coalesce(n->>'id', n->>'key');
  if tg_op = 'UPDATE' then
    o := to_jsonb(old);
    new.updated_at := now();
    for k in select jsonb_object_keys(n) loop
      if k <> 'updated_at' and (o->k) is distinct from (n->k) then
        diff := diff || jsonb_build_object(k, jsonb_build_object('de', o->k, 'para', n->k));
      end if;
    end loop;
    if diff = '{}'::jsonb then return new; end if;
    insert into public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    values (tg_table_name, eid, 'alterado', diff, auth.uid(), (select email from public.profiles where id = auth.uid()));
  else
    insert into public.audit_log(entity, entity_id, action, changes, user_id, user_email)
    values (tg_table_name, eid, 'criado', null, auth.uid(), (select email from public.profiles where id = auth.uid()));
  end if;
  return new;
end $$;

create trigger audit_clients before insert or update or delete on public.clients for each row execute function public.audit_trigger();
create trigger audit_catalog before insert or update or delete on public.catalog_items for each row execute function public.audit_trigger();
create trigger audit_params before insert or update or delete on public.calc_parameters for each row execute function public.audit_trigger();
create trigger audit_quotes before insert or update or delete on public.quotes for each row execute function public.audit_trigger();

insert into public.calc_parameters (key,label,value,unit,validated,note) values
('perda_material_pct','Perda de material',0,'%',false,'Fórmula de perdas em descoberta'),
('margem_pct','Margem',0,'%',false,'Política de margem pendente de validação comercial'),
('imposto_pct','Impostos',0,'%',false,'Regime tributário a validar com o fiscal'),
('horas_dia','Horas produtivas por dia',8,'h',false,'Usado na estimativa de prazo');

insert into public.clients (id,name,cnpj,contact,email,phone,city) values
('11111111-0000-0000-0000-000000000001','Metalúrgica Vale do Aço Ltda','12.345.678/0001-90','Ricardo Mendes','compras@valedoaco.com.br','(31) 3822-1100','Ipatinga/MG'),
('11111111-0000-0000-0000-000000000002','Usina Paulista de Açúcar S.A.','23.456.789/0001-01','Fernanda Lima','manutencao@usinapaulista.com.br','(16) 3945-2200','Sertãozinho/SP'),
('11111111-0000-0000-0000-000000000003','Mineração Serra Norte','34.567.890/0001-12','Carlos Andrade','suprimentos@serranorte.com.br','(94) 3346-3300','Parauapebas/PA'),
('11111111-0000-0000-0000-000000000004','Papel & Celulose Sul','45.678.901/0001-23','Juliana Rocha','engenharia@pcsul.com.br','(42) 3220-4400','Telêmaco Borba/PR'),
('11111111-0000-0000-0000-000000000005','Hidrotec Bombas Industriais','56.789.012/0001-34','Marcos Teixeira','marcos@hidrotec.com.br','(47) 3301-5500','Joinville/SC');

insert into public.catalog_items (id,kind,code,name,unit,unit_cost,details) values
('22222222-0000-0000-0000-000000000001','material','MAT-1045','Aço SAE 1045 redondo','kg',12.80,'{"norma":"SAE J403"}'),
('22222222-0000-0000-0000-000000000002','material','MAT-4140','Aço SAE 4140 beneficiado','kg',21.50,'{"norma":"SAE J404"}'),
('22222222-0000-0000-0000-000000000003','material','MAT-304','Aço inox AISI 304','kg',38.90,'{}'),
('22222222-0000-0000-0000-000000000004','material','MAT-BRZ','Bronze TM-23','kg',89.00,'{}'),
('22222222-0000-0000-0000-000000000005','material','MAT-A36','Chapa ASTM A36 1/2"','kg',9.70,'{}'),
('22222222-0000-0000-0000-000000000011','maquina','MQ-TCN01','Torno CNC Romi GL 300','h',185.00,'{"setup_padrao_h":1.5}'),
('22222222-0000-0000-0000-000000000012','maquina','MQ-CU01','Centro de usinagem Romi D 800','h',240.00,'{"setup_padrao_h":2}'),
('22222222-0000-0000-0000-000000000013','maquina','MQ-TC02','Torno convencional Nardini','h',95.00,'{"setup_padrao_h":0.75}'),
('22222222-0000-0000-0000-000000000014','maquina','MQ-RET01','Retífica cilíndrica','h',160.00,'{"setup_padrao_h":1}'),
('22222222-0000-0000-0000-000000000015','maquina','MQ-SOL01','Solda MIG','h',110.00,'{"setup_padrao_h":0.5}'),
('22222222-0000-0000-0000-000000000021','ferramenta','FR-PST01','Pastilha de metal duro CNMG','un',48.00,'{}'),
('22222222-0000-0000-0000-000000000022','ferramenta','FR-FRS01','Fresa de topo Ø16 metal duro','un',320.00,'{}'),
('22222222-0000-0000-0000-000000000023','ferramenta','FR-BRC01','Broca helicoidal Ø12','un',65.00,'{}'),
('22222222-0000-0000-0000-000000000031','cargo','CG-TOR','Torneiro mecânico','h',42.00,'{"salario_mensal":6200}'),
('22222222-0000-0000-0000-000000000032','cargo','CG-OPC','Operador CNC','h',48.00,'{"salario_mensal":7100}'),
('22222222-0000-0000-0000-000000000033','cargo','CG-SOL','Soldador','h',39.00,'{"salario_mensal":5800}'),
('22222222-0000-0000-0000-000000000041','servico','SV-TT01','Têmpera e revenimento','kg',14.50,'{"fornecedor":"TermoTec"}'),
('22222222-0000-0000-0000-000000000042','servico','SV-CR01','Cromo duro','dm²',22.00,'{"fornecedor":"Galvano Sul"}'),
('22222222-0000-0000-0000-000000000043','servico','SV-NIT01','Nitretação','kg',18.00,'{"fornecedor":"TermoTec"}'),
('22222222-0000-0000-0000-000000000044','servico','SV-END01','Ensaio por líquido penetrante','un',120.00,'{"fornecedor":"Qualinspec"}');

insert into public.quotes (client_id,project,part_name,part_code,quantity,specs,materials,operations,services,status,total,lead_time_days) values
('11111111-0000-0000-0000-000000000001','Redutor laminador L2','Eixo de transmissão','EX-2201',4,
 '{"desenho":"DES-2201 rev.B","tolerancia":"h7 nos mancais","tratamento_termico_aplicavel":true,"tratamento_termico":"Têmpera e revenimento 28-32 HRC","acabamento":"Ra 0,8 nos mancais"}',
 '[{"item_id":"22222222-0000-0000-0000-000000000002","description":"Aço SAE 4140 beneficiado","unit":"kg","qty":96,"unit_cost":21.5}]',
 '[{"machine_id":"22222222-0000-0000-0000-000000000011","tool_id":"22222222-0000-0000-0000-000000000021","description":"Torneamento desbaste e acabamento","setup_h":1.5,"time_min":95,"cost_hour":185,"time_source":"manual"},{"machine_id":"22222222-0000-0000-0000-000000000014","tool_id":null,"description":"Retífica dos mancais","setup_h":1,"time_min":40,"cost_hour":160,"time_source":"manual"}]',
 '[{"item_id":"22222222-0000-0000-0000-000000000041","description":"Têmpera e revenimento","unit":"kg","qty":80,"unit_cost":14.5}]',
 'em_negociacao',5162.33,3.4),
('11111111-0000-0000-0000-000000000002','Moenda terno 3','Bucha de bronze','BC-0310',12,
 '{"desenho":"DES-0310 rev.A","tolerancia":"H8 interno","tratamento_termico_aplicavel":false}',
 '[{"item_id":"22222222-0000-0000-0000-000000000004","description":"Bronze TM-23","unit":"kg","qty":54,"unit_cost":89}]',
 '[{"machine_id":"22222222-0000-0000-0000-000000000013","tool_id":"22222222-0000-0000-0000-000000000021","description":"Torneamento interno/externo","setup_h":0.75,"time_min":35,"cost_hour":95,"time_source":"manual"}]',
 '[]','pendente',5548.25,1.0),
('11111111-0000-0000-0000-000000000003','Britador primário','Flange de acoplamento','FL-0450',2,
 '{"desenho":"","tolerancia":"","tratamento_termico_aplicavel":true,"tratamento_termico":""}',
 '[{"item_id":"22222222-0000-0000-0000-000000000001","description":"Aço SAE 1045 redondo","unit":"kg","qty":70,"unit_cost":12.8}]',
 '[{"machine_id":"22222222-0000-0000-0000-000000000012","tool_id":"22222222-0000-0000-0000-000000000022","description":"Fresamento furação de flange","setup_h":2,"time_min":120,"cost_hour":240,"time_source":"parametro"}]',
 '[]','rascunho',2336.00,0.8),
('11111111-0000-0000-0000-000000000004','Secadora PM1','Rolo guia cromado','RG-1180',1,
 '{"desenho":"DES-1180 rev.C","tolerancia":"±0,02 mm","tratamento_termico_aplicavel":false,"acabamento":"Cromo duro 80 µm"}',
 '[{"item_id":"22222222-0000-0000-0000-000000000005","description":"Chapa ASTM A36 1/2\"","unit":"kg","qty":180,"unit_cost":9.7}]',
 '[{"machine_id":"22222222-0000-0000-0000-000000000015","tool_id":null,"description":"Calandragem e solda do corpo","setup_h":0.5,"time_min":360,"cost_hour":110,"time_source":"manual"},{"machine_id":"22222222-0000-0000-0000-000000000011","tool_id":"22222222-0000-0000-0000-000000000021","description":"Torneamento do corpo","setup_h":1.5,"time_min":240,"cost_hour":185,"time_source":"manual"}]',
 '[{"item_id":"22222222-0000-0000-0000-000000000042","description":"Cromo duro","unit":"dm²","qty":95,"unit_cost":22}]',
 'aprovado',4916.00,1.6),
('11111111-0000-0000-0000-000000000005','Linha B','Eixo de bomba inox','EB-0077',6,
 '{"desenho":"DES-0077 rev.A","tolerancia":"g6","tratamento_termico_aplicavel":false}',
 '[{"item_id":"22222222-0000-0000-0000-000000000003","description":"Aço inox AISI 304","unit":"kg","qty":42,"unit_cost":38.9}]',
 '[{"machine_id":"22222222-0000-0000-0000-000000000011","tool_id":"22222222-0000-0000-0000-000000000021","description":"Torneamento CNC","setup_h":1.5,"time_min":50,"cost_hour":185,"time_source":"manual"}]',
 '[{"item_id":"22222222-0000-0000-0000-000000000044","description":"Ensaio por líquido penetrante","unit":"un","qty":6,"unit_cost":120}]',
 'reprovado',3651.30,0.8);
