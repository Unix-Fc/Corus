# Regras de negócio

As regras abaixo foram identificadas nas fontes e consolidadas no SRC-04. Quando a própria fonte indica validação pendente, a ressalva é mantida.

| ID | Regra | Descrição consolidada | Situação/limite |
|---|---|---|---|
| BR-001 | Composição do custo | Custo total considera, conforme aplicabilidade, matéria-prima, horas-máquina/processos e serviços externos. | Fórmula detalhada não aprovada; ver OPEN-001 e OPEN-003. |
| BR-002 | Custo da matéria-prima | Entrevistas descrevem peso × valor/kg; em usinagem considera peso/volume bruto, volume final e fator de uso. | Regra oficial, unidades, perdas e cálculo precisam de validação; OPEN-011. |
| BR-003 | Preço de referência | Foi relatado uso do custo/kg da última nota fiscal. | Confirmar se é regra padrão e como tratar exceções; OPEN-012. |
| BR-004 | Tempo de produção | Estimativa considera operações/máquinas e pode utilizar histórico e tempo de funcionamento das máquinas. | Método e parâmetros não aprovados; OPEN-004 e OPEN-005. |
| BR-005 | Usinabilidade | Tempo varia conforme material; ligas de maior dureza podem exigir menor velocidade de corte e maior tempo. | Parâmetros técnicos dependem de especialistas. |
| BR-006 | Setup/operação | A entrevista distingue tempo de preparação (setup) e tempo de operação. | Cálculo e aplicação ainda não definidos. |
| BR-007 | Crítica de consumo | Históricos devem ser analisados criticamente, tratando picos atípicos, retrabalho, perdas não recorrentes e apontamentos incorretos. | Período, filtros e critérios de exclusão/normalização em aberto; OPEN-013 e OPEN-014. |
| BR-008 | Análise do PCP | PCP verifica OP/produto, prazo, materiais/quantidade, disponibilidade física, sequência, fator de uso/tempo e desenho técnico. | Critérios de aprovação, bloqueio e responsabilidades precisam de validação. |

## Regras relacionadas ainda não formalizadas

- Como calcular preço de venda, margem/markup, impostos, despesas e arredondamentos (`OPEN-002`).
- Como compor mão de obra e custo-hora (`OPEN-003`).
- Como tratar peso bruto/líquido, volume, fator de uso e perdas (`OPEN-011`).
- Qual fonte de preço prevalece quando última nota fiscal, tabela e cotação divergem (`OPEN-012`).
- Como tratar operações terceirizadas, tratamentos externos, fretes e custos indiretos (`OPEN-028`).
- Quais dados técnicos são obrigatórios por tipo de peça/processo e qual área os define (`OPEN-006`).
- Se dados ausentes apenas geram alerta ou impedem orçamento/liberação pelo PCP (`OPEN-008`).

Nenhuma das questões acima deve ser interpretada como regra aprovada.
