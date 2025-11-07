# 📸 Guia de Screenshots e Demo GIF

## ✅ Extensão Instalada

A extensão já está instalada no seu VS Code. Agora vamos capturar os materiais para publicação.

---

## 📸 Tirando Screenshots

### Preparação

1. **Reinicie o VS Code** para garantir que a extensão está ativa
2. **Abra uma imagem** no VS Code (use as imagens em `test-images/`)
3. A extensão deve abrir automaticamente

### Screenshots Necessários

#### 1. **Screenshot Principal** (Main Feature)

- **Arquivo:** `media/screenshots/main-view.png`
- **Conteúdo:** Interface completa mostrando:
  - Imagem à esquerda
  - Painel de metadados à direita
  - Seção "Basic Information" expandida
- **Como tirar:**
  - Abra uma imagem com EXIF (ex: `test-images/happyboy.png`)
  - Ajuste o VS Code para tela cheia ou boa resolução
  - Use ferramenta de screenshot do sistema
  - **Linux:** `Shift + PrtSc` ou `gnome-screenshot -a`

#### 2. **EXIF Data** (Feature Highlight)

- **Arquivo:** `media/screenshots/exif-data.png`
- **Conteúdo:** Seção EXIF expandida mostrando:
  - Camera information
  - Photo settings (ISO, aperture, etc.)
  - GPS data (se disponível)
- **Como tirar:**
  - Expanda a seção "EXIF Data"
  - Capture o painel de metadados

#### 3. **Zoom Controls** (Feature Highlight)

- **Arquivo:** `media/screenshots/zoom-controls.png`
- **Conteúdo:**
  - Imagem com zoom aplicado
  - Barra de controles de zoom visível na parte inferior
- **Como tirar:**
  - Use os controles de zoom (+, -, fit)
  - Capture com a barra de zoom visível

#### 4. **Remove EXIF Feature**

- **Arquivo:** `media/screenshots/remove-exif.png`
- **Conteúdo:**
  - Botão "Remove EXIF Data" visível
  - Seção EXIF expandida acima
- **Como tirar:**
  - Role até o topo do painel de metadados
  - Mostre o thumbnail e botão de remoção

#### 5. **Display Modes** (Accordion vs List)

- **Arquivo:** `media/screenshots/display-modes.png`
- **Conteúdo:**
  - Toggle de modo de exibição
  - Demonstração de accordion mode
- **Como tirar:**
  - Capture a área dos botões de modo

### Comandos para Screenshots no Linux

```bash
# Screenshot de área selecionada (interativo)
gnome-screenshot -a -f media/screenshots/nome-do-arquivo.png

# Ou use a ferramenta nativa do seu ambiente
# KDE: Spectacle
# GNOME: Screenshot
```

---

## 🎬 Criando Demo GIF

### Ferramentas Recomendadas

#### Opção 1: Peek (Linux - Mais Fácil) ⭐ RECOMENDADO

```bash
# Instalar Peek
sudo apt install peek

# Usar:
# 1. Abra Peek
# 2. Posicione a janela de gravação sobre o VS Code
# 3. Clique em "Record"
# 4. Faça a demonstração (max 30 segundos)
# 5. Clique em "Stop"
# 6. Salve como GIF
```

#### Opção 2: byzanz (Linux - Linha de Comando)

```bash
# Instalar
sudo apt install byzanz

# Gravar área específica (10 segundos)
byzanz-record --duration=10 --x=0 --y=0 --width=1920 --height=1080 media/demo.gif

# Gravar com delay de 5 segundos para você preparar
byzanz-record --delay=5 --duration=15 media/demo.gif
```

#### Opção 3: ScreenToGif (Windows/Wine)

```bash
# Se estiver no WSL, pode usar ferramentas do Windows
# ScreenToGif é excelente: https://www.screentogif.com/
```

### 📝 Roteiro para Demo GIF (15-30 segundos)

**Sequência sugerida:**

1. **[0-3s]** Abrir uma imagem no VS Code
   - Mostrar que a extensão abre automaticamente

2. **[3-6s]** Scroll pelo painel de metadados
   - Mostrar informações básicas
   - Passar rapidamente pelas seções

3. **[6-10s]** Expandir seção EXIF
   - Mostrar dados da câmera
   - Mostrar configurações da foto

4. **[10-14s]** Demonstrar zoom
   - Clicar em zoom in (+)
   - Clicar em fit to screen

5. **[14-17s]** Copiar um valor
   - Clicar em um metadado
   - Mostrar notificação "Copied!"

6. **[17-20s]** Mostrar botão Remove EXIF
   - Scroll até o topo
   - Destacar o botão (não precisa clicar)

### Configurações Recomendadas para GIF

- **Duração:** 15-30 segundos (máximo)
- **FPS:** 15-20 (não precisa 60fps)
- **Resolução:** 1280x720 ou menor
- **Tamanho do arquivo:** < 5MB (ideal < 3MB)
- **Loop:** Sim (infinito)

### Otimizar GIF Após Criação

```bash
# Instalar gifsicle
sudo apt install gifsicle

# Otimizar GIF (reduzir tamanho)
gifsicle -O3 --colors 256 media/demo.gif -o media/demo-optimized.gif

# Redimensionar se muito grande
gifsicle --resize-width 800 media/demo.gif -o media/demo-small.gif
```

---

## 📁 Estrutura de Pastas para Mídia

```bash
# Criar pasta para screenshots
mkdir -p media/screenshots

# Estrutura esperada:
media/
├── screenshots/
│   ├── main-view.png          # Screenshot principal
│   ├── exif-data.png          # Seção EXIF
│   ├── zoom-controls.png      # Controles de zoom
│   ├── remove-exif.png        # Botão remover EXIF
│   └── display-modes.png      # Modos de exibição
├── demo.gif                    # GIF animado principal
└── icon-*.png                 # Ícones (já existem)
```

---

## ✅ Checklist de Conclusão

### Screenshots

- [ ] Main view (interface completa)
- [ ] EXIF data expandida
- [ ] Zoom controls em ação
- [ ] Remove EXIF button
- [ ] Display modes toggle

### Demo GIF

- [ ] GIF gravado (15-30s)
- [ ] GIF otimizado (< 5MB)
- [ ] GIF testado (reproduz corretamente)

### Atualizar README

- [ ] Adicionar seção de screenshots
- [ ] Embedar GIF demo
- [ ] Testar visualização no GitHub

---

## 🎯 Próximos Passos

Após capturar os screenshots e GIF:

1. Salvar na pasta `media/`
2. Atualizar README.md com as imagens
3. Commitar no git
4. Verificar no GitHub se está exibindo bem
5. Marcar TODO 7.2 e 7.3 como concluídos

---

## 💡 Dicas

- **Use tema dark** para screenshots (mais popular)
- **Janela maximizada** mas não tela cheia (para ver bordas do VS Code)
- **Zoom 100%** no VS Code (não use zoom de acessibilidade)
- **Cursor visível** durante gravação do GIF
- **Movimentos suaves** (não apressado)
- **Pausas de 1-2s** entre ações no GIF

---

## 🚀 Comandos Rápidos

```bash
# Criar pasta de screenshots
mkdir -p media/screenshots

# Screenshot com Peek (recomendado)
peek

# Screenshot com gnome
gnome-screenshot -a -f media/screenshots/screenshot.png

# Otimizar GIF
gifsicle -O3 --colors 256 input.gif -o output.gif

# Verificar tamanho do GIF
du -h media/demo.gif
```

Boa sorte com as capturas! 📸🎬
