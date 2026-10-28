$src = "e:\antigravity\livros e video aulas\downloads\Arte"
$dst = "e:\antigravity\livros e video aulas\public\livros"

if (!(Test-Path $dst)) {
    New-Item -ItemType Directory -Force -Path $dst | Out-Null
}

$mapeamento = @()

Get-ChildItem $src -Filter "*.pdf" | ForEach-Object {
    $original = $_.Name
    $slug = $original.ToLower()
    $slug = $slug -replace 'á|à|ã|â|ä','a'
    $slug = $slug -replace 'é|è|ê|ë|é','e'
    $slug = $slug -replace 'í|ì|î|ï','i'
    $slug = $slug -replace 'ó|ò|õ|ô|ö','o'
    $slug = $slug -replace 'ú|ù|û|ü','u'
    $slug = $slug -replace 'ç','c'
    $slug = $slug -replace 'ñ','n'
    $slug = $slug -replace '[^a-z0-9\.\-]','-'
    $slug = $slug -replace '-+','-'
    $slug = $slug.Trim('-')

    $destPath = Join-Path $dst $slug
    Copy-Item -Path $_.FullName -Destination $destPath -Force
    Write-Host "OK: $slug"

    $mapeamento += [PSCustomObject]@{
        original = $original
        slug     = $slug
        pdfUrl   = "/livros/$slug"
    }
}

$mapeamento | ConvertTo-Json -Depth 3 | Out-File -Encoding UTF8 "$src\mapeamento_slugs.json"
Write-Host "Total: $($mapeamento.Count) ficheiros copiados."
