# Backlog consolidado do Discovery

## Status e convenção

Este backlog organiza as capacidades identificadas nos requisitos consolidados. Ele é uma **entrada funcional para as próximas etapas**, não uma autorização de desenvolvimento nem uma priorização final.

O SRC-04 preserva `OBJ-001..006`, `FR-001..021` e demais identificadores, mas não contém a lista de Epic/Feature/User Story do backlog tratado em conversas anteriores. Como o conteúdo integral desse backlog não está presente nas fontes consolidadas disponíveis nesta baseline, este documento **não inventa IDs `EPIC`, `FEAT`, `US` ou `AC`**. Os itens abaixo são agrupamentos funcionais rastreáveis pelos FRs. IDs anteriores devem ser incorporados sem renumeração quando o backlog original validado for anexado/recuperado.

## Priorização de validação herdada do SRC-04

- **P0:** fórmula de custo/preço (`OPEN-001..003`); estimativa de tempo (`OPEN-004/005`); dados técnicos e pendências (`OPEN-006..010`); materiais, fator de uso, preços e qualidade do histórico (`OPEN-011..014`).
- **P1:** ERP, estoque e importação (`OPEN-015..017`); estados, permissões e revisões (`OPEN-018`, `OPEN-020`, `OPEN-022`); documento ao cliente e relatórios (`OPEN-021`, `OPEN-025`, `OPEN-026`).
- **P2:** desempenho, compatibilidade e transição (`OPEN-029..031`).

A prioridade acima é de **validação no Discovery**, não uma decisão definitiva de ordem de implementação.

## Agrupamentos funcionais candidatos

### Grupo funcional — acesso e governança de usuários — Acesso e governança de usuários
**Requisitos:** FR-001. **Objetivos:** OBJ-005. **Atores:** ACT-001 a ACT-006, conforme permissões a validar.

**Objetivo:** permitir acesso individual e limitar operações/informações conforme responsabilidades.

**História candidata:** Como usuário interno autorizado, quero acessar o sistema com minha identidade e permissões, para consultar e executar somente as atividades compatíveis com meu papel.

**Descrição e escopo:**
- autenticação individual;
- associação de usuário a perfil/permissões;
- restrição de funcionalidades e informações;
- proteção de informações internas, incluindo dados de custos e cargos/salários.

**Regras/questões:** NFR-010; OPEN-020; OPEN-032; DEP-007. O cliente não deve ser considerado usuário do sistema até confirmação.

**Critérios preliminares:** usuário não autenticado não acessa áreas internas; funcionalidades são limitadas conforme permissões; a matriz de permissões deve ser validada pelos responsáveis.

**Prioridade:** P1 para validação de governança. **Valor:** segurança, confidencialidade e responsabilidade operacional.

### Grupo funcional — cadastros e parâmetros industriais — Cadastros e parâmetros industriais
**Requisitos:** FR-002. **Objetivos:** OBJ-002, OBJ-003. **Atores:** ACT-006, ACT-005 e ACT-002.

**Objetivo:** manter os dados de referência necessários às estimativas e cálculos.

**História candidata:** Como administrador/gestor de cadastros autorizado, quero manter máquinas, ferramentas, matérias-primas, cargos/salários e demais parâmetros, para que os orçamentos utilizem referências conhecidas e atualizáveis.

**Descrição e escopo:**
- cadastrar, consultar e atualizar máquinas, ferramentas, matérias-primas, cargos/salários e parâmetros;
- identificar quais parâmetros foram utilizados em cada orçamento;
- considerar diferenças por setor/processo.

**Regras/questões:** BR-001 a BR-006; OPEN-003, OPEN-027; NFR-003. Campos, unidades, permissões e responsáveis de validação não estão fechados.

**Critérios preliminares:** permitir manter parâmetros autorizados; identificar os parâmetros usados no orçamento; validar lista de campos por setor/processo.

