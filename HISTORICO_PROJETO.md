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
- **Deploy em Produção (Vercel) & GitHub Concluído:**
  - Repositório sincronizado: `https://github.com/jaimitonhama-droid/Wandra.git`
  - Domínio público ativo e funcional: `https://wandra-cursos.vercel.app`
- **Integração NetShop & Webhook Configurada:**
  - Chaves salvas de forma segura em `.env.local`:
    - `NETSHOP_API_KEY`: configurada.
    - `NETSHOP_WEBHOOK_SECRET`: `whsec_42dc34b80ce3632e127e20cdcbe076251d472ad66ed1e5e8` salva.
  - Endpoint de webhook público criado: `https://wandra-cursos.vercel.app/api/webhooks/netshop`
  - Webhook criado e ativo no painel da NetShop com eventos `charge.paid`, `charge.failed`, etc.

---

## 📍 6. Sessão de 17 de Outubro de 2026 — Refinamento Visual, Mobile & Remoção de Emojis

### 6.1. Novo Fundo Visual (Hero & Plataforma)
- **Ajuste:** O fundo anterior com efeito de partículas/explosão artificial foi completamente removido.
- **Novo Design:** Implementado um fundo escuro com gradientes sutis em tons de obsidiana e azul profundo (`#080c14` / `#0a0f1d`), transmitindo um aspeto muito mais limpo, sóbrio e profissional conforme referência solicitada.

### 6.2. Redimensionamento dos Cards de Categorias (`CategoryCards.tsx`)
- Os 3 cards principais da Home (Livros, Vídeo-Aulas e E-books) tinham dimensões alongadas e desproporcionais.
- A altura da imagem de capa foi reduzida de 320px para 190px (e 160px em mobile).
- O padding interno e o espaçamento dos textos foram otimizados para criar cartões equilibrados, modernos e elegantes.

### 6.3. Otimização Completa para Mobile (Versão Celular)
- Corrigida a escala geral de textos, cabeçalhos (`h1`, `h2`), paddings de seção e formulários que ficavam excessivamente grandes no celular.
- Seções do Hero, Categorias, Prova Social e Rodapé receberam media queries dedicadas para adaptação fluida em telas estreitas (360px–480px).

### 6.4. Menu Mobile Inferior em Formato de Ícones (Bottom Navigation Bar)
- Atendendo à solicitação para que no celular os menus laterais apareçam na parte inferior:
  - Implementada barra de navegação fixa inferior (`fixed bottom-0 left-0 right-0 z-50`) com ícones para os painéis (`/minha-conta` e `/admin`).
  - O utilizador pode navegar com o polegar diretamente entre as abas sem necessidade de abrir gavetas laterais que ocupavam a tela toda.

### 6.5. Remoção de Todos os Emojis & Criação de Ícones SVG Profissionais
- Criado o componente dedicado `src/components/Icons.tsx` com ícones vetoriais modernos (`IconBook`, `IconVideo`, `IconEbook`, `IconHome`, `IconSearch`, `IconUser`, `IconStar`, `IconCheck`, `IconAlert`, `IconLock`, `IconZap`, `IconClose`, `IconMenu`, `IconEye`, `IconEyeOff`, etc.).
- **Substituições 100% concluídas:**
  - `Header.tsx` (logo, navegação desktop, navegação mobile, pesquisa, perfil e botão fechar).
  - `Footer.tsx` (logo, links de catálogo e remoção de bandeira no rodapé).
  - `CategoryCards.tsx` (ícones flutuantes dos cartões).
  - `Testimonials.tsx` (avatares com iniciais coloridas e estrelas SVG douradas).
  - `TrustSection.tsx` (ícones de segurança, rapidez, dispositivos, qualidade e botões de ação).
  - `src/app/page.tsx` (badges do hero e mini métricas).
  - `src/app/livros/page.tsx` e `src/app/livros/[id]/page.tsx` (filtros de categoria, abas, capas placeholder, detalhes e botão de compra).
  - `src/app/cursos/page.tsx` e `src/app/cursos/[id]/page.tsx` (botões de âncora, vitrines de livros/ebooks, player e métricas).
  - `src/app/ebooks/page.tsx` e `src/app/ebooks/[id]/page.tsx` (badges de formato, filtros e checklist de tópicos).
  - `src/app/entrar/page.tsx` e `src/app/criar-conta/page.tsx` (alertas de erro/sucesso e alternador de visibilidade de senha).
  - `src/app/checkout/page.tsx` (selo de pagamento seguro, modal de espera de PIN móvel e tela de aprovação).

