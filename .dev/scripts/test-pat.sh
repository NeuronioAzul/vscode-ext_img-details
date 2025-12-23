#!/bin/bash

# ================================================================================================
# PAT Token Validator - Quick Test
# ================================================================================================
# Testa e valida seu Personal Access Token da Microsoft/Azure DevOps
# ================================================================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BLUE='\033[0;34m'
NC='\033[0m'
BOLD='\033[1m'

clear

echo -e "${BOLD}${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${BOLD}${CYAN}║                                                           ║${NC}"
echo -e "${BOLD}${CYAN}║           🔑 PAT Token Validator & Tester                 ║${NC}"
echo -e "${BOLD}${CYAN}║                                                           ║${NC}"
echo -e "${BOLD}${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# Get PAT from user
echo -e "${CYAN}Este script testará seu Personal Access Token${NC}"
echo -e "${CYAN}O token NÃO será salvo, apenas testado${NC}"
echo ""
read -sp "$(echo -e ${YELLOW}🔑${NC} Cole seu PAT Token: )" PAT
echo -e "\n"

if [ -z "$PAT" ]; then
    echo -e "${RED}✖ PAT vazio. Cancelado.${NC}"
    exit 1
fi

# Get publisher from package.json or ask
PUBLISHER=""
if [ -f "package.json" ]; then
    PUBLISHER=$(grep -o '"publisher": *"[^"]*"' package.json | grep -o '[^"]*"$' | tr -d '"')
    echo -e "${CYAN}ℹ${NC} Publisher detectado: ${BOLD}$PUBLISHER${NC}"
else
    read -p "$(echo -e ${YELLOW}?${NC} Digite o Publisher ID [default: NeuronioAzul]: )" PUBLISHER
    PUBLISHER=${PUBLISHER:-NeuronioAzul}
fi

echo ""
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}  Executando Testes${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Test 1: Basic Authentication
echo -e "${BLUE}▶${NC} ${BOLD}Teste 1: Autenticação Básica${NC}"
RESPONSE=$(curl -s -w "\n%{http_code}" \
  -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
  "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER" 2>&1)

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

case $HTTP_CODE in
  200)
    echo -e "  ${GREEN}✓ Autenticação bem-sucedida${NC}"
    AUTH_OK=true
    ;;
  401)
    echo -e "  ${RED}✖ Token inválido ou expirado${NC}"
    AUTH_OK=false
    ;;
  403)
    echo -e "  ${RED}✖ Token sem permissões suficientes${NC}"
    AUTH_OK=false
    ;;
  404)
    echo -e "  ${RED}✖ Publisher não encontrado ou sem acesso${NC}"
    AUTH_OK=false
    ;;
  *)
    echo -e "  ${YELLOW}⚠ Resposta inesperada (HTTP $HTTP_CODE)${NC}"
    AUTH_OK=false
    ;;
esac
echo ""

# Test 2: Publisher Info
if [ "$AUTH_OK" = true ]; then
    echo -e "${BLUE}▶${NC} ${BOLD}Teste 2: Informações do Publisher${NC}"
    
    # Extract publisher info
    DISPLAY_NAME=$(echo "$BODY" | grep -o '"displayName":"[^"]*"' | head -1 | cut -d'"' -f4)
    PUBLISHER_ID=$(echo "$BODY" | grep -o '"publisherId":"[^"]*"' | head -1 | cut -d'"' -f4)
    
    if [ -n "$DISPLAY_NAME" ]; then
        echo -e "  ${GREEN}✓ Publisher: ${BOLD}$DISPLAY_NAME${NC}"
        echo -e "  ${GREEN}✓ Publisher ID: ${BOLD}$PUBLISHER_ID${NC}"
    else
        echo -e "  ${YELLOW}⚠ Não foi possível extrair informações${NC}"
    fi
    echo ""
fi

# Test 3: Extensions List
if [ "$AUTH_OK" = true ]; then
    echo -e "${BLUE}▶${NC} ${BOLD}Teste 3: Listar Extensões${NC}"
    EXT_RESPONSE=$(curl -s -w "\n%{http_code}" \
      -H "Authorization: Basic $(echo -n "user:$PAT" | base64)" \
      "https://marketplace.visualstudio.com/_apis/gallery/publishers/$PUBLISHER/extensions" 2>&1)
    
    EXT_HTTP=$(echo "$EXT_RESPONSE" | tail -n1)
    EXT_BODY=$(echo "$EXT_RESPONSE" | head -n-1)
    
    if [ "$EXT_HTTP" = "200" ]; then
        echo -e "  ${GREEN}✓ Acesso às extensões OK${NC}"
        
        # Try to parse extensions (if jq is available)
        if command -v jq &> /dev/null; then
            EXTENSIONS=$(echo "$EXT_BODY" | jq -r '.value[].extensionName' 2>/dev/null)
            if [ -n "$EXTENSIONS" ]; then
                echo -e "\n  ${CYAN}Extensões publicadas:${NC}"
                echo "$EXTENSIONS" | while read ext; do
                    echo -e "    • $ext"
                done
            else
                echo -e "  ${CYAN}ℹ Nenhuma extensão publicada ainda${NC}"
            fi
        else
            echo -e "  ${CYAN}ℹ Instale 'jq' para ver lista de extensões${NC}"
        fi
    else
        echo -e "  ${YELLOW}⚠ Não foi possível listar extensões (HTTP $EXT_HTTP)${NC}"
    fi
    echo ""
