Add-Type -AssemblyName System.Drawing

$sourcePath = "C:\Users\pc\.gemini\antigravity-ide\brain\0ea534db-1b54-4d28-b739-05194128ecef\.user_uploaded\media_1793135325358.jpg"
$destDir = "e:\antigravity\livros e video aulas\public\icons"

if (-not (Test-Path $destDir)) {
    New-Item -ItemType Directory -Force -Path $destDir | Out-Null
}

# Copy original as logo.png in public
Copy-Item -Path $sourcePath -Destination "e:\antigravity\livros e video aulas\public\logo.png" -Force

$img = [System.Drawing.Image]::FromFile($sourcePath)
$sizes = @(72, 96, 128, 144, 152, 180, 192, 384, 512)

foreach ($size in $sizes) {
    $bmp = New-Object System.Drawing.Bitmap $size, $size
    $graphics = [System.Drawing.Graphics]::FromImage($bmp)
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.DrawImage($img, 0, 0, $size, $size)
    
    if ($size -eq 180) {
        $outPath = Join-Path $destDir "apple-touch-icon.png"
    } else {
        $outPath = Join-Path $destDir ("icon-" + $size + "x" + $size + ".png")
    }
    
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bmp.Dispose()
    Write-Host "Created $outPath"
}

# Also save favicon.png and apple-touch-icon in public root
Copy-Item -Path (Join-Path $destDir "apple-touch-icon.png") -Destination "e:\antigravity\livros e video aulas\public\apple-touch-icon.png" -Force

$fav = New-Object System.Drawing.Bitmap 48, 48
$gFav = [System.Drawing.Graphics]::FromImage($fav)
$gFav.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$gFav.DrawImage($img, 0, 0, 48, 48)
$fav.Save("e:\antigravity\livros e video aulas\public\favicon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$gFav.Dispose()
$fav.Dispose()

$img.Dispose()
Write-Host "All icons generated successfully!"
