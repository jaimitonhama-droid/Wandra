const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Distribuição estratégica dos livros nas 10 novas categorias
const categoriasMapa = {
  // Finanças & Riqueza
  "BCFQjz6JTcgnhdsLN6az": "Finanças & Riqueza", // O Homem Mais Rico da Babilônia
  "ieTPruwRylh497OFdLNv": "Finanças & Riqueza", // Os Segredos da Mente Milionária
  "uZbbg36OF1VXgplwhbPg": "Finanças & Riqueza", // Planejamento Financeiro Pessoal e Finanças

  // Filosofia & Estoicismo
  "CAbHIaDu1zaCRzLDZV37": "Filosofia & Estoicismo", // Meditações
  "HNHSr5dN1bqlTTibTLE8": "Filosofia & Estoicismo", // O Obstáculo é o Caminho

  // Inteligência Emocional
  "RVG7pi26zo2DgeAZCDOM": "Inteligência Emocional", // Inteligência Emocional

  // Marketing Digital
  "xxxqewkGqxM5DAv3V7Sy": "Marketing Digital", // O Guia Definitivo do Marketing Digital
  "4LmCb4ZpLyjE7glq3IUm": "Marketing Digital", // Gestão de Marketing
  "4R5fTUqyZ363JKMEZvjp": "Marketing Digital", // Neuromarketing e Marketing Sensorial nas Vendas Online
  "Gt0180yCe3BG4awAISJ7": "Marketing Digital", // Estratégias de Marketing
  "LM5u9YrSITF43iAXFHCq": "Marketing Digital", // Tópicos de Marketing no Século XXI - Volume 2
  "NPOf6nHhiUlw6Dk1EVMs": "Marketing Digital", // Como Elaborar um Plano de Marketing
  "O5IrhIawX1pwMDZG4mh8": "Marketing Digital", // Administração de Marketing: Comportamento e Tendências
  "fcm8tZ2jdvRDaXax6sAJ": "Marketing Digital", // A Internet como Ferramenta de Marketing Político
  "j2VVTEGDIYI36HQczkJ7": "Marketing Digital", // Plano de Marketing para um Mercado Internacional
  "WTKdjO0m3DU86rjqTDij": "Marketing Digital", // Análise do Potencial do Neuromarketing na Publicidade
  "cYciCUbIQyIvNSsBqhth": "Marketing Digital", // Avaliação dos Contributos do Neuromarketing na Marca
  "kJKL0EIJYjyiNibJ0ohU": "Marketing Digital", // A Efetividade do Neuromarketing
  "RG8nvkEOLTXRRiKB7ucW": "Marketing Digital", // Marketing Político e Eleitoral para Vereadores
  "RcnU8mZrTQQCHkhe8WAL": "Marketing Digital", // Marketing Político em Tempos Modernos

  // Vendas & Negociação
  "Pb5O8FLsrh4MQUADCRJM": "Vendas & Negociação", // Marketing: Fundamentos e Aplicações
  "alRmlvPLH3fCFw2is1x9": "Vendas & Negociação", // vendedora

  // Desenvolvimento Pessoal
  "3PBRjKGZjTCAhDWArJdy": "Desenvolvimento Pessoal", // Quem Pensa Enriquece - O Legado

  // Negócios
  "2Sf9wtUZFclPb7xyNDx0": "Negócios", // Manual de Empreendedorismo
  "8bdG7agxShihGOnrE9fV": "Negócios", // Introdução à Administração
  "0h3NXwNJCu9502tAPzhQ": "Negócios", // Gestão de Empresas: Um Guia Prático
  "LNvNKN99KFc4FTrbCCMB": "Negócios", // Gestão e Marketing no Agronegócio
  "9QGuIsissiZ7AxQJTJMh": "Negócios", // Marketing nas Pequenas e Médias Explorações Agrícolas
  "upTvw5jIQmqyZ0UtrUsD": "Negócios", // Projeto de Marketing em Agronegócio
};

async function organizar() {
  console.log("--- Organizando livros nas 10 categorias ---");
  let count = 0;
  for (const [id, cat] of Object.entries(categoriasMapa)) {
    const ref = doc(db, "livros", id);
    await updateDoc(ref, { categoria: cat });
    console.log(`[${++count}/${Object.keys(categoriasMapa).length}] ✅ Livro ID ${id} -> Categoria: "${cat}"`);
  }
  console.log("\nOrganização concluída com sucesso!");
  process.exit(0);
}

organizar().catch((err) => {
  console.error("Erro ao organizar:", err);
  process.exit(1);
});