fi

# Test 4: vsce compatibility
echo -e "${BLUE}▶${NC} ${BOLD}Teste 4: Compatibilidade com vsce${NC}"
if command -v vsce &> /dev/null; then
    echo -e "  ${GREEN}✓ vsce instalado ($(vsce --version))${NC}"
    
    # Test if PAT works with vsce (non-interactive)
    echo -e "  ${CYAN}ℹ Para testar login: ${BOLD}vsce login $PUBLISHER${NC}"
else
    echo -e "  ${YELLOW}⚠ vsce não instalado${NC}"
    echo -e "  ${CYAN}ℹ Instale com: ${BOLD}npm install -g @vscode/vsce${NC}"
fi
echo ""

# Summary
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BOLD}${CYAN}  Resumo${NC}"
echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

if [ "$AUTH_OK" = true ]; then
    echo -e "${GREEN}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
    echo -e "${GREEN}${BOLD}║              ✓ PAT TOKEN VÁLIDO E FUNCIONANDO!            ║${NC}"
    echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
    echo -e "${GREEN}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BOLD}Você pode usar este token para:${NC}"
    echo -e "  ${GREEN}✓${NC} Publicar extensões no marketplace"
    echo -e "  ${GREEN}✓${NC} Gerenciar extensões existentes"
    echo -e "  ${GREEN}✓${NC} Atualizar versões"
    echo ""
    echo -e "${BOLD}Como usar:${NC}"
    echo -e "  ${CYAN}# Diretamente no script de publicação:${NC}"
    echo -e "  ${BLUE}./publish.sh --pat \"SEU_PAT\"${NC}"
    echo ""
    echo -e "  ${CYAN}# Ou armazenar com segurança:${NC}"
    echo -e "  ${BLUE}secret-tool store --label=\"VS Code PAT\" service vscode username $PUBLISHER${NC}"
    echo ""
else
    echo -e "${RED}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}${BOLD}║                                                           ║${NC}"
    echo -e "${RED}${BOLD}║              ✖ PROBLEMA COM O PAT TOKEN                   ║${NC}"
    echo -e "${RED}${BOLD}║                                                           ║${NC}"
    echo -e "${RED}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    case $HTTP_CODE in
      401)
        echo -e "${BOLD}Problema:${NC} Token inválido ou expirado"
        echo ""
        echo -e "${BOLD}Solução:${NC}"
        echo -e "  1. Crie novo token em: ${BLUE}https://dev.azure.com/_usersSettings/tokens${NC}"
        echo -e "  2. Certifique-se de selecionar: ${BOLD}Custom defined → Marketplace → Manage${NC}"
        echo -e "  3. Defina expiração adequada (90 dias recomendado)"
        ;;
      403)
        echo -e "${BOLD}Problema:${NC} Token sem permissões corretas"
        echo ""
        echo -e "${BOLD}Solução:${NC}"
        echo -e "  1. O token precisa ter permissão ${BOLD}Marketplace (Manage)${NC}"
        echo -e "  2. ${RED}NÃO${NC} é suficiente ter apenas ${YELLOW}Marketplace (Publish)${NC}"
        echo -e "  3. Crie novo token: ${BLUE}https://dev.azure.com/_usersSettings/tokens${NC}"
        echo -e "  4. Selecione: ${BOLD}Custom defined${NC} → ${BOLD}Marketplace${NC} → ${BOLD}Manage${NC}"
        ;;
      404)
        echo -e "${BOLD}Problema:${NC} Publisher não encontrado ou sem acesso"
        echo ""
        echo -e "${BOLD}Soluções possíveis:${NC}"
        echo -e "  1. Publisher '${BOLD}$PUBLISHER${NC}' não existe"
        echo -e "     → Crie em: ${BLUE}https://marketplace.visualstudio.com/manage/createpublisher${NC}"
        echo ""
        echo -e "  2. Sua conta não foi adicionada ao publisher"
        echo -e "     → Adicione em: ${BLUE}https://marketplace.visualstudio.com/manage/publishers/$PUBLISHER${NC}"
        echo -e "     → Vá em ${BOLD}Members${NC} e adicione seu email Microsoft"
        ;;
    esac
    echo ""
fi

echo -e "${BOLD}📚 Documentação completa:${NC}"
echo -e "  ${CYAN}.dev/docs/PAT_TOKEN_GUIDE.md${NC}"
echo ""
