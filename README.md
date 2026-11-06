# Discovery — Controle de Cálculo de Orçamento Industrial

**Projeto:** Corus Equipamentos Industriais  
**Documento de referência:** SRC-04 — Requisitos Consolidados, versão 2.1, 04/11/2026  
**Fase:** Discovery  
**Status:** consolidado para revisão e validação dos responsáveis de negócio; ainda não constitui baseline aprovada.

## Finalidade

Este diretório reúne o entendimento consolidado do problema, objetivos, stakeholders, requisitos, regras de negócio, backlog candidato, critérios preliminares, decisões registradas, questões em aberto e rastreabilidade do Discovery.

Os documentos representam o estado suportado pelas fontes do projeto. Não são transcrição de conversas e não convertem hipóteses, protótipos ou sugestões em decisões aprovadas.

## Índice

- [CONTEXT.md](CONTEXT.md) — contexto, processo atual, escopo e restrições.
- [VISION.md](VISION.md) — problema, objetivos e resultados esperados.
- [STAKEHOLDERS.md](STAKEHOLDERS.md) — stakeholders e atores identificados.
- [GLOSSARY.md](GLOSSARY.md) — termos do domínio.
- [BUSINESS_RULES.md](BUSINESS_RULES.md) — regras de negócio identificadas e ressalvas.
- [FUNCTIONAL_REQUIREMENTS.md](FUNCTIONAL_REQUIREMENTS.md) — FR-001 a FR-021.
- [NON_FUNCTIONAL_REQUIREMENTS.md](NON_FUNCTIONAL_REQUIREMENTS.md) — NFR-001 a NFR-010.
- [BACKLOG.md](BACKLOG.md) — organização funcional candidata para as próximas etapas.
- [ACCEPTANCE_CRITERIA.md](ACCEPTANCE_CRITERIA.md) — critérios preliminares por requisito.
- [DECISIONS.md](DECISIONS.md) — DEC-001 a DEC-006 e limites.
- [OPEN_QUESTIONS.md](OPEN_QUESTIONS.md) — OPEN-001 a OPEN-032.
- [TRACEABILITY.md](TRACEABILITY.md) — relação entre objetivos, requisitos, regras, backlog e critérios.

## Fontes consideradas

1. `SRC-01-CONTEXTO-INICIAL.md` — problema, processos manuais, usuários e cadastros inicialmente esperados.
2. `SRC-02-PROCESSO-ATUAL-E-ENTREVISTAS.pdf` — entrevistas com Gerência Industrial, Orçamentos, PCP e Usinagem/CNC; processo atual; requisitos não funcionais e interoperabilidade.
3. `SRC-03-PROCESSO-ATUAL-E-DIAGRAMAS.pdf` — processo, requisitos iniciais, casos de uso, protótipo e glossário.
4. `SRC-04-REQUISITOS-CONSOLIDADOS.docx`, versão 2.1, de 04/11/2026 — consolidação pós-entrevistas, identificadores, dependências, conflitos, ambiguidades e questões abertas.

## Convenções de leitura

- **Identificado:** consta das fontes como necessidade ou comportamento esperado.
- **Preliminar:** critério ou comportamento proposto nas fontes, ainda sujeito à validação.
- **Em aberto:** não há decisão suficiente; consultar `OPEN_QUESTIONS.md`.
- **Não delimitado:** a necessidade aparece, mas o limite de escopo não foi definido.
- Os identificadores `OBJ`, `STK`, `ACT`, `FR`, `NFR`, `BR`, `CON`, `INT`, `DAT`, `DEC`, `OPEN`, `DUP`, `CONFL`, `AMB` e `DEP` são preservados conforme SRC-04.
- O SRC-04 não registra identificadores estáveis de Epic, Feature, User Story ou Critério de Aceitação. Para não criar identificadores fictícios nem colidir com o backlog de conversas anteriores, o backlog deste pacote referencia os FRs e marca IDs de backlog não recuperáveis como **não disponíveis na fonte consolidada**.

## Governança e limite

Este pacote não autoriza implementação nem define arquitetura, linguagem, framework, banco de dados, infraestrutura, cloud ou estratégia técnica. A passagem para outra fase depende de solicitação explícita e da validação de negócio, especialmente das questões P0 indicadas no SRC-04.
