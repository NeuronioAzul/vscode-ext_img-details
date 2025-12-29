#!/bin/bash

# ================================================================================================
# Image Details Extension - Marketplace Publishing Only
# ================================================================================================
# This script publishes to VS Code Marketplace without creating git tags or releases.
# Useful for quick marketplace-only updates or republishing existing versions.
#
# Usage:
#   ./marketplace-publish.sh [--pat <token>] [--dry-run]
#
# Examples:
#   ./marketplace-publish.sh                    # Interactive mode with PAT prompt
#   ./marketplace-publish.sh --pat xyz123       # Direct publish with PAT
#   ./marketplace-publish.sh --dry-run          # Test without publishing
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
PACKAGE_JSON="$SCRIPT_DIR/../../package.json"
DRY_RUN=false
PAT=""

# ================================================================================================
# Helper Functions
# ================================================================================================

print_header() {
    echo -e "\n${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BOLD}${CYAN}  $1${NC}"
    echo -e "${BOLD}${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_step() {
    echo -e "${BOLD}${BLUE}▶${NC} ${BOLD}$1${NC}"
}

print_success() {
    echo -e "${GREEN}✔${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✖${NC} $1"
}

print_info() {
    echo -e "${CYAN}ℹ${NC} $1"
}

confirm() {
    local prompt="$1"
    local default="${2:-n}"
    local response
    
    if [ "$default" = "y" ]; then
        prompt="$prompt [${GREEN}Y${NC}/${BOLD}n${NC}]: "
    else
        prompt="$prompt [${BOLD}y${NC}/${RED}N${NC}]: "
    fi
    
    read -p "$(echo -e ${YELLOW}❯${NC} $prompt)" response
    response=${response:-$default}
    
    [[ "$response" =~ ^[Yy]$ ]]
}

# ================================================================================================
# Version and Package Info
# ================================================================================================

get_current_version() {
    grep -o '"version": *"[^"]*"' "$PACKAGE_JSON" | grep -o '[0-9][^"]*'
}

get_publisher() {
    grep -o '"publisher": *"[^"]*"' "$PACKAGE_JSON" | grep -o '[^"]*"$' | tr -d '"'
}

get_extension_name() {
    grep -m 1 '"displayName": *"[^"]*"' "$PACKAGE_JSON" | sed 's/.*: *"\([^"]*\)".*/\1/'
}

# ================================================================================================
# PAT Token Management
# ================================================================================================

validate_pat_token() {
    local pat=$1
    
    if [ -z "$pat" ]; then
        return 1
    fi
    
    print_step "Validating Personal Access Token..."
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Skipping PAT validation"
        return 0
    fi
    
    local publisher=$(get_publisher)
    
    local response=$(curl -s -w "\n%{http_code}" \
        -H "Accept: application/json;api-version=6.0-preview.1" \
        -H "Authorization: Basic $(echo -n "user:$pat" | base64)" \
        "https://marketplace.visualstudio.com/_apis/gallery/publishers/$publisher" 2>&1)
    
    local http_code=$(echo "$response" | tail -n1)
    
    if [ "$http_code" = "401" ]; then
        print_error "Personal Access Token is expired or invalid"
        return 1
    elif [ "$http_code" = "403" ]; then
        print_error "Personal Access Token doesn't have required permissions"
        echo ""
        print_info "Required: Marketplace (${BOLD}Manage${NC}) - NOT just 'Publish'"
        print_info "Create new PAT at: ${BLUE}https://dev.azure.com/[org]/_usersSettings/tokens${NC}"
        return 1
    elif [ "$http_code" = "404" ]; then
        print_error "Publisher not found or you don't have access to it"
        echo ""
        print_info "Publisher in package.json: ${BOLD}$publisher${NC}"
        print_info "Add your account to publisher: ${BLUE}https://marketplace.visualstudio.com/manage/publishers/$publisher${NC}"
        return 1
    elif [ "$http_code" != "200" ]; then
        print_warning "Could not validate PAT (HTTP $http_code). Will attempt to continue..."
        return 0
    fi
    
    print_success "Personal Access Token is valid"
    return 0
}

