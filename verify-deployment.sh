#!/bin/bash

# 🚀 Pre-Deployment Verification Script

echo "════════════════════════════════════════════════════════════════"
echo "          Smart vCard - Pre-Deployment Verification            "
echo "════════════════════════════════════════════════════════════════"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

FAILED=0

# Function to check command
check_command() {
    if command -v "$1" &> /dev/null; then
        echo -e "${GREEN}✓${NC} $1 is installed"
        return 0
    else
        echo -e "${RED}✗${NC} $1 is NOT installed"
        FAILED=$((FAILED+1))
        return 1
    fi
}

# Function to check file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1 exists"
        return 0
    else
        echo -e "${RED}✗${NC} $1 NOT found"
        FAILED=$((FAILED+1))
        return 1
    fi
}

# Function to check env variable
check_env() {
    if [ -z "${!1}" ]; then
        echo -e "${RED}✗${NC} $1 is NOT set"
        FAILED=$((FAILED+1))
        return 1
    else
        echo -e "${GREEN}✓${NC} $1 is set"
        return 0
    fi
}

echo "1️⃣  Checking System Requirements..."
echo "──────────────────────────────────────────────────────────────"
check_command "node"
check_command "npm"
check_command "git"
echo ""

echo "2️⃣  Checking Project Files..."
echo "──────────────────────────────────────────────────────────────"
check_file "package.json"
check_file ".env.example"
check_file "next.config.ts"
check_file "tsconfig.json"
check_file "Dockerfile"
check_file "docker-compose.yml"
echo ""

echo "3️⃣  Checking Node Modules..."
echo "──────────────────────────────────────────────────────────────"
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modules directory exists"
    if [ -f "package-lock.json" ]; then
        echo -e "${GREEN}✓${NC} package-lock.json exists"
    fi
else
    echo -e "${YELLOW}⚠${NC} node_modules not found - running npm install..."
    npm install
fi
echo ""

echo "4️⃣  Checking Environment Variables..."
echo "──────────────────────────────────────────────────────────────"
if [ -f ".env.local" ]; then
    echo -e "${GREEN}✓${NC} .env.local exists"
    
    # Source the env file cautiously
    if grep -q "RESEND_API_KEY" .env.local; then
        echo -e "${GREEN}✓${NC} RESEND_API_KEY is configured"
    else
        echo -e "${RED}✗${NC} RESEND_API_KEY is missing"
        FAILED=$((FAILED+1))
    fi
    
    if grep -q "ADMIN_NOTIFICATION_EMAIL" .env.local; then
        echo -e "${GREEN}✓${NC} ADMIN_NOTIFICATION_EMAIL is configured"
    else
        echo -e "${RED}✗${NC} ADMIN_NOTIFICATION_EMAIL is missing"
        FAILED=$((FAILED+1))
    fi
    
    if grep -q "JWT_SECRET" .env.local; then
        echo -e "${GREEN}✓${NC} JWT_SECRET is configured"
    else
        echo -e "${RED}✗${NC} JWT_SECRET is missing"
        FAILED=$((FAILED+1))
    fi
    
else
    echo -e "${YELLOW}⚠${NC} .env.local not found"
    echo "    Please copy .env.example to .env.local and fill in the values"
fi
echo ""

echo "5️⃣  Linting & Type Checking..."
echo "──────────────────────────────────────────────────────────────"
if npm run lint > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} ESLint passed"
else
    echo -e "${YELLOW}⚠${NC} Some ESLint warnings found (check with: npm run lint)"
fi
echo ""

echo "6️⃣  Building Project..."
echo "──────────────────────────────────────────────────────────────"
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Next.js build successful"
else
    echo -e "${RED}✗${NC} Build failed - check errors above"
    FAILED=$((FAILED+1))
fi
echo ""

echo "7️⃣  Git Status..."
echo "──────────────────────────────────────────────────────────────"
if [ -d ".git" ]; then
    echo -e "${GREEN}✓${NC} Git repository exists"
    
    UNCOMMITTED=$(git status --porcelain | wc -l)
    if [ "$UNCOMMITTED" -gt 0 ]; then
        echo -e "${YELLOW}⚠${NC} $UNCOMMITTED uncommitted changes"
        echo "    Run: git add . && git commit -m 'message'"
    else
        echo -e "${GREEN}✓${NC} All changes committed"
    fi
else
    echo -e "${RED}✗${NC} Git repository not found"
fi
echo ""

echo "8️⃣  Docker Configuration..."
echo "──────────────────────────────────────────────────────────────"
if check_command "docker"; then
    echo "    Docker is ready for containerized deployment"
fi
echo ""

echo "════════════════════════════════════════════════════════════════"
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All checks passed! Ready for deployment.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Verify .env.production with production values"
    echo "  2. Choose deployment platform (Vercel, Docker, VPS)"
    echo "  3. Follow DEPLOYMENT_PRODUCTION.md for detailed steps"
    exit 0
else
    echo -e "${RED}✗ $FAILED check(s) failed. Please fix issues before deploying.${NC}"
    exit 1
fi
