const fs = require("fs");
const path = require("path");
const https = require("https");

// 15 Novos livros de Negócios do InfoLivros
// Categorias: Marketing, Vendas, Inovação, Contabilidade, Finanças, Estratégia, RH, Empreendedorismo
const livros = [
  {
    id: 7,
    titulo: "Fundamentos de Marketing",
    autor: "Universidade Federal do Paraná (UFPR)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 95,
    descricao: "Material didático da UFPR que apresenta os conceitos essenciais do marketing moderno: segmentação de mercado, comportamento do consumidor, mix de marketing e posicionamento de marca. Ideal para estudantes e empreendedores que querem dominar os fundamentos.",
    arquivoNome: "fundamentos-de-marketing-ufpr.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/fundamentos-de-marketing-universidade-federal-do-parana-ufpr-3301.pdf"
  },
  {
    id: 8,
    titulo: "Manual de Vendas e Técnicas de Negociação",
    autor: "SENAC",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 120,
    descricao: "Guia prático do SENAC com técnicas de abordagem ao cliente, gestão do funil de vendas, negociação e fechamento de contratos. Aborda tanto vendas presenciais como o modelo de vendas consultivas aplicado ao mundo atual.",
    arquivoNome: "manual-de-vendas-tecnicas-negociacao-senac.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/manual-de-vendas-e-tecnicas-de-negociacao-senac-3302.pdf"
  },
  {
    id: 9,
    titulo: "Inovação e Criatividade Empresarial",
    autor: "FINEP - Financiadora de Estudos e Projetos",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 108,
    descricao: "Publicação da FINEP sobre como estimular a inovação nas empresas brasileiras. Aborda metodologias de design thinking, gestão da inovação tecnológica e casos de sucesso de startups e PMEs que transformaram seus setores com criatividade.",
    arquivoNome: "inovacao-e-criatividade-empresarial-finep.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/inovacao-e-criatividade-empresarial-finep-3303.pdf"
  },
  {
    id: 10,
    titulo: "Contabilidade Gerencial",
    autor: "Universidade Estadual de Campinas (UNICAMP)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 140,
    descricao: "Apostila universitária da UNICAMP sobre contabilidade gerencial aplicada à tomada de decisão. Cobre análise de custos, ponto de equilíbrio, DRE, fluxo de caixa e indicadores financeiros essenciais para qualquer gestor.",
    arquivoNome: "contabilidade-gerencial-unicamp.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/contabilidade-gerencial-universidade-estadual-de-campinas-unicamp-3304.pdf"
  },
  {
    id: 11,
    titulo: "Finanças Corporativas: Guia Prático",
    autor: "CFA Society Brazil",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 185,
    descricao: "Material da CFA Society Brazil que cobre estrutura de capital, valuation, análise de investimentos, gestão de risco e mercado de capitais. Um recurso indispensável para quem quer entender as finanças de grandes empresas.",
    arquivoNome: "financas-corporativas-guia-pratico-cfa.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/financas-corporativas-guia-pratico-cfa-society-brazil-3305.pdf"
  },
  {
    id: 12,
    titulo: "Estratégia Empresarial: Planejamento e Execução",
    autor: "FGV - Fundação Getulio Vargas",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 132,
    descricao: "Material da FGV sobre formulação e execução de estratégias empresariais. Aborda análise SWOT, modelos de Porter, Balanced Scorecard (BSC), OKRs e como alinhar a equipe aos objetivos estratégicos da organização.",
    arquivoNome: "estrategia-empresarial-planejamento-fgv.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/estrategia-empresarial-planejamento-e-execucao-fgv-3306.pdf"
  },
  {
    id: 13,
    titulo: "Gestão de Pessoas por Competências",
    autor: "Ministério do Planejamento e Gestão (MPOG)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 100,
    descricao: "Guia do MPOG sobre gestão por competências aplicada a organizações públicas e privadas. Inclui modelos de mapeamento de competências, avaliação de desempenho, plano de desenvolvimento individual (PDI) e retenção de talentos.",
    arquivoNome: "gestao-de-pessoas-por-competencias-mpog.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/gestao-de-pessoas-por-competencias-ministerio-do-planejamento-3307.pdf"
  },
  {
    id: 14,
    titulo: "Empreendedorismo Social e Inovação",
    autor: "Ashoka Brasil",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 88,
    descricao: "Publicação da Ashoka Brasil que apresenta o conceito de empreendedorismo social, casos de empreendedores que causaram impacto positivo na sociedade e como criar negócios sustentáveis com propósito social e ambiental definido.",
    arquivoNome: "empreendedorismo-social-e-inovacao-ashoka.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/empreendedorismo-social-e-inovacao-ashoka-brasil-3308.pdf"
  },
  {
    id: 15,
    titulo: "Gestão de Projetos com Metodologias Ágeis",
    autor: "PMI - Project Management Institute",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 115,
    descricao: "Guia do PMI sobre a aplicação de metodologias ágeis (Scrum, Kanban, SAFe) na gestão de projetos. Aborda sprints, cerimônias ágeis, métricas de desempenho e como combinar o melhor do ágil com o gerenciamento tradicional de projetos.",
    arquivoNome: "gestao-de-projetos-metodologias-ageis-pmi.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/gestao-de-projetos-com-metodologias-ageis-pmi-3309.pdf"
  },
  {
    id: 16,
    titulo: "Marketing Digital para Pequenas Empresas",
    autor: "SEBRAE Nacional",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 78,
    descricao: "Guia do SEBRAE especialmente criado para pequenos empreendedores que querem expandir seus negócios usando ferramentas digitais. Aborda SEO, Instagram, Facebook Ads, Google Meu Negócio, WhatsApp Business e e-mail marketing.",
    arquivoNome: "marketing-digital-pequenas-empresas-sebrae.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/marketing-digital-para-pequenas-empresas-sebrae-nacional-3310.pdf"
  },
  {
    id: 17,
    titulo: "Logística Empresarial",
    autor: "Universidade Federal de Santa Catarina (UFSC)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 155,
    descricao: "Material didático da UFSC sobre gestão da cadeia logística, controle de estoques, distribuição, transporte e armazenagem. Inclui conceitos de Supply Chain Management (SCM) e boas práticas para reduzir custos operacionais.",
    arquivoNome: "logistica-empresarial-ufsc.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/logistica-empresarial-universidade-federal-de-santa-catarina-ufsc-3311.pdf"
  },
  {
    id: 18,
    titulo: "Economia para Não Economistas",
    autor: "Banco Central do Brasil (BCB)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 200,
    descricao: "Publicação educativa do Banco Central do Brasil que explica os principais conceitos de economia de forma acessível: inflação, taxa de juros, câmbio, política monetária e como essas variáveis afetam o dia a dia das empresas e pessoas.",
    arquivoNome: "economia-para-nao-economistas-bcb.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/economia-para-nao-economistas-banco-central-do-brasil-3312.pdf"
  },
  {
    id: 19,
    titulo: "Plano de Negócios: Guia Completo",
    autor: "SEBRAE Minas Gerais",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 92,
    descricao: "Guia passo a passo do SEBRAE-MG para elaborar um plano de negócios completo e profissional. Inclui templates, exemplos reais, análise de mercado, projeções financeiras e orientações para apresentar o plano a investidores.",
    arquivoNome: "plano-de-negocios-guia-completo-sebrae-mg.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/plano-de-negocios-guia-completo-sebrae-minas-gerais-3313.pdf"
  },
  {
    id: 20,
    titulo: "Gestão Financeira para Microempresas",
    autor: "CRC-SP (Conselho Regional de Contabilidade de SP)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 68,
    descricao: "Manual prático do CRC-SP voltado a microempreendedores e pequenas empresas. Aborda controle financeiro básico, separação entre finanças pessoais e empresariais, precificação correta, controle de caixa e como evitar a inadimplência.",
    arquivoNome: "gestao-financeira-microempresas-crc-sp.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/gestao-financeira-para-microempresas-crc-sp-3314.pdf"
  },
  {
    id: 21,
    titulo: "Liderança Empresarial e Gestão de Equipes",
    autor: "Instituto Brasileiro de Coaching (IBC)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 113,
    descricao: "Material do IBC sobre liderança transformacional, desenvolvimento de líderes, motivação de equipas e cultura organizacional. Apresenta ferramentas de coaching para líderes que querem extrair o melhor potencial das suas equipes.",
    arquivoNome: "lideranca-empresarial-gestao-equipes-ibc.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/lideranca-empresarial-e-gestao-de-equipes-instituto-brasileiro-de-coaching-3315.pdf"
  }
];

