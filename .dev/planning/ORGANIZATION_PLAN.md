# Extension Organization Plan

## 🎯 Objetivo

Organizar a extensão profissionalmente, mantendo apenas arquivos essenciais na branch `main` (produção) e movendo arquivos de desenvolvimento para branch `dev`.

---

## 📁 Estrutura de Branches

### Branch `main` (Produção)
Contém apenas arquivos necessários para funcionamento da extensão:

#### ✅ Arquivos Essenciais (Manter)
```
vscode-ext_img-details/
├── .github/                    # CI/CD workflows
├── .vscode/                    # Configurações do workspace
├── dist/                       # Código compilado
├── media/                      # Imagens necessárias (screenshots)
├── src/                        # Código fonte TypeScript
├── .eslintrc.json             # Configuração ESLint
├── .gitignore                 # Git ignore
├── .vscodeignore              # VS Code Extension ignore
├── CHANGELOG.md               # Histórico de versões ⭐
├── esbuild.js                 # Build script
├── icon.png                   # Ícone da extensão
├── LICENSE                    # Licença MIT
├── package.json               # Manifesto da extensão ⭐
├── package-lock.json          # Lock file NPM
├── README.md                  # Documentação principal ⭐
└── tsconfig.json              # Configuração TypeScript
```

#### ❌ Arquivos a Mover para `.dev/` (Remover da main)
```
├── _ADM/                      # Arquivos administrativos
├── docs/                      # Documentação técnica/desenvolvimento
├── test-images/               # Imagens de teste
├── publish.sh                 # Script de publicação
├── ROADMAP.md                 # Planejamento futuro
├── MIGRATION_STATUS.md        # Status de migração (temporário)
├── PHASE_*.md                 # Documentos de fases (temporários)
└── REFACTORING_SUMMARY.md    # Resumo de refatoração (temporário)
```

### Branch `dev` (Desenvolvimento)
Contém **TODOS** os arquivos (produção + desenvolvimento):

```
vscode-ext_img-details/
├── [Todos os arquivos da main]
└── .dev/                      # Arquivos de desenvolvimento
    ├── docs/                  # Documentação técnica
    ├── test-images/           # Imagens para teste
    ├── admin/                 # Arquivos administrativos (_ADM)
    ├── scripts/               # Scripts (publish.sh, etc)
    └── planning/              # Planejamento (ROADMAP, etc)
```

---

## 🚀 Plano de Execução

### Fase 1: Preparação (Branch dev)

```bash
# 1. Criar branch dev a partir da main
git checkout main
git pull origin main
git checkout -b dev
git push -u origin dev

# 2. Criar estrutura .dev/
mkdir -p .dev/{docs,test-images,admin,scripts,planning}

# 3. Mover arquivos de desenvolvimento
mv docs/* .dev/docs/
mv test-images/* .dev/test-images/
mv _ADM/* .dev/admin/
mv publish.sh .dev/scripts/
mv ROADMAP.md .dev/planning/
mv MIGRATION_STATUS.md .dev/planning/
mv PHASE_*.md .dev/planning/ 2>/dev/null || true
mv REFACTORING_SUMMARY.md .dev/planning/ 2>/dev/null || true

# 4. Criar README na .dev/
# Explicando a estrutura de desenvolvimento

# 5. Commit na branch dev
git add .
git commit -m "chore: organize development files into .dev/"
git push origin dev
```

### Fase 2: Limpeza (Branch main)

```bash
# 1. Voltar para main
git checkout main

# 2. Remover arquivos de desenvolvimento
git rm -r docs/
git rm -r test-images/
git rm -r _ADM/
git rm publish.sh
git rm ROADMAP.md
git rm MIGRATION_STATUS.md
git rm PHASE_*.md 2>/dev/null || true
git rm REFACTORING_SUMMARY.md 2>/dev/null || true

# 3. Atualizar .gitignore para main
# Adicionar entradas para prevenir re-adição acidental

# 4. Commit na branch main
git add .
git commit -m "chore: clean main branch - keep only production files"
git push origin main
```

### Fase 3: Documentação

```bash
# 1. Criar CONTRIBUTING.md na main
# Indicando que desenvolvimento é feito na branch dev

# 2. Atualizar README.md
# Adicionar badge da branch dev
# Link para documentação de desenvolvimento

# 3. Commit
git add .
git commit -m "docs: update for new branch structure"
git push origin main
```

---

## 📝 Arquivos a Criar

### 1. `.dev/README.md` (Branch dev)
```markdown
# Development Files

This directory contains files used during development that are not needed in production.

## Structure

- `docs/` - Technical documentation
- `test-images/` - Test images
- `admin/` - Administrative files
- `scripts/` - Build and publish scripts
- `planning/` - Roadmaps and planning documents

## Development Workflow

1. All development happens in the `dev` branch
2. Production releases are merged to `main`
3. Only essential files are kept in `main`
```

### 2. `CONTRIBUTING.md` (Branch main)
```markdown
# Contributing

Thank you for your interest in contributing!

## Development Branch

All development happens in the `dev` branch:
- Clone: `git clone -b dev https://github.com/NeuronioAzul/vscode-ext_img-details.git`
- Documentation: See `.dev/docs/` in the dev branch

## Branch Structure

- `main`: Production-ready code (releases only)
- `dev`: Development and documentation

Please submit pull requests to the `dev` branch.
```

### 3. Atualizar `.gitignore` (Branch main)
```gitignore
# Add at the end:

# Development files (kept only in dev branch)
.dev/
docs/
test-images/
_ADM/
publish.sh
ROADMAP.md
MIGRATION_STATUS.md
PHASE_*.md
REFACTORING_SUMMARY.md
```

---

## ✅ Benefícios

1. **Main limpa**: Apenas código de produção
2. **Separação clara**: Desenvolvimento vs. Produção
3. **Clone mais rápido**: Usuários não baixam arquivos desnecessários
4. **Profissional**: Estrutura comum em projetos open-source
5. **Marketplace**: Extensão menor (apenas arquivos essenciais)

---

## 🔄 Workflow Futuro

### Para Desenvolver:
```bash
git checkout dev
# Fazer mudanças
git commit -am "feat: new feature"
git push origin dev
```

### Para Release:
```bash
git checkout main
git merge dev --no-ff
npm run package
# Publicar
git push origin main
git tag v1.x.x
git push origin v1.x.x
```

---

## 📊 Comparação de Tamanho

### Antes (main atual)
- ~50 arquivos
- ~15 MB (com node_modules)
- Inclui: docs, test-images, _ADM, scripts

### Depois (main otimizada)
- ~20 arquivos essenciais
- ~5 MB (com node_modules)
- Apenas: src, dist, README, CHANGELOG, LICENSE

---

## ⚠️ Importante

- **Não deletar arquivos, apenas mover para .dev/**
- **Manter histórico git intacto**
- **Branch dev sempre tem tudo**
- **Main recebe merges da dev (sem arquivos .dev/)**

---

**Status**: ⏳ Pronto para execução
**Responsável**: Mauro
**Data**: 2025-12-23
