# TODO - Image Details Extension

## 🎉 Completed in v1.1.5

### ✅ Code Architecture Refactoring

- [x] Modular architecture implementation (Phase 1-3)
  - [x] Create `src/types/index.ts` with centralized type definitions
  - [x] Create `src/i18n/translations.ts` with locale detection
  - [x] Create `src/i18n/locales/` with separate language files (en, pt-br, ja, es)
  - [x] Create `src/utils/metadata.ts` for utility functions
  - [x] Create `src/templates/htmlGenerators.ts` for HTML generators (stub)
  - [x] Refactor `imageDetailsEditor.ts` to use new modules
  - [x] Replace `getTranslations()` method (28 lines → 3 lines, 89% reduction)
  - [x] Update type definitions to use imported types
  - [x] Extract utility functions to `src/utils/metadata.ts`
    - [x] `formatFileSize()` - 8 lines
    - [x] `getColorInfo()` - 37 lines
    - [x] `calculateBitDepth()` - 45 lines
    - [x] `extractRelevantExifData()` - 580 lines
  - [x] Update all function calls and imports
  - [x] Successful compilation with zero errors
  - [x] Code reduction: 3,131 → 2,651 lines (-480 lines, -15.3%)

### ✅ Internationalization (i18n)

- [x] 3.2 Japanese language support (日本語) - v1.1.4
  - [x] Complete translation of 110+ UI strings
  - [x] Automatic detection for `ja` and `ja-JP` locales
  - [x] Full EXIF metadata field translations
- [x] Spanish language support (Español) - v1.1.5
  - [x] Complete translation of 110+ UI strings
  - [x] Automatic detection for all Spanish locales (es, es-ES, es-MX, es-AR, etc.)
  - [x] Full EXIF metadata field translations

### 🌍 Internationalization (i18n) Expansion Plan

#### ✅ Implemented Languages (5)

- [x] English (en) - Base language
- [x] Portuguese - Brazil (pt-br)
- [x] Japanese (ja) - 日本語
- [x] Spanish (es) - Español
- [x] Chinese Simplified (zh-cn) - 简体中文

#### 🔥 High Priority Languages (2)

- [x] Chinese Simplified (zh-cn) - 简体中文 ✅ COMPLETED
  - ~25-30% of VS Code users
  - Largest developer community worldwide
  - Critical for Asian market penetration
- [ ] French (fr) - Français
  - ~8-12% of VS Code users
  - France + Francophone communities (Africa, Canada, Belgium)
  - Strong European developer base
- [ ] German (de) - Deutsch
  - ~8-12% of VS Code users
  - Germany: tech powerhouse in Europe
  - Strong engineering culture

#### ⭐ Medium Priority Languages (3)

- [ ] Russian (ru) - Русский
  - ~5-8% of VS Code users
  - Large developer community
  - Strong presence in open source
- [ ] Korean (ko) - 한국어
  - ~5-8% of VS Code users
  - South Korea: major tech hub
  - Strong software/hardware industry
- [ ] Italian (it) - Italiano
  - European market presence
  - Active developer community
  - Design and creativity focus

#### 💎 Special Consideration Languages (2)

- [ ] Chinese Traditional (zh-tw) - 繁體中文
  - Taiwan: significant tech industry
  - Hong Kong: financial/tech hub
  - Cultural preference for traditional characters
- [ ] Hindi (hi) - हिन्दी
  - India: massive emerging market
  - Explosion of young developers
  - Enormous future growth potential

**Coverage Goal:**

- Phase 1 (High Priority): ~70% global coverage
- Phase 2 (Medium Priority): ~85% global coverage
- Phase 3 (Special Consideration): ~90% global coverage

### ✅ Documentation

- [x] Refactoring documentation
  - [x] `REFACTORING_SUMMARY.md` - Executive summary
  - [x] `docs/development/REFACTORING.md` - Technical documentation
  - [x] `MIGRATION_STATUS.md` - Migration progress tracker

## 🔧 Melhorias Planejadas

### 1. Code Architecture - Phase 4 (In Progress)

- [x] 1.1 Move utility functions to `src/utils/metadata.ts` ✅ COMPLETED
  - [x] 1.1.1 Move `formatFileSize()` function
  - [x] 1.1.2 Move `getColorInfo()` function
  - [x] 1.1.3 Move `calculateBitDepth()` function
  - [x] 1.1.4 Move `extractRelevantExifData()` function (complete implementation)
  - [ ] 1.1.5 Add unit tests for utility functions

- [x] 1.2 Move HTML generators to `src/templates/htmlGenerators.ts` ✅ PHASE 4A COMPLETE
  - [x] 1.2.0 Create htmlGenerators module structure
  - [x] 1.2.1 Move `escapeHtml()` helper function (18 lines)
  - [x] 1.2.2 Move `getErrorHtml()` function (86 lines)
  - [ ] 1.2.3 Move `generateColorInfoHtml()` function (~50 lines) - Phase 4B
  - [ ] 1.2.4 Move `generateExifHtml()` function (~600 lines) - Phase 4B
  - [ ] 1.2.5 Move `getHtmlForWebview()` function (~950 lines) - Phase 4B
  - [ ] 1.2.1 Move `generateBasicInfoSection()` function
  - [ ] 1.2.2 Move `generateColorInfoHtml()` function
  - [ ] 1.2.3 Move `generateExifHtml()` function
  - [ ] 1.2.4 Move `getHtmlForWebview()` function
  - [ ] 1.2.5 Move `getErrorHtml()` function

