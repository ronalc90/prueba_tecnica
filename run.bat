@echo off
cls

echo ========================================
echo   Sports Shop - Inicio Automatico
echo ========================================
echo.

docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta instalado
    echo.
    echo Instale Docker Desktop desde:
    echo https://www.docker.com/products/docker-desktop
    echo.
    pause
    exit /b 1
)

docker ps >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo
    echo.
    echo Inicie Docker Desktop y ejecute este script nuevamente
    echo.
    pause
    exit /b 1
)

echo [1/6] Instalando dependencias del backend...
cd backend
if not exist "node_modules" (
    call npm install >nul 2>&1
)

echo [2/6] Instalando dependencias del frontend...
cd ..\frontend
if not exist "node_modules" (
    call npm install >nul 2>&1
)

echo [3/6] Iniciando servicios Docker...
cd ..
docker-compose up -d >nul 2>&1

echo [4/6] Esperando servicios...
timeout /t 10 /nobreak >nul

echo [5/6] Creando tablas en DynamoDB...
cd backend
call npm run create-tables

echo [5.5/6] Poblando base de datos...
call npm run seed

echo [6/6] Iniciando aplicacion...
echo.
echo ========================================
echo   Servicios Listos
echo ========================================
echo.
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo Presione cualquier tecla para abrir el navegador
echo y luego inicie el backend y frontend manualmente
echo.
pause

start http://localhost:5173

echo.
echo Ejecute en terminales separadas:
echo.
echo Terminal 1: cd backend ^&^& npm start
echo Terminal 2: cd frontend ^&^& npm run dev
echo.
pause
