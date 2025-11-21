#!/bin/bash

# ================================================================================================
# Image Details Extension - Publishing Script
# ================================================================================================
# This script automates the publishing process for the VS Code extension:
# 1. Version management with intelligent suggestions
# 2. Git tag creation and push
# 3. GitHub release creation
# 4. VS Code Marketplace publishing
#
# Usage:
#   ./publish.sh [--version <version>] [--pat <token>] [--message <text>] [--dry-run]
#
# Examples:
#   ./publish.sh                                    # Interactive mode
#   ./publish.sh --version 1.0.4 --pat xyz123      # With parameters
#   ./publish.sh --dry-run                          # Test without publishing
# ================================================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PACKAGE_JSON="$SCRIPT_DIR/package.json"
CHANGELOG="$SCRIPT_DIR/CHANGELOG.md"
DRY_RUN=false

# ================================================================================================
# Helper Functions
# ================================================================================================

# Imprime um cabeçalho destacado em ciano com bordas
# Usado para separar visualmente as seções principais do script
# Args:
#   $1: Texto do cabeçalho
print_header() {
    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

# Imprime uma mensagem de passo/etapa em azul com seta
# Usado para indicar o início de uma operação
# Args:
#   $1: Mensagem do passo
print_step() {
    echo -e "${BOLD}${BLUE}▶${NC} ${BOLD}$1${NC}"
}

# Imprime uma mensagem de sucesso em verde com checkmark
# Usado para confirmar conclusão bem-sucedida de operações
# Args:
#   $1: Mensagem de sucesso
print_success() {
    echo -e "${GREEN}✔${NC} $1"
}

# Imprime uma mensagem de aviso em amarelo com símbolo de atenção
# Usado para alertar sobre situações que requerem atenção mas não impedem execução
# Args:
#   $1: Mensagem de aviso
print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Imprime uma mensagem de erro em vermelho com X
# Usado para indicar falhas ou problemas críticos
# Args:
#   $1: Mensagem de erro
print_error() {
    echo -e "${RED}✖${NC} $1"
}

# Imprime uma mensagem informativa em ciano com símbolo de informação
# Usado para fornecer contexto ou informações adicionais
# Args:
#   $1: Mensagem informativa
print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

# Solicita confirmação do usuário com resposta sim/não
# Retorna 0 (true) se usuário confirmar, 1 (false) caso contrário
# Args:
#   $1: Texto do prompt
#   $2: Resposta padrão ('y' ou 'n', padrão: 'n')
# Returns:
#   0 se usuário responder Y/y, 1 caso contrário
confirm() {
    local prompt="$1"
    local default="${2:-n}"
    local response
    
    # Ajusta o prompt baseado no padrão
    if [ "$default" = "y" ]; then
        prompt="$prompt [${GREEN}Y${NC}/${BOLD}n${NC}]: "
    else
        prompt="$prompt [${BOLD}y${NC}/${RED}N${NC}]: "
    fi
    
    # Lê resposta do usuário
    read -p "$(echo -e ${YELLOW}❯${NC} $prompt)" response
    response=${response:-$default}
    
    # Retorna true se resposta for Y ou y
    [[ "$response" =~ ^[Yy]$ ]]
}

# ================================================================================================
# Version Management
# ================================================================================================

# Obtém a versão atual do package.json
# Procura pelo campo "version" e extrai apenas os números
# Returns:
#   String com a versão atual (ex: "1.0.3")
get_current_version() {
    grep -o '"version": *"[^"]*"' "$PACKAGE_JSON" | grep -o '[0-9][^"]*'
}

# Remove o prefixo 'v' de uma string de versão se presente
# Args:
#   $1: Versão com ou sem prefixo 'v' (ex: "v1.0.3" ou "1.0.3")
# Returns:
#   Versão sem o prefixo 'v' (ex: "1.0.3")
parse_version() {
    local version=$1
    echo "$version" | sed 's/v//'
}

# Sugere as próximas versões baseadas em Semantic Versioning
# Calcula automaticamente patch, minor e major versions
# Args:
#   $1: Versão atual (ex: "1.0.3")
# Returns:
#   String com 3 sugestões separadas por pipe (ex: "1.0.4|1.1.0|2.0.0")
suggest_next_version() {
    local current=$1
    local major minor patch
    
    # Separa major.minor.patch em variáveis
    IFS='.' read -r major minor patch <<< "$current"
    
    # Calcula próximas versões
    local patch_next="$major.$minor.$((patch + 1))"      # 1.0.3 -> 1.0.4
    local minor_next="$major.$((minor + 1)).0"           # 1.0.3 -> 1.1.0
    local major_next="$((major + 1)).0.0"                # 1.0.3 -> 2.0.0
    
    echo "$patch_next|$minor_next|$major_next"
}

# Valida se uma string está no formato correto de versão (X.Y.Z)
# Verifica se contém apenas números separados por pontos
# Args:
#   $1: String de versão a validar
# Returns:
#   0 se válida, 1 se inválida
validate_version() {
    local version=$1
    if [[ ! "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
        return 1
    fi
    return 0
}

# Solicita interativamente a seleção de versão ao usuário
# Exibe versão atual e sugere 3 opções (patch/minor/major) + custom
# Valida entrada do usuário e retorna versão escolhida
# Returns:
#   String com a versão selecionada (ex: "1.0.4")
prompt_version() {
    local current_version=$(get_current_version)
    local suggestions=$(suggest_next_version "$current_version")
    
    # Separa as sugestões em variáveis individuais
    IFS='|' read -r patch_version minor_version major_version <<< "$suggestions"
    
    # Exibe cabeçalho e opções (redireciona para stderr para não interferir com captura)
    print_header "📦 Version Selection" >&2
    echo -e "${BOLD}Current version:${NC} ${GREEN}v$current_version${NC}\n" >&2
    
    echo -e "${BOLD}Choose new version:${NC}" >&2
    echo -e "  ${BOLD}${GREEN}1)${NC} v$patch_version  ${CYAN}Patch${NC}   - Bug fixes, backward compatible ${BOLD}[RECOMMENDED]${NC}" >&2
    echo -e "  ${BOLD}${BLUE}2)${NC} v$minor_version  ${CYAN}Minor${NC}   - New features, backward compatible" >&2
    echo -e "  ${BOLD}${MAGENTA}3)${NC} v$major_version  ${CYAN}Major${NC}   - Breaking changes" >&2
    echo -e "  ${BOLD}${YELLOW}4)${NC} Custom    - Enter your own version" >&2
    echo "" >&2
    
    # Lê escolha do usuário (padrão: 1 - patch)
    local choice
    read -p "$(echo -e ${YELLOW}❯${NC} Select option [1-4]: )" choice
    choice=${choice:-1}
    
    # Processa escolha e retorna versão selecionada
    local selected_version
    case $choice in
        1) selected_version="$patch_version" ;;
        2) selected_version="$minor_version" ;;
        3) selected_version="$major_version" ;;
        4)
            # Versão customizada com validação em loop
            while true; do
                read -p "$(echo -e ${YELLOW}?${NC} Enter custom version [format: X.Y.Z]: )" selected_version
                if validate_version "$selected_version"; then
                    break
                else
                    print_error "Invalid version format. Please use X.Y.Z (e.g., 1.0.4)" >&2
                fi
            done
            ;;
        *)
            # Escolha inválida, usa patch como fallback
            print_error "Invalid choice. Using patch version." >&2
            selected_version="$patch_version"
            ;;
    esac
    
    # Retorna apenas a versão para stdout (será capturada por VERSION=$(prompt_version))
    echo "$selected_version"
}

