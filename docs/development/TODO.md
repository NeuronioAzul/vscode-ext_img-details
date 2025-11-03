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
- [ ] 5.2 (Sanfona, sempre expandido ou sempre colapsado)
- [ ] 5.3 Configurar formato de data/hora (padrão: detectar local automaticamente e define) mas permite selecionar outro formato
- [ ] 5.4 Opções de unidades (bytes vs KB/MB) (padrão KB/MB/GB/etc)

### 6. Performance

- [ ] 6.1 Lazy loading para imagens grandes

### 7. Publicação

- [ ] 7.1 Criar ícone oficial da extensão
- [ ] 7.2 Otimizar README.md com screenshots
- [ ] 7.3 Adicionar demo GIF
- [ ] 7.4 Configurar CI/CD para builds automáticos
- [ ] 7.5 Preparar para publicação no VS Code Marketplace
- [x] 7.6 Criar changelog estruturado
- [x] 7.7 Adicionar licença apropriada MIT
- [x] 7.8 Melhorar README.md com badges e seções
- [x] 7.9 Adicionar keywords ao package.json
- [x] 7.10 Configurar repository e bugs URL

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
