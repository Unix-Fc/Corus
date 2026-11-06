# DISCOVERY STATUS

**Data de referência:** 05/11/2026  
**Baseline documental utilizada:** SRC-04 — Requisitos Consolidados, versão 2.1, 04/11/2026.  
**Situação:** Discovery documentado e organizado; validação de negócio ainda necessária. Não autoriza início de implementação.

## Principais números do levantamento

| Categoria | Quantidade/intervalo |
|---|---:|
| Objetivos | 6 (`OBJ-001..006`) |
| Stakeholders | 9 (`STK-001..009`) |
| Atores com ID | 7 (`ACT-001..007`) |
| Requisitos funcionais | 21 (`FR-001..021`) |
| Requisitos não funcionais | 10 (`NFR-001..010`) |
| Regras de negócio | 8 (`BR-001..008`) |
| Restrições/premissas | 5 (`CON-001..005`) |
| Integrações/fontes | 5 (`INT-001..005`) |
| Grupos de dados | 12 (`DAT-001..012`) |
| Decisões/entendimentos registrados | 6 (`DEC-001..006`) |
| Questões em aberto | 32 (`OPEN-001..032`) |
| Duplicidades potenciais | 3 (`DUP-001..003`) |
| Conflitos | 1 (`CONFL-001`) |
| Ambiguidades | 6 (`AMB-001..006`) |
| Dependências | 7 (`DEP-001..007`) |
| Entrevistados identificados no SRC-02 | 6 |

O SRC-04 não apresenta contagem consolidada de Epic, Feature, User Story ou Critério de Aceitação. Este pacote não cria tais IDs. Os agrupamentos `Grupo funcional — acesso e governança de usuários..Grupo funcional — apoio à análise do PCP` são organização editorial do backlog deste pacote e não substituem identificadores históricos.

## Questões ainda abertas

Permanecem as 32 questões `OPEN-001..OPEN-032`, detalhadas em `OPEN_QUESTIONS.md`. As questões P0 são prioritárias:
- fórmula de custo, preço e mão de obra/custo-hora (`OPEN-001..003`);
- método e parâmetros de tempo (`OPEN-004..005`);
- dados técnicos obrigatórios, documentos, bloqueios e dúvidas (`OPEN-006..010`);
- material, fator de uso, preço e qualidade dos históricos (`OPEN-011..014`);
- operações, ferramentas e parâmetros iniciais (`OPEN-027`);
- serviços terceirizados, tratamentos, fretes e custos indiretos (`OPEN-028`).

P1 inclui ERP/estoque/importação, estados, escopo de chão de fábrica, permissões, documento comercial, revisões e relatórios (`OPEN-015..022`, `OPEN-025..026`, `OPEN-032`). P2 inclui precisão monetária complementar, auditoria, metas de desempenho/disponibilidade, compatibilidade e transição (`OPEN-023..024`, `OPEN-029..031`).

## Riscos conhecidos

1. **Risco financeiro:** sem fórmula oficial de custo/preço e custo-hora, a composição pode ser inconsistente ou gerar orçamento deficitário (`OPEN-001..003`).
2. **Risco de prazo:** método de estimativa e parâmetros ainda não validados (`OPEN-004/005`).
3. **Risco técnico/qualidade:** informações incompletas, tolerâncias e tratamentos térmicos podem causar retrabalho e estimativas incorretas (`OPEN-006..010`).
4. **Risco de dados:** históricos podem conter apontamentos incorretos, perdas, retrabalho e picos atípicos (`OPEN-013/014`, `CON-004`).
5. **Risco de escopo:** ERP, estoque e chão de fábrica não estão delimitados (`OPEN-015..019`).
6. **Risco de governança:** perfis, permissões e setores autorizados ainda não estão confirmados (`OPEN-020`, `OPEN-032`).
7. **Risco de fluxo comercial:** estados e revisões não estão definidos (`OPEN-018`, `OPEN-022`).
8. **Risco de adoção/continuidade:** treinamento e transição sem interrupção total não possuem plano ou critérios (`OPEN-031`, `CON-005`).

## Decisões pendentes

- Aprovar fórmulas de custo e preço e composição de mão de obra.
- Aprovar metodologia de estimativa de tempo e parâmetros.
- Definir matriz de dados técnicos obrigatórios e regra de alerta/bloqueio.
- Definir fluxo de dúvidas técnicas e responsáveis.
- Definir regras de material, fator de uso, preço e normalização de históricos.
- Definir escopo de estoque e integração ERP.
- Aprovar estados/transições e tratamento de revisões.
- Aprovar matriz de perfis e permissões.
- Definir conteúdo do documento comercial e indicadores.
- Definir requisitos mensuráveis de desempenho, disponibilidade, compatibilidade, auditoria e transição.

## Condições necessárias antes de iniciar a próxima fase

1. Responsáveis de negócio validarem prioritariamente todas as questões P0.
2. Gerência Industrial e responsáveis de Orçamentos, PCP, Engenharia e Usinagem/CNC aprovarem as regras centrais de custo, tempo e dados técnicos.
3. Confirmar atores, stakeholders, responsabilidades e matriz de permissões.
4. Resolver o conflito do catálogo de status (`CONFL-001`/`OPEN-018`) e definir tratamento de revisões.
5. Delimitar formalmente o escopo de ERP, estoque e acompanhamento de chão de fábrica.
6. Validar critérios de aceitação dos requisitos centrais, incluindo os critérios que dependem de fórmulas e parâmetros.
7. Recuperar e reconciliar os identificadores históricos de Epic/Feature/User Story/Acceptance Criteria do backlog anterior, preservando-os sem renumeração.
8. Registrar decisões aprovadas e atualizar a rastreabilidade.
9. Solicitar explicitamente a mudança de fase. Este pacote não inicia automaticamente arquitetura, planejamento técnico ou desenvolvimento.

## Conclusão

O Discovery possui um entendimento amplo do problema, dos objetivos, dos atores, do processo atual e de 21 requisitos funcionais, além de regras, restrições, integrações e necessidades não funcionais. Entretanto, as 32 questões abertas — especialmente as P0 — demonstram que o conjunto ainda não deve ser tratado como baseline de requisitos aprovada. O estado correto é **Discovery documentado, aguardando validação e fechamento das decisões prioritárias**.
