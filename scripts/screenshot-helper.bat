@echo off
REM Screenshot Helper para Windows (WSL)
REM Abre as pastas corretas do projeto no Windows Explorer

echo.
echo ========================================
echo  Image Details - Screenshots Helper
echo ========================================
echo.

SET WSL_PATH=\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details

echo Escolha uma opcao:
echo.
echo 1 - Abrir pasta SCREENSHOTS
echo 2 - Abrir pasta MEDIA (para GIF)
echo 3 - Abrir pasta do PROJETO
echo 4 - Instalar ScreenToGif (via winget)
echo 5 - Instalar ShareX (via winget)
echo 6 - Instalar AMBOS (ScreenToGif + ShareX)
echo 0 - Sair
echo.
choice /C 1234560 /N /M "Digite o numero: "

if errorlevel 7 goto :exit
if errorlevel 6 goto :install_both
if errorlevel 5 goto :install_sharex
if errorlevel 4 goto :install_screentogif
if errorlevel 3 goto :open_project
if errorlevel 2 goto :open_media
if errorlevel 1 goto :open_screenshots

:open_screenshots
echo.
echo Abrindo pasta de screenshots...
explorer "%WSL_PATH%\media\screenshots"
goto :end

:open_media
echo.
echo Abrindo pasta media...
explorer "%WSL_PATH%\media"
goto :end

:open_project
echo.
echo Abrindo pasta do projeto...
explorer "%WSL_PATH%"
goto :end

:install_screentogif
echo.
echo Instalando ScreenToGif...
winget install NickeManarin.ScreenToGif
echo.
echo ScreenToGif instalado!
pause
goto :end

:install_sharex
echo.
echo Instalando ShareX...
winget install ShareX.ShareX
echo.
echo ShareX instalado!
pause
goto :end

:install_both
echo.
echo Instalando ScreenToGif e ShareX...
winget install NickeManarin.ScreenToGif
winget install ShareX.ShareX
echo.
echo Ferramentas instaladas!
pause
goto :end

:exit
echo.
echo Ate logo!
goto :eof

:end
echo.
echo ========================================
echo.
pause
