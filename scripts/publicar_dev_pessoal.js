const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const livros = [
  {
    titulo: "Inteligência Emocional",
    autor: "Daniel Goleman",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "O clássico de Daniel Goleman que revolucionou a forma como entendemos a inteligência. Este livro revela que o QI não é o único fator de sucesso — a inteligência emocional, que inclui autoconsciência, empatia e gestão das emoções, pode ser determinante para o sucesso pessoal e profissional.",
    capaUrl: "/capas/capa_inteligencia-emocional.jpg",
    pdfUrl: "/livros/intelig-ncia-emocional-daniel-goleman.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Meditações",
    autor: "Marco Aurélio",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "Obra filosófica do imperador romano Marco Aurélio, considerada um dos grandes clássicos do estoicismo. Escrita como um diário pessoal, traz reflexões sobre a virtude, a resiliência, a disciplina mental e a arte de viver com integridade em meio às adversidades do mundo.",
    capaUrl: "/capas/capa_meditacoes-marco-aurelio.jpg",
    pdfUrl: "/livros/medita-es-marco-aur-lio.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "O Obstáculo é o Caminho",
    autor: "Ryan Holiday",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "Ryan Holiday resgata a filosofia estoica para ensinar que os obstáculos da vida não nos impedem — eles são o próprio caminho. Com exemplos de grandes líderes como Marco Aurélio, Abraham Lincoln e Steve Jobs, o livro mostra como transformar adversidades em oportunidades de crescimento.",
    capaUrl: "/capas/capa_obstaculo-caminho.jpg",
    pdfUrl: "/livros/o-obst-culo-o-caminhoo-ryan-holiday.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "O Homem Mais Rico da Babilônia",
    autor: "George S. Clason",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "Através de parábolas ambientadas na antiga Babilônia, George S. Clason apresenta princípios atemporais sobre finanças pessoais e prosperidade. O livro ensina como poupar, investir e construir riqueza com sabedoria — lições que continuam relevantes e práticas nos dias de hoje.",
    capaUrl: "/capas/capa_homem-mais-rico-babilonia.jpg",
    pdfUrl: "/livros/o-homem-mais-rico-da-babilonia-george-s.-clason.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Os Segredos da Mente Milionária",
    autor: "T. Harv Eker",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "T. Harv Eker revela como o nosso 'modelo financeiro' — formado na infância — determina o nosso nível de riqueza. Com exercícios práticos e reveladores, o livro ajuda a identificar e reprogramar crenças limitantes sobre dinheiro, abrindo caminho para a abundância financeira e pessoal.",
    capaUrl: "/capas/capa_segredos-mente-milionaria.jpg",
    pdfUrl: "/livros/os-segredos-da-mente-milion-ria.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Quem Pensa Enriquece - O Legado",
    autor: "Napoleon Hill",
    categoria: "Desenvolvimento Pessoal",
    tipo: "livro",
    preco: 0,
    descricao: "Edição especial de 'Quem Pensa Enriquece', o bestseller mais influente sobre desenvolvimento pessoal e sucesso. Napoleon Hill sintetiza os princípios de riqueza e realização aprendidos com centenas dos homens mais bem-sucedidos da história, incluindo Andrew Carnegie e Henry Ford.",
    capaUrl: "/capas/capa_quem-pensa-enriquece.jpg",
    pdfUrl: "/livros/quem-pensa-enriquece-o-legado.pdf",
    criadoEm: new Date().toISOString(),
  },
];

async function publicar() {
  console.log("================================================");
  console.log("  PUBLICANDO 6 LIVROS - DESENVOLVIMENTO PESSOAL");
  console.log("================================================");

  let n = 0;
  for (const livro of livros) {
    const docRef = await addDoc(collection(db, "livros"), livro);
    console.log(`[${++n}/${livros.length}] ✅ "${livro.titulo}" → ID: ${docRef.id}`);
  }

  console.log("\n================================================");
  console.log(`  ${n} livros publicados com sucesso!`);
  console.log("================================================");
  process.exit(0);
}

publicar().catch((err) => {
  console.error("Erro ao publicar:", err);
  process.exit(1);
});
