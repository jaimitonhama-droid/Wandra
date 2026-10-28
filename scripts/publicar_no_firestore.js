const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const novosLivros = [
  {
    titulo: "Manual de Empreendedorismo",
    autor: "ANJE - Associação Nacional de Jovens Empresários",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    descricao: "Guia completo de empreendedorismo com 10 capítulos que cobrem desde o perfil do empreendedor até estratégias para a empresa do século XXI. Cofinanciado pela União Europeia, oferece ferramentas práticas para quem quer criar e gerir um negócio.",
    capaUrl: "/capas/capa_empreendedorismo.jpg",
    pdfUrl: "/livros/manual-de-empreendedorismo.pdf",
    criadoEm: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
  },
  {
    titulo: "Introdução à Administração",
    autor: "Universidade Federal da Bahia (UFBA)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    descricao: "Livro universitário que apresenta as principais teorias da administração de forma clara e didática. Publicado sob licença aberta pela UFBA, cobre fundamentos essenciais para estudantes e profissionais de gestão.",
    capaUrl: "/capas/capa_administracao.jpg",
    pdfUrl: "/livros/introducao-a-administracao.pdf",
    criadoEm: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    titulo: "Gestão de Empresas: Um Guia Prático",
    autor: "CRC-RJ (Conselho Regional de Contabilidade)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    descricao: "Guia prático de gestão empresarial publicado pelo CRC-RJ em 2023 com 4 autores especializados. Aborda temas como planejamento estratégico, gestão financeira e governança corporativa com foco em resultados.",
    capaUrl: "/capas/capa_gestao.jpg",
    pdfUrl: "/livros/gestao-de-empresas-guia-pratico.pdf",
    criadoEm: new Date(Date.now() - 1000 * 60 * 6).toISOString(),
  },
  {
    titulo: "Planejamento Financeiro Pessoal e Finanças",
    autor: "CVM e PLANEJAR",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    descricao: "Manual completo de planejamento financeiro pessoal com 289 páginas. Publicado pela CVM em parceria com a PLANEJAR, cobre desde orçamento pessoal até investimentos e previdência com linguagem acessível.",
    capaUrl: "/capas/capa_financas.jpg",
    pdfUrl: "/livros/planejamento-financeiro-pessoal.pdf",
    criadoEm: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
  },
  {
    titulo: "O Guia Definitivo do Marketing Digital",
    autor: "Rock Content",
    categoria: "Negócios",
    tipo: "ebook",
    preco: 0,
    descricao: "Guia abrangente de marketing digital que cobre SEO, marketing de conteúdo, redes sociais e métricas. Design profissional com exemplos práticos para implementação imediata em novos negócios.",
    capaUrl: "/capas/capa_marketing.jpg",
    pdfUrl: "/livros/o-guia-definitivo-do-marketing-digital.pdf",
    criadoEm: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
  },
];

async function publicar() {
  console.log("Iniciando publicação no Firebase Firestore...");
  for (const livro of novosLivros) {
    const docRef = await addDoc(collection(db, "livros"), livro);
    console.log(`[PUBLICADO] "${livro.titulo}" -> ID: ${docRef.id}`);
  }
  console.log("\nTodos os 5 livros foram publicados no banco de dados com sucesso!");
  process.exit(0);
}

publicar().catch((err) => {
  console.error("Erro ao publicar:", err);
  process.exit(1);
});
