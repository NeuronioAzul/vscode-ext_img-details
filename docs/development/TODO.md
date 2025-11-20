# TODO - Image Details Extension

## 🔧 Melhorias Planejadas

### 1. Limpeza de Código

- [x] 1.1 Remover logs de debug (`console.log`) dos arquivos de produção
- [x] 1.2 Otimizar imports e dependências não utilizadas
- [x] 1.3 Adicionar tratamento de erros mais robusto
- [x] 1.4 Validação de tipos para dados EXIF
- [x] 1.5 Página de erro amigável para falhas no carregamento

### 2. Metadados Expandidos

- [x] 2.1 Adicionar suporte a EXIF data para fotos
  - [x] 2.1.1 Dados da câmera (modelo, marca)
  - [x] 2.1.2 Configurações da foto (ISO, abertura, velocidade)
  - [x] 2.1.3 Data/hora da captura
  - [x] 2.1.4 Informações de GPS (se disponível)
- [x] 2.2 Informações de cor
  - [x] 2.2.1 Color depth (profundidade de cor)
  - [x] 2.2.2 Has transparency (tem transparência)
  - [x] 2.2.3 Color space (espaço de cores) - Disponível via EXIF
- [x] 2.3 Informações técnicas
  - [ ] 2.3.1 Compression type/quality
  - [x] 2.3.2 DPI/PPI information
  - [x] 2.3.3 Bit depth melhorado com dados EXIF (BitsPerSample, SamplesPerPixel)
- [x] 2.4 Ferramentas de edição de metadados
  - [x] 2.4.1 Remover dados EXIF com backup automático
  - [x] 2.4.2 Suporte para JPEG/JPG e PNG
  - [x] 2.4.3 Confirmação antes de remover
  - [x] 2.4.4 Restauração automática em caso de erro
- [x] 2.5 Adicionar visualização dos metadados EXIF completos
  - [x] 2.5.1 Image Description
  - [x] 2.5.2 Camera Info (Make, Model, Owner)
  - [x] 2.5.3 Lens Info (Make, Model, Serial Number)
  - [x] 2.5.4 Photo Settings completos (ISO, Aperture, Shutter Speed, Focal Length, Exposure, Metering, Flash, White Balance, Components, User Comment)
  - [x] 2.5.5 Date/Time Info (Date Taken, Create Date, Modify Date)
  - [x] 2.5.6 GPS Info completo (Version ID, Latitude/Longitude, Altitude, Time/Date Stamps, Satellites, Status, Measure Mode, DOP, Speed, Track, Image Direction, Map Datum, Destination, Differential)
  - [x] 2.5.7 Image Technical Info (Compression, Orientation, Resolution, Color Space, YCbCr, Software, Artist, Copyright, EXIF/Flashpix/Interop Versions)
- [x] 2.6 Adicionar botão para exibir todos os metadados em formato JSON
  - [x] 2.6.1 Botão "View as JSON" no painel de metadados
  - [x] 2.6.2 Modal com JSON formatado
  - [x] 2.6.3 Funcionalidade de copiar JSON completo
  - [x] 2.6.4 Traduções em inglês e português
  - [x] 2.6.5 Estilos responsivos para o modal

### 3. Interface e UX

- [x] 3.1 Adicionar samfona na seção de metadados para melhor organização (colapsável)padrão: sempre expandido
  - [x] 3.1.1 O primeiro item da samfona deve estar aberto por padrão, os outros fechados
  - [x] 3.1.2 Adicionar animação ao abrir/fechar a samfona
  - [x] 3.1.3 Salvar estado (expandido/colapsado) entre sessões
  - [x] 3.1.4 Permitir usuário escolher se quer samfona ou lista simples nas configurações
- [x] 3.2 Adicionar tradução para múltiplos idiomas (i18n) pelo menos para inglês e português do Brasil
- [x] 3.3 a coluna de metadados deve ser "sticky" a direita ao rolar a página, mas pode redimensionar horizontalmente
- [x] 3.4 Ao clicar no arquivo de imagem abrir o visualizador da extensão por padrão
- [x] 3.5 Adicionar opção no menu de contexto "Open with Image Details Viewer"
- [x] 3.6 Melhorar tema dark/light responsivo
- [x] 3.7 Adicionar ícones para cada tipo de metadado
- [x] 3.8 Implementar botões de copy mais visuais
- [x] 3.9 Adicionar tooltip "Click to copy" nos valores
- [x] 3.10 Implementar feedback visual ao copiar (animação/highlight)
- [x] 3.11 Adicionar preview de thumbnail na lista de metadados
- [x] 3.12 Implementar zoom in and out na imagem principal
  - [x] 3.12.1 Controles de zoom (+, -, reset, fit)
  - [x] 3.12.2 Zoom com mouse wheel (Ctrl+Scroll)
  - [x] 3.12.3 Click para alternar zoom
  - [x] 3.12.4 Atalhos de teclado (+, -, 0)

