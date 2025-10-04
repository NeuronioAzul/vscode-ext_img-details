# TODO - Image Details Extension

## 🔧 Melhorias Planejadas

### 1. Limpeza de Código
- [x] Remover logs de debug (`console.log`) dos arquivos de produção
- [ ] Otimizar imports e dependências não utilizadas
- [x] Adicionar tratamento de erros mais robusto

### 2. Metadados Expandidos
- [ ] Adicionar suporte a EXIF data para fotos
  - [ ] Dados da câmera (modelo, marca)
  - [ ] Configurações da foto (ISO, abertura, velocidade)
  - [ ] Data/hora da captura
  - [ ] Informações de GPS (se disponível)
- [ ] Informações de cor
  - [ ] Color depth (profundidade de cor)
  - [ ] Color space (espaço de cores)
  - [ ] Has transparency (tem transparência)
- [ ] Informações técnicas
  - [ ] Compression type/quality
  - [ ] DPI/PPI information
  - [ ] Bit depth

### 3. Interface e UX
- [ ] Adicionar tradução para múltiplos idiomas (i18n) pelo menos para inglês e português do Brasil
- [x] Ao clicar no arquivo de imagem abrir o visualizador da extensão por padrão
- [ ] Adicionar opção no menu de contexto "Open with Image Details Viewer"
- [x] Melhorar tema dark/light responsivo
- [x] Adicionar ícones para cada tipo de metadado
- [x] Implementar botões de copy mais visuais
- [x] Adicionar tooltip "Click to copy" nos valores
- [x] Implementar feedback visual ao copiar (animação/highlight)
- [ ] Adicionar preview de thumbnail na lista de metadados
- [ ] Implementar zoom na imagem principal

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
- [ ] Criar changelog estruturado
- [ ] Adicionar licença apropriada MIT

### 8. Testes
- [ ] Testes unitários para metadados
- [ ] Testes de integração com VS Code API
- [ ] Testes com diferentes formatos de imagem
- [ ] Testes de performance com imagens grandes
- [ ] Testes de acessibilidade

### 9. Documentação
- [ ] Criar guia de contribuição
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