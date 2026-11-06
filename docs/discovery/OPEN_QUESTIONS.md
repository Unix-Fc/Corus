# Questões em aberto

Todas as questões abaixo permanecem abertas no SRC-04, versão 2.1. Não foram resolvidas por inferência neste pacote.

| ID | Questão a confirmar | Prioridade de validação no SRC-04 |
|---|---|---|
| OPEN-001 | Fórmula oficial de custo por processo (usinagem, corte, solda, caldeiraria e outros). | P0 |
| OPEN-002 | Fórmula do preço de venda: margem, markup, despesas, impostos e arredondamentos. | P0 |
| OPEN-003 | Componentes de mão de obra e obtenção dos custos-hora. | P0 |
| OPEN-004 | Método de estimativa de tempo por operação/máquina e parâmetros obrigatórios. | P0 |
| OPEN-005 | Período e critérios para selecionar/normalizar histórico de produção. | P0 |
| OPEN-006 | Campos técnicos obrigatórios por tipo de peça/processo e responsável por defini-los. | P0 |
| OPEN-007 | Formatos de desenhos/documentos aceitos e controle de revisão. | P0 |
| OPEN-008 | Ausência de dados técnicos gera alerta, bloqueio do orçamento ou bloqueio da liberação pelo PCP? Quais exceções? | P0 |
| OPEN-009 | Responsáveis, prazos e fluxo para responder/encerrar dúvidas técnicas. | P0 |
| OPEN-010 | Como registrar tolerâncias e tratamentos térmicos: campos, anexos ou referência ao desenho? | P0 |
| OPEN-011 | Regras para peso bruto/líquido, volume, fator de uso e perdas. | P0 |
| OPEN-012 | Fonte de preço prevalente: última nota fiscal, tabela, cotação ou outra. | P0 |
| OPEN-013 | Período de histórico de compras/consumo e tratamento de picos, retrabalho e perdas. | P0 |
| OPEN-014 | Tratamento de apontamentos incorretos e divergência entre estoque sistêmico e físico. | P0 |
| OPEN-015 | Consulta de estoque em tempo real ou apenas dados importados/registrados? | P1 |
| OPEN-016 | Escopo ERP: consulta, gravação, sincronização, importação ou integração bidirecional? | P1 |
| OPEN-017 | Dados/períodos a importar e responsável pela validação da qualidade. | P1 |
| OPEN-018 | Estados oficiais do orçamento e transições permitidas. | P1 |
| OPEN-019 | Sistema acompanha somente pipeline comercial ou também execução da ordem na fábrica? | P1 (limite de escopo) |
| OPEN-020 | Perfis de usuário e permissões para executar/aprovar operações. | P1 |
| OPEN-021 | Conteúdo do documento enviado ao cliente: prazo, validade, impostos e condições. | P1 |
| OPEN-022 | Tratamento de revisões após negociação ou alteração de desenho/quantidade. | P1 |
| OPEN-023 | Precisão, arredondamento e armazenamento monetário além das duas casas decimais. | P2/critério complementar |
| OPEN-024 | Eventos da trilha de auditoria e prazo de retenção. | P2/critério complementar |
| OPEN-025 | Relatórios/indicadores prioritários e públicos autorizados. | P1 |
| OPEN-026 | Histórico de compras/materiais será consulta gerencial ou alimentará automaticamente o cálculo? | P1 |
| OPEN-027 | Operações, ferramentas e parâmetros iniciais e seus responsáveis pela validação. | P0 para parametrização central |
| OPEN-028 | Tratamento de operações terceirizadas, tratamentos externos, fretes e custos indiretos. | P0 para composição completa de custos |
| OPEN-029 | Metas mensuráveis de tempo de resposta, cálculo e disponibilidade. | P2 |
| OPEN-030 | Navegadores, sistemas operacionais e dispositivos suportados. | P2 |
| OPEN-031 | Treinamento e transição sem interrupção total. | P2 |
| OPEN-032 | Setores com acesso e responsabilidades formais no sistema. | P1 |

## Conflitos, ambiguidades e dependências registrados

### Conflito
- `CONFL-001`: catálogo de status diverge entre protótipo e referências anteriores. O protótipo apresenta Pendente, Em negociação, Aprovado e Reprovado; outras referências citam Pendente/Finalizado ou iniciado/finalizado. Manter OPEN-018.

### Ambiguidades
- `AMB-001`: “controle integrado de orçamento, estoque e tempo” não define controle transacional de estoque ou mera consulta.
- `AMB-002`: “cálculo preciso” não possui métricas, tolerâncias ou fórmula aprovada.
- `AMB-003`: histórico de produção não define período, comparabilidade ou exceções.
- `AMB-004`: validação técnica não define alerta ou bloqueio.
- `AMB-005`: tempo estimado não esclarece inclusão de fila, disponibilidade, setup, inspeção ou transporte.
- `AMB-006`: documento de orçamento não define validade e condições comerciais.

### Duplicidades potenciais
- `DUP-001`: FR-003 e FR-018 tratam de materiais/custos sob perspectivas diferentes: composição monetária e levantamento de quantidade/fator de uso.
- `DUP-002`: FR-004 e FR-017 tratam de tempo: estimativa global e detalhamento por setup/operação/usinabilidade.
- `DUP-003`: FR-005 e FR-015 tratam de dados técnicos gerais e dos atributos específicos de tolerâncias/tratamento térmico.

### Dependências
- `DEP-001`: FR-003 depende de OPEN-001 a OPEN-003.
- `DEP-002`: FR-004/FR-017 dependem de OPEN-004/OPEN-005.
- `DEP-003`: FR-013/FR-015 dependem de OPEN-006 a OPEN-010.
- `DEP-004`: FR-018/BR-002 dependem de OPEN-011.
- `DEP-005`: FR-019/FR-012 dependem de OPEN-012, OPEN-016 e OPEN-017.
- `DEP-006`: FR-008 depende de OPEN-018 e OPEN-022.
- `DEP-007`: FR-001 depende de OPEN-020.

## Ordem sugerida para resolução

A ordem P0/P1/P2 acima é a prioridade de validação do Discovery definida pelo SRC-04. Não representa compromisso de entrega. A baseline de requisitos depende da confirmação prioritária das questões P0, da validação de atores/permissões, catálogo de estados e critérios dos requisitos centrais.
