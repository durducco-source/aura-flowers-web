param([string]$Root="C:\Users\JENIFFER\Downloads\aura-flowers-web",[int]$Port=8765)
$l=New-Object Net.HttpListener; $l.Prefixes.Add("http://localhost:$Port/"); $l.Start(); Write-Host "Serving $Root on http://localhost:$Port/"
$types=@{".html"="text/html; charset=utf-8";".css"="text/css";".js"="application/javascript; charset=utf-8";".jpg"="image/jpeg";".png"="image/png";".svg"="image/svg+xml";".xml"="application/xml";".txt"="text/plain";".json"="application/json";".webp"="image/webp";".mp3"="audio/mpeg";".m4a"="audio/mp4";".mp4"="video/mp4";".md"="text/plain; charset=utf-8"}
while($l.IsListening){ $c=$l.GetContext(); try{
 $p=[Uri]::UnescapeDataString($c.Request.Url.AbsolutePath).TrimStart('/'); if($p -eq ''){$p='index.html'}
 if($c.Request.HttpMethod -eq 'PUT' -and $p -match '^__save/((anuncios/reels|assets/video)/[a-z0-9-]+\.(mp4|jpg|m4a))$'){
   $dest=Join-Path $Root $matches[1]; New-Item -ItemType Directory -Force (Split-Path $dest) | Out-Null
   $fs=[IO.File]::Create($dest); $c.Request.InputStream.CopyTo($fs); $fs.Close(); $c.Response.StatusCode=200; continue }
 $f=Join-Path $Root $p; if(Test-Path $f -PathType Container){$f=Join-Path $f 'index.html'}
 if(Test-Path $f -PathType Leaf){ $b=[IO.File]::ReadAllBytes($f); $e=[IO.Path]::GetExtension($f).ToLower(); $c.Response.ContentType=$types[$e]; $c.Response.Headers.Add("Cache-Control","no-store"); $c.Response.OutputStream.Write($b,0,$b.Length) }
 else { $c.Response.StatusCode=404; $b=[IO.File]::ReadAllBytes((Join-Path $Root '404.html')); $c.Response.ContentType="text/html; charset=utf-8"; $c.Response.OutputStream.Write($b,0,$b.Length) }
 } catch {} finally { $c.Response.Close() } }
