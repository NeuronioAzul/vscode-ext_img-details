#!/bin/bash

# Screenshot Helper Script for Image Details Extension
# Ajuda a capturar screenshots de forma padronizada

SCREENSHOTS_DIR="media/screenshots"
DEMO_DIR="media"

echo "📸 Image Details Extension - Screenshot Helper"
echo "=============================================="
echo ""

# Criar diretórios se não existirem
mkdir -p "$SCREENSHOTS_DIR"
mkdir -p "$DEMO_DIR"

echo "📁 Pastas criadas/verificadas:"
echo "   - $SCREENSHOTS_DIR"
echo "   - $DEMO_DIR"
echo ""

# Verificar ferramentas instaladas
echo "🔍 Verificando ferramentas instaladas..."
echo ""

# Verificar gnome-screenshot
if command -v gnome-screenshot &> /dev/null; then
    echo "✅ gnome-screenshot - Instalado"
    HAS_GNOME=true
else
    echo "❌ gnome-screenshot - Não instalado"
    echo "   Instalar: sudo apt install gnome-screenshot"
    HAS_GNOME=false
fi

# Verificar Peek (para GIF)
if command -v peek &> /dev/null; then
    echo "✅ peek - Instalado (para GIF)"
    HAS_PEEK=true
else
    echo "❌ peek - Não instalado"
    echo "   Instalar: sudo apt install peek"
    HAS_PEEK=false
fi

# Verificar gifsicle (otimização)
if command -v gifsicle &> /dev/null; then
    echo "✅ gifsicle - Instalado (otimizar GIF)"
    HAS_GIFSICLE=true
else
    echo "❌ gifsicle - Não instalado"
    echo "   Instalar: sudo apt install gifsicle"
    HAS_GIFSICLE=false
fi

echo ""
echo "📋 Screenshots Necessários:"
echo ""
echo "1. main-view.png       - Interface completa"
echo "2. exif-data.png       - Seção EXIF expandida"
echo "3. zoom-controls.png   - Controles de zoom"
echo "4. remove-exif.png     - Botão remover EXIF"
echo "5. display-modes.png   - Modos de exibição"
echo ""

# Menu interativo
while true; do
    echo "=============================================="
    echo "O que você quer fazer?"
    echo ""
    echo "1) Capturar screenshot (gnome-screenshot)"
    echo "2) Gravar demo GIF (Peek)"
    echo "3) Otimizar GIF existente"
    echo "4) Listar screenshots capturados"
    echo "5) Abrir pasta de screenshots"
    echo "6) Instalar ferramentas faltando"
    echo "0) Sair"
    echo ""
    read -p "Escolha uma opção: " choice

    case $choice in
        1)
            if [ "$HAS_GNOME" = true ]; then
                echo ""
                echo "Nome do screenshot (sem extensão):"
                echo "Sugestões: main-view, exif-data, zoom-controls, remove-exif, display-modes"
                read -p "Nome: " filename
                
                if [ -z "$filename" ]; then
                    echo "❌ Nome vazio, cancelado."
                else
                    echo "Preparando screenshot em 3 segundos..."
                    echo "Posicione a janela do VS Code!"
                    sleep 3
                    gnome-screenshot -a -f "$SCREENSHOTS_DIR/${filename}.png"
                    
                    if [ -f "$SCREENSHOTS_DIR/${filename}.png" ]; then
                        echo "✅ Screenshot salvo: $SCREENSHOTS_DIR/${filename}.png"
                        du -h "$SCREENSHOTS_DIR/${filename}.png"
                    fi
                fi
            else
                echo "❌ gnome-screenshot não está instalado!"
            fi
            echo ""
            ;;
            
        2)
            if [ "$HAS_PEEK" = true ]; then
                echo ""
                echo "🎬 Abrindo Peek para gravação de GIF..."
                echo ""
                echo "Dicas:"
                echo "- Duração: 15-30 segundos"
                echo "- FPS: 15-20"
                echo "- Salve como: $DEMO_DIR/demo.gif"
                echo ""
                peek &
            else
                echo "❌ Peek não está instalado!"
                echo "Instale com: sudo apt install peek"
            fi
            echo ""
            ;;
            
        3)
            echo ""
            ls -lh "$DEMO_DIR"/*.gif 2>/dev/null
            if [ $? -eq 0 ]; then
                echo ""
                read -p "Nome do arquivo GIF (ex: demo.gif): " gifname
                
                if [ -f "$DEMO_DIR/$gifname" ]; then
                    if [ "$HAS_GIFSICLE" = true ]; then
                        echo "Otimizando $gifname..."
                        output="${gifname%.gif}-optimized.gif"
                        gifsicle -O3 --colors 256 "$DEMO_DIR/$gifname" -o "$DEMO_DIR/$output"
                        
                        echo ""
                        echo "📊 Comparação:"
                        echo "Original:"
                        du -h "$DEMO_DIR/$gifname"
                        echo "Otimizado:"
                        du -h "$DEMO_DIR/$output"
                    else
                        echo "❌ gifsicle não está instalado!"
                    fi
                else
                    echo "❌ Arquivo não encontrado: $DEMO_DIR/$gifname"
                fi
            else
                echo "Nenhum arquivo GIF encontrado em $DEMO_DIR/"
            fi
            echo ""
            ;;
            
        4)
            echo ""
            echo "📸 Screenshots capturados:"
            echo ""
            ls -lh "$SCREENSHOTS_DIR"/*.png 2>/dev/null || echo "Nenhum screenshot encontrado ainda."
            echo ""
            ;;
            
        5)
            xdg-open "$SCREENSHOTS_DIR" 2>/dev/null || nautilus "$SCREENSHOTS_DIR" 2>/dev/null || echo "Pasta: $(pwd)/$SCREENSHOTS_DIR"
            ;;
            
        6)
            echo ""
            echo "📦 Instalando ferramentas..."
            echo ""
            sudo apt update
            sudo apt install -y gnome-screenshot peek gifsicle
            echo ""
            echo "✅ Instalação concluída! Reinicie o script."
            exit 0
            ;;
            
        0)
            echo "👋 Até logo!"
            exit 0
            ;;
            
        *)
            echo "❌ Opção inválida!"
            ;;
    esac
done
