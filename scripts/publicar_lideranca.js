const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const { UTApi } = require("uploadthing/server");

// Configurações Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// UploadThing
const utapi = new UTApi({
  token: "eyJhcGlLZXkiOiJza19saXZlXzMxZjIyNjg4MTBmNjVhNTk5YTU4YmUwNDUxN2IzYTk3MDA4N2ZlNDQ4ZGI5OTYxNDJhYjc3M2JlN2E1OGRmMTgiLCJhcHBJZCI6InpiazF0dHdmdjMiLCJyZWdpb25zIjpbInNlYTEiXX0=",
});

const sourceDir = path.join(process.cwd(), "downloads", "liderar");
const targetPdfDir = path.join(process.cwd(), "public", "livros");
const targetCapasDir = path.join(process.cwd(), "public", "capas");

if (!fs.existsSync(targetPdfDir)) fs.mkdirSync(targetPdfDir, { recursive: true });
if (!fs.existsSync(targetCapasDir)) fs.mkdirSync(targetCapasDir, { recursive: true });

function escapeXml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// 6 Paletas editoriais sofisticadas de livraria (reais, elegantes, nada de IA)
const paletas = [
  {
    nome: "Midnight Blue & Gold",
    bg1: "#0a192f",
    bg2: "#020c1b",
    destaque: "#d4af37",
    textoClaro: "#f8fafc",
    subtexto: "#94a3b8",
  },
  {
    nome: "Emerald Corporate",
    bg1: "#064e3b",
    bg2: "#022c22",
    destaque: "#fbbf24",
    textoClaro: "#ffffff",
    subtexto: "#a7f3d0",
  },
  {
    nome: "Bordeaux Executive",
    bg1: "#4c0519",
    bg2: "#1f020a",
    destaque: "#fb7185",
    textoClaro: "#fff1f2",
    subtexto: "#fecdd3",
  },
  {
    nome: "Royal Slate",
    bg1: "#1e293b",
    bg2: "#0f172a",
    destaque: "#38bdf8",
    textoClaro: "#ffffff",
    subtexto: "#cbd5e1",
  },
  {
    nome: "Imperial Charcoal",
    bg1: "#18181b",
    bg2: "#09090b",
    destaque: "#eab308",
    textoClaro: "#ffffff",
    subtexto: "#a1a1aa",
  },
  {
    nome: "Deep Indigo",
    bg1: "#1e1b4b",
    bg2: "#05051a",
    destaque: "#818cf8",
    textoClaro: "#ffffff",
    subtexto: "#c7d2fe",
  },
];

