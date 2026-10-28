Add-Type -AssemblyName System.Drawing

$livrosDir = "e:\antigravity\livros e video aulas\public\livros"
$capasDir  = "e:\antigravity\livros e video aulas\public\capas"

if (!(Test-Path $capasDir)) {
    New-Item -ItemType Directory -Force -Path $capasDir | Out-Null
}

# Lista de livros de marketing com slug -> nome da capa
$livros = @(
    @{ slug="a-efetividade-do-neuromarketing-como-ferramenta-de-pesquisa-e-an-lise-do-consumidor.pdf"; capa="capa_neuromarketing-ferramenta-pesquisa"; titulo="Neuromarketing" },
    @{ slug="a-internet-como-ferramenta-de-marketing-pol-tico.pdf"; capa="capa_marketing-politico-internet"; titulo="Marketing Politico Internet" },
    @{ slug="administra-o-de-marketing-comportamento-e-tend-ncias-dos-consumidores.pdf"; capa="capa_administracao-de-marketing"; titulo="Administracao Marketing" },
    @{ slug="an-lise-do-potencial-do-neuromarketing-na-publicidade-contempor-nea.pdf"; capa="capa_neuromarketing-publicidade"; titulo="Neuromarketing Publicidade" },
    @{ slug="avalia-o-dos-contributos-do-neuromarketing-na-gest-o-da-marca.pdf"; capa="capa_neuromarketing-gestao-marca"; titulo="Neuromarketing Marca" },
    @{ slug="como-elaborar-um-plano-de-marketing.pdf"; capa="capa_como-elaborar-plano-marketing"; titulo="Plano de Marketing" },
    @{ slug="estrat-gias-de-marketing.pdf"; capa="capa_estrategias-de-marketing"; titulo="Estrategias Marketing" },
    @{ slug="gest-o-de-marketing.pdf"; capa="capa_gestao-de-marketing"; titulo="Gestao Marketing" },
    @{ slug="gest-o-marketing-no-agroneg-cio.pdf"; capa="capa_marketing-agronegocio"; titulo="Marketing Agronegocio" },
    @{ slug="marketing-nas-pequenas-e-m-dias-explora-es-agr-colas.pdf"; capa="capa_marketing-exploracoes-agricolas"; titulo="Marketing Agricola" },
    @{ slug="marketing-pol-tico-e-eleitoral-para-vereadores.pdf"; capa="capa_marketing-politico-vereadores"; titulo="Marketing Vereadores" },
    @{ slug="marketing-pol-tico-em-tempos-modernos.pdf"; capa="capa_marketing-politico-moderno"; titulo="Marketing Politico Moderno" },
    @{ slug="marketing.pdf"; capa="capa_marketing-fundamentos"; titulo="Marketing Fundamentos" },
    @{ slug="neuromarketing-e-marketing-sensorial-nas-vendas-online.pdf"; capa="capa_neuromarketing-vendas-online"; titulo="Neuromarketing Vendas" },
    @{ slug="plano-de-marketing-para-um-mercado-internacional.pdf"; capa="capa_marketing-mercado-internacional"; titulo="Marketing Internacional" },
    @{ slug="projeto-de-marketing-em-agroneg-cio-estrat-gias-para-um-desenvolvimento-sustent-vel.pdf"; capa="capa_marketing-agronegocio-sustentavel"; titulo="Marketing Sustentavel" },
    @{ slug="t-picos-de-marketing-no-s-culo-xxi-volume-2.pdf"; capa="capa_topicos-marketing-seculo-xxi-v2"; titulo="Topicos Marketing XXI" }
)

# Paletas de cores para capas genéricas de marketing (azul, verde, laranja, roxo)
$paletas = @(
    @("#0284c7","#38bdf8","#ffffff"),
    @("#059669","#34d399","#ffffff"),
    @("#d97706","#fbbf24","#ffffff"),
    @("#7c3aed","#a78bfa","#ffffff"),
    @("#dc2626","#f87171","#ffffff"),
    @("#0891b2","#67e8f9","#ffffff")
)

$i = 0
foreach ($livro in $livros) {
    $capaPath = Join-Path $capasDir ($livro.capa + ".jpg")
    
    if (Test-Path $capaPath) {
        Write-Host "Ja existe: $($livro.capa).jpg"
        $i++
        continue
    }

    $paleta = $paletas[$i % $paletas.Count]
    $cor1 = [System.Drawing.ColorTranslator]::FromHtml($paleta[0])
    $cor2 = [System.Drawing.ColorTranslator]::FromHtml($paleta[1])
    $corTexto = [System.Drawing.ColorTranslator]::FromHtml($paleta[2])

    # Criar imagem 400x560 (proporção livro)
    $bmp = New-Object System.Drawing.Bitmap 400, 560
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias

    # Gradiente vertical
    $rect = New-Object System.Drawing.Rectangle 0, 0, 400, 560
    $grad = New-Object System.Drawing.Drawing2D.LinearGradientBrush($rect, $cor1, $cor2, [System.Drawing.Drawing2D.LinearGradientMode]::Vertical)
    $g.FillRectangle($grad, $rect)

    # Texto central "MARKETING" 
    $fontCategory = New-Object System.Drawing.Font "Arial", 14, [System.Drawing.FontStyle]::Bold
    $fontTitle    = New-Object System.Drawing.Font "Arial", 18, [System.Drawing.FontStyle]::Bold
    $fontSub      = New-Object System.Drawing.Font "Arial", 11, [System.Drawing.FontStyle]::Regular
    $brushText    = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(180, 255, 255, 255))
    $brushTitle   = New-Object System.Drawing.SolidBrush $corTexto

    # Retangulo decorativo
    $brushRect = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::FromArgb(40, 255, 255, 255))
    $g.FillRectangle($brushRect, 30, 200, 340, 160)

    # Categoria
    $sfCenter = New-Object System.Drawing.StringFormat
    $sfCenter.Alignment = [System.Drawing.StringAlignment]::Center
    $sfCenter.LineAlignment = [System.Drawing.StringAlignment]::Center
    $g.DrawString("MARKETING", $fontCategory, $brushText, (New-Object System.Drawing.RectangleF 0, 100, 400, 40), $sfCenter)

    # Titulo
    $tituloDisplay = $livro.titulo.ToUpper()
    if ($tituloDisplay.Length -gt 30) { $tituloDisplay = $tituloDisplay.Substring(0, 30) + "..." }
    $g.DrawString($tituloDisplay, $fontTitle, $brushTitle, (New-Object System.Drawing.RectangleF 30, 210, 340, 130), $sfCenter)

    # Rodapé
    $g.DrawString("Sabedoria Digital", $fontSub, $brushText, (New-Object System.Drawing.RectangleF 0, 480, 400, 40), $sfCenter)

    # Salvar como JPG
    $bmp.Save($capaPath, [System.Drawing.Imaging.ImageFormat]::Jpeg)

    $g.Dispose()
    $bmp.Dispose()

    Write-Host "Criada: $($livro.capa).jpg"
    $i++
}

Write-Host ""
Write-Host "Total de capas: $($livros.Count) criadas."