prompt_pat_token() {
    local pat=""
    local attempts=0
    local max_attempts=3
    
    print_header "🔐 Personal Access Token Required"
    echo -e "${CYAN}A Personal Access Token (PAT) is required to publish to the marketplace.${NC}"
    echo -e "${CYAN}Get your PAT from: ${BLUE}https://dev.azure.com/[organization]/_usersSettings/tokens${NC}\n"
    echo -e "${BOLD}Required permissions:${NC}"
    echo -e "  ${GREEN}✓${NC} Marketplace: ${BOLD}Manage${NC} ${YELLOW}(NOT just 'Publish' - use 'Manage')${NC}"
    echo -e ""
    echo -e "${BOLD}${RED}IMPORTANT:${NC}"
    echo -e "  ${YELLOW}⚠${NC}  Your Microsoft account must be added to the publisher"
    echo -e "  ${YELLOW}⚠${NC}  Manage publisher members at: ${BLUE}https://marketplace.visualstudio.com/manage/publishers/${NC}"
    echo -e ""
    
    while [ $attempts -lt $max_attempts ]; do
        read -sp "$(echo -e ${YELLOW}🔑${NC} Enter your Personal Access Token: )" pat
        echo ""
        
        if [ -z "$pat" ]; then
            print_error "PAT cannot be empty"
            attempts=$((attempts + 1))
            continue
        fi
        
        if validate_pat_token "$pat"; then
            echo "$pat"
            return 0
        else
            attempts=$((attempts + 1))
            if [ $attempts -lt $max_attempts ]; then
                print_error "Invalid or expired PAT. Please try again ($attempts/$max_attempts attempts)"
                echo ""
            fi
        fi
    done
    
    print_error "Maximum attempts reached. Cannot proceed without valid PAT."
    return 1
}

# ================================================================================================
# Marketplace Publishing
# ================================================================================================

check_vsce() {
    if ! command -v vsce &> /dev/null; then
        print_warning "vsce not found. Installing globally..."
        npm install -g @vscode/vsce
    fi
    print_success "vsce is available"
}

