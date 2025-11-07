# 📸 Guia de Screenshots e GIF no Windows (WSL)

Como você está usando WSL (Ubuntu no Windows), pode aproveitar as ferramentas nativas do Windows que são mais fáceis e poderosas!

---

## 🪟 Screenshots no Windows

### Método 1: Ferramenta de Captura (Snipping Tool) ⭐ RECOMENDADO

**Atalho:** `Win + Shift + S`

1. Pressione `Win + Shift + S`
2. A tela escurece e você pode selecionar a área
3. Captura vai para a área de transferência
4. Cole no Paint, PowerPoint ou save direto do popup
5. Salve em: `\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media\screenshots\`

**Vantagens:**

- ✅ Muito rápido
- ✅ Editor integrado
- ✅ Anotações e setas

### Método 2: Snip & Sketch (Ferramenta Completa)

**Como abrir:**

1. `Win + Shift + S` (captura)
2. Ou buscar "Snip & Sketch" no menu iniciar

**Recursos:**

- Delay timer (3s, 5s, 10s)
- Editor com marcações
- Régua e transferidor
- Salvar direto em formato PNG

### Método 3: ShareX (Ferramenta Profissional) ⭐⭐⭐

**Download:** <https://getsharex.com/> (GRÁTIS)

**Por que usar ShareX:**

- ✅ Captura de região com um clique
- ✅ Salva automaticamente na pasta configurada
- ✅ Editor embutido poderoso
- ✅ Captura scrolling (páginas longas)
- ✅ Grava GIF e vídeo
- ✅ Upload automático (opcional)

**Instalação:**

```powershell
# Via winget (Windows 10/11)
winget install ShareX.ShareX

# Ou baixar em: https://getsharex.com/
```

**Configuração inicial:**

1. Abrir ShareX
2. `Task Settings > Capture > General`:
   - Screenshot folder: `\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media\screenshots`
3. `Hotkey Settings`:
   - Capture region: `Ctrl + Shift + 3`
4. Pronto!

---

## 🎬 Demo GIF no Windows

### Método 1: ScreenToGif ⭐⭐⭐ MELHOR OPÇÃO

**Download:** <https://www.screentogif.com/> (GRÁTIS)

**Por que é o melhor:**

- ✅ Gravação suave e leve
- ✅ Editor integrado muito poderoso
- ✅ Otimização automática
- ✅ Preview frame-by-frame
- ✅ Fácil de usar
- ✅ Tamanho de arquivo pequeno

**Instalação:**

```powershell
# Via winget
winget install NickeManarin.ScreenToGif

# Ou via Chocolatey
choco install screentogif

# Ou baixar: https://www.screentogif.com/
```

**Como usar ScreenToGif:**

1. **Abrir ScreenToGif**
2. Escolher **"Recorder"**
3. **Posicionar a janela** sobre o VS Code
4. Ajustar **FPS: 15-20** (não precisa 60fps)
5. Clicar **"Record"** (ou F7)
6. **Fazer a demonstração** (15-30 segundos)
7. Clicar **"Stop"** (ou F8)
8. **Editor abre automaticamente:**
   - Delete frames desnecessários
   - Add texto/setas se quiser
   - Preview o resultado
9. **Salvar:**
   - File > Save As
   - Local: `\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media\demo.gif`
   - Encoder: ScreenToGif (otimizado)

**Dicas de Otimização no ScreenToGif:**

No editor, antes de salvar:

- `Image > Resize`: 1280x720 ou menor
- `Image > Reduce Frame Count`: Delete frames duplicados
- `Options > Save As > Encoder`: ScreenToGif (melhor compressão)

### Método 2: ShareX (Também grava GIF)

**Já tem ShareX instalado?** Ele também grava GIF!

**Como usar:**

1. ShareX > Capture > Screen recording (GIF)
2. Selecionar região
3. Gravar (15-30s)
4. Stop
5. Salva automaticamente

**Configurar pasta de saída:**

- `Task Settings > Capture > Screen recorder`
- Output folder: `\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media`

### Método 3: OBS Studio + Converter

Se você já usa OBS:

1. Gravar vídeo MP4
2. Converter para GIF com ffmpeg:

```bash
# No WSL
ffmpeg -i input.mp4 -vf "fps=15,scale=1280:-1:flags=lanczos" -c:v gif output.gif
```

---

## 📂 Acessar Pasta do WSL no Windows

### Via Explorador de Arquivos

Digite na barra de endereço:

```
\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media\screenshots
```

Ou simplesmente:

```
\\wsl$\Ubuntu
```

E navegue até a pasta.

### Via Terminal WSL

```bash
# Abrir pasta no Windows Explorer
explorer.exe .