# ================================================================================================
# Release Message
# ================================================================================================

# Extrai automaticamente as release notes do CHANGELOG.md para uma versão específica
# Procura pela seção da versão e retorna todo o conteúdo até a próxima versão
# Args:
#   $1: Versão a buscar (ex: "1.0.3")
#   $2: Caminho do arquivo CHANGELOG.md
# Returns:
#   Texto das release notes (sem espaços vazios), ou vazio se não encontrado
extract_changelog_for_version() {
    local version=$1
    local changelog_file="$2"
    
    # Extrai conteúdo entre ## [version] e próximo ## [
    # Usa awk para processar o arquivo linha por linha
    awk -v ver="$version" '
        /^## \[/ {
            if (found) exit                      # Se já encontrou, para ao achar próxima versão
            if (index($0, "[" ver "]") > 0) {   # Se encontrou a versão buscada
                found=1                          # Marca como encontrado
                next                             # Pula para próxima linha
            }
        }
        found && /^## \[/ { exit }              # Se encontrou e achou nova versão, para
        found { print }                         # Se encontrou, imprime a linha
    ' "$changelog_file" | sed -e 's/^[[:space:]]*//' -e '/^$/d'  # Remove espaços e linhas vazias
}

# Solicita interativamente a mensagem de release
# Tenta extrair automaticamente do CHANGELOG, caso contrário solicita entrada manual
# Args:
#   $1: Versão para a qual criar a mensagem
# Returns:
#   Texto da mensagem de release
prompt_release_message() {
    local version=$1
    
    print_header "📝 Release Message" >&2
    
    # Tenta extrair automaticamente do CHANGELOG
    local auto_message=""
    if [ -f "$CHANGELOG" ]; then
        auto_message=$(extract_changelog_for_version "$version" "$CHANGELOG" 2>/dev/null || echo "")
    fi
    
    # Se encontrou no CHANGELOG, oferece para usar
    if [ -n "$auto_message" ]; then
        echo -e "${GREEN}✓${NC} Found in CHANGELOG.md for v$version\n" >&2
        
        # Preview truncado (primeiras 10 linhas)
        local preview=$(echo "$auto_message" | head -n 10)
        local line_count=$(echo "$auto_message" | wc -l | tr -d ' ')
        
        echo -e "${CYAN}Preview:${NC}" >&2
        echo -e "${CYAN}┌─────────────────────────────────────────────────────────┐${NC}" >&2
        echo "$preview" | sed 's/^/│ /' >&2
        if [ "$line_count" -gt 10 ]; then
            echo -e "${CYAN}│ ... ($((line_count - 10)) more lines)${NC}" >&2
        fi
        echo -e "${CYAN}└─────────────────────────────────────────────────────────┘${NC}\n" >&2
        
        if confirm "Use this message from CHANGELOG?" "y"; then
            echo "$auto_message"
            return
        fi
    else
        print_warning "No changelog entry found for v$version" >&2
    fi
    
    # Se não encontrou ou usuário recusou, usa mensagem padrão em dry-run
    if [ "$DRY_RUN" = true ]; then
        local message="Release v$version"
        print_info "Using default message in dry-run mode: $message" >&2
        echo "$message"
        return
    fi
    
    # Solicita entrada manual apenas em modo normal
    echo -e "Enter release message (press Ctrl+D when done, or Ctrl+C to cancel):\n" >&2
    local message=$(cat)
    
    # Se não digitou nada, usa mensagem padrão
    if [ -z "$message" ]; then
        message="Release v$version"
        print_warning "Using default message: $message" >&2
    fi
    
    echo "$message"
}

