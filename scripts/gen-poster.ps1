param(
  [string]$Video = "",
  [string]$Out = "",
  [ValidateRange(0, 60)][int]$AtSecond = 3,
  [ValidateRange(50, 95)][int]$Quality = 80
)

$ErrorActionPreference = "Stop"

if (-not $Video) { $Video = Join-Path $PSScriptRoot "..\public\assets\videos\197848-905691449_medium.mp4" }
if (-not $Out) { $Out = Join-Path $PSScriptRoot "..\public\assets\videos\workout-demo-poster.jpg" }

Add-Type -AssemblyName PresentationCore, WindowsBase

$player = New-Object System.Windows.Media.MediaPlayer
try {
  $failed = $null
  $player.add_MediaFailed({
    param($s, $e)
    if ($e -and $e.ErrorException) { $script:failed = $e.ErrorException.Message }
  })
  $player.Open([uri](Resolve-Path $Video).Path)

  $waits = 0
  while (-not $player.NaturalDuration.HasTimeSpan -and -not $script:failed -and $waits -lt 120) {
    Start-Sleep -Milliseconds 250
    $waits++
  }
  if ($script:failed) { throw "Media fallo: $script:failed" }
  if (-not $player.NaturalDuration.HasTimeSpan) { throw "Media no abrio (timeout): $Video" }
  Start-Sleep -Milliseconds 200

  $w = $player.NaturalVideoWidth
  $h = $player.NaturalVideoHeight
  if ($w -lt 1 -or $h -lt 1) { throw "Sin video stream" }
  $player.ScrubbingEnabled = $true

  $player.Play()
  Start-Sleep -Milliseconds 1200
  $player.Pause()
  $player.Position = [TimeSpan]::FromSeconds($AtSecond)
  Start-Sleep -Milliseconds 600

  $visual = New-Object System.Windows.Media.DrawingVisual
  $dc = $visual.RenderOpen()
  $dc.DrawRectangle(
    ([System.Windows.Media.Brushes]::Black),
    $null,
    (New-Object System.Windows.Rect(0, 0, $w, $h))
  )
  $dc.DrawVideo($player, (New-Object System.Windows.Rect(0, 0, $w, $h)))
  $dc.Close()

  $rtb = New-Object System.Windows.Media.Imaging.RenderTargetBitmap($w, $h, 96, 96, [System.Windows.Media.PixelFormats]::Pbgra32)
  $rtb.Render($visual)

  $dir = Split-Path -Parent $Out
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir | Out-Null }

  $encoder = New-Object System.Windows.Media.Imaging.JpegBitmapEncoder
  $encoder.QualityLevel = $Quality
  $encoder.Frames.Add([System.Windows.Media.Imaging.BitmapFrame]::Create($rtb))

  $fs = [System.IO.File]::Create((Resolve-Path $dir).Path + "\" + (Split-Path $Out -Leaf))
  $encoder.Save($fs)
  $fs.Close()

  Write-Output ("OK {0} ({1} x {2} @ {3:G}s)" -f $Out, $w, $h, $AtSecond)
} finally {
  $player.Close()
}