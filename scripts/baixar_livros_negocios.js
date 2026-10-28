const fs = require("fs");
const path = require("path");
const https = require("https");

// Lista com os 5 livros de ouro de Negócios do InfoLivros
const livros = [
  {
    id: 1,
    titulo: "Manual de Empreendedorismo",
    autor: "ANJE - Associação Nacional de Jovens Empresários",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 171,
    descricao: "Guia completo de empreendedorismo com 10 capítulos que cobrem desde o perfil do empreendedor até estratégias para a empresa do século XXI. Cofinanciado pela União Europeia, oferece ferramentas práticas para quem quer criar e gerir um negócio.",
    arquivoNome: "manual-de-empreendedorismo.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/manual-de-empreendedorismo-anje-associacao-nacional-de-jovens-empresarios-3201.pdf"
  },
  {
    id: 2,
    titulo: "Introdução à Administração",
    autor: "Universidade Federal da Bahia (UFBA)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 96,
    descricao: "Livro universitário que apresenta as principais teorias da administração de forma clara e didática. Publicado sob licença aberta pela UFBA, cobre fundamentos essenciais para estudantes e profissionais de gestão.",
    arquivoNome: "introducao-a-administracao.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/introducao-a-administracao-universidade-federal-da-bahia-ufba-3202.pdf"
  },
  {
    id: 3,
    titulo: "Gestão de Empresas: Um Guia Prático",
    autor: "CRC-RJ (Conselho Regional de Contabilidade)",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 110,
    descricao: "Guia prático de gestão empresarial publicado pelo CRC-RJ em 2023 com 4 autores especializados. Aborda temas como planejamento estratégico, gestão financeira e governança corporativa com foco em resultados.",
    arquivoNome: "gestao-de-empresas-guia-pratico.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/gestao-de-empresas-um-guia-pratico-crc-rj-conselho-regional-de-contabilidade-3203.pdf"
  },
  {
    id: 4,
    titulo: "Planejamento Financeiro Pessoal e Finanças",
    autor: "CVM e PLANEJAR",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 289,
    descricao: "Manual completo de planejamento financeiro pessoal com 289 páginas. Publicado pela CVM em parceria com a PLANEJAR, cobre desde orçamento pessoal até investimentos e previdência com linguagem acessível.",
    arquivoNome: "planejamento-financeiro-pessoal.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/planejamento-financeiro-pessoal-e-financas-cvm-e-planejar-3204.pdf"
  },
  {
    id: 5,
    titulo: "O Guia Definitivo do Marketing Digital",
    autor: "Rock Content",
    categoria: "Negócios",
    tipo: "ebook",
    preco: 0,
    paginas: 76,
    descricao: "Guia abrangente de marketing digital que cobre SEO, marketing de conteúdo, redes sociais e métricas. Design profissional com exemplos práticos para implementação imediata em novos negócios.",
    arquivoNome: "o-guia-definitivo-do-marketing-digital.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/o-guia-definitivo-do-marketing-digital-rock-content-3206.pdf"
  },
  {
    id: 6,
    titulo: "Gestão Empresarial para PMEs",
    autor: "SEBRAE",
    categoria: "Negócios",
    tipo: "livro",
    preco: 0,
    paginas: 88,
    descricao: "Guia do SEBRAE focado na gestão prática de pequenas e médias empresas. Aborda planejamento, finanças, marketing e gestão de pessoas com ferramentas aplicáveis ao dia a dia do empreendedor.",
    arquivoNome: "gestao-empresarial-para-pmes.pdf",
    url: "https://pdf.infolivros.org/PT/PDF/gestao-empresarial-para-pmes-sebrae-3210.pdf"
  }
];

const destDir = path.join(__dirname, "..", "downloads", "livros_negocios");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

function downloadPdf(livro) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(destDir, livro.arquivoNome);

    // Se já foi baixado e tem tamanho válido, não baixa de novo
    if (fs.existsSync(filePath) && fs.statSync(filePath).size > 10000) {
      const mb = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2);
      console.log(`\n[OK] Já existe: "${livro.titulo}" (${mb} MB)`);
      return resolve(filePath);
    }

    console.log(`\n[${livro.id}] A baixar: "${livro.titulo}"...`);
    console.log(`     Autor: ${livro.autor}`);

    const fileStream = fs.createWriteStream(filePath);

    https.get(
      livro.url,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept: "application/pdf,*/*"
        }
      },
      (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          return downloadPdf({ ...livro, url: response.headers.location }).then(resolve).catch(reject);
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
          console.log(`     Sucesso! Tamanho: ${mb} MB salvo em: downloads/livros_negocios/${livro.arquivoNome}`);
          resolve(filePath);
        });
      }
    ).on("error", (err) => {
      fileStream.close();
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      reject(err);
    });
  });
}

async function main() {
  console.log("==================================================");
  console.log("   DOWNLOAD AUTOMATIZADO - CATEGORIA: NEGÓCIOS   ");
  console.log("==================================================");

  const baixadosComSucesso = [];

  for (const livro of livros) {
    try {
      await downloadPdf(livro);
      baixadosComSucesso.push(livro);
    } catch (err) {
      console.error(`     Aviso no livro "${livro.titulo}":`, err.message);
    }
  }

  // Grava arquivo JSON com os metadados prontos para cadastro
  const catalogoPath = path.join(destDir, "catalogo_negocios.json");
  fs.writeFileSync(catalogoPath, JSON.stringify(baixadosComSucesso, null, 2), "utf-8");

  console.log("\n==================================================");
  console.log(`  CONCLUÍDO! ${baixadosComSucesso.length} livros prontos.`);
  console.log(`  Pasta local: ${destDir}`);
  console.log(`  Ficheiro de dados: ${catalogoPath}`);
  console.log("==================================================");
}

main();
