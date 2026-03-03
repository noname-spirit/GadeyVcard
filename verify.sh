#!/bin/bash
# Smart vCard Project - Final Verification Script

echo "🔍 Vérification du projet Smart vCard..."
echo ""

# Check Node version
echo "✓ Node.js version:"
node --version | sed 's/^/  /'

# Check npm version
echo "✓ npm version:"
npm --version | sed 's/^/  /'

# Check project files
echo ""
echo "📁 Fichiers du projet:"

FILES=(
  "package.json"
  ".env.local"
  "app/page.tsx"
  "app/layout.tsx"
  "app/globals.css"
  "lib/firebase.ts"
  "public/contact.vcf"
  "next.config.ts"
  "tsconfig.json"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✓ $file"
  else
    echo "  ✗ MISSING: $file"
  fi
done

# Check documentation
echo ""
echo "📖 Documentation:"

DOCS=(
  "START_HERE.md"
  "GETTING_STARTED.md"
  "README.md"
  "SETUP_CHECKLIST.md"
  "FIREBASE_SETUP.md"
  "QUICK_START.md"
  "META_PIXEL_SETUP.md"
  "ARCHITECTURE.md"
  "PROJECT_SUMMARY.md"
)

for doc in "${DOCS[@]}"; do
  if [ -f "$doc" ]; then
    echo "  ✓ $doc"
  else
    echo "  ✗ MISSING: $doc"
  fi
done

# Check node_modules
echo ""
echo "📦 Dependencies:"

DEPS=(
  "firebase"
  "framer-motion"
  "lucide-react"
  "tailwindcss"
  "qrcode.react"
)

for dep in "${DEPS[@]}"; do
  if [ -d "node_modules/$dep" ]; then
    VERSION=$(grep -m1 '"version"' node_modules/$dep/package.json | sed 's/.*"version": "\([^"]*\)".*/\1/')
    echo "  ✓ $dep@$VERSION"
  else
    echo "  ✗ MISSING: $dep"
  fi
done

echo ""
echo "✅ Vérification complète!"
echo ""
echo "Prochaine étape: npm run dev"
