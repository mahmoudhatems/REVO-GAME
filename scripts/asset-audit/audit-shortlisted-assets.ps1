param(
    [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$catalogPath = Join-Path $RepositoryRoot 'src/data/assets/asset-catalog.json'
$catalog = Get-Content -LiteralPath $catalogPath -Raw | ConvertFrom-Json
$assetIds = Get-Content -LiteralPath (Join-Path $RepositoryRoot 'docs/asset-review/shortlisted-asset-ids.json') -Raw | ConvertFrom-Json
$originalRoot = Join-Path $RepositoryRoot 'assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/00_Original_SpriteSheets'
$rows = foreach ($assetId in $assetIds) {
    $entry = $catalog | Where-Object assetId -eq $assetId | Select-Object -First 1
    if (-not $entry) { throw "Catalog entry missing: $assetId" }
    $imagePath = Join-Path $RepositoryRoot $entry.sourceFolder
    $bitmap = [System.Drawing.Bitmap]::FromFile($imagePath)
    try {
        $transparent = 0
        $opaque = 0
        $blackOpaque = 0
        $minX = $bitmap.Width
        $minY = $bitmap.Height
        $maxX = -1
        $maxY = -1
        for ($y = 0; $y -lt $bitmap.Height; $y++) {
            for ($x = 0; $x -lt $bitmap.Width; $x++) {
                $pixel = $bitmap.GetPixel($x, $y)
                if ($pixel.A -eq 0) { $transparent++ }
                else {
                    $opaque++
                    if ($pixel.R -le 5 -and $pixel.G -le 5 -and $pixel.B -le 5) { $blackOpaque++ }
                    if ($x -lt $minX) { $minX = $x }
                    if ($x -gt $maxX) { $maxX = $x }
                    if ($y -lt $minY) { $minY = $y }
                    if ($y -gt $maxY) { $maxY = $y }
                }
            }
        }
        $sheetPath = Join-Path $originalRoot $entry.sourceSheet
        $sheetWidth = $null
        $sheetHeight = $null
        $cropInSheetBounds = $null
        if (Test-Path -LiteralPath $sheetPath -PathType Leaf) {
            $sheet = [System.Drawing.Image]::FromFile($sheetPath)
            try {
                $sheetWidth = $sheet.Width
                $sheetHeight = $sheet.Height
                $cropInSheetBounds = ($entry.crop.x -ge 0 -and $entry.crop.y -ge 0 -and ($entry.crop.x + $entry.crop.width) -le $sheetWidth -and ($entry.crop.y + $entry.crop.height) -le $sheetHeight)
            }
            finally { $sheet.Dispose() }
        }
        [PSCustomObject]@{
            assetId = $assetId
            filename = $entry.originalFilename
            width = $bitmap.Width
            height = $bitmap.Height
            transparentPixels = $transparent
            opaquePixels = $opaque
            opaqueBounds = if ($maxX -ge 0) { "${minX},${minY}-$maxX,$maxY" } else { 'empty' }
            opaqueBlackPixels = $blackOpaque
            opaqueBlackPercent = if ($opaque -gt 0) { [Math]::Round(100 * $blackOpaque / $opaque, 2) } else { 0 }
            sourceSheet = $entry.sourceSheet
            sourceSheetWidth = $sheetWidth
            sourceSheetHeight = $sheetHeight
            manifestCrop = "$($entry.crop.x),$($entry.crop.y),$($entry.crop.width),$($entry.crop.height)"
            manifestCropWithinSheet = $cropInSheetBounds
            cropMatchesAssetDimensions = ($entry.crop.width -eq $bitmap.Width -and $entry.crop.height -eq $bitmap.Height)
            visualAnimationNote = if ($entry.category -eq 'Astronaut') { 'Separate static pose crop; animation sequence/order requires owner review.' } else { 'Single static PNG crop; no animation frames in this asset file.' }
        }
    }
    finally { $bitmap.Dispose() }
}

$outputPath = Join-Path $RepositoryRoot 'docs/asset-review/shortlisted-asset-audit.csv'
$null = New-Item -ItemType Directory -Path (Split-Path -Parent $outputPath) -Force
$rows | Export-Csv -LiteralPath $outputPath -NoTypeInformation -Encoding utf8
Write-Output "Audited $($rows.Count) shortlisted PNG assets. Report: docs/asset-review/shortlisted-asset-audit.csv"
