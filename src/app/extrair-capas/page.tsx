"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/firebase";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

interface LivroParaProcessar {
  pdfUrl: string;
  nomeCapa: string;
  tituloExato: string;
  descricaoExata: string;
}

const livrosParaProcessar: LivroParaProcessar[] = [
  // ── Lote 1: Livros de Negócios ──────────────────────────────────────────
  {
    pdfUrl: "/livros/manual-de-empreendedorismo.pdf",
    nomeCapa: "capa_empreendedorismo.jpg",
    tituloExato: "Manual de Empreendedorismo",
    descricaoExata:
      "Guia completo de empreendedorismo com 10 capítulos que cobrem desde o perfil do empreendedor até estratégias para a empresa do século XXI. Cofinanciado pela União Europeia, oferece ferramentas práticas para quem quer criar e gerir um negócio.",
  },
  {
    pdfUrl: "/livros/introducao-a-administracao.pdf",
    nomeCapa: "capa_administracao.jpg",
    tituloExato: "Introdução à Administração",
    descricaoExata:
      "Livro universitário que apresenta as principais teorias da administração de forma clara e didática. Publicado sob Creative Commons pela UFBA, cobre fundamentos essenciais para estudantes e profissionais.",
  },
  {
    pdfUrl: "/livros/gestao-de-empresas-guia-pratico.pdf",
    nomeCapa: "capa_gestao.jpg",
    tituloExato: "Gestão de Empresas: Um Guia Prático",
    descricaoExata:
      "Guia prático de gestão empresarial publicado pelo CRC-RJ em 2023 com 4 autores especializados. Aborda temas como planejamento estratégico, gestão financeira e governança corporativa com foco em resultados.",
  },
  {
    pdfUrl: "/livros/planejamento-financeiro-pessoal.pdf",
    nomeCapa: "capa_financas.jpg",
    tituloExato: "Planejamento Financeiro Pessoal e Finanças",
    descricaoExata:
      "Manual completo de planejamento financeiro pessoal com 289 páginas. Publicado pela CVM em parceria com a PLANEJAR, cobre desde orçamento pessoal até investimentos e previdência com linguagem acessível.",
  },
  {
    pdfUrl: "/livros/o-guia-definitivo-do-marketing-digital.pdf",
    nomeCapa: "capa_marketing.jpg",
    tituloExato: "O Guia Definitivo do Marketing Digital",
    descricaoExata:
      "Guia abrangente de marketing digital que cobre SEO, marketing de conteúdo, redes sociais e métricas. Design profissional com indicadores de nível e exemplos práticos para implementação imediata.",
  },

  // ── Lote 2: 17 Livros de Marketing ──────────────────────────────────────
  {
    pdfUrl: "/livros/a-efetividade-do-neuromarketing-como-ferramenta-de-pesquisa-e-an-lise-do-consumidor.pdf",
    nomeCapa: "capa_neuromarketing-ferramenta-pesquisa.jpg",
    tituloExato: "A Efetividade do Neuromarketing como Ferramenta de Pesquisa e Análise do Consumidor",
    descricaoExata:
      "Estudo académico sobre como o neuromarketing pode ser aplicado como ferramenta de pesquisa para analisar o comportamento e as decisões do consumidor. Aborda técnicas de neurociência aplicadas ao marketing e branding.",
  },
  {
    pdfUrl: "/livros/a-internet-como-ferramenta-de-marketing-pol-tico.pdf",
    nomeCapa: "capa_marketing-politico-internet.jpg",
    tituloExato: "A Internet como Ferramenta de Marketing Político",
    descricaoExata:
      "Análise do uso estratégico da internet como plataforma de marketing político. Aborda como candidatos e partidos utilizam redes sociais, sites e e-mail marketing para conquistar eleitores e fortalecer a comunicação política.",
  },
  {
    pdfUrl: "/livros/administra-o-de-marketing-comportamento-e-tend-ncias-dos-consumidores.pdf",
    nomeCapa: "capa_administracao-de-marketing.jpg",
    tituloExato: "Administração de Marketing: Comportamento e Tendências dos Consumidores",
    descricaoExata:
      "Obra completa sobre administração de marketing com foco no comportamento do consumidor e tendências de mercado. Cobre análise de mercado, segmentação, posicionamento e estratégias de fidelização do cliente.",
  },
  {
    pdfUrl: "/livros/an-lise-do-potencial-do-neuromarketing-na-publicidade-contempor-nea.pdf",
    nomeCapa: "capa_neuromarketing-publicidade.jpg",
    tituloExato: "Análise do Potencial do Neuromarketing na Publicidade Contemporânea",
    descricaoExata:
      "Pesquisa académica que explora o potencial do neuromarketing na criação de campanhas publicitárias mais eficazes. Investiga como as emoções e o inconsciente influenciam as decisões de compra e a perceção das marcas.",
  },
  {
    pdfUrl: "/livros/avalia-o-dos-contributos-do-neuromarketing-na-gest-o-da-marca.pdf",
    nomeCapa: "capa_neuromarketing-gestao-marca.jpg",
    tituloExato: "Avaliação dos Contributos do Neuromarketing na Gestão da Marca",
    descricaoExata:
      "Estudo aprofundado sobre como o neuromarketing contribui para a gestão estratégica de marcas. Analisa o impacto das técnicas de neurociência no branding, na identidade de marca e na lealdade do consumidor.",
  },
  {
    pdfUrl: "/livros/como-elaborar-um-plano-de-marketing.pdf",
    nomeCapa: "capa_como-elaborar-plano-marketing.jpg",
    tituloExato: "Como Elaborar um Plano de Marketing",
    descricaoExata:
      "Guia prático e objetivo sobre como criar um plano de marketing eficaz. Apresenta passo a passo os elementos essenciais: análise de situação, objetivos SMART, estratégias de produto, preço, praça e promoção, e indicadores de resultado.",
  },
  {
    pdfUrl: "/livros/estrat-gias-de-marketing.pdf",
    nomeCapa: "capa_estrategias-de-marketing.jpg",
    tituloExato: "Estratégias de Marketing",
    descricaoExata:
      "Visão abrangente das principais estratégias de marketing utilizadas por empresas bem-sucedidas. Aborda marketing de conteúdo, inbound marketing, marketing de relacionamento, diferenciação de produto e estratégias de crescimento.",
  },
  {
    pdfUrl: "/livros/gest-o-de-marketing.pdf",
    nomeCapa: "capa_gestao-de-marketing.jpg",
    tituloExato: "Gestão de Marketing",
    descricaoExata:
      "Obra completa sobre gestão de marketing nas organizações modernas. Cobre planejamento de marketing, análise competitiva, gestão de campanhas, métricas e KPIs de marketing, além de ferramentas digitais para gestores.",
  },
  {
    pdfUrl: "/livros/gest-o-marketing-no-agroneg-cio.pdf",
    nomeCapa: "capa_marketing-agronegocio.jpg",
    tituloExato: "Gestão e Marketing no Agronegócio",
    descricaoExata:
      "Livro especializado em estratégias de marketing e gestão aplicadas ao agronegócio. Aborda como produtores rurais, cooperativas e empresas do setor agrícola podem utilizar o marketing para agregar valor e conquistar novos mercados.",
  },
  {
    pdfUrl: "/livros/marketing-nas-pequenas-e-m-dias-explora-es-agr-colas.pdf",
    nomeCapa: "capa_marketing-exploracoes-agricolas.jpg",
    tituloExato: "Marketing nas Pequenas e Médias Explorações Agrícolas",
    descricaoExata:
      "Guia de marketing direcionado a pequenos e médios agricultores. Apresenta estratégias acessíveis para promover produtos agrícolas, aceder a novos mercados, criar marca e aumentar a rentabilidade de explorações de pequena escala.",
  },
  {
    pdfUrl: "/livros/marketing-pol-tico-e-eleitoral-para-vereadores.pdf",
    nomeCapa: "capa_marketing-politico-vereadores.jpg",
    tituloExato: "Marketing Político e Eleitoral para Vereadores",
    descricaoExata:
      "Manual prático de marketing político especialmente desenvolvido para candidatos a vereadores. Aborda estratégias de campanha, comunicação com o eleitor, uso de redes sociais, gestão da imagem pública e táticas eleitorais eficazes.",
  },
  {
    pdfUrl: "/livros/marketing-pol-tico-em-tempos-modernos.pdf",
    nomeCapa: "capa_marketing-politico-moderno.jpg",
    tituloExato: "Marketing Político em Tempos Modernos",
    descricaoExata:
      "Análise do marketing político na era digital e das redes sociais. Explora como as mudanças tecnológicas transformaram as campanhas políticas, o papel das fake news, a polarização online e as novas ferramentas de comunicação política.",
  },
  {
    pdfUrl: "/livros/marketing.pdf",
    nomeCapa: "capa_marketing-fundamentos.jpg",
    tituloExato: "Marketing: Fundamentos e Aplicações",
    descricaoExata:
      "Obra de referência sobre os fundamentos do marketing e suas aplicações práticas no mundo empresarial. Ideal para estudantes e profissionais que querem dominar os conceitos centrais do marketing.",
  },
  {
    pdfUrl: "/livros/neuromarketing-e-marketing-sensorial-nas-vendas-online.pdf",
    nomeCapa: "capa_neuromarketing-vendas-online.jpg",
    tituloExato: "Neuromarketing e Marketing Sensorial nas Vendas Online",
    descricaoExata:
      "Estudo sobre a aplicação de técnicas de neuromarketing e marketing sensorial no e-commerce. Analisa como elementos visuais, sonoros e sensoriais influenciam a experiência de compra online e aumentam as taxas de conversão.",
  },
  {
    pdfUrl: "/livros/plano-de-marketing-para-um-mercado-internacional.pdf",
    nomeCapa: "capa_marketing-mercado-internacional.jpg",
    tituloExato: "Plano de Marketing para um Mercado Internacional",
    descricaoExata:
      "Guia completo para criar um plano de marketing voltado à internacionalização de empresas. Aborda pesquisa de mercados externos, adaptação de produtos, estratégias de entrada em novos países e gestão da comunicação multicultural.",
  },
  {
    pdfUrl: "/livros/projeto-de-marketing-em-agroneg-cio-estrat-gias-para-um-desenvolvimento-sustent-vel.pdf",
    nomeCapa: "capa_marketing-agronegocio-sustentavel.jpg",
    tituloExato: "Projeto de Marketing em Agronegócio: Estratégias para um Desenvolvimento Sustentável",
    descricaoExata:
      "Projeto académico que apresenta estratégias de marketing sustentável aplicadas ao agronegócio. Foca em como aliar competitividade e crescimento económico com responsabilidade ambiental e social no setor agroindustrial.",
  },
  {
    pdfUrl: "/livros/t-picos-de-marketing-no-s-culo-xxi-volume-2.pdf",
    nomeCapa: "capa_topicos-marketing-seculo-xxi-v2.jpg",
    tituloExato: "Tópicos de Marketing no Século XXI - Volume 2",
    descricaoExata:
      "Segunda volume de uma coleção sobre os temas mais relevantes do marketing contemporâneo. Aborda tendências emergentes como marketing de influência, inteligência artificial no marketing, personalização em massa e o futuro do consumo digital.",
  },

  // ── Lote 3: 6 Livros de Desenvolvimento Pessoal ─────────────────────────
  {
    pdfUrl: "/livros/intelig-ncia-emocional-daniel-goleman.pdf",
    nomeCapa: "capa_inteligencia-emocional.jpg",
    tituloExato: "Inteligência Emocional",
    descricaoExata:
      "O clássico de Daniel Goleman que revolucionou a forma como entendemos a inteligência. Este livro revela que o QI não é o único fator de sucesso — a inteligência emocional, que inclui autoconsciência, empatia e gestão das emoções, pode ser determinante para o sucesso pessoal e profissional.",
  },
  {
    pdfUrl: "/livros/medita-es-marco-aur-lio.pdf",
    nomeCapa: "capa_meditacoes-marco-aurelio.jpg",
    tituloExato: "Meditações",
    descricaoExata:
      "Obra filosófica do imperador romano Marco Aurélio, considerada um dos grandes clássicos do estoicismo. Escrita como um diário pessoal, traz reflexões sobre a virtude, a resiliência, a disciplina mental e a arte de viver com integridade em meio às adversidades do mundo.",
  },
  {
    pdfUrl: "/livros/o-obst-culo-o-caminhoo-ryan-holiday.pdf",
    nomeCapa: "capa_obstaculo-caminho.jpg",
    tituloExato: "O Obstáculo é o Caminho",
    descricaoExata:
      "Ryan Holiday resgata a filosofia estoica para ensinar que os obstáculos da vida não nos impedem — eles são o próprio caminho. Com exemplos de grandes líderes como Marco Aurélio, Abraham Lincoln e Steve Jobs, o livro mostra como transformar adversidades em oportunidades de crescimento.",
  },
  {
    pdfUrl: "/livros/o-homem-mais-rico-da-babilonia-george-s.-clason.pdf",
    nomeCapa: "capa_homem-mais-rico-babilonia.jpg",
    tituloExato: "O Homem Mais Rico da Babilônia",
    descricaoExata:
      "Através de parábolas ambientadas na antiga Babilônia, George S. Clason apresenta princípios atemporais sobre finanças pessoais e prosperidade. O livro ensina como poupar, investir e construir riqueza com sabedoria — lições que continuam relevantes e práticas nos dias de hoje.",
  },
  {
    pdfUrl: "/livros/os-segredos-da-mente-milion-ria.pdf",
    nomeCapa: "capa_segredos-mente-milionaria.jpg",
    tituloExato: "Os Segredos da Mente Milionária",
    descricaoExata:
      "T. Harv Eker revela como o nosso 'modelo financeiro' — formado na infância — determina o nosso nível de riqueza. Com exercícios práticos e reveladores, o livro ajuda a identificar e reprogramar crenças limitantes sobre dinheiro, abrindo caminho para a abundância financeira e pessoal.",
  },
  {
    pdfUrl: "/livros/quem-pensa-enriquece-o-legado.pdf",
    nomeCapa: "capa_quem-pensa-enriquece.jpg",
    tituloExato: "Quem Pensa Enriquece - O Legado",
    descricaoExata:
      "Edição especial de 'Quem Pensa Enriquece', o bestseller mais influente sobre desenvolvimento pessoal e sucesso. Napoleon Hill sintetiza os princípios de riqueza e realização aprendidos com centenas dos homens mais bem-sucedidos da história, incluindo Andrew Carnegie e Henry Ford.",
  },
];


