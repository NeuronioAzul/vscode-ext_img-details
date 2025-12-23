# Guia Completo de PAT Token no Ubuntu

## 🔑 O que é PAT (Personal Access Token)?

Um PAT é uma chave de autenticação da Microsoft/Azure DevOps usada para publicar extensões no VS Code Marketplace. É como uma senha, mas mais segura e com permissões específicas.

---

## 📝 Passo 1: Criar um PAT Token

### 1.1. Acessar o Azure DevOps

```bash
# Abra no navegador:
https://dev.azure.com/
```

Ou acesse diretamente a página de tokens:
```bash
https://dev.azure.com/[sua-organizacao]/_usersSettings/tokens
```

### 1.2. Criar Novo Token

1. Clique em **"New Token"** / **"Novo Token"**
2. Preencha:
   - **Name**: `vscode-marketplace-publish`
   - **Organization**: `All accessible organizations` (recomendado)
   - **Expiration**: `90 days` ou `Custom defined`
   
3. **IMPORTANTE - Scopes/Permissões:**
   - Marque **"Custom defined"**
   - Expanda **"Marketplace"**
   - Selecione: ✅ **"Manage"** (NÃO apenas "Publish"!)
   
4. Clique em **"Create"**

5. **COPIE O TOKEN IMEDIATAMENTE** 📋
   - Ele só é mostrado uma vez
   - Salve em local seguro (veja seção "Armazenamento Seguro" abaixo)

---

## 🧪 Passo 2: Testar/Validar o PAT Token no Ubuntu

### Método 1: Teste Rápido via cURL

```bash
# Substitua SEU_PAT pelo token copiado
export PAT="seu-pat-token-aqui"

# Teste básico de autenticação
curl -s -w "\nHTTP Status: %{http_code}\n" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/NeuronioAzul"
```

**Interpretação dos resultados:**

✅ **HTTP Status: 200** = Token válido e funcionando
```json
{
  "publisherId": "NeuronioAzul",
  "publisherName": "NeuronioAzul",
  "displayName": "...",
  ...
}
```

❌ **HTTP Status: 401** = Token inválido ou expirado
```
Token precisa ser recriado
```

❌ **HTTP Status: 403** = Token sem permissões suficientes
```
Precisa de permissão "Manage", não apenas "Publish"
```

❌ **HTTP Status: 404** = Publisher não encontrado ou você não tem acesso
```
Adicione sua conta ao publisher no marketplace
```

### Método 2: Teste Detalhado com Informações

Crie um script de teste:

```bash
# Criar arquivo de teste
cat > ~/test-pat.sh << 'EOF'
#!/bin/bash

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}=== Teste de PAT Token ===${NC}\n"

# Solicita o PAT
read -sp "Cole seu PAT Token: " PAT
echo -e "\n"

# Solicita o publisher
read -p "Digite o Publisher ID (ex: NeuronioAzul): " PUBLISHER
echo ""

# Testa autenticação
echo -e "${CYAN}Testando autenticação...${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

echo -e "\nHTTP Status: $HTTP_CODE"

case $HTTP_CODE in
  200)
    echo -e "${GREEN}✓ Token VÁLIDO!${NC}"
    echo -e "\nInformações do Publisher:"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
    ;;
  401)
    echo -e "${RED}✖ Token INVÁLIDO ou EXPIRADO${NC}"
    echo -e "\nSolução:"
    echo "1. Crie um novo token em: https://dev.azure.com/_usersSettings/tokens"
    echo "2. Certifique-se de selecionar permissão 'Marketplace (Manage)'"
    ;;
  403)
    echo -e "${RED}✖ Token SEM PERMISSÕES${NC}"
    echo -e "\nProblema: Token não tem permissão 'Manage'"
    echo -e "\nSolução:"
    echo "1. Crie novo token em: https://dev.azure.com/_usersSettings/tokens"
    echo "2. Selecione: Custom defined → Marketplace → Manage"
    ;;
  404)
    echo -e "${RED}✖ PUBLISHER NÃO ENCONTRADO ou SEM ACESSO${NC}"
    echo -e "\nProblemas possíveis:"
    echo "1. Publisher '$PUBLISHER' não existe"
    echo "2. Sua conta não foi adicionada ao publisher"
    echo -e "\nSolução:"
    echo "Adicione sua conta em: https://marketplace.visualstudio.com/manage/publishers/$PUBLISHER"
    ;;
  *)
    echo -e "${YELLOW}⚠ Resposta inesperada${NC}"
    echo "$BODY"
    ;;
esac

echo ""
EOF

# Tornar executável
chmod +x ~/test-pat.sh

# Executar
~/test-pat.sh
```

