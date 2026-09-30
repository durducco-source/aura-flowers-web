Add-Type -AssemblyName PresentationCore,WindowsBase
$r="C:\Users\JENIFFER\Downloads\aura-flowers-web\assets"
function Img($p){ $b=New-Object Windows.Media.Imaging.BitmapImage;$b.BeginInit();$b.UriSource=[Uri]$p;$b.CacheOption='OnLoad';$b.EndInit();$b }
function Save($rtb,$path,$png){ if($png){$e=New-Object Windows.Media.Imaging.PngBitmapEncoder}else{$e=New-Object Windows.Media.Imaging.JpegBitmapEncoder;$e.QualityLevel=88}; $e.Frames.Add([Windows.Media.Imaging.BitmapFrame]::Create($rtb)); $fs=[IO.File]::Create($path);$e.Save($fs);$fs.Close() }
$ivory=(New-Object Windows.Media.BrushConverter).ConvertFromString("#F8F4ED")
# OG 1200x630
$dv=New-Object Windows.Media.DrawingVisual;$dc=$dv.RenderOpen()
$dc.DrawRectangle($ivory,$null,(New-Object Windows.Rect 0,0,1200,630))
$logo=Img "$r\brand\aura-logo-dorado.png"; $lw=300; $lh=$lw*$logo.PixelHeight/$logo.PixelWidth
$dc.DrawImage($logo,(New-Object Windows.Rect (300-$lw/2),((630-$lh)/2),$lw,$lh))
$ph=Img "$r\aura\collar-orquidea.jpg"
$dc.PushClip((New-Object Windows.Media.RectangleGeometry (New-Object Windows.Rect 640,0,560,630)))
$dc.DrawImage($ph,(New-Object Windows.Rect 605,0,630,630)); $dc.Pop()
$dc.Close();$rtb=New-Object Windows.Media.Imaging.RenderTargetBitmap(1200,630,96,96,[Windows.Media.PixelFormats]::Pbgra32);$rtb.Render($dv)
Save $rtb "$r\brand\og-image.jpg" $false
# apple touch 180
$dv=New-Object Windows.Media.DrawingVisual;$dc=$dv.RenderOpen()
$dc.DrawRectangle($ivory,$null,(New-Object Windows.Rect 0,0,180,180))
$o=Img "$r\brand\favicon-512.png"; $dc.DrawImage($o,(New-Object Windows.Rect 22,22,136,136)); $dc.Close()
$rtb=New-Object Windows.Media.Imaging.RenderTargetBitmap(180,180,96,96,[Windows.Media.PixelFormats]::Pbgra32);$rtb.Render($dv)
Save $rtb "$r\brand\apple-touch-icon.png" $true
"ok"