publish_to_marketplace() {
    local pat=$1
    
    print_step "Publishing to VS Code Marketplace"
    
    check_vsce
    
    if [ "$DRY_RUN" = true ]; then
        print_info "[DRY-RUN] Would publish to marketplace"
        print_info "[DRY-RUN] Package contents:"
        echo ""
        vsce ls
        return 0
    fi
    
    local publisher=$(get_publisher)
    echo ""
    print_info "Publisher: ${BOLD}$publisher${NC}"
    print_info "Version: ${BOLD}v$(get_current_version)${NC}"
    print_warning "Make sure your Microsoft account is authorized for this publisher"
    
    if ! confirm "Continue with publishing?" "y"; then
        print_warning "Publishing cancelled"
        return 1
    fi
    
    print_step "Packaging and uploading to marketplace..."
    echo ""
    
    # Executa vsce publish e captura output
    if ! vsce publish -p "$pat" 2>&1 | tee /tmp/vsce_output.log; then
        local exit_code=$?
        echo ""
        
        # Verifica se é erro de autorização TF400813
        if grep -q "TF400813" /tmp/vsce_output.log; then
            print_error "❌ AUTHORIZATION ERROR (TF400813)"
            echo ""
            echo -e "${RED}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
            echo -e "${RED}${BOLD}║                                                           ║${NC}"
            echo -e "${RED}${BOLD}║   ⚠️  YOU ARE NOT AUTHORIZED TO PUBLISH THIS EXTENSION    ║${NC}"
            echo -e "${RED}${BOLD}║                                                           ║${NC}"
            echo -e "${RED}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"
            echo ""
            
            # Extrai a mensagem de erro completa
            local error_msg=$(grep -A 2 "TF400813" /tmp/vsce_output.log | head -n 1)
            print_error "Error details:"
            echo -e "  ${YELLOW}$error_msg${NC}"
            echo ""
            
            print_info "${BOLD}Why this happens:${NC}"
            echo -e "  ${CYAN}1.${NC} Your Microsoft account is ${BOLD}NOT added to the publisher${NC}"
            echo -e "  ${CYAN}2.${NC} Your PAT doesn't have the correct permissions"
            echo -e "  ${CYAN}3.${NC} You're using the wrong Azure DevOps organization"
            echo ""
            
            print_info "${BOLD}How to fix:${NC}"
            echo -e "  ${GREEN}Step 1:${NC} Add your Microsoft account to the publisher"
            echo -e "          ${BLUE}https://marketplace.visualstudio.com/manage/publishers/$publisher${NC}"
            echo -e "          ${YELLOW}→${NC} Click 'Members' tab"
            echo -e "          ${YELLOW}→${NC} Add your Microsoft email"
            echo ""
            echo -e "  ${GREEN}Step 2:${NC} Create new PAT with correct permissions"
            echo -e "          ${BLUE}https://dev.azure.com/_usersSettings/tokens${NC}"
            echo -e "          ${YELLOW}→${NC} Select 'Marketplace' (${BOLD}Manage${NC}) permission"
            echo -e "          ${YELLOW}→${NC} NOT just 'Publish' - must be 'Manage'"
            echo ""
            echo -e "  ${GREEN}Step 3:${NC} Make sure you're in the correct Azure DevOps organization"
            echo -e "          ${YELLOW}→${NC} PAT must be from the same org as the publisher"
            echo ""
            
            print_warning "${BOLD}IMPORTANT:${NC} Ask the publisher owner to add you first!"
            echo ""
            
            rm -f /tmp/vsce_output.log
            return 1
        fi
        
        # Outros erros de autorização (403, not authorized)
        if grep -q "not authorized\|403" /tmp/vsce_output.log; then
            print_error "Authorization error detected!"
            echo ""
            print_info "Common causes:"
            print_info "  1. PAT needs 'Marketplace (${BOLD}Manage${NC})' permission"
            print_info "  2. Your account is not added to the publisher"
            echo ""
            print_info "Quick fix:"
            print_info "  • Add yourself: ${BLUE}https://marketplace.visualstudio.com/manage/publishers/$publisher${NC}"
            print_info "  • New PAT: ${BLUE}https://dev.azure.com/_usersSettings/tokens${NC}"
            echo ""
            rm -f /tmp/vsce_output.log
            return 1
        fi
        
        # Erro genérico
        print_error "Failed to publish to marketplace (exit code: $exit_code)"
        echo ""
        print_info "Check the output above for details"
        echo ""
        rm -f /tmp/vsce_output.log
        return 1
    fi
    
    rm -f /tmp/vsce_output.log
    print_success "Published to VS Code Marketplace"
}

# ================================================================================================
# Main
# ================================================================================================