**Prioridade:** P0 para validar parâmetros que influenciam custo e tempo. **Valor:** consistência e reutilização de referências.

### Grupo funcional — clientes, projetos e peças — Cadastro de clientes, projetos e peças
**Requisitos:** FR-009, FR-005. **Objetivos:** OBJ-001, OBJ-005. **Atores:** ACT-002, ACT-007.

**Objetivo:** associar solicitações, peças e orçamentos a clientes e projetos.

**História candidata:** Como orçamentista, quero registrar clientes e projetos/peças e associar seus documentos técnicos, para manter o contexto da solicitação durante a elaboração e consulta do orçamento.

**Descrição e escopo:**
- cadastrar cliente;
- cadastrar projeto/peça e associar ao cliente;
- associar dados básicos e especificações;
- evitar duplicidade conforme regra a definir;
- manter referência aos desenhos/documentos.

**Regras/questões:** DAT-002 a DAT-004; OPEN-006, OPEN-007; campos e política de duplicidade não definidos.

**Critérios preliminares:** orçamento vinculado a cliente; cliente pode possuir múltiplos projetos/orçamentos; dados técnicos e documentos devem estar referenciados.

**Prioridade:** P0/P1, conforme dependência do cálculo e do fluxo. **Valor:** organização do processo e rastreabilidade.

**Execução da história US-001 (namespace da issue):** o fluxo implementado mantém projeto e peça como campos do orçamento e restringe o cadastro de clientes a administradores; orçamentistas selecionam clientes existentes. Para concluir o cadastro, cliente, projeto e peça são exigidos. Pendências técnicas são sinalizadas sem bloquear o salvamento enquanto a regra de suficiência não for aprovada. Os identificadores BR-010 e OPEN-001 fornecidos com US-001 permanecem separados dos IDs do SRC-04; campos detalhados, duplicidade e identificação de peças recorrentes continuam pendentes de validação.

### Grupo funcional — dados técnicos — Registro e validação de dados técnicos
**Requisitos:** FR-005, FR-013, FR-015. **Objetivos:** OBJ-001, OBJ-002, OBJ-005. **Atores:** ACT-002, ACT-004, ACT-003, ACT-005.

**Objetivo:** reduzir interrupções e retrabalho decorrentes de informações incompletas ou ambíguas.

**História candidata:** Como orçamentista ou analista do PCP, quero verificar a presença das informações técnicas aplicáveis à peça/processo e visualizar pendências, para solicitar esclarecimentos antes de avançar com segurança.

**Descrição e escopo:**
- registrar ou referenciar desenho e especificações;
- identificar ausência de dados;
- registrar/referenciar dimensões, tolerâncias e tratamento térmico;
- definir matriz de obrigatoriedade por tipo de peça/processo;
- manter referência/revisão documental.

**Regras/questões:** DEC-005; OPEN-006..010; DEP-003; AMB-004; INT-005; DAT-004.

**Critérios preliminares:** sinalizar ausência de informação; suportar referência aos documentos técnicos; tolerâncias e tratamento térmico devem ser considerados quando aplicáveis. Não presumir bloqueio automático.

**Prioridade:** P0. **Valor:** reduzir retrabalho e evitar estimativas baseadas em dados insuficientes.

### Grupo funcional — dúvidas e pendências técnicas — Dúvidas e pendências técnicas
**Requisitos:** FR-014. **Objetivos:** OBJ-001, OBJ-005. **Atores:** ACT-002, ACT-004, ACT-003.

**Objetivo:** registrar e acompanhar esclarecimentos técnicos associados a projetos.

**História candidata:** Como orçamentista, quero registrar uma dúvida técnica vinculada ao projeto e acompanhar sua resolução, para preservar contexto e evitar perda de informações em comunicações dispersas.

**Descrição e escopo:**
- registrar descrição e vínculo ao projeto;
- registrar situação da pendência;
- identificar responsável, prazo e resolução, caso aprovados;
- avaliar necessidade de notificações.

