param(
    [string]$RepositoryRoot = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path,
    [string]$ArchiveRoot = 'assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets',
    [string]$OutputRoot = 'docs/asset-contact-sheets',
    [int]$PageSize = 64
)

$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Drawing

$archive = Join-Path $RepositoryRoot $ArchiveRoot
$originalRoot = Join-Path $archive '01_Original_Size'
$manifestPath = Join-Path $originalRoot 'Asset_Manifest.csv'
$output = Join-Path $RepositoryRoot $OutputRoot
$null = New-Item -ItemType Directory -Path $output -Force

$categoryCodes = @{
    Ground_Tileset = 'GTS'
    Buildings = 'BLD'
    Doors_Walls = 'DOR'
    Walls_Modular = 'WAL'
    Panels_Glass = 'GLS'
    Floor_Tiles = 'FLT'
    Tools_Equipment = 'EQP'
    Astronaut = 'AST'
    Drone_Animations = 'DRN'
    UI_Elements = 'UIE'
    UI_Icons = 'UIC'
}

$manifest = Import-Csv -LiteralPath $manifestPath
$requiredCategories = @(
    'Ground_Tileset', 'Buildings', 'Doors_Walls', 'Walls_Modular',
    'Panels_Glass', 'Floor_Tiles', 'Tools_Equipment', 'Astronaut',
    'Drone_Animations', 'UI_Elements', 'UI_Icons'
)
$font = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Regular)
$headerFont = New-Object System.Drawing.Font('Arial', 16, [System.Drawing.FontStyle]::Bold)
$smallFont = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Bold)
$format = New-Object System.Drawing.StringFormat
$format.Trimming = [System.Drawing.StringTrimming]::EllipsisWord
$format.FormatFlags = [System.Drawing.StringFormatFlags]::LineLimit
$items = [System.Collections.Generic.List[object]]::new()

