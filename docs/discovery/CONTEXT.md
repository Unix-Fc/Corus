# Contexto do projeto

## Identificação

- **Projeto:** Controle de Cálculo de Orçamento Industrial — Corus Equipamentos Industriais.
- **Fase:** Discovery.
- **Referência de consolidação:** SRC-04, versão 2.1, 04/11/2026.
- **Natureza da solução:** sistema de apoio à elaboração de orçamentos industriais e à estimativa do tempo de produção de peças e componentes.

## Problema

O processo de orçamento depende de cálculos manuais, estimativas baseadas na experiência dos colaboradores e informações distribuídas entre ERP, planilhas, ordens de produção (OPs), documentos físicos e comunicações. Isso causa demora na elaboração e resposta ao cliente, risco de inconsistência, retrabalho e dificuldade de gestão.

Os processos industriais mencionados nas fontes incluem usinagem, corte, solda e caldeiraria. As entrevistas e o detalhamento técnico concentram-se especialmente em usinagem/CNC e no fluxo entre Orçamentos, Engenharia, PCP e Usinagem.

## Processo atual consolidado

1. Cliente solicita fabricação e encaminha informações, normalmente por WhatsApp ou e-mail.
2. Orçamentista identifica a peça e analisa desenho, material, dimensões e especificações disponíveis.
3. São levantados materiais, quantidades, operações, máquinas, tempos e serviços externos aplicáveis.
4. O orçamento é calculado manualmente, com apoio da experiência, planilhas, ERP, histórico e informações de compras/produção.
5. A proposta é elaborada e enviada ao cliente.
6. O cliente avalia a proposta; pode haver negociação e revisão.
7. Após pedido de compra, ocorre conferência da aderência ao orçamento.
8. PCP analisa OP/produto, prazo, materiais e quantidades, disponibilidade física, sequência, fator de uso/tempo e desenho técnico.
9. É emitida/considerada a ordem de produção e a execução segue pelos setores.

A sequência representa o processo descrito nas fontes, não um fluxo futuro aprovado nem uma especificação de automação integral.

## Problemas e necessidades observados

- Cálculo lento e suscetível a erros.
- Dependência do conhecimento individual.
- Dados técnicos incompletos, inclusive tolerâncias e tratamento térmico.
- Dúvidas à Engenharia tratadas por canais dispersos, sem histórico padronizado.
- Dificuldade de estimar material, fator de uso e tempos.
- Histórico de consumo e produção pode conter picos, retrabalho, perdas e apontamentos incorretos.
- Falta de visão consolidada de orçamentos, custos, prazos e indicadores.
- Transferência de informação entre Orçamentos, Engenharia, PCP e Usinagem/CNC é fragmentada.

## Escopo funcional identificado

- Acesso individual e permissões.
- Manutenção de parâmetros de cálculo e cadastros.
- Cadastro de clientes, projetos e peças.
- Registro/referência a dados técnicos e desenhos.
- Definição de operações, sequência e serviços externos.
- Estimativa de materiais, custos e tempo de produção.
- Validação de completude técnica e registro de dúvidas.
- Consulta de históricos de orçamentos, compras e dados operacionais.
- Acompanhamento do status comercial do orçamento.
- Geração de documento de orçamento.
- Relatórios e informações gerenciais.
- Apoio à análise do PCP.
- Interoperabilidade/importação conforme escopo a aprovar.

## Limites conhecidos

- O sistema foi concebido como complemento ao ERP existente; não há decisão de substituí-lo (`CON-001`, `DEC-001`).
- O escopo e a direção da integração com ERP não estão definidos (`OPEN-016`).
- Consulta e controle transacional de estoque não estão delimitados (`OPEN-015`, `AMB-001`).
- Acompanhamento de chão de fábrica não está delimitado (`OPEN-019`).
- Catálogo de estados e transições do orçamento não está aprovado (`OPEN-018`, `CONFL-001`).
- Bloqueios decorrentes de dados técnicos incompletos não estão definidos (`OPEN-008`, `AMB-004`).
- Não há fórmula oficial de custo e preço aprovada (`OPEN-001` a `OPEN-003`).
- Não há método oficial de estimativa de tempo aprovado (`OPEN-004`, `OPEN-005`).

## Restrições e premissas

| ID | Item | Entendimento |
|---|---|---|
| CON-001 | ERP existente | O ERP atual permanece como sistema existente; o novo sistema foi solicitado como complemento. |
| CON-002 | Fontes heterogêneas | Dados estão distribuídos em ERP, planilhas, OPs, documentos físicos e comunicações. |
| CON-003 | Conhecimento especializado | Processos, ferramentas e parâmetros dependem de especialistas. |
| CON-004 | Qualidade dos dados | Apontamentos incorretos, baixas, retrabalho e perdas podem distorcer históricos. |
| CON-005 | Transição | Há requisito de implantação sem interrupção total, mas a abordagem não está definida. |

## Dados de domínio identificados

`DAT-001` usuários/permissões; `DAT-002` clientes; `DAT-003` projetos/peças; `DAT-004` documentação técnica; `DAT-005` matérias-primas; `DAT-006` custos de materiais; `DAT-007` fator de uso/quantidade; `DAT-008` máquinas/recursos; `DAT-009` ferramentas/parâmetros; `DAT-010` operações/serviços; `DAT-011` composição financeira; `DAT-012` histórico operacional.

## Integrações e fontes

| ID | Fonte | Necessidade e situação |
|---|---|---|
| INT-001 | ERP | Consultar/trocar informações de produção, PCP, ordens e dados operacionais; escopo em aberto. |
| INT-002 | Planilhas | Importar dados históricos e parâmetros; formatos e conteúdo a inventariar. |
| INT-003 | Ordens de produção | Utilizar produto, materiais, quantidades, fator de uso, sequência e prazo; sincronização não definida. |
| INT-004 | Notas fiscais/compras | Obter referência de preço de aquisição; acesso e origem formal não definidos. |
| INT-005 | Desenhos/documentos técnicos | Consultar dimensões, tolerâncias, material e especificações; formato, armazenamento e revisão em aberto. |