**Regras/questões:** OPEN-009; DAT-004. Responsáveis, prazos, notificações e fluxo de encerramento não estão definidos.

**Critérios preliminares:** dúvida deve estar vinculada ao projeto; conteúdo e situação devem ser consultáveis; responsável e prazo dependem de definição.

**Prioridade:** P0. **Valor:** comunicação entre áreas e redução de retrabalho.

### Grupo funcional — operações e serviços externos — Operações, processos e serviços externos
**Requisitos:** FR-006, FR-016. **Objetivos:** OBJ-001, OBJ-003, OBJ-005. **Atores:** ACT-002, ACT-005, ACT-003.

**Objetivo:** representar o roteiro de fabricação e os serviços externos aplicáveis.

**História candidata:** Como orçamentista, com apoio dos especialistas de processo, quero registrar as operações em sequência e associar cada uma ao processo/setor e aos serviços externos aplicáveis, para compor a estimativa de fabricação.

**Descrição e escopo:**
- incluir uma ou mais operações;
- ordenar operações;
- associar operação a processo/setor;
- associar serviços externos quando aplicáveis;
- registrar dados de custo e tempo disponíveis.

**Regras/questões:** BR-001, BR-004..006; OPEN-027, OPEN-028. Taxonomia, campos e tratamento de terceirização, frete e custos indiretos não definidos.

**Critérios preliminares:** permitir múltiplas operações ordenadas; associar operação a processo/setor; incluir serviços externos quando aplicáveis.

**Prioridade:** P0. **Valor:** representar o processo produtivo e apoiar custo e prazo.

### Grupo funcional — materiais e consumo — Estimativa de materiais e consumo
**Requisitos:** FR-018, FR-019. **Objetivos:** OBJ-002, OBJ-006. **Atores:** ACT-002, ACT-003, ACT-006; Compras/Estoque (STK-008) como fonte a confirmar.

**Objetivo:** estimar quantidades e valores de materiais com referência a dados técnicos e históricos.

**História candidata:** Como orçamentista, quero levantar materiais e quantidades a partir das dimensões, peso, fator de uso e quantidade solicitada, consultando referências de compra, para fundamentar o custo de material.

**Descrição e escopo:**
- identificar material e unidade;
- registrar dimensões brutas/finais, peso/volume quando disponíveis;
- registrar fator de uso e quantidade necessária;
- consultar histórico de compras/preços e origem/data;
- distinguir referência histórica de preço vigente.

**Regras/questões:** BR-002, BR-003, BR-007; OPEN-011..014, OPEN-026; DAT-005..007; INT-004; DEP-004 e DEP-005.

**Critérios preliminares:** identificar material e quantidade; registrar fator de uso; preservar origem/data do preço; tratar histórico criticamente. Fórmula oficial não aprovada.

**Prioridade:** P0. **Valor:** reduzir erro de consumo e de custo de material.

### Grupo funcional — estimativa de tempo — Estimativa de tempo por máquina, setup e operação
**Requisitos:** FR-004, FR-017. **Objetivos:** OBJ-001, OBJ-002, OBJ-003. **Atores:** ACT-002, ACT-005, ACT-003.

**Objetivo:** produzir estimativa de tempo fundamentada em máquinas, operações, setup, características do material e histórico.

**História candidata:** Como orçamentista, quero estimar o tempo de produção considerando quantidade, máquinas, operações, setup, operação e usinabilidade, para informar prazo/capacidade com base em parâmetros técnicos e histórico válido.

**Descrição e escopo:**
- estimar tempo por operação/máquina;
- distinguir setup de tempo de operação;
- considerar material/usinabilidade;
- considerar histórico quando disponível e validado;
- apresentar estimativa total e detalhamento quando definido.

**Regras/questões:** BR-004..007; OPEN-004, OPEN-005, OPEN-013, OPEN-029; DEP-002; DUP-002; AMB-003 e AMB-005.