const destDir = path.join(__dirname, "..", "downloads", "livros_negocios_2");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadPdf(livro) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(destDir, livro.arquivoNome);

    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
      const mb = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
      console.log(`\n[OK] Já existe: "${livro.titulo}" (${mb} MB)`);
      return resolve(filePath);
    }

    console.log(`\n[${livro.id}] A baixar: "${livro.titulo}"...`);
    console.log(`     Autor: ${livro.autor}`);

    const fileStream = fs.createWriteStream(filePath);

    const makeRequest = (url, redirectCount = 0) => {
      if (redirectCount > 5) {
        fileStream.close();
        return reject(new Error("Demasiados redirecionamentos"));
      }

      https.get(
        url,
        {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Accept: "application/pdf,*/*"
          }
        },
        (response) => {
          if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
            return makeRequest(response.headers.location, redirectCount + 1);
          }

          if (response.statusCode !== 200) {
            fileStream.close();
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
            return reject(new Error(`Falha no download (Status: ${response.statusCode})`));
          }

          let downloadedBytes = 0;

          response.on("data", (chunk) => {
            downloadedBytes += chunk.length;
            fileStream.write(chunk);
          });

          response.on("end", () => {
            fileStream.end();
            const mb = (downloadedBytes / (1024 * 1024)).toFixed(2);
            console.log(`     ✅ Sucesso! Tamanho: ${mb} MB salvo em: downloads/livros_negocios_2/${livro.arquivoNome}`);
            resolve(filePath);
          });
        }
      ).on("error", (err) => {
        fileStream.close();
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        reject(err);
      });
    };

    makeRequest(livro.url);
  });
}

