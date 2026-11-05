# Critérios de aceitação preliminares

## Status

Os critérios abaixo sintetizam os critérios preliminares descritos no SRC-04. Não são critérios formalmente aprovados. Os critérios dependentes de questões abertas permanecem condicionados à decisão dos responsáveis de negócio.

| Requisito | Critérios preliminares consolidados | Dependências/ressalvas |
|---|---|---|
| FR-001 | Usuário deve estar autenticado para acessar áreas internas; operações devem estar associadas ao usuário; matriz de permissões deve ser validada. | OPEN-020; NFR-010. |
| FR-002 | Deve permitir cadastrar, consultar e atualizar parâmetros autorizados; identificar parâmetros utilizados em orçamento; validar campos por setor. | OPEN-027; OPEN-020. |
| FR-003 | Deve apresentar composição discriminada e considerar componentes aplicáveis; fórmula de preço, margens e impostos devem ser definidas antes da validação final. | OPEN-001..003; BR-001..003. |
| FR-004 | Deve apresentar estimativa total e detalhamento quando definido; considerar quantidade, operações, máquinas e histórico validado. | OPEN-004/005; OPEN-013; BR-004. |
| FR-005 | Deve manter referência aos dados técnicos utilizados; sinalizar ausência de dados definidos como necessários; suportar campos/documentos conforme padrão a aprovar. | OPEN-006/007. |
| FR-006 | Deve permitir uma ou mais operações e serviços externos quando aplicáveis; deve permitir validar ordem e atributos. | OPEN-027/028. |
| FR-007 | Deve localizar orçamentos anteriores e consultar dados essenciais; filtros, retenção e versões devem ser definidos. | DEC-003; retenção/filtros ainda não definidos. |
| FR-008 | Cada orçamento deve possuir estado; alterações devem ser associadas ao orçamento; catálogo e transições devem ser validados. | OPEN-018/022; CONFL-001. |
| FR-009 | Deve associar orçamento a cliente; permitir múltiplos projetos/orçamentos por cliente; campos e duplicidade devem ser definidos. | Campos e regras cadastrais pendentes. |
| FR-010 | Documento deve conter cliente/projeto, custos e prazo conforme aprovado; deve manter vínculo com registro/revisão; condições comerciais dependem de definição. | OPEN-021/022; AMB-006. |
| FR-011 | Deve permitir consulta a dados históricos consolidados; distinguir estimativas de registros realizados; indicadores e públicos devem ser definidos. | OPEN-025/026. |
| FR-012 | Deve identificar fontes e dados; rastrear origem; método, frequência, direção e responsáveis devem ser definidos antes de validar integração/importação. | OPEN-016/017; INT-001..005. |
| FR-013 | Deve sinalizar informações técnicas ausentes; matriz por tipo de peça/processo e comportamento de alerta/bloqueio precisam ser definidos. | OPEN-006..008; AMB-004. |
| FR-014 | Deve vincular pendência ao projeto; registrar conteúdo e situação; responsável, prazo e notificações devem ser definidos. | OPEN-009. |
| FR-015 | Deve registrar ou referenciar tolerâncias e tratamento térmico quando aplicáveis; formato e obrigatoriedade devem ser validados. | OPEN-010. |
| FR-016 | Deve representar várias operações ordenadas e associá-las a processo/setor; taxonomia e campos devem ser validados. | OPEN-027. |
| FR-017 | Deve distinguir setup e operação quando os dados existirem; parâmetros técnicos e fórmulas devem ser validados. | OPEN-004/005; BR-005/006. |
| FR-018 | Deve identificar material e quantidade; registrar fator de uso; validar fórmula, unidades, tolerâncias e perdas. | OPEN-011; BR-002. |
| FR-019 | Deve identificar origem e data do preço; distinguir preço histórico e vigente quando ambos existirem; fonte prevalente deve ser definida. | OPEN-012/013/026; INT-004. |
| FR-020 | Deve identificar parâmetros utilizados e associar alterações a usuário/momento conforme política; retenção, justificativa e imutabilidade devem ser definidas. | OPEN-024; NFR-004. |
| FR-021 | Deve disponibilizar ao PCP produto, prazo, materiais, quantidades, sequência, fatores de uso/tempo e referências técnicas; bloqueios e integração dependem de decisão. | OPEN-008/015/019/032; BR-008. |

## Critérios transversais

- Valores monetários devem atender ao mínimo de duas casas decimais (`NFR-002`); regra de arredondamento e precisão intermediária depende de `OPEN-023`.
- Custos de matéria-prima, custo-hora e serviços externos devem ser registrados de forma padronizada (`NFR-003`).
- Alterações relevantes e cálculos financeiros devem ser rastreáveis (`NFR-004` e `NFR-010`); eventos e retenção dependem de `OPEN-024`.
- Acesso deve ser restrito a usuários autorizados (`NFR-010`); matriz de permissões depende de `OPEN-020`.
- Histórico deve ser preservado sem perda de dados (`NFR-001`); política de retenção/recuperação não está especificada.
- Compatibilidade, disponibilidade, desempenho e transição precisam de critérios mensuráveis (`OPEN-029..031`).

## Não constituem critérios aprovados

- Fórmula final de custo/preço.
- Algoritmo de tempo.
- Catálogo definitivo de status.
- Bloqueio automático por falta de dados técnicos.
- Integração bidirecional com ERP.
- Estoque em tempo real.
- Acompanhamento integral do chão de fábrica.
- Conteúdo comercial definitivo do documento enviado ao cliente.
