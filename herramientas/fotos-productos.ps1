Add-Type -AssemblyName PresentationCore,WindowsBase
$src="C:\Users\JENIFFER\AppData\Local\Temp\claude\C--Users-JENIFFER-AppData-Roaming-Claude-scratch-workspaces-0117431c-6b5f-4b2d-8407-b1f900b64926-dff0334f-c269-42c0-951e-5f70f6ca6158-scratch-2026-09-30-4c372d\78675278-34e7-4f13-8a41-d44d1cc6e17a\images"
$out="C:\Users\JENIFFER\Downloads\aura-flowers-web\assets\productos"; New-Item -ItemType Directory -Force $out | Out-Null
$map=@{ "11.webp"="colgante-buganvilla"; "12.webp"="collar-rosa-eterna"; "13.webp"="collar-orquidea-burdeos"; "14.webp"="collar-narciso"; "15.webp"="caja-regalo-2"; "16.webp"="orquidea-salon"; "17.webp"="colgante-narciso-libelula"; "18.webp"="conjunto-orquidea-burdeos"; "19.webp"="orquideas-burdeos-resina"; "20.webp"="caja-regalo"; "21.webp"="anillos-perla-granate"; "22.png"="pendientes-jardin-azul"; "23.webp"="anillo-cielo-azul"; "24.webp"="colgante-orquidea-fucsia" }
foreach($k in $map.Keys){ $s=[IO.File]::OpenRead("$src\$k"); $f=[Windows.Media.Imaging.BitmapDecoder]::Create($s,'None','OnLoad').Frames[0]; $s.Close()
 $b=$f; if($f.PixelWidth -gt 1080){ $sc=1080/$f.PixelWidth; $b=New-Object Windows.Media.Imaging.TransformedBitmap($f,(New-Object Windows.Media.ScaleTransform($sc,$sc))) }
 $e=New-Object Windows.Media.Imaging.JpegBitmapEncoder; $e.QualityLevel=84; $e.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($b)); $p="$out\$($map[$k]).jpg"; $fs=[IO.File]::Create($p); $e.Save($fs); $fs.Close()
 "{0} {1}x{2} -> {3}x{4} {5}KB" -f $k,$f.PixelWidth,$f.PixelHeight,$b.PixelWidth,$b.PixelHeight,[math]::Round((Get-Item $p).Length/1KB) }
