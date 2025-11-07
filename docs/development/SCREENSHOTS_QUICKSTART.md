# 🚀 Quick Start - Screenshots & GIF (Windows)

## ✅ Extensão Já Instalada

A extensão **Image Details v0.2.0** já está instalada no VS Code.

**Para usar:**

1. Reinicie o VS Code
2. Abra qualquer imagem
3. Extensão abre automaticamente!

---

## 📸 Windows: Screenshots & GIF

### 🛠️ Ferramentas Recomendadas

#### ScreenToGif (Para GIF Demo) ⭐⭐⭐

**Instalar via PowerShell:**

```powershell
winget install NickeManarin.ScreenToGif
```

**Ou baixar:** <https://www.screentogif.com/>

#### ShareX (Para Screenshots) ⭐⭐

**Instalar via PowerShell:**

```powershell
winget install ShareX.ShareX
```

**Ou baixar:** <https://getsharex.com/>

#### Nativo do Windows (Grátis já tem)

**Atalho:** `Win + Shift + S` (Snipping Tool)

---

## 🎯 Passos Rápidos

### 1. Instalar Ferramentas (Escolha uma)

>**Opção A: Script Automático**

```cmd
REM Executar no Windows (PowerShell ou CMD)
scripts\screenshot-helper.bat
```

>**Opção B: Manual via PowerShell (Admin)**

```powershell
winget install NickeManarin.ScreenToGif ShareX.ShareX
```

>**Opção C: Usar Windows nativo**

- Atalho `Win + Shift + S` (já tem!)

### 2. Configurar Pasta de Saída

>**Caminho WSL no Windows Explorer:**

```text
\\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media\screenshots
```

**Dica:** Criar atalho no Desktop ou Quick Access

### 3. Capturar Screenshots (5 necessários)

**Com Windows Nativo:**

1. `Win + Shift + S`
2. Selecionar área
3. Salvar em: `\\wsl$\Ubuntu\...\media\screenshots\`

**Com ShareX:**

1. Configurar hotkey e pasta
2. `Ctrl + Shift + 3`
3. Salva automaticamente!

**Screenshots necessários:**

- `main-view.png` - Interface completa
- `exif-data.png` - EXIF expandido
- `zoom-controls.png` - Controles zoom
- `remove-exif.png` - Botão remover
- `display-modes.png` - Toggle modos

### 4. Gravar GIF Demo (15-30s)

**Com ScreenToGif:**

1. Abrir ScreenToGif
2. Recorder > Posicionar sobre VS Code
3. FPS: 15-20
4. Record (F7) > Demonstrar > Stop (F8)
5. Editor: otimizar e salvar em `\\wsl$\Ubuntu\...\media\demo.gif`

### 5. Verificar no WSL

```bash
# No terminal WSL
cd /home/mauro/projects/vscode-ext_img-details

# Listar screenshots
ls -lh media/screenshots/

# Ver tamanho do GIF
ls -lh media/demo.gif
```

---

## 📋 Checklist

### Screenshots

- [ ] main-view.png
- [ ] exif-data.png
- [ ] zoom-controls.png
- [ ] remove-exif.png
- [ ] display-modes.png

### Demo GIF

- [ ] demo.gif (15-30s, < 5MB)

### Documentação

- [ ] Atualizar README.md
- [ ] Marcar TODO 7.2 e 7.3 como concluídos

---

## 🔗 Links Úteis

- **Documentação completa:** `docs/development/SCREENSHOTS_WINDOWS.md`
- **Guia Linux:** `docs/development/SCREENSHOTS_GUIDE.md`
- **ScreenToGif:** <https://www.screentogif.com/>
- **ShareX:** <https://getsharex.com/>

---

## 💡 Comandos Úteis

```bash
# Abrir pasta no Windows Explorer (do WSL)
explorer.exe media/screenshots/

# Listar arquivos
ls -lh media/screenshots/
ls -lh media/*.gif

# Ver tamanho
du -h media/demo.gif
```

```powershell
# PowerShell: Instalar ferramentas
winget install NickeManarin.ScreenToGif ShareX.ShareX

# Abrir pasta WSL
explorer \\wsl$\Ubuntu\home\mauro\projects\vscode-ext_img-details\media
```

---

**Pronto para capturar!** 📸🎬

Use `scripts/screenshot-helper.bat` para abrir pastas rapidamente no Windows!
