$root = $PSScriptRoot
$port = 5173
$l = New-Object System.Net.HttpListener
$l.Prefixes.Add("http://localhost:$port/")
$l.Start()
$mime = @{ '.html'='text/html; charset=utf-8'; '.css'='text/css'; '.js'='text/javascript'; '.svg'='image/svg+xml'; '.jpg'='image/jpeg'; '.jpeg'='image/jpeg'; '.png'='image/png'; '.webp'='image/webp'; '.avif'='image/avif'; '.mp4'='video/mp4'; '.json'='application/json' }
while ($l.IsListening) {
  $c = $l.GetContext()
  try {
    $p = [Uri]::UnescapeDataString($c.Request.Url.AbsolutePath.TrimStart('/'))
    if ($c.Request.HttpMethod -eq 'PUT' -and $p -like 'assets/aura/*' -and $p -notlike '*..*') {
      $f = Join-Path $root $p
      $fs = [IO.File]::Create($f); $c.Request.InputStream.CopyTo($fs); $fs.Close()
      $c.Response.StatusCode = 201
    } else {
      if ($p -eq '') { $p = 'index.html' }
      $f = Join-Path $root $p
      if (Test-Path $f -PathType Leaf) {
        $ext = [IO.Path]::GetExtension($f).ToLower()
        $c.Response.ContentType = $(if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' })
        $b = [IO.File]::ReadAllBytes($f)
        $c.Response.OutputStream.Write($b, 0, $b.Length)
      } else { $c.Response.StatusCode = 404 }
    }
  } catch { $c.Response.StatusCode = 500 }
  $c.Response.Close()
}