- [ ] 1.3 Clean up legacy code
  - [ ] 1.3.1 Remove duplicate `translations` object from `imageDetailsEditor.ts`
  - [ ] 1.3.2 Remove unused imports
  - [ ] 1.3.3 Optimize code structure

- [ ] 1.4 Testing
  - [ ] 1.4.1 Unit tests for `src/i18n/translations.ts`
  - [ ] 1.4.2 Unit tests for `src/utils/metadata.ts`
  - [ ] 1.4.3 Unit tests for `src/templates/htmlGenerators.ts`
  - [ ] 1.4.4 Integration tests for main editor provider

### 2. Limpeza de Código

- [x] 2.1 Remover logs de debug (`console.log`) dos arquivos de produção
- [x] 2.2 Otimizar imports e dependências não utilizadas
- [x] 2.3 Adicionar tratamento de erros mais robusto
- [x] 2.4 Validação de tipos para dados EXIF
- [x] 2.5 Página de erro amigável para falhas no carregamento

### 3. Metadados Expandidos

- [x] 3.1 Adicionar suporte a EXIF data para fotos
  - [x] 3.1.1 Dados da câmera (modelo, marca)
  - [x] 3.1.2 Configurações da foto (ISO, abertura, velocidade)
  - [x] 3.1.3 Data/hora da captura
  - [x] 3.1.4 Informações de GPS (se disponível)
- [x] 3.2 Informações de cor
  - [x] 3.2.1 Color depth (profundidade de cor)
  - [x] 3.2.2 Has transparency (tem transparência)
  - [x] 3.2.3 Color space (espaço de cores) - Disponível via EXIF
- [x] 3.3 Informações técnicas
  - [ ] 3.3.1 Compression type/quality
  - [x] 3.3.2 DPI/PPI information
  - [x] 3.3.3 Bit depth melhorado com dados EXIF (BitsPerSample, SamplesPerPixel)
- [x] 3.4 Ferramentas de edição de metadados
  - [x] 3.4.1 Remover dados EXIF com backup automático
  - [x] 3.4.2 Suporte para JPEG/JPG e PNG
  - [x] 3.4.3 Confirmação antes de remover
  - [x] 3.4.4 Restauração automática em caso de erro
- [x] 3.5 Adicionar visualização dos metadados EXIF completos
  - [x] 3.5.1 Image Description
  - [x] 3.5.2 Camera Info (Make, Model, Owner)
  - [x] 3.5.3 Lens Info (Make, Model, Serial Number)
  - [x] 3.5.4 Photo Settings completos
  - [x] 3.5.5 Date/Time Info
  - [x] 3.5.6 GPS Info completo
  - [x] 3.5.7 Image Technical Info
- [x] 3.6 Adicionar botão para exibir todos os metadados em formato JSON
  - [x] 3.6.1 Botão "View as JSON" no painel de metadados
  - [x] 3.6.2 Modal com JSON formatado
  - [x] 3.6.3 Funcionalidade de copiar JSON completo
  - [x] 3.6.4 Traduções em múltiplos idiomas
  - [x] 3.6.5 Estilos responsivos para o modal

### 4. Interface e UX

- [x] 4.1 Adicionar accordion na seção de metadados para melhor organização
  - [x] 4.1.1 O primeiro item do accordion aberto por padrão
  - [x] 4.1.2 Adicionar animação ao abrir/fechar
  - [x] 4.1.3 Salvar estado (expandido/colapsado) entre sessões
  - [x] 4.1.4 Permitir escolher accordion ou lista simples nas configurações
- [x] 4.2 Tradução para múltiplos idiomas (English, Português, 日本語, Español)
- [x] 4.3 Coluna de metadados "sticky" à direita com resize horizontal
- [x] 4.4 Abrir visualizador da extensão por padrão ao clicar em imagem
- [x] 4.5 Opção no menu de contexto "Open with Image Details Viewer"
- [x] 4.6 Melhorar tema dark/light responsivo
- [x] 4.7 Adicionar ícones para cada tipo de metadado
- [x] 4.8 Implementar botões de copy visuais
- [x] 4.9 Adicionar tooltip "Click to copy" nos valores
- [x] 4.10 Implementar feedback visual ao copiar (animação/highlight)
- [x] 4.11 Adicionar preview de thumbnail na lista de metadados
- [x] 4.12 Implementar zoom in/out na imagem principal
  - [x] 4.12.1 Controles de zoom (+, -, reset, fit)
  - [x] 4.12.2 Zoom com mouse wheel (Ctrl+Scroll)
  - [x] 4.12.3 Click para alternar zoom
  - [x] 4.12.4 Atalhos de teclado (+, -, 0)