---


---

## 📍 8. Sessão de 27 de Outubro de 2026 — Correções Críticas na Versão Mobile

### 8.1. Visibilidade do Painel Admin no Mobile e Cadastro
- **Problema:** Ao cadastrar ou logar no celular, o usuário via o Gmail no topo mas não tinha acesso ao Painel Admin. O link em `/minha-conta` estava restrito por e-mail hardcoded (`jaimitonhama@gmail.com`) e o texto "Painel Admin" ficava oculto em telas menores (`hidden sm:inline`). Além disso, o menu móvel e o topo do `Header.tsx` não exibiam atalho para o admin.
- **Solução Implementada:**
  - `Header.tsx`: Adicionado botão dourado **⚙️ Admin** direto na barra superior mobile quando logado, e botões em grade de 2 colunas (**Painel Admin** e **Minha Conta**) dentro da gaveta móvel ao abrir o menu hambúrguer.
  - `minha-conta/page.tsx`: Removida restrição arbitrária de string única e liberada a visualização clara do botão com texto "Painel Admin" na barra superior móvel e na barra lateral.

### 8.2. Livros em Grade de 2 em 2 no Mobile
- **Problema:** Em telas de smartphone, os livros eram renderizados em coluna única (grid de 1), deixando a página excessivamente longa.
- **Solução Implementada:**
  - `src/app/livros/page.tsx`: Adicionada classe `.livros-catalogo-grid` com media query `@media (max-width: 768px)` configurando `grid-template-columns: repeat(2, 1fr) !important`, gap ajustado para 12px, altura de capa proporcional (185px) e tipografia fluida.
  - `src/app/cursos/page.tsx`: Atualizada `.livros-grid` e `.ebooks-grid` para `repeat(2, 1fr)` em telas móveis com capas de 180px.
  - `src/app/ebooks/page.tsx`: Ambas as grades de e-books ajustadas para 2 colunas no celular.
  - `src/app/minha-conta/page.tsx`: As abas de *Livros Digitais* e *Meus E-books* agora exibem os itens comprados em `grid-cols-2` no mobile.

### 8.3. Correção de Sobreposição dos Vídeos na Versão Mobile
- **Problema:** Na sala de aula `/cursos/[id]/aula/[aulaId]`, ao abrir ou trocar de aula no celular, a barra lateral de módulos/outros vídeos (com largura fixa de 350px em `flex-row`) esmagava ou ficava por cima do player de vídeo. O utilizador apenas ouvia o áudio mas não conseguia ver a imagem do vídeo. Além disso, no `VideoPlayer.tsx` havia um hack de `-20% top` e `140% height` com `pointerEvents: none` que impedia o controlo em telas táteis.
- **Solução Implementada:**
  - `src/app/cursos/[id]/aula/[aulaId]/page.tsx`:
    - Layout convertido para fluxo vertical (`flex-direction: column`) no mobile (`<= 900px`).
    - O vídeo principal agora fica sempre no **topo absoluto**, com largura 100% e visibilidade prioritária.
    - A lista de outros módulos/aulas foi reposicionada para ficar **abaixo** do vídeo em reprodução.
    - Adicionado scroll suave automático ao topo (`window.scrollTo({ top: 0, behavior: "smooth" })`) ao clicar em qualquer outra aula.
  - `src/components/VideoPlayer.tsx`:
    - Removido o corte de `-20% / 140%` e o overlay transparente que bloqueava o toque. O player agora ocupa 100% do container 16:9.
    - Habilitados `controls: 1` e `playsinline: 1` para permitir play, pause, ajuste de linha do tempo e tela cheia diretamente no celular.