export default function ExtrairCapasPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [progresso, setProgresso] = useState<number>(0);
  const [concluido, setConcluido] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const addLog = (msg: string) => {
    setLogs((prev) => [...prev, msg]);
    console.log(msg);
  };

  useEffect(() => {
    async function processarTudo() {
      try {
        addLog("Iniciando carregamento do PDF.js...");
        // Carrega PDF.js dinamicamente
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

        addLog("Buscando livros no Firestore...");
        const snapshot = await getDocs(collection(db, "livros"));
        const docsNoBanco = snapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];

        let contador = 0;

        for (const item of livrosParaProcessar) {
          addLog(`\nProcessando: "${item.tituloExato}"...`);

          // 1. Baixa o arrayBuffer do PDF local
          const resp = await fetch(item.pdfUrl);
          if (!resp.ok) {
            addLog(`❌ Falha ao carregar PDF de ${item.pdfUrl}`);
            continue;
          }
          const arrayBuffer = await resp.arrayBuffer();

          // 2. Renderiza a 1ª página no canvas
          const pdfDoc = await pdfjs.getDocument({ data: arrayBuffer }).promise;
          const page = await pdfDoc.getPage(1);

          const viewport = page.getViewport({ scale: 2.0 }); // alta resolução
          const canvas = canvasRef.current || document.createElement("canvas");
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          const ctx = canvas.getContext("2d");

          // @ts-expect-error - compatibility across pdfjs-dist versions
          await page.render({ canvasContext: ctx, viewport, canvas }).promise;

          const dataUrl = canvas.toDataURL("image/jpeg", 0.92);

          // 3. Salva a imagem no backend (public/capas/...)
          const saveRes = await fetch("/api/salvar-capa", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              nome: item.nomeCapa,
              dataUrl: dataUrl,
            }),
          });

          if (!saveRes.ok) {
            addLog(`❌ Erro ao salvar capa ${item.nomeCapa} no servidor.`);
            continue;
          }

          addLog(`✅ Capa original salva com sucesso: /capas/${item.nomeCapa}`);

          // 4. Atualiza o documento no Firestore com a capa original e a descrição exata do InfoLivros
          const docExistente = docsNoBanco.find(
            (d) => d.titulo?.trim().toLowerCase() === item.tituloExato.trim().toLowerCase()
          );

          if (docExistente) {
            await updateDoc(doc(db, "livros", docExistente.id), {
              capaUrl: `/capas/${item.nomeCapa}?t=${Date.now()}`,
              descricao: item.descricaoExata,
            });
            addLog(`✅ Firestore atualizado: ID ${docExistente.id} com descrição e capa originais!`);
          }

          contador++;
          setProgresso(Math.round((contador / livrosParaProcessar.length) * 100));
        }

        addLog("\n🎉 PROCESSO CONCLUÍDO COM SUCESSO!");
        setConcluido(true);
      } catch (err: any) {
        addLog(`❌ Erro durante o processo: ${err.message}`);
      }
    }

    processarTudo();
  }, []);

  return (
    <div
      style={{
        padding: "40px",
        maxWidth: "800px",
        margin: "0 auto",
        background: "#0a0d14",
        color: "#fff",
        minHeight: "100vh",
        fontFamily: "sans-serif",
      }}
    >
      <h1 style={{ color: "#c9a84c", marginBottom: "8px" }}>
        Extração de Capas Originais e Atualização de Descrições
      </h1>
      <p style={{ color: "#888", marginBottom: "24px" }}>
        Extraindo a 1ª página oficial de cada PDF em alta resolução e sincronizando com o Firestore...
      </p>

      <div
        style={{
          background: "#161b26",
          borderRadius: "8px",
          height: "16px",
          overflow: "hidden",
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #c9a84c, #e0c068)",
            height: "100%",
            width: `${progresso}%`,
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div
        style={{
          background: "#10141d",
          border: "1px solid #1f2737",
          borderRadius: "8px",
          padding: "20px",
          fontSize: "14px",
          fontFamily: "monospace",
          maxHeight: "400px",
          overflowY: "auto",
        }}
      >
        {logs.map((l, i) => (
          <div key={i} style={{ marginBottom: "6px" }}>
            {l}
          </div>
        ))}
      </div>

      {concluido && (
        <div style={{ marginTop: "30px", textAlign: "center" }}>
          <a
            href="/livros"
            style={{
              display: "inline-block",
              background: "#c9a84c",
              color: "#0a0d14",
              padding: "12px 28px",
              borderRadius: "8px",
              fontWeight: "bold",
              textDecoration: "none",
            }}
          >
            Ver Livros com Capas Originais no Catálogo →
          </a>
        </div>
      )}

      {/* Canvas invisível para renderização */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}