// Dados estruturados dos 17 livros
const livrosMeta = [
  {
    slug: "a-jornada-do-lider.pdf",
    tituloLinhas: ["A Jornada", "do Líder"],
    tituloCompleto: "A Jornada do Líder",
    subtitulo: "O caminho do autoconhecimento à liderança de excelência",
    autor: "InfoLivros / Gestão Estratégica",
    preco: 35,
    descricao: "Um guia prático sobre a trajetória de desenvolvimento de um líder moderno. Aborda os desafios de autoliderança, formação de caráter e a transição de executor para líder de pessoas.",
  },
  {
    slug: "a-lideranca-na-gestao-de-equipes.pdf",
    tituloLinhas: ["A Liderança na", "Gestão de Equipes"],
    tituloCompleto: "A Liderança na Gestão de Equipes",
    subtitulo: "Estratégias práticas para coordenar pessoas e atingir metas",
    autor: "Especialistas em Gestão de Pessoas",
    preco: 45,
    descricao: "Manual focado na construção, coordenação e desenvolvimento de equipes eficazes. Apresenta metodologias para comunicação clara, motivação e alcance de metas em conjunto.",
  },
  {
    slug: "a-lideranca-transformacional-e-o-seu-impacto.pdf",
    tituloLinhas: ["Liderança", "Transformacional"],
    tituloCompleto: "A Liderança Transformacional e o seu Impacto na Motivação",
    subtitulo: "Impacto no engajamento e desempenho corporativo",
    autor: "Pesquisadores em Comportamento Organizacional",
    preco: 25,
    descricao: "Estudo aprofundado sobre o modelo de liderança transformacional e como ele eleva o nível de engajamento, satisfação e produtividade dos colaboradores nas organizações.",
  },
  {
    slug: "estimule-as-liderancas-femininas-na-sua-empresa.pdf",
    tituloLinhas: ["Lideranças", "Femininas"],
    tituloCompleto: "Estimule as Lideranças Femininas na sua Empresa",
    subtitulo: "Guia corporativo de valorização e ascensão de mulheres líderes",
    autor: "Guia Corporativo de Diversidade e Inclusão",
    preco: 35,
    descricao: "Estratégias corporativas para identificar, valorizar e acelerar a ascensão de mulheres a cargos de liderança executiva e tomada de decisão estratégica.",
  },
  {
    slug: "gestao-de-pessoas-lideranca-e-motivacao.pdf",
    tituloLinhas: ["Gestão de Pessoas", "e Liderança"],
    tituloCompleto: "Gestão de Pessoas, Liderança e Motivação: Equipes de Alta Performance",
    subtitulo: "Estratégias para desenvolver equipes de alto rendimento",
    autor: "Especialistas em Recursos Humanos e Liderança",
    preco: 55,
    descricao: "Obra completa sobre gestão moderna de pessoas, técnicas de motivação de alta performance, feedback assertivo e retenção de talentos em ambientes competitivos.",
  },
  {
    slug: "lideranca-e-desenvolvimento-de-equipes.pdf",
    tituloLinhas: ["Liderança e", "Desenvolvimento"],
    tituloCompleto: "Liderança e Desenvolvimento de Equipes",
    subtitulo: "Como formar e coordenar times de alta cooperação",
    autor: "Consultoria em Liderança Organizacional",
    preco: 35,
    descricao: "Princípios práticos para transformar grupos de trabalho dispersos em equipes coesas, alinhadas aos objetivos estratégicos e orientadas a resultados tangíveis.",
  },
  {
    slug: "lideranca-e-gestao-estrategica.pdf",
    tituloLinhas: ["Liderança e Gestão", "Estratégica"],
    tituloCompleto: "Liderança e Gestão Estratégica: Competências do Século XXI",
    subtitulo: "Competências gerenciais para o executivo contemporâneo",
    autor: "Mestres e Doutores em Administração",
    preco: 55,
    descricao: "Manual abrangente com mais de 300 páginas sobre as competências essenciais do executivo moderno: visão sistêmica, planejamento estratégico, inovação e governança.",
  },
  {
    slug: "lideranca-e-motivacao-nas-organizacoes.pdf",
    tituloLinhas: ["Liderança e", "Motivação"],
    tituloCompleto: "Liderança e Motivação nas Organizações",
    subtitulo: "Como líderes inspiradores extraem o melhor das pessoas",
    autor: "Teóricos da Administração e Psicologia",
    preco: 25,
    descricao: "Fundamentos da motivação humana aplicados ao ambiente corporativo. Como líderes inspiradores conseguem extrair o melhor de suas equipes sem depender apenas de pressão.",
  },
  {
    slug: "lideranca-educacional.pdf",
    tituloLinhas: ["Liderança", "Educacional"],
    tituloCompleto: "Liderança Educacional: Princípios e Práticas",
    subtitulo: "Gestão escolar, liderança pedagógica e participação comunitária",
    autor: "Especialistas em Gestão Educacional",
    preco: 25,
    descricao: "Guia direcionado para gestores, coordenadores e líderes de instituições de ensino, abordando clima institucional, liderança pedagógica e gestão participativa.",
  },
  {
    slug: "lideranca-escolar-diretores-transformadores.pdf",
    tituloLinhas: ["Liderança", "Escolar"],
    tituloCompleto: "Liderança Escolar: Fatores-chave de Transformação",
    subtitulo: "O papel decisivo da liderança na melhoria de resultados institucionais",
    autor: "Pesquisadores em Políticas Educacionais",
    preco: 35,
    descricao: "Análise de casos e evidências sobre o papel decisivo da liderança escolar na melhoria dos indicadores pedagógicos e no engajamento da comunidade escolar.",
  },
  {
    slug: "lideranca-motivacao-gestao-desempenho.pdf",
    tituloLinhas: ["Gestão do", "Desempenho"],
    tituloCompleto: "Liderança, Motivação e Gestão do Desempenho",
    subtitulo: "Acompanhamento de metas, indicadores e produtividade contínua",
    autor: "Consultores de Produtividade Corporativa",
    preco: 45,
    descricao: "Metodologias para acompanhamento de indicadores de desempenho (KPIs), avaliação periódica de metas e estímulo contínuo à produtividade com foco em qualidade.",
  },
  {
    slug: "mulheres-que-comunicam-a-transformacao.pdf",
    tituloLinhas: ["Mulheres que", "Comunicam"],
    tituloCompleto: "Liderança: Mulheres que Comunicam a Transformação",
    subtitulo: "Comunicação assertiva e liderança feminina em ação",
    autor: "Coletivo de Líderes e Comunicadoras",
    preco: 35,
    descricao: "Histórias, depoimentos e técnicas de comunicação assertiva de mulheres que lideram processos de transformação social, política e empresarial.",
  },
  {
    slug: "liderancas-e-inovacao-em-contextos-educativos.pdf",
    tituloLinhas: ["Liderança e", "Inovação"],
    tituloCompleto: "Lideranças e Inovação em Contextos Educativos",
    subtitulo: "Modernização de métodos e condução de projetos inovadores",
    autor: "Acadêmicos em Inovação e Pedagogia",
    preco: 25,
    descricao: "O papel da liderança na condução de projetos inovadores, incorporação de novas tecnologias e modernização dos métodos de ensino e aprendizagem.",
  },
  {
    slug: "lideranca-testemunhos-pessoais.pdf",
    tituloLinhas: ["Liderança:", "Testemunhos"],
    tituloCompleto: "Liderazgo, Liderança, Leadership: Testemunhos Pessoais",
    subtitulo: "Lições vivenciadas por líderes em diferentes culturas executivas",
    autor: "Executivos Internacionais",
    preco: 25,
    descricao: "Relatos autobiográficos e lições práticas vivenciadas por líderes em diferentes países e culturas corporativas, compartilhando erros e acertos reais.",
  },
  {
    slug: "manual-de-boas-praticas-de-lideranca.pdf",
    tituloLinhas: ["Manual de Boas", "Práticas de Liderança"],
    tituloCompleto: "Manual de Boas Práticas de Liderança",
    subtitulo: "Rotinas de delegação, ética e gestão assertiva de conflitos",
    autor: "Associação de Gestores e Líderes",
    preco: 35,
    descricao: "Guia prático de bolso com regras de conduta, ética profissional, rotinas de delegação, reuniões produtivas e resolução ágil de atritos interpessoais.",
  },
  {
    slug: "mulheres-lideres-carreira-e-familia.pdf",
    tituloLinhas: ["Mulheres", "Líderes"],
    tituloCompleto: "Mulheres Líderes: Carreira, Família e Desafios nas Organizações",
    subtitulo: "Equilíbrio, quebra de barreiras e ascensão profissional",
    autor: "Pesquisadoras em Sociologia do Trabalho",
    preco: 25,
    descricao: "Estudo reflexivo sobre os desafios enfrentados por mulheres líderes na conciliação entre ascensão profissional, equilíbrio familiar e quebra de barreiras corporativas.",
  },
  {
    slug: "praticas-de-lideranca-e-gestao-de-equipes.pdf",
    tituloLinhas: ["Práticas de", "Liderança"],
    tituloCompleto: "Práticas de Liderança e Gestão de Equipes",
    subtitulo: "Exercícios e casos reais para aprimorar a rotina gerencial",
    autor: "Instituto de Desenvolvimento Gerencial",
    preco: 35,
    descricao: "Casos aplicados e exercícios práticos para aprimorar o dia a dia da liderança: desde a contratação e integração até a condução de feedbacks e celebração de metas.",
  },
];