# ================================================================================================
# Git Operations
# ================================================================================================

# Verifica se o working directory do git está limpo (sem mudanças não commitadas)
# Essencial para garantir que todas as mudanças foram commitadas antes de criar tag
# Returns:
#   0 se limpo, 1 se há mudanças pendentes
check_git_clean() {
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Skipping git status check"
        return 0
    fi
    
    # Verifica se há diferenças entre working directory e HEAD
    if ! git diff-index --quiet HEAD --; then
        print_error "Working directory is not clean. Please commit or stash changes first."
        print_info "Uncommitted files:"
        git status --short
        return 1
    fi
    return 0
}

# Verifica se o remote 'origin' está configurado
# Necessário para fazer push de tags
# Returns:
#   0 se remote existe, 1 caso contrário
check_git_remote() {
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Skipping git remote check"
        return 0
    fi
    
    # Tenta obter URL do remote origin
    if ! git remote get-url origin &>/dev/null; then
        print_error "No git remote 'origin' found."
        return 1
    fi
    return 0
}

# Cria uma tag anotada do git com a versão e mensagem
# Se a tag já existe, oferece opção de deletar e recriar
# Args:
#   $1: Versão (ex: "1.0.3")
#   $2: Mensagem da tag (release notes)
# Returns:
#   0 se sucesso, 1 se falha ou usuário cancelou
create_git_tag() {
    local version=$1
    local message=$2
    local tag="v$version"  # Adiciona prefixo 'v' à versão
    
    print_step "Creating Git tag: $tag"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would create tag: $tag"
        print_info "[DRY-RUN] Tag message: $message"
        return 0
    fi
    
    # Verifica se tag já existe
    if git rev-parse "$tag" &>/dev/null; then
        print_warning "Tag $tag already exists."
        # Oferece opção de deletar e recriar
        if ! confirm "Delete existing tag and recreate?" "n"; then
            return 1
        fi
        # Remove tag local e remota
        git tag -d "$tag"
        git push origin ":refs/tags/$tag" 2>/dev/null || true
    fi
    
    # Cria tag anotada (-a) com mensagem (-m)
    git tag -a "$tag" -m "$message"
    print_success "Tag created: $tag"
}

