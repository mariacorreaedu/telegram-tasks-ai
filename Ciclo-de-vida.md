# 🚀 Próximos Passos

## Implementações (Features / Recursos):
#### Plataforma Web (Gestão Desktop)
Construção de uma interface visual dedicada para administração avançada de tarefas, lembretes e notas em ambiente desktop.
- [ ] **Painel de Controle (Retool / Appsmith):** Conexão direta com o banco PostgreSQL (Supabase) para exibição em tabelas e quadros Kanban.
- [ ] **Autenticação via Link Parametrizado:** Acesso direto à dashboard através de tokens/chaves na URL (`https://seu-dashboard/?user=<telegram_id>&key=<chave>`).
- [ ] **Captura Avançada de Conteúdo:** Suporte ao registro de notas longas e lembretes estruturados além das tarefas simples.

#### Arquitetura & IA
- [ ] **Suporte Multi-LLM Dinâmico:** Implementar alternância entre provedores de IA (OpenAI, Anthropic, Ollama/Local) diretamente nos fluxos do n8n Cloud.
- [ ] **Suporte a Mensagens de Áudio:** Integração com Whisper (OpenAI) no n8n para transcrição e processamento automático de notas de voz.

---
## Melhorias (Enhancements / Refatoração):
#### Telegram (Experiência do Usuário)
- [ ] **Navegação Interativa por Botões (Inline Keyboards):** Substituir comandos de texto (`/add`, `/listar`) por botões de clique rápido no chat.
  - *Fluxo:* Envio de mensagem ➔ Exibição de botões de ação ➔ Seleção rápida ➔ Confirmação.

#### Relatórios & Insights Automaticos
- [ ] **Relatório Diário/Semanal de Desempenho:** Disparo automático via n8n enviando um resumo estatístico das tarefas concluídas e pendentes no Telegram do usuário.
- [ ] **Refinamento do Prompts da IA:** Melhorar a precisão da classificação de categorias e urgência com base no contexto das mensagens anteriores.
---
## Correções (Bug Fixes / Ajustes):
- [ ] **Tratamento de Erros no n8n:** Adicionar rotas de *fallback* para notificar o usuário via Telegram caso a API da OpenAI ou o Supabase fiquem indisponíveis.
- [ ] **Sanitização de Dados:** Tratar caracteres especiais nas mensagens do Telegram para evitar falhas de gravação SQL no Supabase.
