Add-Type -AssemblyName PresentationCore,WindowsBase,System.Xaml
Add-Type -ReferencedAssemblies PresentationCore,WindowsBase,System.Xaml,System.Core -Path "C:\Users\JENIFFER\AppData\Local\Temp\claude\aw\AdGen.cs"

function C($id,$img,$kick,$plain,$ital,$sub,$cta,$fx,$fy,$full){ $c=New-Object Concept; $c.Id=$id;$c.Img=$img;$c.Kicker=$kick;$c.Plain=$plain;$c.Italic=$ital;$c.Sub=$sub;$c.Cta=$cta;$c.Fx=$fx;$c.Fy=$fy;$c.Full=$full; $c }
$concepts=@(
 (C "orquidea" "assets/aura/collar-orquidea.jpg" "PIEZA ÚNICA · HECHA A MANO" "Una orquídea real," "para siempre." "Flores naturales preservadas en joyas únicas." "Descúbrela" 0.5 0.55 $false),
 (C "fucsia" "assets/hero/colgante-orquidea-fucsia.jpg" "NUEVA PIEZA" "El color de" "la buganvilla." "Colgante de orquídea natural · Pieza única" "Ver la pieza" 0.5 0.62 $false),
 (C "amanda" "assets/hero/buganvilla.jpg" "AURA FLOWERS" "Flores naturales, convertidas en" "joyas eternas." "Hechas a mano en Lloret de Mar" "Comprar ahora" 0.45 0.3 $true),
 (C "regalo" "assets/ig/ig-10.jpg" "EL REGALO PERFECTO" "No regalas una flor." "Regalas un recuerdo." "Lista para regalar · Cada pieza es única" "Elegir regalo" 0.5 0.5 $false),
 (C "a-medida" "assets/aura/orquidea-fucsia.jpg" "PIEZAS A MEDIDA" "¿Tu ramo de novia," "convertido en joya?" "Conservamos tus flores para siempre." "Cuéntanos tu historia" 0.5 0.4 $false)
)
$formats=@( @("feed-4x5",1080,1350), @("story-9x16",1080,1920), @("cuadrado-1x1",1080,1080), @("horizontal-1200x628",1200,628), @("pinterest-2x3",1000,1500) )
foreach($c in $concepts){ foreach($f in $formats){ [Ads]::Render($c,$f[1],$f[2],"anuncios\creatividades\$($c.Id)-$($f[0]).jpg") } }
[Ads]::Logos()
"done"
