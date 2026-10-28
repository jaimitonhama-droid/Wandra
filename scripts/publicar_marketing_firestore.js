const { initializeApp } = require("firebase/app");
const { getFirestore, collection, addDoc } = require("firebase/firestore");
const fs = require("fs");
const path = require("path");

const firebaseConfig = {
  apiKey: "AIzaSyBq22BlwDCEO7fDqbEmFMbXznKqQF2BV14",
  authDomain: "carla-v5.firebaseapp.com",
  projectId: "carla-v5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 17 Livros de Marketing baixados manualmente do InfoLivros.org
const livrosMarketing = [
  {
    titulo: "A Efetividade do Neuromarketing como Ferramenta de Pesquisa e Análise do Consumidor",
    autor: "InfoLivros / Pesquisadores Acadêmicos",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Estudo académico sobre como o neuromarketing pode ser aplicado como ferramenta de pesquisa para analisar o comportamento e as decisões do consumidor. Aborda técnicas de neurociência aplicadas ao marketing e branding.",
    capaUrl: "/capas/capa_neuromarketing-ferramenta-pesquisa.jpg",
    pdfUrl: "/livros/a-efetividade-do-neuromarketing-como-ferramenta-de-pesquisa-e-an-lise-do-consumidor.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "A Internet como Ferramenta de Marketing Político",
    autor: "InfoLivros / Pesquisadores Acadêmicos",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Análise do uso estratégico da internet como plataforma de marketing político. Aborda como candidatos e partidos utilizam redes sociais, sites e e-mail marketing para conquistar eleitores e fortalecer a comunicação política.",
    capaUrl: "/capas/capa_marketing-politico-internet.jpg",
    pdfUrl: "/livros/a-internet-como-ferramenta-de-marketing-pol-tico.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Administração de Marketing: Comportamento e Tendências dos Consumidores",
    autor: "InfoLivros / Pesquisadores Acadêmicos",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Obra completa sobre administração de marketing com foco no comportamento do consumidor e tendências de mercado. Cobre análise de mercado, segmentação, posicionamento e estratégias de fidelização do cliente.",
    capaUrl: "/capas/capa_administracao-de-marketing.jpg",
    pdfUrl: "/livros/administra-o-de-marketing-comportamento-e-tend-ncias-dos-consumidores.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Análise do Potencial do Neuromarketing na Publicidade Contemporânea",
    autor: "InfoLivros / Pesquisadores Acadêmicos",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Pesquisa académica que explora o potencial do neuromarketing na criação de campanhas publicitárias mais eficazes. Investiga como as emoções e o inconsciente influenciam as decisões de compra e a perceção das marcas.",
    capaUrl: "/capas/capa_neuromarketing-publicidade.jpg",
    pdfUrl: "/livros/an-lise-do-potencial-do-neuromarketing-na-publicidade-contempor-nea.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Avaliação dos Contributos do Neuromarketing na Gestão da Marca",
    autor: "InfoLivros / Pesquisadores Acadêmicos",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Estudo aprofundado sobre como o neuromarketing contribui para a gestão estratégica de marcas. Analisa o impacto das técnicas de neurociência no branding, na identidade de marca e na lealdade do consumidor.",
    capaUrl: "/capas/capa_neuromarketing-gestao-marca.jpg",
    pdfUrl: "/livros/avalia-o-dos-contributos-do-neuromarketing-na-gest-o-da-marca.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Como Elaborar um Plano de Marketing",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Guia prático e objetivo sobre como criar um plano de marketing eficaz. Apresenta passo a passo os elementos essenciais: análise de situação, objetivos SMART, estratégias de produto, preço, praça e promoção, e indicadores de resultado.",
    capaUrl: "/capas/capa_como-elaborar-plano-marketing.jpg",
    pdfUrl: "/livros/como-elaborar-um-plano-de-marketing.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Estratégias de Marketing",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Visão abrangente das principais estratégias de marketing utilizadas por empresas bem-sucedidas. Aborda marketing de conteúdo, inbound marketing, marketing de relacionamento, diferenciação de produto e estratégias de crescimento.",
    capaUrl: "/capas/capa_estrategias-de-marketing.jpg",
    pdfUrl: "/livros/estrat-gias-de-marketing.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Gestão de Marketing",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Obra completa sobre gestão de marketing nas organizações modernas. Cobre planejamento de marketing, análise competitiva, gestão de campanhas, métricas e KPIs de marketing, além de ferramentas digitais para gestores de marketing.",
    capaUrl: "/capas/capa_gestao-de-marketing.jpg",
    pdfUrl: "/livros/gest-o-de-marketing.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Gestão e Marketing no Agronegócio",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Livro especializado em estratégias de marketing e gestão aplicadas ao agronegócio. Aborda como produtores rurais, cooperativas e empresas do setor agrícola podem utilizar o marketing para agregar valor e conquistar novos mercados.",
    capaUrl: "/capas/capa_marketing-agronegocio.jpg",
    pdfUrl: "/livros/gest-o-marketing-no-agroneg-cio.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Marketing nas Pequenas e Médias Explorações Agrícolas",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Guia de marketing direcionado a pequenos e médios agricultores. Apresenta estratégias acessíveis para promover produtos agrícolas, aceder a novos mercados, criar marca e aumentar a rentabilidade de explorações de pequena escala.",
    capaUrl: "/capas/capa_marketing-exploracoes-agricolas.jpg",
    pdfUrl: "/livros/marketing-nas-pequenas-e-m-dias-explora-es-agr-colas.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Marketing Político e Eleitoral para Vereadores",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Manual prático de marketing político especialmente desenvolvido para candidatos a vereadores. Aborda estratégias de campanha, comunicação com o eleitor, uso de redes sociais, gestão da imagem pública e táticas eleitorais eficazes.",
    capaUrl: "/capas/capa_marketing-politico-vereadores.jpg",
    pdfUrl: "/livros/marketing-pol-tico-e-eleitoral-para-vereadores.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Marketing Político em Tempos Modernos",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Análise do marketing político na era digital e das redes sociais. Explora como as mudanças tecnológicas transformaram as campanhas políticas, o papel das fake news, a polarização online e as novas ferramentas de comunicação política.",
    capaUrl: "/capas/capa_marketing-politico-moderno.jpg",
    pdfUrl: "/livros/marketing-pol-tico-em-tempos-modernos.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Marketing: Fundamentos e Aplicações",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Obra de referência sobre os fundamentos do marketing e suas aplicações práticas no mundo empresarial. Ideal para estudantes e profissionais que querem dominar os conceitos centrais do marketing desde os princípios básicos até estratégias avançadas.",
    capaUrl: "/capas/capa_marketing-fundamentos.jpg",
    pdfUrl: "/livros/marketing.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Neuromarketing e Marketing Sensorial nas Vendas Online",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Estudo sobre a aplicação de técnicas de neuromarketing e marketing sensorial no e-commerce. Analisa como elementos visuais, sonoros e sensoriais influenciam a experiência de compra online e aumentam as taxas de conversão em lojas virtuais.",
    capaUrl: "/capas/capa_neuromarketing-vendas-online.jpg",
    pdfUrl: "/livros/neuromarketing-e-marketing-sensorial-nas-vendas-online.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Plano de Marketing para um Mercado Internacional",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Guia completo para criar um plano de marketing voltado à internacionalização de empresas. Aborda pesquisa de mercados externos, adaptação de produtos, estratégias de entrada em novos países e gestão da comunicação em contextos culturais diferentes.",
    capaUrl: "/capas/capa_marketing-mercado-internacional.jpg",
    pdfUrl: "/livros/plano-de-marketing-para-um-mercado-internacional.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Projeto de Marketing em Agronegócio: Estratégias para um Desenvolvimento Sustentável",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Projeto académico que apresenta estratégias de marketing sustentável aplicadas ao agronegócio. Foca em como aliar competitividade e crescimento económico com responsabilidade ambiental e social no setor agroindustrial.",
    capaUrl: "/capas/capa_marketing-agronegocio-sustentavel.jpg",
    pdfUrl: "/livros/projeto-de-marketing-em-agroneg-cio-estrat-gias-para-um-desenvolvimento-sustent-vel.pdf",
    criadoEm: new Date().toISOString(),
  },
  {
    titulo: "Tópicos de Marketing no Século XXI - Volume 2",
    autor: "InfoLivros",
    categoria: "Marketing",
    tipo: "livro",
    preco: 0,
    descricao: "Segunda volume de uma coleção sobre os temas mais relevantes do marketing contemporâneo. Aborda tendências emergentes como marketing de influência, inteligência artificial no marketing, personalização em massa e o futuro do consumo digital.",
    capaUrl: "/capas/capa_topicos-marketing-seculo-xxi-v2.jpg",
    pdfUrl: "/livros/t-picos-de-marketing-no-s-culo-xxi-volume-2.pdf",
    criadoEm: new Date().toISOString(),
  },
];

async function publicar() {
  console.log("================================================");
  console.log("  PUBLICANDO 17 LIVROS DE MARKETING NO FIRESTORE");
  console.log("================================================");

  let publicados = 0;
  for (const livro of livrosMarketing) {
    const docRef = await addDoc(collection(db, "livros"), livro);
    console.log(`[${++publicados}/${livrosMarketing.length}] ✅ "${livro.titulo}" → ID: ${docRef.id}`);
  }

  console.log("\n================================================");
  console.log(`  ${publicados} livros publicados com sucesso!`);
  console.log("================================================");
  process.exit(0);
}

publicar().catch((err) => {
  console.error("Erro ao publicar:", err);
  process.exit(1);
});
