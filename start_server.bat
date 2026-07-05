@echo off
REM ============================================================
REM GNG Homepage Redesign — 로컬 개발 서버 실행 스크립트
REM 우선순위: Python -> Node serve -> PowerShell
REM ============================================================
echo.
echo  GNG Homepage Redesign — Starting local server...
echo  ====================================================
cd /d "%~dp0"

REM ---- Try Python (most reliable on Windows) ----
where python >nul 2>nul
if %errorlevel%==0 (
    echo  [Python] http://localhost:5173 에서 시작합니다.
    start "" http://localhost:5173/
    python -m http.server 5173
    goto :eof
)

where py >nul 2>nul
if %errorlevel%==0 (
    echo  [Python via py] http://localhost:5173 에서 시작합니다.
    start "" http://localhost:5173/
    py -m http.server 5173
    goto :eof
)

REM ---- Try Node serve ----
where npx >nul 2>nul
if %errorlevel%==0 (
    echo  [Node serve] http://localhost:5173 에서 시작합니다.
    npx --yes serve . -l 5173
    goto :eof
)

REM ---- Fallback: PowerShell ----
echo  [PowerShell] http://localhost:5173 에서 시작합니다.
start "" http://localhost:5173/
powershell -NoProfile -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:5173/'); $listener.Start(); Write-Host 'Listening on http://localhost:5173/ — Ctrl+C to stop'; while ($listener.IsListening) { $context = $listener.GetContext(); $req = $context.Request; $res = $context.Response; $path = $req.Url.AbsolutePath; if ($path -eq '/') { $path = '/index.html' }; $file = (Get-Location).Path + $path.Replace('/', '\\'); if (Test-Path $file -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($file); $ext = [System.IO.Path]::GetExtension($file).ToLower(); switch ($ext) { '.html' { $res.ContentType = 'text/html; charset=utf-8' } '.css' { $res.ContentType = 'text/css' } '.js' { $res.ContentType = 'application/javascript' } '.tsx' { $res.ContentType = 'application/javascript' } '.ts' { $res.ContentType = 'application/javascript' } '.png' { $res.ContentType = 'image/png' } default { $res.ContentType = 'application/octet-stream' } }; $res.ContentLength64 = $bytes.Length; $res.OutputStream.Write($bytes, 0, $bytes.Length); } else { $res.StatusCode = 404; }; $res.OutputStream.Close(); }"