# Faz push da tag criada para o remote origin (GitHub)
# Args:
#   $1: Versão (ex: "1.0.3")
# Returns:
#   0 se sucesso
push_git_tag() {
    local version=$1
    local tag="v$version"
    
    print_step "Pushing tag to GitHub"
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would push tag: $tag"
        return 0
    fi
    
    # Push apenas da tag específica
    git push origin "$tag"
    print_success "Tag pushed to GitHub: $tag"
}

# ================================================================================================
# GitHub Release
# ================================================================================================

# Verifica se o GitHub CLI (gh) está instalado e autenticado
# O GitHub CLI é opcional, mas permite criar releases automaticamente
# Returns:
#   0 se gh está disponível e autenticado, 1 caso contrário
check_gh_cli() {
    # Verifica se comando 'gh' existe
    if ! command -v gh &> /dev/null; then
        print_warning "GitHub CLI (gh) not found."
        print_info "Install: https://cli.github.com/"
        return 1
    fi
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] GitHub CLI found"
        return 0
    fi
    
    # Verifica se está autenticado
    if ! gh auth status &>/dev/null; then
        print_warning "GitHub CLI not authenticated."
        print_info "Run: gh auth login"
        return 1
    fi
    
    return 0
}

# Cria uma release no GitHub usando o GitHub CLI
# A release é criada a partir da tag e inclui as release notes
# Args:
#   $1: Versão (ex: "1.0.3")
#   $2: Mensagem/notas da release
# Returns:
#   0 sempre (não bloqueia se gh não estiver disponível)
create_github_release() {
    local version=$1
    local message=$2
    local tag="v$version"
    
    print_step "Creating GitHub Release"
    
    # Se gh não está disponível, apenas avisa e continua
    if ! check_gh_cli; then
        print_warning "Skipping GitHub release creation"
        return 0
    fi
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would create GitHub release: $tag"
        print_info "[DRY-RUN] Release notes: $message"
        return 0
    fi
    
    # Cria release no GitHub
    # --title: Título da release
    # --notes: Corpo da release (release notes)
    # --latest: Marca como latest release
    gh release create "$tag" \
        --title "Release $tag" \
        --notes "$message" \
        --latest
    
    print_success "GitHub release created: $tag"
}

# ================================================================================================
# VS Code Marketplace
# ================================================================================================

# Verifica se vsce (VS Code Extension CLI) está instalado
# Se não estiver, instala automaticamente via npm global
# Returns:
#   0 sempre (instala se necessário)
check_vsce() {
    # Verifica se comando 'vsce' existe
    if ! command -v vsce &> /dev/null; then
        print_warning "vsce not found. Installing globally..."
        npm install -g @vscode/vsce
    fi
    print_success "vsce is available"
}