# Abrir pasta específica
explorer.exe media/screenshots
```

### Criar Atalho

1. Abrir `\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media`
2. Clicar com direito > "Pin to Quick Access"
3. Ou arrastar para Desktop para criar atalho

---

## 🎯 Workflow Recomendado

### Para Screenshots

**Opção A: Rápido (Win + Shift + S)**

1. `Win + Shift + S`
2. Selecionar área
3. Clicar na notificação
4. Salvar em: `\\wsl$\Ubuntu\...\media\screenshots\`

**Opção B: Profissional (ShareX)**

1. `Ctrl + Shift + 3` (configurar hotkey)
2. Selecionar área
3. Salva automaticamente na pasta configurada!

### Para GIF Demo

**ScreenToGif (Recomendado):**

1. Abrir ScreenToGif
2. Recorder > Posicionar sobre VS Code
3. FPS: 15-20
4. Record (F7) > Demonstrar > Stop (F8)
5. Editor: otimizar e salvar
6. Resultado: GIF otimizado < 5MB

---

## 📋 Checklist com Ferramentas Windows

### Screenshots Necessários

- [ ] **main-view.png** - Interface completa
  - Ferramenta: `Win + Shift + S` ou ShareX
  - Tamanho: ~1920x1080 ou menor

- [ ] **exif-data.png** - EXIF expandido
  - Ferramenta: `Win + Shift + S`
  - Foco: Painel de metadados

- [ ] **zoom-controls.png** - Controles de zoom
  - Ferramenta: `Win + Shift + S`
  - Mostrar: Barra de zoom na parte inferior

- [ ] **remove-exif.png** - Botão remover
  - Ferramenta: `Win + Shift + S`
  - Foco: Thumbnail + botão

- [ ] **display-modes.png** - Modos de exibição
  - Ferramenta: `Win + Shift + S`
  - Foco: Toggle buttons

### Demo GIF

- [ ] **demo.gif** - Demonstração completa
  - Ferramenta: ScreenToGif
  - Duração: 15-30 segundos
  - FPS: 15-20
  - Tamanho: < 5MB
  - Resolução: 1280x720 ou menor

---

## 🛠️ Instalação Rápida (Windows)

### Via winget (Windows Terminal como Admin)

```powershell
# ShareX (screenshots e GIF)
winget install ShareX.ShareX

# ScreenToGif (melhor para GIF)
winget install NickeManarin.ScreenToGif
```

### Via Chocolatey

```powershell
# Instalar Chocolatey primeiro (se não tiver)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Instalar ferramentas
choco install sharex screentogif -y
```

### Download Manual

- **ShareX:** <https://getsharex.com/>
- **ScreenToGif:** <https://www.screentogif.com/>

---

## 💡 Dicas Importantes

### Screenshots

- Use **tema dark** no VS Code (mais popular)
- Janela **maximizada** mas não fullscreen
- **Zoom 100%** no VS Code (Ctrl+0)
- Capture com **boa resolução** (1920x1080 ideal)
- Formato **PNG** (melhor qualidade)

### GIF Demo

- **Duração:** 15-30 segundos (máximo)
- **FPS:** 15-20 (suficiente, não use 60fps)
- **Resolução:** 1280x720 ou 1024x768
- **Tamanho:** < 5MB (ideal < 3MB)
- **Movimentos suaves** (não apressado)
- **Pausas de 1-2s** entre ações

### Otimização

- ScreenToGif já otimiza automaticamente
- Se precisar reduzir mais:
  - Diminuir FPS (15 é bom)
  - Reduzir resolução (1024x768)
  - Deletar frames duplicados
  - Usar encoder ScreenToGif (não FFmpeg)

---

## 🎬 Roteiro Sugerido para Demo GIF

**Duração total: ~20 segundos**

1. **[0-3s]** Abrir imagem no VS Code
   - Mostrar extensão abrindo automaticamente

2. **[3-6s]** Scroll rápido no painel
   - Mostrar Basic Info, Color Info

3. **[6-10s]** Expandir EXIF Data
   - Mostrar camera, settings, GPS

4. **[10-14s]** Demonstrar zoom
   - Clicar em + (zoom in)
   - Clicar em fit to screen

5. **[14-17s]** Copiar um valor
   - Clicar em algum metadado
   - Mostrar notificação "Copied!"

6. **[17-20s]** Mostrar botão Remove EXIF
   - Scroll até topo
   - Destacar o botão (não precisa clicar)

---

## 🚀 Comandos Rápidos WSL

```bash
# Abrir pasta screenshots no Windows Explorer
cd /home/mauro/projects/vscode-ext_img-details/media/screenshots
explorer.exe .

# Abrir pasta do projeto
cd /home/mauro/projects/vscode-ext_img-details
explorer.exe .

# Verificar screenshots capturados
ls -lh media/screenshots/

# Verificar GIF
ls -lh media/*.gif
du -h media/*.gif  # Ver tamanho do arquivo
```

---

## ✅ Resumo Final

### Ferramentas Windows Recomendadas

1. **Screenshots:** ShareX ou `Win + Shift + S`
2. **Demo GIF:** ScreenToGif (melhor opção!)
3. **Editor:** ScreenToGif tem editor integrado excelente

### Passos

1. Instalar ScreenToGif e/ou ShareX
2. Configurar pasta de saída: `\\wsl$\Ubuntu\...\media\screenshots`
3. Abrir imagem no VS Code (extensão já instalada)
4. Capturar 5 screenshots
5. Gravar 1 GIF demo (15-30s)
6. Otimizar e salvar
7. Verificar no WSL: `ls media/screenshots/`

**Pronto para capturar!** 📸🎬
