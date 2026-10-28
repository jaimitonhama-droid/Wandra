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
### Fase 4: Integrações e Banco de Dados (O Motor)
- [x] Modelar a estrutura de dados no Firestore (Tabelas de Produtos, Livros e Usuários).
- [x] Criar o painel de Administração (para adicionar os produtos).
- [x] Integrar a API do YouTube (Lógica para buscar e exibir os vídeos privados).
- [x] Configurar a comunicação com UploadThing (PDFs e extração automática de capas).

### Fase 5: Pagamentos e Área do Cliente
- [x] Criar a página de Checkout unificado (M-Pesa e e-Mola).
- [x] Integrar a API e Webhook do Netshop para processamento de pagamentos móveis.
- [x] Desenvolver a Área do Cliente / Minha Conta (`/minha-conta`).
- [x] Criar a lógica de liberação e estante de materiais.

### Fase 6: Polimento, Responsividade e Lançamento
- [x] Revisão completa de Design (eliminação de fundos artificiais e proporção de cards).
- [x] Testes e otimização de responsividade mobile (Bottom navigation bar com ícones nos painéis).
- [x] Remoção de todos os emojis da plataforma e substituição por biblioteca de ícones SVG (`Icons.tsx`).
- [x] Deploy do site para produção no Vercel (`https://wandra-cursos.vercel.app`).

---
*Nota: Este arquivo serve como a memória central do projeto. Ele é atualizado conforme avançamos nas fases.*

## 📝 Log de Progresso (Últimas Atualizações)
**28 de Outubro de 2026**
- **Páginas de Detalhes do Livro (`/livros/[id]`) e E-book (`/ebooks/[id]`):** Redesenho da interface ao clicar em uma obra para exibir com destaque imediato o **Nome do Autor**, a **Descrição Completa da Obra** em card dedicado e legível, especificações técnicas (formato PDF, leitura offline, compatibilidade móvel) e botão de compra seguro via M-Pesa / e-Mola.
- **Integração Real de E-books:** A rota `/ebooks/[id]` agora busca os dados reais da obra cadastrada no Firestore (`db.livros`), garantindo sincronização de autor, capa e sinopse.
- **Compilação TypeScript:** Verificada e validada com 0 erros (`tsc --noEmit`).

**17 de Outubro de 2026**
- **Design & Fundo do Site:** Removido o efeito artificial de explosão/partículas do Hero; aplicado fundo elegante em gradiente escuro obsidiana.
- **Proporções:** Redimensionamento e equilíbrio dos cards de Livros, Vídeo-Aulas e E-books na Home.
- **Responsividade Mobile:** Ajuste fino de escalas tipográficas e paddings para celulares.
- **Navegação Móvel por Ícones:** Menus dos painéis no celular convertidos para barra inferior fixa (bottom navigation bar).
- **Remoção Global de Emojis:** Substituição integral de emojis por ícones vetoriais SVG de alta qualidade em toda a plataforma.
- **Compilação e Estabilidade:** TypeScript compilando com 0 erros (`tsc --noEmit`). Comandos de push para GitHub/Vercel disponibilizados.