# Publica a extensão no VS Code Marketplace
# Empacota a extensão e faz upload usando o Personal Access Token (PAT)
# Args:
#   $1: Personal Access Token (PAT) do Azure DevOps (opcional)
# Returns:
#   0 se sucesso, 1 se falha
publish_to_marketplace() {
    local pat=$1
    
    print_step "Publishing to VS Code Marketplace"
    
    # Garante que vsce está instalado
    check_vsce
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would publish to marketplace"
        print_info "[DRY-RUN] Package:"
        vsce ls  # Lista arquivos que seriam incluídos no pacote
        return 0
    fi
    
    # Se PAT não foi fornecido, solicita ao usuário
    if [ -z "$pat" ]; then
        print_error "Personal Access Token (PAT) is required for publishing."
        print_info "Get your PAT from: https://dev.azure.com/"
        # -s: modo silencioso (não mostra o que é digitado)
        # -p: exibe prompt
        read -sp "$(echo -e ${YELLOW}?${NC} Enter your PAT: )" pat
        echo ""
    fi
    
    # Valida que PAT não está vazio
    if [ -z "$pat" ]; then
        print_error "PAT cannot be empty"
        return 1
    fi
    
    # Empacota e publica a extensão
    # -p: especifica o PAT para autenticação
    vsce publish -p "$pat"
    
    print_success "Published to VS Code Marketplace"
}

# ================================================================================================
# Main Workflow
# ================================================================================================

# Processa argumentos da linha de comando
# Permite uso não-interativo do script com todas as opções via CLI
# Args:
#   $@: Todos os argumentos passados ao script
# Sets:
#   VERSION, PAT, MESSAGE, DRY_RUN (variáveis globais)
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version)
                VERSION="$2"
                shift 2  # Consome argumento e seu valor
                ;;
            --pat)
                PAT="$2"
                shift 2
                ;;
            --message)
                MESSAGE="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift  # Consome apenas o argumento (flag booleana)
                ;;
            -h|--help)
                # Exibe ajuda e sai
                echo "Usage: $0 [options]"
                echo ""
                echo "Options:"
                echo "  --version <version>   Specify version (e.g., 1.0.4)"
                echo "  --pat <token>         Personal Access Token for marketplace"
                echo "  --message <text>      Release message"
                echo "  --dry-run             Test without making changes"
                echo "  -h, --help            Show this help"
                exit 0
                ;;
            *)
                # Argumento desconhecido
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

