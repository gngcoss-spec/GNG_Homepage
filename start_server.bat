@echo off
REM GNG Homepage — 로컬 실행 (Vite 필요: TSX는 정적 서버로 실행할 수 없음)
cd /d "%~dp0"
if not exist node_modules (
  echo [1/2] npm install ...
  call npm install
)
echo [2/2] 개발 서버 시작 → http://localhost:5173
call npm run dev
