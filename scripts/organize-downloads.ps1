$ErrorActionPreference = "Stop"

$downloadsFolder = Join-Path $env:USERPROFILE "Downloads"

if (-not (Test-Path -LiteralPath $downloadsFolder -PathType Container)) {
    throw "Downloads folder was not found: $downloadsFolder"
}

Get-ChildItem -LiteralPath $downloadsFolder -File | ForEach-Object {
    $sourceFile = $_
    $dateFolderName = $sourceFile.LastWriteTime.ToString("yyyy-MM-dd")
    $dateFolder = Join-Path $downloadsFolder $dateFolderName

    if (-not (Test-Path -LiteralPath $dateFolder -PathType Container)) {
        New-Item -ItemType Directory -Path $dateFolder | Out-Null
    }

    $destination = Join-Path $dateFolder $sourceFile.Name
    if (Test-Path -LiteralPath $destination) {
        $baseName = [System.IO.Path]::GetFileNameWithoutExtension($sourceFile.Name)
        $extension = $sourceFile.Extension
        $counter = 1

        do {
            $destination = Join-Path $dateFolder ("{0} ({1}){2}" -f $baseName, $counter, $extension)
            $counter++
        } while (Test-Path -LiteralPath $destination)
    }

    Move-Item -LiteralPath $sourceFile.FullName -Destination $destination
}