**Critérios preliminares:** considerar quantidade, operações e máquinas; apresentar total e detalhamento quando definido; explicitar que método e parâmetros dependem de validação.

**Prioridade:** P0. **Valor:** melhorar estimativa de prazo e capacidade produtiva.

### Grupo funcional — composição de custos — Composição de custos e preço do orçamento
**Requisitos:** FR-003, FR-002, FR-006, FR-018. **Objetivos:** OBJ-001, OBJ-002. **Atores:** ACT-002, ACT-005, ACT-006.

**Objetivo:** calcular e apresentar a composição de custo do orçamento.

**História candidata:** Como orçamentista, quero calcular o custo do projeto a partir dos componentes aplicáveis de materiais, processos, horas-máquina, mão de obra e serviços externos, para elaborar uma proposta consistente.

**Descrição e escopo:**
- compor custo discriminado;
- considerar materiais, operações/processos, horas-máquina, mão de obra e serviços externos conforme aplicabilidade;
- disponibilizar referências e parâmetros utilizados;
- distinguir custo de preço de venda;
- considerar impostos, margens e despesas somente após definição formal.

**Regras/questões:** BR-001..003, BR-006; OPEN-001..003, OPEN-012, OPEN-023, OPEN-028; NFR-002/003; DEP-001.

**Critérios preliminares:** apresentar composição discriminada; incluir componentes aplicáveis; não considerar fórmula de venda aprovada enquanto OPEN-002 não for resolvida.

**Prioridade:** P0. **Valor:** reduzir risco de prejuízo e inconsistência comercial.

### Grupo funcional — histórico e pipeline comercial — Histórico de orçamentos e pipeline comercial
**Requisitos:** FR-007, FR-008, FR-020. **Objetivos:** OBJ-004, OBJ-002. **Atores:** ACT-001, ACT-002.

**Objetivo:** preservar e consultar orçamentos, alterações e estágio comercial.

**História candidata:** Como orçamentista ou gerente, quero consultar orçamentos anteriores, seus dados e alterações e acompanhar seu estágio comercial, para manter histórico e visibilidade do processo.

**Descrição e escopo:**
- armazenar orçamentos e dados associados;
- permitir consulta e filtros;
- preservar versões/revisões;
- acompanhar estado comercial;
- rastrear alterações de valores e parâmetros.

**Regras/questões:** DEC-003, DEC-006; OPEN-018, OPEN-022, OPEN-024; NFR-001, NFR-004; DEP-006.

**Critérios preliminares:** localizar orçamento anterior e consultar dados essenciais; cada orçamento deve possuir estado; alterações relevantes devem ser rastreáveis. Estados e transições permanecem pendentes.

**Prioridade:** P1. **Valor:** gestão, continuidade e rastreabilidade.

### Grupo funcional — documento de orçamento — Documento de orçamento
**Requisitos:** FR-010. **Objetivos:** OBJ-001, OBJ-002. **Atores:** ACT-002, ACT-007.

**Objetivo:** gerar representação do orçamento para apresentação/envio ao cliente.

**História candidata:** Como orçamentista, quero gerar um documento com os dados aprovados do orçamento, para apresentar a proposta ao cliente de forma consistente.

**Descrição e escopo:**
- identificar cliente/projeto;
- apresentar custos e prazo conforme aprovado;
- manter vínculo com registro e revisão;
- incluir condições comerciais após validação.

**Regras/questões:** OPEN-021, OPEN-022; AMB-006. O protótipo sugere geração do orçamento, mas não define conteúdo final.

**Critérios preliminares:** documento deve refletir cliente/projeto, custos e prazo aprovados; validade, impostos, condições e layout aguardam decisão.

**Prioridade:** P1. **Valor:** padronizar a comunicação comercial.

### Grupo funcional — relatórios gerenciais — Relatórios e informações gerenciais
**Requisitos:** FR-011. **Objetivos:** OBJ-004, OBJ-006. **Atores:** ACT-001, ACT-002, ACT-003.