### 4. Suporte a Mais Formatos

### 5. Configurações

- [ ] 5.1 Permitir usuário escolher quais metadados exibir
- [ ] 5.2 Permitir usuário escolher qual quer usar: (Sanfona, sempre expandido ou sempre colapsado)
- [ ] 5.3 Configurar formato de data/hora (padrão: detectar local automaticamente e define) mas permite selecionar outro formato
- [ ] 5.4 Opções de unidades (bytes vs KB/MB) (padrão KB/MB/GB/etc)

### 6. Performance

- [ ] 6.1 Lazy loading para imagens grandes

### 7. Publicação

- [x] 7.1 Criar ícone oficial da extensão (icon.png 128x128px)
- [x] 7.2 Otimizar README.md com screenshots
- [x] 7.3 Adicionar demo GIF
- [ ] 7.4 Configurar CI/CD para builds automáticos
- [x] 7.5 Preparar para publicação no VS Code Marketplace
- [x] 7.6 Criar changelog estruturado
- [x] 7.7 Adicionar licença apropriada MIT
- [x] 7.8 Melhorar README.md com badges e seções
- [x] 7.9 Adicionar keywords ao package.json
- [x] 7.10 Configurar repository e bugs URL
- [ ] 7.11 Adicionar funding links (GitHub Sponsors)
- [x] 7.12 Botão para doação
  - [x] 7.12.1 no README.md
    - [x] Adicionar seção "Apoie o projeto"
    - [x] PayPal link and button
    - [x] Buy me a coffee link and button
    - [x] GitHub Sponsors badge
  - [x] 7.12.2 no painel da extensão
    - [x] Botão "Buy Me A Coffee" no final do painel de metadados
    - [x] Estilo responsivo com hover effect
  - [ ] 7.12.3 na página da extensão no marketplace
```html
<form action="https://www.paypal.com/donate" method="post" target="_top">
<input type="hidden" name="hosted_button_id" value="QNEHQ5LAF64G2" />
<input type="image" src="https://www.paypalobjects.com/pt_BR/BR/i/btn/btn_donateCC_LG.gif" border="0" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Faça doações com o botão do PayPal" />
<img alt="" border="0" src="https://www.paypal.com/pt_BR/i/scr/pixel.gif" width="1" height="1" />
</form>
```
    - [ ] buyme a coffee link and button

```html
<script type="text/javascript" src="https://cdnjs.buymeacoffee.com/1.0.0/button.prod.min.js" data-name="bmc-button" data-slug="neuronioazul" data-color="#5F7FFF" data-emoji=""  data-font="Cookie" data-text="Buy me a coffee" data-outline-color="#000000" data-font-color="#ffffff" data-coffee-color="#FFDD00" ></script>
```

- [ ] 7.12.2 no painel da extensão
<a href="https://www.buymeacoffee.com/neuronioazul" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-blue.png" alt="Buy Me A Coffee" style="height: 60px !important;width: 217px !important;" ></a>

- [ ] 7.12.2 na página da extensão no marketplace

### 8. Testes

- [ ] 8.1 Testes unitários para metadados
- [ ] 8.2 Testes de integração com VS Code API
- [ ] 8.3 Testes com diferentes formatos de imagem
- [ ] 8.4 Testes de performance com imagens grandes
- [ ] 8.5 Testes de acessibilidade

### 9. Documentação

- [x] 9.1 Criar guia de contribuição (CONTRIBUTING.md)
- [x] 9.2 Documentar sistema de i18n (I18N.md)
- [ ] 9.3 Documentar API interna
- [ ] 9.4 Criar examples/samples
- [ ] 9.5 Adicionar troubleshooting guide

### 10. Compatibilidade

- [ ] 10.1 Testar com diferentes versões do VS Code
- [ ] 10.2 Suporte a mais formatos de imagem (TIFF, RAW, etc.)
- [ ] 10.3 Compatibilidade com extensions populares
- [ ] 10.4 Suporte a imagens em repositórios remotos

## 🎯 Prioridades

### High Priority

- Remover logs de debug
- Melhorar interface dark/light
- Adicionar EXIF data básico

### Medium Priority  

- Ícones nos metadados
- Feedback visual ao copiar
- Configurações básicas

### Low Priority

- Publicação no marketplace

## 📝 Notas

- Manter foco na simplicidade e performance
- Priorizar funcionalidades que agregam valor real ao desenvolvedor
- Considerar feedback dos usuários antes de implementar funcionalidades complexas

📋 Próximos Passos para Publicação:

📦 Como Publicar (Quando pronto):

1. Instalar vsce

```bash
npm install -g @vscode/vsce
```

2. Criar pacote

```bash
vsce package
```

3. Testar o pacote

```bash
code --install-extension image-details-0.1.0.vsix
```

4. Publicar (requer token do marketplace)

```bash
vsce publish
```
