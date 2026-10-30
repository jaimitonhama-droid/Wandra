const { initializeApp } = require("firebase/app");
const { getFirestore, doc, updateDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const precosNegocios = {
  "2Sf9wtUZFclPb7xyNDx0": { titulo: "Manual de Empreendedorismo", preco: 25 },
  "8bdG7agxShihGOnrE9fV": { titulo: "Introdução à Administração", preco: 15 },
  "0h3NXwNJCu9502tAPzhQ": { titulo: "Gestão de Empresas: Um Guia Prático", preco: 35 },
  "uZbbg36OF1VXgplwhbPg": { titulo: "Planejamento Financeiro Pessoal e Finanças", preco: 25 },
  "xxxqewkGqxM5DAv3V7Sy": { titulo: "O Guia Definitivo do Marketing Digital", preco: 35 },
  "alRmlvPLH3fCFw2is1x9": { titulo: "vendedora", preco: 15 },
  "4LmCb4ZpLyjE7glq3IUm": { titulo: "Gestão de Marketing", preco: 35 },
  "4R5fTUqyZ363JKMEZvjp": { titulo: "Neuromarketing e Marketing Sensorial nas Vendas Online", preco: 35 },
  "9QGuIsissiZ7AxQJTJMh": { titulo: "Marketing nas Pequenas e Médias Explorações Agrícolas", preco: 25 },
  "Gt0180yCe3BG4awAISJ7": { titulo: "Estratégias de Marketing", preco: 25 },
  "LM5u9YrSITF43iAXFHCq": { titulo: "Tópicos de Marketing no Século XXI - Volume 2", preco: 15 },
  "LNvNKN99KFc4FTrbCCMB": { titulo: "Gestão e Marketing no Agronegócio", preco: 25 },
  "NPOf6nHhiUlw6Dk1EVMs": { titulo: "Como Elaborar um Plano de Marketing", preco: 35 },
  "O5IrhIawX1pwMDZG4mh8": { titulo: "Administração de Marketing: Comportamento e Tendências dos Consumidores", preco: 25 },
  "Pb5O8FLsrh4MQUADCRJM": { titulo: "Marketing: Fundamentos e Aplicações", preco: 15 },
  "RG8nvkEOLTXRRiKB7ucW": { titulo: "Marketing Político e Eleitoral para Vereadores", preco: 25 },
  "RcnU8mZrTQQCHkhe8WAL": { titulo: "Marketing Político em Tempos Modernos", preco: 25 },
  "WTKdjO0m3DU86rjqTDij": { titulo: "Análise do Potencial do Neuromarketing na Publicidade Contemporânea", preco: 15 },
  "cYciCUbIQyIvNSsBqhth": { titulo: "Avaliação dos Contributos do Neuromarketing na Gestão da Marca", preco: 15 },
  "fcm8tZ2jdvRDaXax6sAJ": { titulo: "A Internet como Ferramenta de Marketing Político", preco: 25 },
  "j2VVTEGDIYI36HQczkJ7": { titulo: "Plano de Marketing para um Mercado Internacional", preco: 35 },
  "kJKL0EIJYjyiNibJ0ohU": { titulo: "A Efetividade do Neuromarketing como Ferramenta de Pesquisa e Análise do Consumidor", preco: 15 },
  "upTvw5jIQmqyZ0UtrUsD": { titulo: "Projeto de Marketing em Agronegócio: Estratégias para um Desenvolvimento Sustentável", preco: 25 }
};

async function atualizar() {
  console.log("--- Atualizando precos da categoria Negocios ---");
  let count = 0;
  for (const [id, info] of Object.entries(precosNegocios)) {
    const ref = doc(db, "livros", id);
    await updateDoc(ref, { 
      preco: info.preco,
      categoria: "Negócios"
    });
    console.log(`[${++count}/${Object.keys(precosNegocios).length}] ✅ ${info.titulo} -> ${info.preco} MT (Negócios)`);
  }
  console.log("\nTodos os 23 livros de Negócios foram atualizados com sucesso!");
  process.exit(0);
}

atualizar().catch((err) => {
  console.error("Erro ao atualizar:", err);
  process.exit(1);
});