foreach ($category in $requiredCategories) {
    $categoryRows = @($manifest | Where-Object category_folder -eq $category | Sort-Object filename)
    $code = $categoryCodes[$category]
    for ($i = 0; $i -lt $categoryRows.Count; $i++) {
        $row = $categoryRows[$i]
        $relative = Join-Path $category $row.filename
        $sourcePath = Join-Path $originalRoot $relative
        if (-not (Test-Path -LiteralPath $sourcePath -PathType Leaf)) {
            throw "Manifest file not found: $relative"
        }
        $image = [System.Drawing.Image]::FromFile($sourcePath)
        try {
            $width = $image.Width
            $height = $image.Height
            if ($width -ne [int]$row.file_width_px -or $height -ne [int]$row.file_height_px) {
                throw "Manifest dimensions differ from file: $relative"
            }
            $items.Add([PSCustomObject]@{
                asset_id = ('{0}-{1:D4}' -f $code, ($i + 1))
                semantic_key = ('{0}.{1}' -f ($category.ToLowerInvariant() -replace '[^a-z0-9]+', '_'), (($row.filename -replace '\.png$', '') -replace '[^a-zA-Z0-9]+', '_').ToLowerInvariant())
                filename = $row.filename
                source_folder = $relative.Replace('\', '/')
                category = $category
                width = $width
                height = $height
                artwork_width = [int]$row.artwork_width_px
                artwork_height = [int]$row.artwork_height_px
                source_sheet = $row.source_sheet
                source_x = [int]$row.source_x
                source_y = [int]$row.source_y
                alpha_channel = [bool]($image.Flags -band [int][System.Drawing.Imaging.ImageFlags]::HasAlpha)
                full_path = $sourcePath
            })
        }
        finally {
            $image.Dispose()
        }
    }
}

$catalogRows = [System.Collections.Generic.List[object]]::new()
$sheetIndex = [System.Collections.Generic.List[object]]::new()
$cellWidth = 200
$cellHeight = 150
$columns = 8
$canvasWidth = $columns * $cellWidth

foreach ($category in $requiredCategories) {
    $categoryItems = @($items | Where-Object category -eq $category)
    $categoryOutput = Join-Path $output $category
    $null = New-Item -ItemType Directory -Path $categoryOutput -Force
    $pageCount = [Math]::Ceiling($categoryItems.Count / $PageSize)

    for ($page = 0; $page -lt $pageCount; $page++) {
        $start = $page * $PageSize
        $pageItems = @($categoryItems | Select-Object -Skip $start -First $PageSize)
        $rows = [Math]::Ceiling($pageItems.Count / $columns)
        $canvasHeight = 38 + ($rows * $cellHeight)
        $bitmap = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        $graphics.Clear([System.Drawing.Color]::White)
        $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
        $title = '{0} - page {1} of {2} - assets {3}-{4}' -f $category, ($page + 1), $pageCount, ($start + 1), ($start + $pageItems.Count)
        $graphics.DrawString($title, $headerFont, [System.Drawing.Brushes]::Black, 10, 5)

        for ($j = 0; $j -lt $pageItems.Count; $j++) {
            $item = $pageItems[$j]
            $column = $j % $columns
            $rowIndex = [Math]::Floor($j / $columns)
            $x = $column * $cellWidth
            $y = 38 + ($rowIndex * $cellHeight)
            $graphics.FillRectangle([System.Drawing.Brushes]::WhiteSmoke, $x + 1, $y + 1, $cellWidth - 2, $cellHeight - 2)

            $checkerSize = 10
            for ($cy = 0; $cy -lt 9; $cy++) {
                for ($cx = 0; $cx -lt 18; $cx++) {
                    $checker = if (($cx + $cy) % 2 -eq 0) { [System.Drawing.Brushes]::White } else { [System.Drawing.Brushes]::Gainsboro }
                    $graphics.FillRectangle($checker, $x + 10 + ($cx * $checkerSize), $y + 5 + ($cy * $checkerSize), $checkerSize, $checkerSize)
                }
            }

            $image = [System.Drawing.Image]::FromFile($item.full_path)
            try {
                $scale = [Math]::Min(170.0 / $image.Width, 88.0 / $image.Height)
                $drawWidth = [Math]::Max(1, [int][Math]::Round($image.Width * $scale))
                $drawHeight = [Math]::Max(1, [int][Math]::Round($image.Height * $scale))
                $destX = $x + 10 + [int][Math]::Floor((170 - $drawWidth) / 2)
                $destY = $y + 5 + [int][Math]::Floor((88 - $drawHeight) / 2)
                $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::NearestNeighbor
                $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::Half
                $graphics.DrawImage($image, $destX, $destY, $drawWidth, $drawHeight)
            }
            finally {
                $image.Dispose()
            }

            $graphics.DrawString($item.asset_id, $smallFont, [System.Drawing.Brushes]::DarkBlue, $x + 7, $y + 96)
            $label = "{0}`n{1} x {2}" -f $item.filename, $item.width, $item.height
            $labelBounds = [System.Drawing.RectangleF]::new([single]($x + 7), [single]($y + 110), [single]($cellWidth - 14), [single]36)
            $graphics.DrawString($label, $font, [System.Drawing.Brushes]::Black, $labelBounds, $format)
            $null = $catalogRows.Add($item)
        }

        $sheetName = '{0}-{1:D2}.png' -f $category, ($page + 1)
        $bitmap.Save((Join-Path $categoryOutput $sheetName), [System.Drawing.Imaging.ImageFormat]::Png)
        $graphics.Dispose()
        $bitmap.Dispose()
        $null = $sheetIndex.Add([PSCustomObject]@{
            category = $category
            page = $page + 1
            pages = $pageCount
            asset_start = $start + 1
            asset_end = $start + $pageItems.Count
            file = "asset-contact-sheets/$category/$sheetName"
        })
    }
    Write-Output ("{0}: {1} assets, {2} contact sheets" -f $category, $categoryItems.Count, $pageCount)
}

$sheetIndex | Export-Csv -LiteralPath (Join-Path $output 'contact-sheet-index.csv') -NoTypeInformation -Encoding utf8
$catalog = foreach ($item in $items) {
    $classification = 'UNIDENTIFIED'
    $visualPurpose = 'Individual purpose is not confirmed; inspect the linked contact sheet.'
    switch ($item.category) {
        'Buildings' { $classification = 'CANDIDATE'; $visualPurpose = 'Building or facility module; exact function requires owner approval.' }
        'Doors_Walls' { $classification = 'CANDIDATE'; $visualPurpose = 'Access, door, wall, sign, or safety detail; exact function depends on the individual image.' }
        'Walls_Modular' { $classification = 'CANDIDATE'; $visualPurpose = 'Modular wall construction piece; room placement requires map review.' }
        'Panels_Glass' { $classification = 'CANDIDATE'; $visualPurpose = 'Glass, frame, trim, or broken-glass detail; exact use requires review.' }
        'Floor_Tiles' { $classification = 'CANDIDATE'; $visualPurpose = 'Interior floor or hazard/detail tile; room use requires review.' }
        'Tools_Equipment' { $classification = 'CANDIDATE'; $visualPurpose = 'Equipment or prop; exact identity/function is not asserted.' }
        'Astronaut' { $classification = 'CANDIDATE'; $visualPurpose = 'Astronaut/character pose; animation sequence and role require approval.' }
        'Drone_Animations' { $classification = 'CANDIDATE'; $visualPurpose = 'Drone-like animation frame; sequence/role require approval and it is not N.E.I.L.' }
        'UI_Elements' { $classification = 'CANDIDATE'; $visualPurpose = 'Interface element or glyph; exact UI role requires review.' }
        'UI_Icons' { $classification = 'CANDIDATE'; $visualPurpose = 'Interface icon; exact gameplay meaning requires owner approval.' }
        'Ground_Tileset' {
            if ($item.filename -match '^Tile_\d+_32x32\.png$' -and $item.source_sheet -match 'Martian Pixel Art Tileset') {
                $classification = 'CANDIDATE'
                $visualPurpose = 'Source tileset crop; terrain versus edge, rock, plant, label, or facility fragment must be selected visually before use.'
            }
            $tileIndex = 0
            if ([int]::TryParse(($item.asset_id -replace '^GTS-', ''), [ref]$tileIndex) -and (($tileIndex -ge 1 -and $tileIndex -le 80) -or ($tileIndex -ge 1081 -and $tileIndex -le 1174))) {
                $classification = 'UNIDENTIFIED'
                $visualPurpose = 'Mixed source-sheet crop or text/edge fragment; exact gameplay purpose is unclear. Do not place without individual review.'
            }
        }
    }
    if ($item.category -eq 'Walls_Modular') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Modular wall segment/corner artwork; exact room arrangement remains a map decision.'
    }
    if ($item.category -eq 'Floor_Tiles') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Floor tile artwork; exact room assignment remains a map decision.'
    }
    if ($item.category -eq 'Astronaut') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Astronaut character pose; frame sequence and playable role remain to be approved.'
    }
    if ($item.category -eq 'Drone_Animations') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Drone-like animation artwork; sequence and optional gameplay role require approval. This is not N.E.I.L.'
    }
    if ($item.category -eq 'UI_Elements') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Interface component/glyph artwork; exact interface use and text assembly require review.'
    }
    if ($item.category -eq 'Buildings' -and $item.asset_id -eq 'BLD-0007') {
        $classification = 'CONFIRMED'
        $visualPurpose = 'Solar-array artwork is visually identifiable; suitability and placement still require owner approval.'
    }
    [PSCustomObject]@{
        assetId = $item.asset_id
        semanticKey = $item.semantic_key + '.' + $item.asset_id.ToLowerInvariant()
        originalFilename = $item.filename
        sourceFolder = ('assets/source/REVO_Categorized_Assets/REVO_Categorized_Assets/01_Original_Size/' + $item.source_folder)
        dimensions = [PSCustomObject]@{ width = $item.width; height = $item.height }
        category = $item.category
        transparency = [PSCustomObject]@{ alphaChannelPresent = $item.alpha_channel; transparentPixelsAudited = $false }
        sourceSheet = $item.source_sheet
        crop = [PSCustomObject]@{ x = $item.source_x; y = $item.source_y; width = $item.artwork_width; height = $item.artwork_height }
        visualClassification = $classification
        intendedGameUsage = $visualPurpose
        approvalStatus = if ($classification -eq 'UNIDENTIFIED') { 'owner_visual_review_required' } else { 'pending_owner_approval' }
        licenseStatus = 'UNVERIFIED'
    }
}
$catalogPath = Join-Path $RepositoryRoot 'src/data/assets/asset-catalog.json'
$catalogDirectory = Split-Path -Parent $catalogPath
$null = New-Item -ItemType Directory -Path $catalogDirectory -Force
[System.IO.File]::WriteAllText(
    $catalogPath,
    ($catalog | ConvertTo-Json -Depth 8),
    [System.Text.UTF8Encoding]::new($false)
)
$catalog.Count | Write-Output
$font.Dispose()
$headerFont.Dispose()
$smallFont.Dispose()
$format.Dispose()
Write-Output ("Total: {0} assets across {1} requested categories." -f $items.Count, $requiredCategories.Count)
