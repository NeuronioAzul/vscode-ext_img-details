# Publishing Scripts

Scripts para publicação da extensão Image Details no VS Code Marketplace.

## 📜 Scripts Disponíveis

### 1. `publish.sh` - Publicação Completa

Script completo de publicação que realiza todo o workflow de release:

```bash
./publish.sh [OPTIONS]
```

**O que faz:**
- ✅ Verifica estado do git (clean, remote)
- 🔐 Valida Personal Access Token
- 📦 Permite seleção de versão (patch/minor/major)
- 📝 Extrai release notes do CHANGELOG.md
- 🔄 Atualiza package.json com nova versão
- 🏷️ Cria e faz push de git tag
- 🌐 Cria release no GitHub (se gh CLI disponível)
- 📤 Publica no VS Code Marketplace

**Opções:**
- `--version <version>` - Especifica a versão (ex: 1.2.4)
- `--pat <token>` - Personal Access Token do Azure DevOps
- `--message <text>` - Mensagem de release
- `--dry-run` - Modo teste (não faz alterações)
- `-h, --help` - Exibe ajuda completa

**Exemplos:**
```bash
# Modo interativo (recomendado)
./publish.sh

# Com versão específica
./publish.sh --version 1.2.4

# Modo automatizado completo
./publish.sh --version 1.2.4 --pat "token" --message "Bug fixes"

# Teste sem fazer alterações
./publish.sh --dry-run
```

---

### 2. `marketplace-publish.sh` - Publicação Rápida no Marketplace

Script simplificado para publicar **apenas no marketplace**, sem criar tags ou releases.

```bash
./marketplace-publish.sh [OPTIONS]
```

**O que faz:**
- 🔐 Valida Personal Access Token
- ✅ Verifica disponibilidade do vsce
- 📋 Mostra informações do pacote
- 📤 Publica no VS Code Marketplace

**O que NÃO faz:**
- ✗ Não cria git tags
- ✗ Não cria GitHub releases
- ✗ Não modifica package.json
- ✗ Não faz commits

**Opções:**
- `--pat <token>` - Personal Access Token do Azure DevOps
- `--dry-run` - Modo teste (mostra o que seria publicado)
- `-h, --help` - Exibe ajuda

**Exemplos:**
```bash
# Modo interativo (solicita PAT)
./marketplace-publish.sh

# Com PAT direto
./marketplace-publish.sh --pat "seu-token-aqui"

# Preview do que será publicado
./marketplace-publish.sh --dry-run
```

**Casos de uso:**
- ✅ Republicar versão existente
- ✅ Hotfix emergencial no marketplace
- ✅ Testar publicação sem criar tags
- ✅ Atualizar descrição/ícone sem nova versão

---

## 🔐 Personal Access Token (PAT)

Ambos os scripts requerem um PAT válido do Azure DevOps.

### Criar PAT

1. Acesse: https://dev.azure.com/[organization]/_usersSettings/tokens
2. Click em "New Token"
3. **Importante:** Selecione permissão **Marketplace (Manage)** - NÃO apenas "Publish"
4. Defina expiração (recomendado: 90 dias ou menos)
5. Copie o token gerado

### Adicionar-se ao Publisher

⚠️ **Seu Microsoft account deve estar adicionado ao publisher!**

1. Acesse: https://marketplace.visualstudio.com/manage/publishers/NeuronioAzul
2. Faça login com sua conta Microsoft
3. Peça ao proprietário para adicionar você como membro

### Validação do PAT

Ambos os scripts validam o PAT automaticamente antes de fazer qualquer operação. Se o PAT for inválido ou expirado, você será informado imediatamente.

---

## 📊 Comparação dos Scripts

| Característica | `publish.sh` | `marketplace-publish.sh` |
|---------------|--------------|--------------------------|
| Cria git tags | ✅ Sim | ❌ Não |
| GitHub release | ✅ Sim | ❌ Não |
| Atualiza package.json | ✅ Sim | ❌ Não |
| Publica marketplace | ✅ Sim | ✅ Sim |
| Valida PAT | ✅ Sim | ✅ Sim |
| Modo interativo | ✅ Sim | ✅ Sim |
| Modo dry-run | ✅ Sim | ✅ Sim |
| Extrai CHANGELOG | ✅ Sim | ❌ Não |
| Workflow completo | ✅ Sim | ❌ Não |
| Publicação rápida | ❌ Não | ✅ Sim |

---

## 🚀 Qual Script Usar?

### Use `publish.sh` quando:
- ✅ Criar uma nova versão oficial
- ✅ Fazer release completo (git + GitHub + marketplace)
- ✅ Seguir o workflow completo de versionamento
- ✅ Documentar mudanças no CHANGELOG

### Use `marketplace-publish.sh` quando:
- ✅ Republicar versão existente
- ✅ Corrigir algo urgente apenas no marketplace
- ✅ Atualizar README, ícone ou screenshots
- ✅ Testar publicação antes do release oficial
- ✅ Não quiser criar tags ou releases

---

## ⚙️ Requisitos

- **Node.js** e **npm**
- **Git** com remote 'origin' configurado
- **@vscode/vsce** (instalado automaticamente se necessário)
- **gh CLI** (opcional, para GitHub releases)
- **PAT válido** com permissão Marketplace (Manage)

---

## 📝 Exemplos de Workflow

### Workflow 1: Release Completo
```bash
# 1. Atualizar CHANGELOG.md com mudanças da v1.2.5
vim CHANGELOG.md

# 2. Commit das mudanças
git add .
git commit -m "Prepare v1.2.5"

# 3. Executar publicação completa
./publish.sh --version 1.2.5
# (Irá extrair automaticamente as notas do CHANGELOG)
```

### Workflow 2: Hotfix Rápido
```bash
# 1. Fazer correção urgente no código
vim src/extension.ts

# 2. Compilar e testar
npm run compile

# 3. Commit e criar tag manualmente
git add .
git commit -m "hotfix: Critical bug fix"
git tag v1.2.6
git push origin v1.2.6

# 4. Atualizar package.json
vim package.json  # Mudar version para 1.2.6

# 5. Publicar apenas no marketplace
./marketplace-publish.sh
```

### Workflow 3: Testar Antes de Publicar
```bash
# 1. Ver o que seria publicado
./marketplace-publish.sh --dry-run

# 2. Se estiver OK, publicar de verdade
./marketplace-publish.sh
```

---

## 🐛 Troubleshooting

### Erro: "Personal Access Token is expired or invalid"
- Crie um novo PAT em: https://dev.azure.com/_usersSettings/tokens
- Certifique-se de selecionar **Marketplace (Manage)**

### Erro: "Publisher not found or you don't have access"
- Verifique se você está adicionado ao publisher
- Acesse: https://marketplace.visualstudio.com/manage/publishers/NeuronioAzul

### Erro: "TF400813" ou "not authorized"
- Seu PAT precisa de permissão **Manage**, não apenas **Publish**
- Sua conta Microsoft deve estar adicionada ao publisher

### Erro: "Working directory is not clean"
- Commit ou stash suas mudanças antes de executar `publish.sh`
- Ou use `marketplace-publish.sh` que não verifica git status

---

## 📚 Documentação Adicional

- [Guia de Publicação Completo](../docs/PUBLISH_GUIDE.md)
- [Troubleshooting de Publicação](../docs/PUBLISHING_TROUBLESHOOTING.md)
- [Guia de PAT Token](../docs/PAT_TOKEN_GUIDE.md)

---

## 📄 Licença

Scripts fazem parte do projeto Image Details Extension.
MIT License - Veja LICENSE na raiz do projeto.