// Gerador de capa clássica (formato de livro tradicional)
function gerarSvgCapa(livro, paleta) {
  const l1 = escapeXml(livro.tituloLinhas[0] || "");
  const l2 = escapeXml(livro.tituloLinhas[1] || "");
  const sub = escapeXml(livro.subtitulo.length > 55 ? livro.subtitulo.substring(0, 52) + "..." : livro.subtitulo);
  const aut = escapeXml(livro.autor.length > 38 ? livro.autor.substring(0, 35) + "..." : livro.autor);

  return `
<svg width="600" height="900" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${paleta.bg1}" />
      <stop offset="100%" stop-color="${paleta.bg2}" />
    </linearGradient>
  </defs>

  <!-- Fundo Sólido Editorial -->
  <rect width="600" height="900" fill="url(#gradBg)" />

  <!-- Moldura Fina Tradicional de Encadernação -->
  <rect x="28" y="28" width="544" height="844" fill="none" stroke="${paleta.destaque}" stroke-width="1.8" opacity="0.65" />
  <rect x="36" y="36" width="528" height="828" fill="none" stroke="${paleta.destaque}" stroke-width="0.8" opacity="0.3" />

  <!-- Faixa Topo: Coleção Oficial -->
  <text x="300" y="85" font-family="Arial, Helvetica, sans-serif" font-size="11" font-weight="700" letter-spacing="4" fill="${paleta.destaque}" text-anchor="middle">COLEÇÃO LIDERANÇA &amp; GESTÃO</text>
  <line x1="180" y1="102" x2="420" y2="102" stroke="${paleta.destaque}" stroke-width="1" opacity="0.4" />

  <!-- Título Principal (Tipografia Clássica de Livro) -->
  <text x="300" y="${l2 ? "315" : "345"}" font-family="Georgia, Times New Roman, serif" font-size="38" font-weight="bold" fill="${paleta.textoClaro}" text-anchor="middle">${l1}</text>
  ${l2 ? `<text x="300" y="375" font-family="Georgia, Times New Roman, serif" font-size="40" font-weight="bold" fill="${paleta.destaque}" text-anchor="middle">${l2}</text>` : ""}

  <!-- Divisor Central Delicado -->
  <line x1="220" y1="420" x2="380" y2="420" stroke="${paleta.destaque}" stroke-width="1.5" opacity="0.5" />
  <circle cx="300" cy="420" r="3" fill="${paleta.destaque}" />

  <!-- Subtítulo -->
  <text x="300" y="460" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="${paleta.subtexto}" text-anchor="middle">${sub}</text>

  <!-- Emblema Clássico de Qualidade -->
  <g transform="translate(300, 560)">
    <circle cx="0" cy="0" r="42" fill="none" stroke="${paleta.destaque}" stroke-width="1.5" opacity="0.5" />
    <circle cx="0" cy="0" r="38" fill="none" stroke="${paleta.destaque}" stroke-width="0.75" opacity="0.3" stroke-dasharray="3,3" />
    <polygon points="0,-18 12,-6 12,18 0,10 -12,18 -12,-6" fill="none" stroke="${paleta.destaque}" stroke-width="1.8" opacity="0.85" />
  </g>

  <!-- Rodapé Editorial: Autor & Selo -->
  <line x1="140" y1="730" x2="460" y2="730" stroke="${paleta.destaque}" stroke-width="1" opacity="0.3" />
  <text x="300" y="765" font-family="Georgia, serif" font-size="16" font-style="italic" fill="${paleta.subtexto}" text-anchor="middle">Obra de Referência</text>
  <text x="300" y="795" font-family="Arial, Helvetica, sans-serif" font-size="15" font-weight="700" fill="${paleta.textoClaro}" text-anchor="middle">${aut}</text>
  <text x="300" y="825" font-family="Arial, Helvetica, sans-serif" font-size="10" letter-spacing="3" fill="${paleta.destaque}" text-anchor="middle">SABEDORIA DIGITAL • BIBLIOTECA</text>
</svg>
  `.trim();
}

