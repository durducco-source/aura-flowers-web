Add-Type -AssemblyName PresentationCore,WindowsBase
$src="C:\Users\JENIFFER\AppData\Local\Temp\claude\C--Users-JENIFFER-AppData-Roaming-Claude-scratch-workspaces-0117431c-6b5f-4b2d-8407-b1f900b64926-dff0334f-c269-42c0-951e-5f70f6ca6158-scratch-2026-09-30-4c372d\78675278-34e7-4f13-8a41-d44d1cc6e17a\images"
$root="C:\Users\JENIFFER\Downloads\aura-flowers-web\assets"
foreach($d in "brand","hero","historia","taller"){ New-Item -ItemType Directory -Force "$root\$d" | Out-Null }
function Load($n){ $s=[IO.File]::OpenRead("$src\$n"); $f=[Windows.Media.Imaging.BitmapDecoder]::Create($s,'None','OnLoad').Frames[0]; $s.Close(); return $f }
function SaveJpg($bmp,$path,$maxW,$q=82){
  if($bmp.PixelWidth -gt $maxW){ $sc=$maxW/$bmp.PixelWidth; $bmp=New-Object Windows.Media.Imaging.TransformedBitmap($bmp,(New-Object Windows.Media.ScaleTransform($sc,$sc))) }
  $e=New-Object Windows.Media.Imaging.JpegBitmapEncoder; $e.QualityLevel=$q; $e.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bmp))
  $fs=[IO.File]::Create($path); $e.Save($fs); $fs.Close(); "$path $($bmp.PixelWidth)x$($bmp.PixelHeight)" }
function Crop($bmp,$x,$y,$w,$h){ New-Object Windows.Media.Imaging.CroppedBitmap($bmp,(New-Object Windows.Int32Rect($x,$y,$w,$h))) }
$c1=Load "1.webp"
SaveJpg (Crop $c1 4 0 392 899) "$root\hero\buganvilla-panel.jpg" 400
SaveJpg (Crop $c1 404 0 392 899) "$root\hero\cattleya.jpg" 400
SaveJpg (Crop $c1 804 0 392 899) "$root\hero\phalaenopsis-cesta.jpg" 400
SaveJpg (Crop $c1 1204 0 395 899) "$root\hero\colgante-orquidea-fucsia.jpg" 400
$c5=Load "5.webp"
SaveJpg (Crop $c5 0 0 530 899) "$root\taller\taller-mesa.jpg" 600
SaveJpg (Crop $c5 537 0 528 899) "$root\taller\lampara-uv.jpg" 600
SaveJpg (Crop $c5 1070 0 529 899) "$root\taller\orquideas-estante.jpg" 600
SaveJpg (Load "7.webp") "$root\hero\buganvilla.jpg" 900
SaveJpg (Load "8.webp") "$root\hero\jardin-sonrisa.jpg" 900
SaveJpg (Load "9.webp") "$root\hero\jardin-espaldas.jpg" 900
SaveJpg (Load "6.webp") "$root\hero\hibisco-margarita.jpg" 904
SaveJpg (Load "2.webp") "$root\historia\boda-mama.jpg" 1000
SaveJpg (Crop (Load "3.webp") 0 0 1126 1330) "$root\historia\ramo-boda.jpg" 900
SaveJpg (Crop (Load "4.webp") 0 380 1126 1620) "$root\historia\nina-cesta-flores.jpg" 900

# ---- logo: cream background -> transparent ----
$logo=New-Object Windows.Media.Imaging.FormatConvertedBitmap((Load "10.webp"),[Windows.Media.PixelFormats]::Bgra32,$null,0)
$W=$logo.PixelWidth;$H=$logo.PixelHeight;$px=New-Object byte[] ($W*$H*4);$logo.CopyPixels($px,$W*4,0)
$bgB=$px[0];$minB=255;for($i=0;$i -lt $px.Length;$i+=4){ if($px[$i] -lt $minB){$minB=$px[$i]} }
"bgB=$bgB minB=$minB"
$alpha=New-Object double[] ($W*$H)
for($i=0;$i -lt $W*$H;$i++){ $a=($bgB-$px[$i*4])/($bgB-$minB)*1.15; if($a -lt 0.1){$a=0}; if($a -gt 1){$a=1}; $alpha[$i]=$a }
function SaveLogo($name,$r,$g,$b,$x0,$y0,$x1,$y1,$maxW){
  $w=$x1-$x0;$h=$y1-$y0;$o=New-Object byte[] ($w*$h*4)
  for($y=0;$y -lt $h;$y++){ for($x=0;$x -lt $w;$x++){ $a=$alpha[($y+$y0)*$W+$x+$x0]; $k=($y*$w+$x)*4; $o[$k]=[byte]($b*$a);$o[$k+1]=[byte]($g*$a);$o[$k+2]=[byte]($r*$a);$o[$k+3]=[byte](255*$a) } }
  $bmp=[Windows.Media.Imaging.BitmapSource]::Create($w,$h,96,96,[Windows.Media.PixelFormats]::Pbgra32,$null,$o,$w*4)
  if($w -gt $maxW){ $sc=$maxW/$w; $bmp=New-Object Windows.Media.Imaging.TransformedBitmap($bmp,(New-Object Windows.Media.ScaleTransform($sc,$sc))) }
  $e=New-Object Windows.Media.Imaging.PngBitmapEncoder;$e.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($bmp))
  $fs=[IO.File]::Create("$root\brand\$name");$e.Save($fs);$fs.Close(); "$name $($bmp.PixelWidth)x$($bmp.PixelHeight)" }
SaveLogo "aura-logo-dorado.png" 176 138 60 240 0 1360 1250 700
SaveLogo "aura-logo-marfil.png" 250 244 232 240 0 1360 1250 700
SaveLogo "aura-orquidea-dorado.png" 176 138 60 505 265 1095 815 300
SaveLogo "aura-orquidea-marfil.png" 250 244 232 505 265 1095 815 300
SaveLogo "aura-texto-dorado.png" 176 138 60 290 1000 1310 1225 600
SaveLogo "aura-texto-marfil.png" 250 244 232 290 1000 1310 1225 600
# original logo for OG / reference
SaveJpg (Load "10.webp") "$root\brand\aura-logo-original.jpg" 800 90
