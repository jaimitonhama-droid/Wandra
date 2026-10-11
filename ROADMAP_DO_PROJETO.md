# Planejamento do Projeto: Plataforma de Conhecimento (Livros, Cursos e E-books)

## 📌 Visão Geral do Projeto
Uma plataforma de e-commerce e e-learning unificada, dividida em três pilares principais para garantir a melhor experiência do usuário (UX):
1. Livros Digitais (PDF)
2. Vídeo-aulas (Cursos)
3. E-books

O usuário entrará em um "Portal" (Página Inicial) onde escolherá qual área deseja explorar.

## 🛠️ Stack Tecnológica
*   **Frontend:** Next.js (React) para SEO, performance e navegação rápida.
*   **Backend & Banco de Dados:** Firebase (Firestore para DB, Firebase Auth para login).
*   **Armazenamento de Arquivos:** Backblaze B2 (Para hospedar os PDFs dos livros e e-books).
*   **Hospedagem de Vídeos:** YouTube + YouTube API (Vídeos não listados incorporados).
*   **Gateway de Pagamento:** Netshop (Integração com carteiras móveis locais de Moçambique).

## 🎨 Diretrizes de Design
*   **Portal Inicial:** Limpo, moderno, com 3 grandes opções de escolha.
*   **Área de Livros/E-books:** Estética aconchegante, cores terrosas, tipografia clássica (inspirado em livrarias premium).
*   **Área de Cursos:** Estética dinâmica, tecnológica, visual limpo com "Glassmorphism", foco em usabilidade de ensino.

---

## 🗺️ Roadmap de Execução (Passo a Passo)

### Fase 1: Configuração Inicial e Base (A Fundação)
- [x] Inicializar o projeto Next.js na pasta.
- [ ] Configurar o sistema de estilos (CSS Base/Tailwind) definindo as variáveis de cores globais.
- [x] Configurar o projeto no Firebase e adicionar as chaves ao projeto.
- [x] Criar a estrutura base de pastas (`/components`, `/app`, `/services`).

### Fase 2: O Portal Central e Navegação
- [x] Desenvolver o Header (Menu de navegação principal, unificado, com barra de pesquisa).
- [x] Criar a Página Inicial (Hero Section com imagem de fundo premium).
- [x] Criar os 3 Cartões Interativos (Links para Livros, Cursos e E-books).
- [x] Configurar as rotas base (`/livros`, `/cursos`, `/ebooks`).
- [x] Adicionar animações de scroll (FadeIn component).
- [x] Adicionar secção de Depoimentos/Avaliações.
- [x] Melhorar ícones da secção de Confiança.

### Fase 3: Desenvolvimento Visual (Frontend das Lojas)
- [x] Construir a vitrine da rota `/livros` (Carrossel, categorias por coleção).
- [x] Construir a vitrine da rota `/cursos` (Cards modernos, listagem de módulos).
- [x] Construir a vitrine da rota `/ebooks`.
- [x] Desenvolver as "Páginas de Produto" (A página onde o cliente vê o detalhe de um curso ou livro antes de comprar).

### Fase 4: Integrações e Banco de Dados (O Motor)
- [ ] Modelar a estrutura de dados no Firestore (Tabelas de Produtos e Usuários).
- [ ] Criar o painel de Administração (para adicionar os produtos).
- [ ] Integrar a API do YouTube (Lógica para buscar e exibir os vídeos privados).
- [ ] Configurar a comunicação com o Backblaze B2.

### Fase 5: Pagamentos e Área do Cliente
- [ ] Criar a página de Checkout unificado.
- [ ] Integrar a API do **Netshop** para processamento de pagamentos.
- [ ] Desenvolver a Área do Cliente (Onde ele acessa "Meus Cursos" e "Meus Downloads").
- [ ] Criar a lógica de liberação: Pagamento aprovado = Produto liberado no perfil.

### Fase 6: Polimento e Lançamento
- [ ] Revisão completa de Design (Adicionar animações, micro-interações, garantir o visual "Premium").
- [ ] Testes de responsividade (Garantir que funciona perfeitamente em celulares).
- [ ] Deploy do site para produção.

---
*Nota: Este arquivo serve como a memória central do projeto. Ele será atualizado conforme avançarmos nas fases.*

## 📝 Log de Progresso (Últimas Atualizações)
**06 de Outubro de 2026**
- **Menu:** Adicionado botão "Início" no cabeçalho (Desktop e Mobile) para facilitar a navegação global.
- **Leitor de Vídeo (Cursos):** Remodelado o componente `VideoPlayer.tsx` para usar um `iframe` nativo com truque avançado de CSS (zoom/letterbox). Isto ocultou permanentemente 100% dos botões e marcas de água do YouTube.
- **Catálogo de Cursos (Vitrine):** 
  - Limpeza total de todos os dados e mockups de demonstração a pedido do cliente.
  - Cartões de cursos modificados para exibirem *apenas* a imagem da capa (thumbnail do vídeo), sem qualquer texto auxiliar, mantendo um design minimalista.
- **Sala de Aula (Integração de Playlists):**
  - Dados de demonstração apagados em definitivo.
  - O sistema extraiu com sucesso os dados (Títulos e Links) de duas playlists reais do cliente.
  - Adicionado suporte dinâmico (`cursosDB`) em `[id]/aula/[aulaId]/page.tsx` para carregar módulos e aulas reais diretamente do código.
  - **Cursos implementados:** "Curso de FOREX 2026" e "Curso de Dropshipping Nacional".