async function processar() {
  console.log("==================================================================");
  console.log("  INICIANDO PUBLICAÇÃO DOS 17 LIVROS DE LIDERANÇA & GESTÃO");
  console.log("==================================================================");

  // Lê todos os arquivos reais da pasta
  const files = fs.readdirSync(sourceDir).filter((f) => f.endsWith(".pdf"));
  console.log(`Arquivos encontrados na pasta downloads/liderar: ${files.length}`);

  let sucessoCount = 0;

  for (let i = 0; i < files.length; i++) {
    const filename = files[i];
    const meta = livrosMeta[i] || {
      slug: filename.toLowerCase().replace(/[^a-z0-9]/g, "-") + ".pdf",
      tituloLinhas: [filename.replace(".pdf", "").substring(0, 20), ""],
      tituloCompleto: filename.replace(".pdf", ""),
      subtitulo: "Manual Prático de Gestão e Liderança",
      autor: "Sabedoria Digital",
      preco: 35,
      descricao: "Guia completo de liderança e gestão estratégica para líderes e gestores.",
    };

    const paleta = paletas[i % paletas.length];

    console.log(`\n[${i + 1}/${files.length}] Processando: "${meta.tituloCompleto}"`);

    // 1. Copiar PDF
    const srcPdf = path.join(sourceDir, filename);
    const destPdf = path.join(targetPdfDir, meta.slug);
    fs.copyFileSync(srcPdf, destPdf);
    console.log(`  📄 PDF copiado para: public/livros/${meta.slug}`);

    // 2. Gerar Capa Clássica Elegante (SVG -> JPEG 600x900)
    const svgCode = gerarSvgCapa(meta, paleta);
    const capaLocalPath = path.join(targetCapasDir, `capa_${meta.slug.replace(".pdf", "")}.jpg`);

    await sharp(Buffer.from(svgCode))
      .jpeg({ quality: 92 })
      .toFile(capaLocalPath);

    console.log(`  🎨 Capa clássica gerada (${paleta.nome})`);

    // 3. Upload da Capa para o UploadThing
    let finalCapaUrl = `/capas/capa_${meta.slug.replace(".pdf", "")}.jpg`;
    try {
      const buffer = fs.readFileSync(capaLocalPath);
      const fileObj = new File([buffer], path.basename(capaLocalPath), { type: "image/jpeg" });
      const uploadRes = await utapi.uploadFiles([fileObj]);

      if (uploadRes && uploadRes[0] && uploadRes[0].data) {
        finalCapaUrl = uploadRes[0].data.ufsUrl || uploadRes[0].data.url;
        console.log(`  ☁️ Capa no UploadThing: ${finalCapaUrl}`);
      }
    } catch (upErr) {
      console.warn(`  ⚠️ UploadThing usou fallback local:`, upErr.message);
    }

    // 4. Gravação no Firestore
    const docData = {
      titulo: meta.tituloCompleto,
      autor: meta.autor,
      categoria: "Liderança & Gestão",
      tipo: "livro",
      preco: Number(meta.preco),
      descricao: meta.descricao,
      capaUrl: finalCapaUrl,
      pdfUrl: `/livros/${meta.slug}`,
      criadoEm: new Date(Date.now() - (files.length - i) * 60000).toISOString(),
    };

    const docRef = await addDoc(collection(db, "livros"), docData);
    console.log(`  ✅ Gravado no Firestore com ID: ${docRef.id} (${meta.preco} MT)`);
    sucessoCount++;
  }

  console.log("\n==================================================================");
  console.log(`  🎉 ${sucessoCount} de ${files.length} livros publicados com sucesso!`);
  console.log("==================================================================");
  process.exit(0);
}

processar().catch((err) => {
  console.error("Erro fatal ao processar:", err);
  process.exit(1);
});
