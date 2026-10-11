# 📋 Histórico Completo de Desenvolvimento — Sabedoria Digital
**Data:** 11 de Outubro de 2026  
**Status do Projeto:** Ativo, Funcional e Estável (Dev server rodando em `http://localhost:3000`)

---

## 🎯 1. Resumo Executivo do Dia
Nesta sessão de trabalho intensiva, resolvemos um erro crítico que bloqueava o sistema há 2 dias (upload de arquivos), integramos a persistência real no Firebase Firestore com extração de capa mágica de PDFs, limpamos categorias obsoletas e implementamos a separação definitiva entre **Livros** e **E-books** tanto no painel administrativo quanto na loja pública e na tela de cursos/vídeos.

---

## 🛠️ 2. Detalhamento de Tudo o que Foi Realizado

### 2.1. Diagnóstico e Resolução do Erro Crítico de Upload (UploadThing)
- **Problema Enfrentado (2 dias de bloqueio):** Ao tentar publicar um novo livro no formulário `/admin/livros/novo`, o UploadThing retornava erros como `UploadThingError: XHR failed 400`, `Invalid signature` e `Expired signature`.
- **Causa Raiz Identificada:**
  1. No UploadThing v7, o servidor assina URLs pré-assinadas com timestamps UTC. A máquina local apresentava diferença de relógio (clock skew) em relação aos servidores da AWS/UploadThing, fazendo com que as assinaturas expirassem imediatamente.
  2. Em ambiente local (`localhost:3000`), o webhook de callback do UploadThing não conseguia notificar o servidor sem túnel público, travando quando configurado com `awaitServerData: true`.
- **Solução Aplicada em `src/app/api/uploadthing/core.ts` e `src/app/admin/livros/novo/page.tsx`:**
  - Configurado `presignedURLTTL: "1d"` (1 dia de tolerância para assinatura de URLs).
  - Sanitização de nomes de arquivos para evitar caracteres especiais/acentos que invalidavam a assinatura HMAC.
  - Configurado `awaitServerData: false` no router do UploadThing para permitir conclusão instantânea no frontend.
  - **Resultado:** Uploads de PDFs de livros e imagens de capa agora sobem com 100% de sucesso.

---

### 2.2. Extração Mágica de Capa do PDF
- Mantida e otimizada a biblioteca `pdfjs-dist` no formulário `/admin/livros/novo`.
- Ao carregar qualquer PDF, a primeira página é renderizada em `<canvas>` e convertida automaticamente em imagem JPEG de alta resolução, sendo enviada para o CDN do UploadThing sem necessidade de o utilizador desenhar ou subir uma capa separada.

---

### 2.3. Eliminação dos Cards Falsos e Conexão Real com o Firebase Firestore
- **Problema Anterior:** A página `/livros` exibia capas e livros falsos/estáticos de simulação, enquanto o livro recém-publicado não aparecia.
- **Soluções Implementadas:**
  1. `src/app/livros/page.tsx`: Removidos todos os dados simulados. Agora faz consulta direta no Firestore (`collection(db, "livros")`, ordenado por data `criadoEm desc`).
  2. `src/app/admin/livros/page.tsx`: Atualizado para listar os itens reais salvos no Firestore, com botão de **"Ver PDF"** e botão de **"Excluir"** funcional.
  3. `src/app/livros/[id]/page.tsx`: Conectado para exibir os detalhes dinâmicos do documento selecionado no Firestore.

---

### 2.4. Filtro de Categorias Solicitado
- Conforme o pedido expresso do cliente, foram eliminadas todas as outras categorias que existiam (como Finanças, Psicologia, Saúde, História, etc.).
- **Categorias oficiais ativas mantidas:**
  1. 💼 **Negócios**
  2. 🧠 **Desenvolvimento Pessoal**
- Disponíveis tanto para seleção no cadastro (`/admin/livros/novo`) quanto para filtragem interativa no catálogo (`/livros`).

---

### 2.5. Nova Função: Marcação de "Livro" vs "E-book"
- **No formulário `src/app/admin/livros/novo/page.tsx`:**
  - Adicionado seletor visual em destaque com duas opções claras:
    - 📖 **Livro** (*Obra completa / Livro digital*)
    - 📱 **E-book** (*Guia prático / Manual digital*)
  - Textos dinâmicos nos botões e no campo de upload conforme a escolha.
  - Gravação do campo `tipo: "livro" | "ebook"` no documento do Firestore.