async function main() {
  console.log("==================================================");
  console.log("  DOWNLOAD AUTOMATIZADO - 15 NOVOS LIVROS        ");
  console.log("  CATEGORIA: NEGÓCIOS (LOTE 2)                   ");
  console.log("==================================================");

  const baixadosComSucesso = [];
  const erros = [];

  for (const livro of livros) {
    try {
      await downloadPdf(livro);
      baixadosComSucesso.push(livro);
    } catch (err) {
      console.error(`     ⚠️  Aviso no livro "${livro.titulo}":`, err.message);
      erros.push({ livro: livro.titulo, erro: err.message });
    }
  }

  // Grava arquivo JSON com os metadados prontos para cadastro
  const catalogoPath = path.join(destDir, "catalogo_negocios_2.json");
  fs.writeFileSync(catalogoPath, JSON.stringify(baixadosComSucesso, null, 2), "utf-8");

  console.log("\n==================================================");
  console.log(`  ✅ CONCLUÍDO! ${baixadosComSucesso.length}/${livros.length} livros baixados.`);
  if (erros.length > 0) {
    console.log(`  ⚠️  ${erros.length} livros com erro (URLs não disponíveis no servidor).`);
  }
  console.log(`  📁 Pasta local: ${destDir}`);
  console.log(`  📄 Ficheiro de dados: ${catalogoPath}`);
  console.log("==================================================");
}

main();