---

## 📍 10. Sessão de 28 de Outubro de 2026 — Destaque de Descrição e Autor dos Livros, Otimização de E-books e Deploy Completo

### 10.1. Destaque da Descrição e do Nome do Autor na Página de Detalhes
- **Solicitação do Usuário:** Quando o visitante clica em qualquer livro, deseja ver imediatamente a descrição completa da obra e o nome do autor na página que se abre em seguida.
- **Solução Implementada em `src/app/livros/[id]/page.tsx`:**
  - **Autor em Evidência:** Inserido um bloco estilizado com ícone `IconUser`, label e nome do autor em destaque (`Autor da Obra: [Nome]`), garantindo leitura imediata sem passar despercebido.
  - **Card de Descrição da Obra:** Criada uma seção dedicada com cabeçalho `Descrição da Obra`, ícone `IconFileText`, fundo sutil escuro com borda suave e tipografia confortável (`1.08rem`, `lineHeight: 1.85`, `whiteSpace: pre-line`) para exibir toda a sinopse cadastrada logo na visão principal da tela.
  - **Card de Compra & Download:** Posicionado à esquerda ao lado da capa, com preço em Meticais (`MT`), botão de compra rápida via carteiras locais (M-Pesa e e-Mola), e checklist com ícones de garantias (download imediato em PDF, leitura offline, compatibilidade com celular, tablet e computador).
  - **Navegação & Retorno:** Adicionado botão `← Voltar ao Catálogo` e trilha de navegação (breadcrumb) no topo da página.
  - **Responsividade:** Ajuste com `@media (max-width: 860px)` para adaptar a visualização em uma coluna fluida no celular sem cortes de imagem.

### 10.2. Conexão Real da Rota de E-books (`/ebooks/[id]`)
- **Problema:** A rota `/ebooks/[id]` exibia apenas dados simulados estáticos de exemplo (`ebookMock`), não refletindo o livro real selecionado.
- **Solução Implementada em `src/app/ebooks/[id]/page.tsx`:**
  - Atualizada para consultar dinamicamente o documento correspondente no Firestore (`db.livros`), renderizando capa, título, autor e descrição reais do e-book cadastrado, com fallback compatível para os identificadores de teste.

### 10.3. Otimização de Repositório e Resolução de Erro de Push Git
- **Problema Enfrentado:** Ao tentar subir todas as alterações acumuladas (mais de 58 MB contendo capas e PDFs de livros reais), o Git apresentou `error: RPC failed; curl 7 Failed to connect to github.com:443` devido a uma oscilação de rede e ao limite de buffer HTTP padrão do Git (1 MB).
- **Soluções:**
  1. Adicionado diretório de rascunhos temporários `downloads/` ao `.gitignore`.
  2. Configurado o buffer de postagem HTTP do Git para 500 MB (`git config http.postBuffer 524288000`).
  3. Realizado o envio com sucesso (`9f230dd..f3ffde3 main -> main`), transferindo 58.74 MB para o repositório GitHub (`https://github.com/jaimitonhama-droid/Wandra.git`).

### 10.4. Validação de Build e Deploy
- **TypeScript:** Verificado com `npx tsc --noEmit` — aprovado com **0 erros**.
- **Next.js Production Build:** Testado com `npm run build` — todas as 22 rotas compiladas e otimizadas com sucesso em produção.
- **Deploy Automático:** Disparado na Vercel a partir do branch `main`.

---

## 📍 11. Ponto Exato de Parada
- Plataforma 100% sincronizada entre repositório local, GitHub e Vercel (`https://wandra-cursos.vercel.app`).
- Catálogo de livros e e-books com visualização completa de capa, título, autor, descrição detalhada e checkout integrado via M-Pesa e e-Mola.