### Método 3: Testar com vsce

```bash
# Instalar vsce se ainda não tiver
npm install -g @vscode/vsce

# Testar login
vsce login NeuronioAzul
# Cole o PAT quando solicitado

# Se der certo, você verá:
# Personal Access Token for publisher 'NeuronioAzul': ****
# The Personal Access Token verification succeeded for the publisher 'NeuronioAzul'.
```

---

## 🔒 Passo 3: Armazenamento Seguro do PAT

### Opção 1: Variável de Ambiente Temporária (Sessão Atual)

```bash
# Apenas para a sessão atual do terminal
export VSCE_PAT="seu-pat-aqui"

# Usar no script
./publish.sh --pat "$VSCE_PAT"
```

### Opção 2: Arquivo de Ambiente (.env) - Recomendado

```bash
# Criar arquivo .env na raiz do projeto
cat > .env << 'EOF'
VSCE_PAT=seu-pat-token-aqui
EOF

# Proteger o arquivo (só você pode ler)
chmod 600 .env

# Adicionar ao .gitignore (IMPORTANTE!)
echo ".env" >> .gitignore

# Usar no terminal
source .env
./publish.sh --pat "$VSCE_PAT"
```

### Opção 3: Keyring do Sistema (Mais Seguro)

```bash
# Instalar libsecret
sudo apt-get install libsecret-tools

# Armazenar o PAT
secret-tool store --label="VS Code PAT" service vscode username NeuronioAzul

# Recuperar quando necessário
PAT=$(secret-tool lookup service vscode username NeuronioAzul)
./publish.sh --pat "$PAT"
```

### Opção 4: Pass (Password Manager CLI)

```bash
# Instalar pass
sudo apt-get install pass

# Inicializar (primeira vez)
gpg --gen-key  # Se não tiver chave GPG
pass init "seu-email@exemplo.com"

# Armazenar PAT
pass insert vscode/pat
# Cole o PAT quando solicitado

# Recuperar
PAT=$(pass vscode/pat)
./publish.sh --pat "$PAT"
```

---

## ⚙️ Passo 4: Configurar para Uso Contínuo

### Script Auxiliar para Publicação

Crie um script helper:

```bash
cat > ~/.local/bin/vscode-publish << 'EOF'
#!/bin/bash
# Script helper para publicação de extensões VS Code

# Carregar PAT do keyring
PAT=$(secret-tool lookup service vscode username NeuronioAzul 2>/dev/null)

if [ -z "$PAT" ]; then
    echo "❌ PAT não encontrado no keyring"
    echo "Configure com: secret-tool store --label='VS Code PAT' service vscode username NeuronioAzul"
    exit 1
fi

# Executar script de publicação
cd /home/mauro/projects/vscode-ext_img-details
./.dev/scripts/publish.sh --pat "$PAT" "$@"
EOF

chmod +x ~/.local/bin/vscode-publish

# Agora você pode publicar de qualquer lugar:
vscode-publish
```

### Alias no .bashrc / .zshrc

```bash
# Adicionar ao ~/.bashrc ou ~/.zshrc
cat >> ~/.zshrc << 'EOF'

# VS Code Publishing
alias vscode-publish='cd ~/projects/vscode-ext_img-details && source .env && ./.dev/scripts/publish.sh --pat "$VSCE_PAT"'
EOF

# Recarregar
source ~/.zshrc

# Usar
vscode-publish
```

---

## 🔍 Passo 5: Troubleshooting (Solução de Problemas)

### Problema 1: "Token expirado"

```bash
# Verificar data de expiração
# Infelizmente não há API para isso, você precisa:
# 1. Ir para: https://dev.azure.com/_usersSettings/tokens
# 2. Ver a lista de tokens e suas datas de expiração
# 3. Renovar ou criar novo token

# Criar novo token e atualizar
secret-tool store --label="VS Code PAT" service vscode username NeuronioAzul
# Cole o novo PAT
```

