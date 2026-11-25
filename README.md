# Corus — Orçamentos Industriais

Sistema para elaborar orçamentos de fabricação. O Corus calcula o custo de materiais, operações internas e serviços externos, estima o tempo de produção e acompanha a proposta até a aprovação.

## Pré-requisitos

- Git e Node.js 24 com npm.
- Para um banco local, [Supabase CLI](https://supabase.com/docs/guides/local-development) e um runtime de contêineres compatível com Docker em execução.

## Instalação

```bash
git clone --branch develop https://github.com/Unix-Fc/Corus.git
cd Corus
npm ci
```

### Banco e autenticação

Para preparar um ambiente local novo, execute na raiz do repositório:

```bash
supabase start
supabase status
```

Use a URL da API, as chaves e a URL do banco exibidas pelo Supabase para criar um arquivo `.env.local` na raiz:

```dotenv
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_PUBLISHABLE_KEY=<chave-publishable-ou-anon>
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_PUBLISHABLE_KEY=<mesma-chave-publishable-ou-anon>
SUPABASE_SERVICE_ROLE_KEY=<chave-secret-ou-service_role>
LOVABLE_DB_MIGRATION_URL=<url-postgres-do-banco-local>
```

Preencha as duas variáveis de URL com o endereço da API do seu ambiente. Use a chave de servidor apenas em `SUPABASE_SERVICE_ROLE_KEY` e guarde o arquivo `.env.local` fora do Git.

No banco local novo, aplique as migrações versionadas:

```bash
node --env-file=.env.local node_modules/drizzle-kit/bin.cjs migrate
```

Abra o endereço do **Supabase Studio** exibido por `supabase status` e crie um usuário confirmado em **Authentication → Users**. Depois das migrações, o primeiro usuário criado no ambiente novo recebe o perfil de administrador. O administrador pode cadastrar outros usuários na tela **Usuários e perfis** do Corus.

Se a equipe já forneceu um ambiente Supabase configurado, preencha `.env.local` com a URL da API e as chaves desse ambiente e siga para a execução. Use `LOVABLE_DB_MIGRATION_URL` para preparar o banco local.

### Executar o Corus

```bash
node --env-file=.env.local node_modules/vite/bin/vite.js dev --host 127.0.0.1
```

Abra a URL local exibida no terminal e entre com e-mail e senha.

## Criar um orçamento

1. Como administrador, abra **Cadastros** e adicione o cliente e os recursos que serão usados, como materiais, máquinas, ferramentas, cargos e serviços externos.
2. Abra **Orçamentos → Novo orçamento**. Selecione o cliente, preencha o projeto e o nome da peça e informe a quantidade do lote.
3. Adicione materiais, operações e serviços externos conforme necessário. Revise a quantidade, o valor unitário, os tempos e os percentuais de perda de material, margem e impostos.
4. Confira o custo, o preço de venda e o tempo estimado. Use **Salvar rascunho** para retomar a edição depois ou **Salvar orçamento** para registrar o orçamento.
5. Acompanhe o status em **Orçamentos** ou **Pipeline**. Após a aprovação, abra **Proposta → Imprimir / PDF** se precisar gerar a proposta comercial.

## Diagrama de classes

![Diagrama de classes UML do Corus](Diagrama%20de%20Classes/diagrama_classes.png)

- [Arquivo PNG](Diagrama%20de%20Classes/diagrama_classes.png)
- [Corus Backlog](https://github.com/orgs/Unix-Fc/projects/5)
- [Documentação do Discovery](docs/discovery/README.md)
