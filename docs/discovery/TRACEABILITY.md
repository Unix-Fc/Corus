# Matriz de rastreabilidade

## Objetivo → requisito → regra → backlog → critério

O SRC-04 fornece rastreabilidade formal entre objetivos e requisitos. As regras de negócio e critérios abaixo são relacionados quando sustentados pelo conteúdo consolidado. Os agrupamentos `BL-xx` deste pacote são rótulos descritivos locais, não IDs históricos de Epic/Feature/User Story.

| Objetivo | Requisitos funcionais | Regras de negócio relacionadas | Backlog deste pacote | Critérios |
|---|---|---|---|---|
| OBJ-001 — Reduzir tempo | FR-003, FR-004, FR-005, FR-006, FR-010, FR-013, FR-014 | BR-001, BR-004, BR-006 | Grupo funcional — clientes, projetos e peças, Grupo funcional — dados técnicos, Grupo funcional — dúvidas e pendências técnicas, Grupo funcional — operações e serviços externos, Grupo funcional — estimativa de tempo, Grupo funcional — composição de custos, Grupo funcional — documento de orçamento | FR-003, FR-004, FR-005, FR-006, FR-010, FR-013, FR-014 em ACCEPTANCE_CRITERIA.md |
| OBJ-002 — Precisão/consistência | FR-002, FR-003, FR-004, FR-015, FR-017, FR-018, FR-019, FR-020; NFR-002 a NFR-004 | BR-001 a BR-007 | Grupo funcional — cadastros e parâmetros industriais, Grupo funcional — dados técnicos, Grupo funcional — materiais e consumo, Grupo funcional — estimativa de tempo, Grupo funcional — composição de custos, Grupo funcional — histórico e pipeline comercial | FR-002, FR-003, FR-004, FR-015, FR-017, FR-018, FR-019, FR-020 |
| OBJ-003 — Estimar produção | FR-004, FR-006, FR-016, FR-017, FR-021 | BR-004 a BR-006 | Grupo funcional — operações e serviços externos, Grupo funcional — estimativa de tempo, Grupo funcional — apoio à análise do PCP | FR-004, FR-006, FR-016, FR-017, FR-021 |
| OBJ-004 — Histórico/gestão | FR-007, FR-011, FR-019, FR-020; NFR-001 e NFR-004 | BR-003, BR-007 | Grupo funcional — materiais e consumo, Grupo funcional — histórico e pipeline comercial, Grupo funcional — relatórios gerenciais, Grupo funcional — integração e importação | FR-007, FR-011, FR-019, FR-020 |
| OBJ-005 — Comunicação entre áreas | FR-005, FR-013, FR-014, FR-015, FR-021 | BR-008 | Grupo funcional — acesso e governança de usuários, Grupo funcional — clientes, projetos e peças, Grupo funcional — dados técnicos, Grupo funcional — dúvidas e pendências técnicas, Grupo funcional — operações e serviços externos, Grupo funcional — apoio à análise do PCP | FR-001, FR-005, FR-013, FR-014, FR-015, FR-021 |
| OBJ-006 — Decisão baseada em dados | FR-011, FR-018, FR-019, FR-021 | BR-007, BR-008 | Grupo funcional — materiais e consumo, Grupo funcional — relatórios gerenciais, Grupo funcional — integração e importação, Grupo funcional — apoio à análise do PCP | FR-011, FR-018, FR-019, FR-021 |

## Rastreabilidade complementar de NFRs

| Objetivo/necessidade | NFRs | Questões relacionadas |
|---|---|---|
| Histórico e gestão (OBJ-004) | NFR-001, NFR-004 | OPEN-024, OPEN-025 |
| Precisão/consistência (OBJ-002) | NFR-002, NFR-003, NFR-004 | OPEN-023, OPEN-024 |
| Comunicação e fontes (OBJ-005) | NFR-009, NFR-010 | OPEN-016, OPEN-017, OPEN-020, OPEN-024, OPEN-032 |
| Continuidade e adoção | NFR-005 a NFR-008 | OPEN-029, OPEN-030, OPEN-031 |

## Rastreabilidade das regras

| Regra | Requisitos que a operacionalizam ou suportam | Questões que impedem fechamento |
|---|---|---|
| BR-001 — Composição do custo | FR-003, FR-006, FR-018 | OPEN-001, OPEN-003, OPEN-028 |
| BR-002 — Custo da matéria-prima | FR-003, FR-018 | OPEN-011 |
| BR-003 — Preço de referência | FR-019, FR-003 | OPEN-012, OPEN-026 |
| BR-004 — Tempo de produção | FR-004, FR-017 | OPEN-004, OPEN-005 |
| BR-005 — Usinabilidade | FR-017 | OPEN-004, OPEN-005, OPEN-027 |
| BR-006 — Setup/operação | FR-006, FR-016, FR-017 | OPEN-004, OPEN-005, OPEN-027 |
| BR-007 — Crítica de consumo | FR-018, FR-019, FR-011 | OPEN-013, OPEN-014 |
| BR-008 — Análise do PCP | FR-013, FR-015, FR-016, FR-018, FR-021 | OPEN-008, OPEN-015, OPEN-019, OPEN-032 |

## Dependências críticas para rastreabilidade

| Dependência | Relação |
|---|---|
| DEP-001 | FR-003 ← OPEN-001..003 |
| DEP-002 | FR-004/FR-017 ← OPEN-004/005 |
| DEP-003 | FR-013/FR-015 ← OPEN-006..010 |
| DEP-004 | FR-018/BR-002 ← OPEN-011 |
| DEP-005 | FR-019/FR-012 ← OPEN-012, OPEN-016, OPEN-017 |
| DEP-006 | FR-008 ← OPEN-018, OPEN-022 |
| DEP-007 | FR-001 ← OPEN-020 |

## Limites da matriz

- Não há no SRC-04 IDs estáveis de Epic, Feature, User Story ou Acceptance Criteria; o backlog anterior deve ser reconciliado antes de renumerar ou criar identificadores.
- Não se atribuem regras de negócio a requisitos quando a relação não é explícita ou suficientemente sustentada.
- As relações entre objetivo, requisito e regra não eliminam dependências ou questões abertas.
- Critérios são preliminares e não substituem validação formal.