**Objetivo:** disponibilizar informações consolidadas para acompanhamento e decisão.

**História candidata:** Como gerente, quero consultar informações gerenciais confiáveis de orçamentos e, conforme escopo, materiais, compras e produção, para acompanhar resultados e apoiar decisões.

**Descrição e escopo:**
- consultar dados históricos;
- diferenciar estimativas de registros realizados;
- disponibilizar indicadores prioritários após definição;
- controlar acesso conforme público autorizado.

**Regras/questões:** DEC-003; OPEN-025, OPEN-026; NFR-001, NFR-004.

**Critérios preliminares:** consultar informações históricas; distinguir estimativa de dado realizado; relatórios e públicos dependem de definição.

**Prioridade:** P1. **Valor:** visibilidade gerencial e decisão baseada em dados.

### Grupo funcional — integração e importação — Integração e importação de dados
**Requisitos:** FR-012. **Objetivos:** OBJ-004, OBJ-005, OBJ-006. **Atores:** ACT-002, ACT-003, ACT-005; STK-008 como fonte a confirmar.

**Objetivo:** reduzir fragmentação e permitir uso de fontes existentes conforme escopo aprovado.

**História candidata:** Como usuário interno autorizado, quero consultar ou importar informações das fontes existentes, com origem rastreável, para evitar redigitação e apoiar o orçamento e a análise do PCP.

**Descrição e escopo:**
- inventariar fontes ERP, planilhas, OPs, notas fiscais/compras e documentos técnicos;
- identificar dados, formatos, períodos, frequência e responsáveis;
- definir direção e modalidade de integração;
- validar qualidade e origem dos dados importados.

**Regras/questões:** CON-001/002; INT-001..005; OPEN-015..017; NFR-009; DEP-005.

**Critérios preliminares:** identificar fonte e dados; rastrear origem; método, frequência, direção e responsáveis precisam decisão.

**Prioridade:** P1. **Valor:** reduzir dispersão e duplicidade de dados.

### Grupo funcional — apoio à análise do PCP — Apoio à análise do PCP
**Requisitos:** FR-021, FR-013, FR-015, FR-016, FR-018. **Objetivos:** OBJ-003, OBJ-005, OBJ-006. **Atores:** ACT-003, ACT-004, ACT-005.

**Objetivo:** disponibilizar ao PCP informações necessárias à análise do produto e das condições de liberação.

**História candidata:** Como profissional do PCP, quero consultar produto, prazo, materiais, quantidades, sequência, fatores de uso e referências técnicas, para analisar a aderência e as condições do processo.

**Descrição e escopo:**
- consultar OP/produto e prazo;
- consultar materiais e quantidades;
- consultar sequência e fatores de uso/tempo;
- consultar desenho e referências técnicas;
- identificar pendências.

**Regras/questões:** BR-008; OPEN-008, OPEN-015, OPEN-019, OPEN-032; INT-003; AMB-001.

**Critérios preliminares:** disponibilizar as informações identificadas no requisito; regras de bloqueio, liberação e integração não estão definidas.

**Prioridade:** P0 para requisitos de dados técnicos e P1 para limites de integração/estoque. **Valor:** melhorar transferência entre Orçamentos e PCP.

## Observações para refinamento futuro

1. Reconciliar este agrupamento com os IDs de Epic, Feature, User Story e critérios de aceitação já usados no backlog anterior, preservando-os sem renumeração.
2. Confirmar se cada agrupamento deve ser uma Epic, Feature ou conjunto de User Stories; a classificação não está definida no SRC-04.
3. Refinar histórias em unidades menores após decisão das questões P0.
4. Não transformar critérios preliminares em critérios de pronto/aprovação sem validação dos responsáveis.
5. Não assumir que estoque transacional, chão de fábrica, acesso de cliente ou integração bidirecional façam parte do escopo.
