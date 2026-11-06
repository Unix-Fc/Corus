# Requisitos não funcionais

| ID | Categoria | Requisito consolidado | Lacunas/observações |
|---|---|---|---|
| NFR-001 | Armazenamento | Armazenar histórico de orçamentos, ordens de produção e informações gerenciais sem perda de dados. | Política de retenção, backup e recuperação não detalhada. |
| NFR-002 | Precisão monetária | Precisão mínima de duas casas decimais em cálculos monetários. | Arredondamento e precisão intermediária em aberto (`OPEN-023`). |
| NFR-003 | Padronização | Registrar custos de matéria-prima, custo-hora e serviços externos de forma padronizada. | Unidade, moeda, periodicidade e convenções precisam validação. |
| NFR-004 | Rastreabilidade | Manter histórico de alterações em valores de orçamento/custos operacionais e rastrear cálculos financeiros. | Eventos e retenção em `OPEN-024`. |
| NFR-005 | Compatibilidade | Ser compatível com computadores existentes na empresa. | Sistemas operacionais, navegadores e dispositivos em `OPEN-030`. |
| NFR-006 | Portabilidade/evolução | Permitir futura adaptação a novos ambientes/tecnologias sem reconstrução total. | Requisito qualitativo; critérios mensuráveis não definidos. |
| NFR-007 | Documentação/capacitação | Entregar documentação técnica, manual do usuário e treinamento dos funcionários envolvidos. | Público, conteúdo e formato do treinamento a definir. |
| NFR-008 | Continuidade | Implantar sem interromper totalmente os processos atuais. | Plano, janela e tolerância de indisponibilidade em aberto (`OPEN-031`). |
| NFR-009 | Interoperabilidade | Possibilitar integração ERP, importação de planilhas/OPs e compartilhamento entre Orçamentos, PCP e Usinagem. | Escopo e mecanismo não definidos (`OPEN-016/017`). |
| NFR-010 | Segurança/integridade | Restringir acesso a autorizados, preservar integridade e registrar operações para auditoria. | Perfis e permissões em `OPEN-020`; eventos/retention em `OPEN-024`. |

## Requisitos adicionais presentes nas fontes originais

O SRC-02 também menciona manutenibilidade, evolução futura para apoio à decisão e estoque e separação modular de componentes. O SRC-04 registra portabilidade/evolução em NFR-006 e limita o escopo de estoque, integração e implantação como questões em aberto. Não se cria requisito adicional nem decisão técnica a partir dessas menções.

## Critérios quantitativos ausentes

Não foram estabelecidos valores para:
- tempo máximo de resposta ou de cálculo;
- disponibilidade;
- usuários simultâneos;
- capacidade/volume de dados;
- retenção de dados;
- recuperação/backup;
- precisão de estimativas de tempo e custo além da indicação monetária de duas casas decimais.

As metas de tempo de resposta, cálculo e disponibilidade estão em `OPEN-029`.