### Problema 2: "Permissão negada"

```bash
# Verificar permissões do token
# Não há como ver via API, mas você pode:

# 1. Criar novo token com permissão correta
# 2. Em Scopes, selecionar: Marketplace (Manage)

# 3. Atualizar o token armazenado
secret-tool store --label="VS Code PAT" service vscode username NeuronioAzul
```

### Problema 3: "Publisher não encontrado"

```bash
# Verificar se sua conta está no publisher
curl -s -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/NeuronioAzul/members"

# Se retornar 404, adicione-se ao publisher:
# https://marketplace.visualstudio.com/manage/publishers/NeuronioAzul
```

### Problema 4: Testar permissões específicas

```bash
# Script completo de diagnóstico
cat > ~/diagnose-pat.sh << 'EOF'
#!/bin/bash

read -sp "PAT Token: " PAT
echo -e "\n"

PUBLISHER="NeuronioAzul"

echo "=== Diagnóstico de PAT ==="
echo ""

# Teste 1: Autenticação básica
echo "1. Testando autenticação básica..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER")

if [ "$HTTP" = "200" ]; then
  echo "   ✓ Autenticação OK"
else
  echo "   ✗ Falha ($HTTP)"
fi

# Teste 2: Acesso ao publisher
echo "2. Testando acesso ao publisher..."
HTTP=$(curl -s -o /dev/null -w "%{http_code}" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER/extensions")

if [ "$HTTP" = "200" ]; then
  echo "   ✓ Acesso ao publisher OK"
else
  echo "   ✗ Falha ($HTTP)"
fi

# Teste 3: Listar extensões
echo "3. Testando listagem de extensões..."
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER/extensions")

HTTP=$(echo "$RESPONSE" | tail -n1)
if [ "$HTTP" = "200" ]; then
  echo "   ✓ Listagem OK"
  echo "   Extensões encontradas:"
  echo "$RESPONSE" | head -n-1 | jq -r '.value[].extensionName' 2>/dev/null || echo "   (instale jq para ver nomes)"
else
  echo "   ✗ Falha ($HTTP)"
fi

echo ""
echo "=== Resumo ==="
if [ "$HTTP" = "200" ]; then
  echo "✓ PAT está funcionando corretamente!"
else
  echo "✗ PAT tem problemas. Verifique:"
  echo "  1. Permissões (deve ser 'Manage')"
  echo "  2. Expiração do token"
  echo "  3. Acesso ao publisher"
fi
EOF

chmod +x ~/diagnose-pat.sh
~/diagnose-pat.sh
```

---

## 📋 Checklist Final

Antes de publicar, verifique:

```bash
# 1. PAT válido
curl -s -o /dev/null -w "Status: %{http_code}\n" \
  -H "Authorization: Basic $(echo -n "user:$VSCE_PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/NeuronioAzul"
# Deve retornar: Status: 200

# 2. vsce instalado
vsce --version

# 3. Projeto compilado
npm run compile

# 4. Git limpo
git status

# 5. Testar pacote localmente
vsce package
# Gera um .vsix para testar

# 6. Instalar e testar localmente
code --install-extension image-details-1.2.3.vsix
```

---

## 🎯 Comandos Úteis

```bash
# Ver tokens ativos (navegador)
xdg-open https://dev.azure.com/_usersSettings/tokens

# Limpar token armazenado
secret-tool clear service vscode username NeuronioAzul

# Ver todas as credenciais armazenadas
secret-tool search --all service vscode

# Exportar PAT para sessão atual
export VSCE_PAT="seu-token"
echo $VSCE_PAT  # Verificar

# Publicar com PAT inline (não recomendado, use com cuidado)
vsce publish -p "seu-pat-aqui"
```

---

## 🔗 Links Úteis

- Criar PAT: https://dev.azure.com/_usersSettings/tokens
- Gerenciar Publisher: https://marketplace.visualstudio.com/manage
- Documentação vsce: https://github.com/microsoft/vscode-vsce
- Documentação PAT: https://docs.microsoft.com/azure/devops/organizations/accounts/use-personal-access-tokens-to-authenticate

---

**Última atualização**: 2025-12-23