# Função principal que orquestra todo o processo de publicação
# Executa as seguintes etapas:
#   1. Pre-flight checks (git clean, remote configurado)
#   2. Seleção de versão (interativa ou via CLI)
#   3. Obtenção de release message (CHANGELOG ou manual)
#   4. Exibição de resumo e confirmação
#   5. Criação e push de git tag
#   6. Criação de GitHub release
#   7. Publicação no VS Code Marketplace
# Exits:
#   0 se sucesso, 1 se erro ou cancelamento
main() {
    clear
    
    print_header "🚀 Image Details Extension - Publishing Wizard"
    
    # Avisa se está em modo dry-run
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY-RUN MODE: No changes will be made"
        echo ""
    fi
    
    # ============================================================
    # FASE 1: Pre-flight checks
    # ============================================================
    print_step "Running pre-flight checks..."
    check_git_clean || exit 1      # Garante que não há mudanças pendentes
    check_git_remote || exit 1     # Garante que remote origin existe
    print_success "Pre-flight checks passed"
    echo ""
    
    # ============================================================
    # FASE 2: Obter versão
    # ============================================================
    if [ -z "$VERSION" ]; then
        # Modo interativo: solicita versão ao usuário
        VERSION=$(prompt_version)
    else
        # Modo CLI: valida versão fornecida
        VERSION=$(parse_version "$VERSION")  # Remove 'v' se presente
        if ! validate_version "$VERSION"; then
            print_error "Invalid version format: $VERSION"
            exit 1
        fi
    fi
    
    # ============================================================
    # FASE 3: Obter mensagem de release
    # ============================================================
    if [ -z "$MESSAGE" ]; then
        # Tenta extrair do CHANGELOG ou solicita manualmente
        MESSAGE=$(prompt_release_message "$VERSION")
    fi
    
    # ============================================================
    # FASE 4: Exibir resumo e confirmar
    # ============================================================
    print_header "📋 Publishing Summary"
    
    # Tabela formatada
    echo -e "${BOLD}${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${BOLD}${CYAN}│${NC} ${BOLD}Version Details${NC}                                          ${BOLD}${CYAN}│${NC}"
    echo -e "${BOLD}${CYAN}├─────────────────────────────────────────────────────────────┤${NC}"
    printf "${BOLD}${CYAN}│${NC} %-18s ${GREEN}v%-38s${NC} ${BOLD}${CYAN}│${NC}\n" "Current:" "$(get_current_version)"
    printf "${BOLD}${CYAN}│${NC} %-18s ${YELLOW}v%-38s${NC} ${BOLD}${CYAN}│${NC}\n" "New Version:" "$VERSION"
    printf "${BOLD}${CYAN}│${NC} %-18s ${BLUE}v%-38s${NC} ${BOLD}${CYAN}│${NC}\n" "Git Tag:" "$VERSION"
    echo -e "${BOLD}${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    
    # Preview das release notes
    echo -e "${BOLD}Release Notes Preview:${NC}"
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo "$MESSAGE" | head -n 5 | sed 's/^/│ /'
    local msg_lines=$(echo "$MESSAGE" | wc -l | tr -d ' ')
    if [ "$msg_lines" -gt 5 ]; then
        echo -e "${CYAN}│ ... ($((msg_lines - 5)) more lines)${NC}"
    fi
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "This is a DRY-RUN. No actual changes will be made."
        echo ""
    fi
    
    # Confirmação final antes de prosseguir
    if ! confirm "Proceed with publishing?" "y"; then
        print_warning "Publishing cancelled by user"
        exit 0
    fi
    
    # ============================================================
    # FASE 5: Executar workflow de publicação
    # ============================================================
    print_header "🚀 Publishing Workflow"
    
    echo -e "${CYAN}Progress: [1/3] Git Tagging${NC}"
    echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
    # Passo 1: Criar e fazer push da tag git
    create_git_tag "$VERSION" "$MESSAGE" || exit 1
    push_git_tag "$VERSION" || exit 1
    echo ""
    
    echo -e "${CYAN}Progress: [2/3] GitHub Release${NC}"
    echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
    # Passo 2: Criar release no GitHub (opcional, não bloqueia se falhar)
    create_github_release "$VERSION" "$MESSAGE"
    echo ""
    
    echo -e "${CYAN}Progress: [3/3] Marketplace Publishing${NC}"
    echo -e "${CYAN}─────────────────────────────────────────────────────────────${NC}"
    # Passo 3: Publicar no marketplace (com confirmação)
    if confirm "Publish to VS Code Marketplace?" "y"; then
        publish_to_marketplace "$PAT" || exit 1
    else
        print_warning "Skipped marketplace publishing"
    fi
    
    # ============================================================
    # FASE 6: Mensagem de sucesso
    # ============================================================
    print_header "✅ Publishing Complete"
    
    echo -e "${GREEN}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
    echo -e "${GREEN}${BOLD}║           Successfully published v$VERSION!                 ║${NC}"
    echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
    echo -e "${GREEN}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"
    echo ""
    
    echo -e "${BOLD}📍 Quick Links:${NC}"
    echo -e "${CYAN}┌─────────────────────────────────────────────────────────────┐${NC}"
    echo -e "${CYAN}│${NC} ${BOLD}GitHub Release:${NC}                                          ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   https://github.com/NeuronioAzul/vscode-ext_img-details/releases${CYAN}│${NC}"
    echo -e "${CYAN}│                                                             │${NC}"
    echo -e "${CYAN}│${NC} ${BOLD}VS Code Marketplace:${NC}                                     ${CYAN}│${NC}"
    echo -e "${CYAN}│${NC}   https://marketplace.visualstudio.com/items?itemName=…   ${CYAN}│${NC}"
    echo -e "${CYAN}└─────────────────────────────────────────────────────────────┘${NC}"
    echo ""
}

# ================================================================================================
# Script Entry Point
# ================================================================================================
# Ponto de entrada do script
# Processa argumentos CLI e executa função principal

parse_arguments "$@"  # Processa todos os argumentos passados ao script
main                  # Executa workflow principal