### 5. Suporte a Mais Formatos

- [x] 5.1 PNG, JPG/JPEG, GIF, WebP, BMP, SVG, ICO
- [ ] 5.2 TIFF
- [ ] 5.3 RAW formats (CR2, NEF, ARW, etc.)
- [ ] 5.4 HEIC/HEIF

### 6. Configurações

- [ ] 6.1 Permitir usuário escolher quais metadados exibir
- [ ] 6.2 Configurar formato de data/hora (padrão: locale automático)
- [ ] 6.3 Opções de unidades (bytes vs KB/MB)

### 7. Performance

- [ ] 7.1 Lazy loading para imagens grandes
- [ ] 7.2 Cache de metadados
- [ ] 7.3 Otimização de renderização webview

### 8. Publicação

- [x] 8.1 Criar ícone oficial da extensão (icon.png 128x128px)
- [x] 8.2 Otimizar README.md com screenshots
- [x] 8.3 Adicionar demo GIF
- [ ] 8.4 Configurar CI/CD para builds automáticos
- [x] 8.5 Preparar para publicação no VS Code Marketplace
- [x] 8.6 Criar changelog estruturado
- [x] 8.7 Adicionar licença MIT
- [x] 8.8 Melhorar README.md com badges
- [x] 8.9 Adicionar keywords ao package.json
- [x] 8.10 Configurar repository e bugs URL
- [x] 8.11 Funding links (GitHub Sponsors, PayPal, Buy Me a Coffee)
- [x] 8.12 Automated publishing script (`publish.sh`)
- [x] 8.13 Publishing documentation

### 9. Testes

- [ ] 9.1 Testes unitários para metadados
- [ ] 9.2 Testes de integração com VS Code API
- [ ] 9.3 Testes com diferentes formatos de imagem
- [ ] 9.4 Testes de performance com imagens grandes
- [ ] 9.5 Testes de acessibilidade
- [ ] 9.6 Unit tests for i18n module
- [ ] 9.7 Unit tests for utils module
- [ ] 9.8 Unit tests for templates module

### 10. Documentação

### 10. Documentação

- [x] 10.1 Criar guia de contribuição (CONTRIBUTING.md)
- [x] 10.2 Documentar sistema de i18n
- [x] 10.3 Refactoring documentation
- [ ] 10.4 Documentar API interna
- [ ] 10.5 Criar examples/samples
- [ ] 10.6 Adicionar troubleshooting guide

### 11. Compatibilidade

- [ ] 11.1 Testar com diferentes versões do VS Code
- [ ] 11.2 Suporte a mais formatos de imagem (TIFF, RAW, etc.)
- [ ] 11.3 Compatibilidade com extensions populares
- [ ] 11.4 Suporte a imagens em repositórios remotos

## 🎯 Prioridades v1.2.0

### High Priority

- [ ] Complete Phase 3: Move utility functions to utils/metadata.ts
- [ ] Complete Phase 4: Move HTML generators to templates/
- [ ] Add unit tests for refactored modules
- [ ] Performance optimizations (lazy loading, cache)

### Medium Priority

- [ ] Advanced configuration options
- [ ] CI/CD setup
- [ ] Additional image format support (TIFF, RAW)

### Low Priority

- [ ] API documentation
- [ ] Examples and samples
- [ ] Troubleshooting guide

## 📝 Notas

- ✅ v1.1.5: Modular architecture Phases 1-4A successfully implemented
  - Phase 1: Module structure creation ✅
  - Phase 2: Core migration (types, i18n) ✅
  - Phase 3: Utility functions extraction ✅
  - Phase 4A: HTML helpers extraction ✅ (2/5 functions, 104 lines)
- 🎯 Next: Phase 4B (remaining HTML generators ~1600 lines) + Phase 5 (cleanup & testing)
- 📊 Code quality improved: 18.4% reduction, better maintainability and testability
- 🌐 4 languages supported: English, Portuguese, Japanese, Spanish
- 📐 Progress: ~60% complete overall, Phase 4: 40% complete

## 📦 Publishing & Release Management

- [x] Automated publishing script (`publish.sh`)
  - [x] Interactive version selection (patch/minor/major)
  - [x] Automatic CHANGELOG extraction
  - [x] Git tag creation and push
  - [x] GitHub release creation
  - [x] VS Code Marketplace publishing
  - [x] Dry-run mode for testing
  - [x] Command-line options support
- [x] Publishing documentation
  - [x] Complete guide in `docs/PUBLISHING.md`
  - [x] Best practices and troubleshooting
  - [x] Security notes for PAT handling

## 🚀 Manual Publishing Steps

For manual publishing without the script:

1. Bump version in `package.json`

1. Create pacote

   ```bash
   vsce package
   ```

1. Test the package

   ```bash
   code --install-extension image-details-0.1.0.vsix
   ```

1. Publish (requires marketplace token)

   ```bash
   vsce publish
   ```

**Note:** It's recommended to use the automated `publish.sh` script for consistent and reliable publishing.