- **No painel `src/app/admin/livros/page.tsx`:**
  - Abas de separação rápida: `✨ Todos`, `📖 Livros`, `📱 E-books` com contagem automática.
  - Selo visual em cada card indicando o tipo de material.

---

### 2.6. Separação de Informações na Tela de Vídeos/Cursos (`/cursos`)
- Para evitar misturar as informações em uma única grelha desorganizada, a tela `src/app/cursos/page.tsx` foi dividida em 3 seções dedicadas:
  1. 🎬 **Vídeo-Aulas Publicadas** (Cursos com integração de playlists do YouTube: FOREX, Dropshipping, etc.)
  2. 📱 **E-books Publicados** (Carregados do Firestore com etiqueta verde e preço em MT)
  3. 📖 **Livros Publicados** (Carregados do Firestore com etiqueta dourada e preço em MT)
- Adicionados botões no cabeçalho/Hero para saltar diretamente para cada uma das seções.

---

### 2.7. Integração na Loja de E-books (`/ebooks`)
- `src/app/ebooks/page.tsx`: Atualizada para carregar em tempo real os e-books publicados no Firestore.

---

## 🗄️ 3. Estrutura do Banco de Dados (Firestore)
Coleção: `livros`  
Campos de cada documento:
```typescript
{
  id: string;               // ID gerado pelo Firestore
  titulo: string;           // Título da publicação
  autor: string;            // Nome do autor
  categoria: string;        // "Negócios" | "Desenvolvimento Pessoal"
  tipo: "livro" | "ebook";  // Marcação solicitada
  preco: number;            // Preço em Meticais (MT)
  descricao: string;        // Sinopse do material
  capaUrl: string;          // Link da imagem no CDN do UploadThing
  pdfUrl: string;           // Link do arquivo PDF no UploadThing
  criadoEm: string;         // Timestamp ISO 8601
}
```

---

## 🌐 4. Links Importantes da Aplicação Local
- **Página Inicial:** `http://localhost:3000/`
- **Catálogo de Livros:** `http://localhost:3000/livros`
- **Catálogo de E-books:** `http://localhost:3000/ebooks`
- **Vídeo-Aulas & Cursos (com seções de livros e e-books):** `http://localhost:3000/cursos`
- **Painel Administrativo:** `http://localhost:3000/admin`
- **Lista de Livros & E-books (Admin):** `http://localhost:3000/admin/livros`
- **Adicionar Livro ou E-book (Admin):** `http://localhost:3000/admin/livros/novo`

---

## 📍 5. Ponto Exato de Parada
- **Autenticação Concluída:**
  - Telas compactas e funcionais de `/criar-conta` e `/entrar` com Firebase Auth e Firestore.
  - Header reativo: detecta login em tempo real, mostra avatar do usuário e botão de logout.
- **Painel do Aluno / Minha Biblioteca Concluído (`/minha-conta`):**
  - Banner exclusivo de boas-vindas com contagem de materiais.
  - Abas: `Todos os Materiais`, `Livros Digitais`, `E-books` e `Vídeo-Aulas`.
  - Cursos liberados com atalho direto para a sala de aula.
  - Livros e e-books com botões de "Ler Online" e "Baixar PDF" + Estado vazio elegante convidando para o catálogo.
- **Painel de Vendas & Faturamento Concluído (`/admin/vendas`):**
  - Métricas financeiras em tempo real: Receita Total Aprovada (MT), Vendas Concluídas, Pendentes e Total de Pedidos.
  - Tabela completa de transações com suporte a **M-Pesa**, **e-Mola** e Transferência.
  - Filtros por status (`Todos`, `Aprovado`, `Pendente`, `Rejeitado`) e barra de busca instantânea.
  - Ações para aprovar pagamentos pendentes e exclusão de registros.
  - Modal para registro de vendas manuais/simuladas salvas diretamente no Firestore.
- **Tela de Checkout & Pagamento Móvel Concluída (`/checkout`):**
  - Design compacto e focado, sem informações excessivas.
  - Seleção rápida de carteira: **🔴 M-Pesa** ou **🟡 e-Mola**.
  - Exibe resumo do material (capa, título e preço em MT).
  - Formulário simplificado: Número de telefone e código de confirmação.
  - Gravação automática no **Painel de Vendas (`/admin/vendas`)** e liberação imediata na **Minha Biblioteca (`/minha-conta`)**.
- Ciclo de vendas 100% completo e operacional!
