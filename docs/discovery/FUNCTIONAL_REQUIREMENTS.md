# Requisitos funcionais

Todos os requisitos FR-001 a FR-021 foram identificados no SRC-04. Os critérios são preliminares e sujeitos à validação dos responsáveis de negócio.

| ID | Nome | Descrição consolidada | Evidência/observações |
|---|---|---|---|
| FR-001 | Autenticação e acesso de usuários | Permitir acesso individual autenticado e restringir funcionalidades/informações conforme permissões atribuídas. | Contexto inicial, SRC-02 e protótipos. Matriz de permissões depende de OPEN-020. |
| FR-002 | Manutenção de parâmetros de cálculo | Permitir manter máquinas, ferramentas, matérias-primas, cargos/salários e demais insumos aplicáveis. | SRC-01, SRC-03 e entrevistas. Parâmetros autorizados e campos por setor precisam validação. |
| FR-003 | Cálculo do custo e preço do orçamento | Calcular custos considerando, conforme aplicabilidade, matéria-prima, operações, horas-máquina, mão de obra e serviços externos. | Composição discriminada esperada; fórmula de preço, margens e impostos em aberto (OPEN-001 a OPEN-003). |
| FR-004 | Estimativa do tempo de produção | Estimar tempo necessário para produzir as quantidades solicitadas, considerando máquinas, operações e histórico disponível. | Deve apresentar estimativa total e detalhamento quando definido; método em OPEN-004/005. |
| FR-005 | Registro de dados técnicos do projeto/peça | Permitir registrar ou referenciar dados técnicos necessários, incluindo desenho e especificações do cliente. | Deve sinalizar dados faltantes; formatos, revisões e campos obrigatórios em OPEN-006/007. |
| FR-006 | Definição de operações e serviços externos | Permitir incluir sequência de operações/processos e serviços externos aplicáveis, com dados de custo e tempo disponíveis. | Ordenação e atributos por operação precisam validação; OPEN-027/028. |
| FR-007 | Consulta ao histórico de orçamentos | Armazenar e permitir consultar orçamentos anteriores e seus dados associados. | Filtros, retenção, versões e migração não definidos. |
| FR-008 | Acompanhamento do status do orçamento | Permitir acompanhar estágio comercial do orçamento por estados identificáveis. | Protótipo tem Pendente, Em negociação, Aprovado e Reprovado; catálogo oficial em OPEN-018. |
| FR-009 | Cadastro de clientes e projetos | Permitir cadastrar clientes e associá-los a projetos e orçamentos. | Campos, duplicidade e regras cadastrais precisam validação. |
| FR-010 | Geração de documento de orçamento | Gerar documento/representação do orçamento para apresentação ou envio ao cliente. | Conteúdo, validade, impostos e condições comerciais em OPEN-021; revisões em OPEN-022. |
| FR-011 | Relatórios e informações gerenciais | Armazenar e disponibilizar informações gerenciais relacionadas a orçamentos e, conforme escopo, materiais, compras e produção. | Indicadores, públicos e prioridade em OPEN-025. |
| FR-012 | Importação/integração com fontes existentes | Permitir interoperabilidade com ERP e/ou importar dados de planilhas e ordens de produção conforme escopo aprovado. | Fontes, método, frequência, direção e responsáveis em OPEN-016/017. |
| FR-013 | Validação de completude técnica | Verificar se informações técnicas necessárias ao orçamento ou análise do PCP estão presentes e sinalizar pendências antes do avanço da etapa. | Campos e comportamento de alerta/bloqueio em OPEN-006 a OPEN-008. |
| FR-014 | Registro e acompanhamento de dúvidas técnicas | Registrar dúvidas/pendências técnicas com descrição, vínculo ao projeto e situação de resolução. | Responsáveis, prazos, fluxo e notificações em OPEN-009. |
| FR-015 | Registro de tolerâncias e tratamento térmico | Comportar registro ou referência às tolerâncias dimensionais e ao tratamento térmico quando aplicáveis. | Forma de registro, obrigatoriedade e validação em OPEN-010. |
| FR-016 | Representação de múltiplas operações | Representar sequência de operações necessárias à fabricação, inclusive em diferentes setores. | Ordem, taxonomia, setores e campos em OPEN-027. |
| FR-017 | Composição da estimativa por setup e operação | Considerar, quando aplicável, preparação (setup), operação de máquina e fatores de usinabilidade do material. | Fórmulas e parâmetros técnicos ainda precisam validação; OPEN-004/005. |
| FR-018 | Estimativa de materiais, quantidades e fator de uso | Apoiar levantamento de materiais e quantidades com base em desenho/dimensões, peso, fator de uso e quantidade solicitada. | Fórmula, unidades, tolerâncias e perdas em OPEN-011. |
| FR-019 | Consulta ao histórico de compras e custos de materiais | Permitir consultar ou utilizar histórico de compras/preços de materiais como referência para análises e orçamentos. | Fonte prevalente e uso automático no cálculo em OPEN-012/026. |
| FR-020 | Rastreabilidade de alterações e cálculos financeiros | Preservar histórico de alterações relevantes em valores, custos e parâmetros usados no orçamento, permitindo rastrear a composição do resultado. | Eventos, retenção, justificativas e imutabilidade em OPEN-024. |
| FR-021 | Apoio à análise de materiais e operações pelo PCP | Disponibilizar ao PCP dados relevantes: produto, prazo, materiais, quantidades, sequência, fatores de uso e referências técnicas. | Escopo de bloqueio/liberação e integração com estoque/produção em OPEN-015/019. |

## Dependências explicitadas no SRC-04

- `DEP-001`: FR-003 depende de OPEN-001 a OPEN-003.
- `DEP-002`: FR-004/FR-017 dependem de OPEN-004/OPEN-005.
- `DEP-003`: FR-013/FR-015 dependem de OPEN-006 a OPEN-010.
- `DEP-004`: FR-018/BR-002 dependem de OPEN-011.
- `DEP-005`: FR-019/FR-012 dependem de OPEN-012, OPEN-016 e OPEN-017.
- `DEP-006`: FR-008 depende de OPEN-018 e OPEN-022.
- `DEP-007`: FR-001 depende de OPEN-020.

## Nota sobre sobreposição

O SRC-04 registra duplicidades potenciais, não duplicidades a serem removidas:
- `DUP-001`: FR-003 e FR-018 — cálculo monetário versus levantamento de materiais/quantidades.
- `DUP-002`: FR-004 e FR-017 — estimativa global de tempo versus composição por setup/operação.
- `DUP-003`: FR-005 e FR-015 — dados técnicos gerais versus tolerâncias/tratamento térmico.
