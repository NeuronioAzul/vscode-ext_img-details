# TODO - Image Details Extension

## 🔧 Melhorias Planejadas

### 1. Limpeza de Código
- [x] Remover logs de debug (`console.log`) dos arquivos de produção
- [x] Otimizar imports e dependências não utilizadas
- [x] Adicionar tratamento de erros mais robusto
- [x] Validação de tipos para dados EXIF
- [x] Página de erro amigável para falhas no carregamento

### 2. Metadados Expandidos
- [x] Adicionar suporte a EXIF data para fotos
  - [x] Dados da câmera (modelo, marca)
  - [x] Configurações da foto (ISO, abertura, velocidade)
  - [x] Data/hora da captura
  - [x] Informações de GPS (se disponível)
- [x] Informações de cor
  - [x] Color depth (profundidade de cor)
  - [x] Has transparency (tem transparência)
  - [ ] Color space (espaço de cores) - Disponível via EXIF
- [ ] Informações técnicas
  - [ ] Compression type/quality
  - [ ] DPI/PPI information
  - [ ] Bit depth

### 3. Interface e UX
- [x] Adicionar tradução para múltiplos idiomas (i18n) pelo menos para inglês e português do Brasil
- [x] a coluna de metadados deve ser "sticky" a direita ao rolar a página, mas pode redimensionar horizontalmente
- [x] Ao clicar no arquivo de imagem abrir o visualizador da extensão por padrão
- [x] Adicionar opção no menu de contexto "Open with Image Details Viewer"
- [x] Melhorar tema dark/light responsivo
- [x] Adicionar ícones para cada tipo de metadado
- [x] Implementar botões de copy mais visuais
- [x] Adicionar tooltip "Click to copy" nos valores
- [x] Implementar feedback visual ao copiar (animação/highlight)
- [ ] Adicionar preview de thumbnail na lista de metadados
- [x] Implementar zoom in and out na imagem principal
  - [x] Controles de zoom (+, -, reset, fit)
  - [x] Zoom com mouse wheel (Ctrl+Scroll)
  - [x] Click para alternar zoom
  - [x] Atalhos de teclado (+, -, 0)

### 5. Configurações
- [ ] Permitir usuário escolher quais metadados exibir
- [ ] Configurar formato de data/hora
- [ ] Opções de unidades (bytes vs KB/MB)

### 6. Performance
- [ ] Lazy loading para imagens grandes

### 7. Publicação
- [ ] Criar ícone oficial da extensão
- [ ] Otimizar README.md com screenshots
- [ ] Adicionar demo GIF
- [ ] Configurar CI/CD para builds automáticos
- [ ] Preparar para publicação no VS Code Marketplace
- [x] Criar changelog estruturado
- [x] Adicionar licença apropriada MIT
- [x] Melhorar README.md com badges e seções
- [x] Adicionar keywords ao package.json
- [x] Configurar repository e bugs URL

### 8. Testes
- [ ] Testes unitários para metadados
- [ ] Testes de integração com VS Code API
- [ ] Testes com diferentes formatos de imagem
- [ ] Testes de performance com imagens grandes
- [ ] Testes de acessibilidade

### 9. Documentação
- [x] Criar guia de contribuição (CONTRIBUTING.md)
- [x] Documentar sistema de i18n (I18N.md)
- [ ] Documentar API interna
- [ ] Criar examples/samples
- [ ] Adicionar troubleshooting guide

### 10. Compatibilidade
- [ ] Testar com diferentes versões do VS Code
- [ ] Suporte a mais formatos de imagem (TIFF, RAW, etc.)
- [ ] Compatibilidade com extensions populares
- [ ] Suporte a imagens em repositórios remotos

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