show_help() {
    cat << 'EOF'
┌──────────────────────────────────────────────────────────────────────────────┐
│              📤 Image Details - Marketplace Publishing Only                  │
│                  Quick publish without git tags or releases                  │
└──────────────────────────────────────────────────────────────────────────────┘

USAGE:
    ./marketplace-publish.sh [OPTIONS]

DESCRIPTION:
    Publishes the extension to VS Code Marketplace without creating git tags
    or GitHub releases. Useful for:
    
    • Quick marketplace-only updates
    • Republishing existing versions
    • Testing marketplace publication
    • Emergency hotfix deployments

OPTIONS:
    --pat <token>    Personal Access Token for Azure DevOps
                     If not provided, you'll be prompted securely
                     
    --dry-run        Test mode - shows what would be published
                     without actually uploading
                     
    -h, --help       Display this help message

EXAMPLES:
    Interactive mode (will prompt for PAT):
        ./marketplace-publish.sh
    
    Direct publish with PAT:
        ./marketplace-publish.sh --pat "your-token-here"
    
    Dry-run to preview package:
        ./marketplace-publish.sh --dry-run

PERSONAL ACCESS TOKEN (PAT):
    Required permissions: Marketplace (Manage) - NOT just "Publish"
    
    Create PAT:    https://dev.azure.com/[org]/_usersSettings/tokens
    Manage access: https://marketplace.visualstudio.com/manage/publishers/
    
    ⚠️  IMPORTANT: Your Microsoft account must be added to the publisher!

WHAT THIS SCRIPT DOES:
    ✓ Validates Personal Access Token
    ✓ Checks vsce availability (installs if needed)
    ✓ Shows current version and publisher info
    ✓ Publishes to VS Code Marketplace
    
    ✗ Does NOT create git tags
    ✗ Does NOT create GitHub releases
    ✗ Does NOT modify package.json

REQUIREMENTS:
    • Node.js and npm
    • @vscode/vsce (installed automatically if missing)
    • Valid Personal Access Token with Marketplace (Manage) permission

EXIT CODES:
    0 - Success
    1 - Error or user cancelled

NOTE:
    For full release workflow (git tags, GitHub release, and marketplace),
    use the main publish.sh script instead.

EOF
}

parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --pat)
                PAT="$2"
                shift 2
                ;;
            --dry-run)
                DRY_RUN=true
                shift
                ;;
            -h|--help)
                show_help
                exit 0
                ;;
            *)
                print_error "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
    done
}

main() {
    clear
    
    print_header "📤 Marketplace Publishing - $(get_extension_name)"
    
    if [ "$DRY_RUN" = true ]; then
        print_warning "DRY-RUN MODE: No changes will be made"
        echo ""
    fi
    
    # Show current package info
    print_step "Package Information"
    echo -e "  ${BOLD}Name:${NC}      $(get_extension_name)"
    echo -e "  ${BOLD}Version:${NC}   v$(get_current_version)"
    echo -e "  ${BOLD}Publisher:${NC} $(get_publisher)"
    echo ""
    
    # Get and validate PAT
    if [ -z "$PAT" ]; then
        PAT=$(prompt_pat_token) || {
            print_error "Cannot proceed without a valid Personal Access Token"
            exit 1
        }
    else
        if ! validate_pat_token "$PAT"; then
            print_error "The provided PAT is invalid or expired"
            echo ""
            print_info "Common issues:"
            print_info "  1. PAT needs 'Marketplace (Manage)' permission, not just 'Publish'"
            print_info "  2. Your Microsoft account must be added to the publisher"
            print_info "  3. Manage at: ${BLUE}https://marketplace.visualstudio.com/manage${NC}"
            exit 1
        fi
    fi
    echo ""
    
    # Publish
    publish_to_marketplace "$PAT" || exit 1
    
    # Success message
    if [ "$DRY_RUN" = false ]; then
        echo ""
        print_header "✅ Publishing Complete"
        
        echo -e "${GREEN}${BOLD}╔═══════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
        echo -e "${GREEN}${BOLD}║    Successfully published v$(get_current_version) to Marketplace!          ║${NC}"
        echo -e "${GREEN}${BOLD}║                                                           ║${NC}"
        echo -e "${GREEN}${BOLD}╚═══════════════════════════════════════════════════════════╝${NC}"
        echo ""
        
        echo -e "${BOLD}📍 VS Code Marketplace:${NC}"
        echo -e "${CYAN}   https://marketplace.visualstudio.com/items?itemName=$(get_publisher).image-details${NC}"
        echo ""
        
        print_info "Note: It may take a few minutes for the update to appear on the marketplace"
    fi
}

# ================================================================================================
# Entry Point
# ================================================================================================

parse_arguments "$@"
main
