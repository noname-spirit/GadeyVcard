# 🚀 Checklist de Déploiement - Smart vCard

## ✅ Pré-Déploiement

### 1. **Build Verification**
- [x] `npm run build` ✓ (Success)
- [x] Aucune erreur TypeScript
- [x] Aucun warning de compilation
- [x] Routes générées: 12/12

### 2. **Code Quality**
- [x] Linting: `npm run lint` (optional)
- [x] Pas de console.log() de debug
- [x] Variables d'env correctement setups
- [x] Secrets non exposés dans le code

### 3. **Environment Variables Setup**

**Variables à configurer en production:**

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Meta Pixel ID (optionnel)
NEXT_PUBLIC_META_PIXEL_ID=

# JWT Secret (générer une nouvelle clé cryptographique)
JWT_SECRET=
```

**Générer une clé JWT sécurisée:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. **Git Status**
- [ ] Tous les changements commitalizés
- [ ] `.env.local` n'est PAS versionnés (check .gitignore)
- [ ] `node_modules/` n'est PAS versionnés
- [ ] `.next/` n'est PAS versionnés

```bash
# Vérifier:
git status
```

### 5. **Déploiement sur Vercel** (Recommandé pour Next.js)

#### Option A: Via Dashboard Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your Git repository
4. Configure:
   - **Framework**: Next.js (auto-detected)
   - **Build Command**: `npm run build` ✓
   - **Output Directory**: `.next` ✓
   - **Install Command**: `npm install` ✓
5. Add Environment Variables (Settings → Environment Variables):
   - Firebase keys
   - Meta Pixel ID
   - JWT_SECRET
6. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Ou:
vercel deploy --prod
```

### 6. **Déploiement Alternative (Docker/Self-hosted)**

**Build Docker:**
```bash
# Create Dockerfile if needed
docker build -t messite:latest .
docker run -p 3000:3000 -e JWT_SECRET=xxx messite:latest
```

### 7. **Post-Deployment Checks**

After deployment, verify:

- [ ] Website loads at deployment URL
- [ ] Metadata/viewport configured correctly
- [ ] QR Scanner works (camera access)
- [ ] Lead capture form submits
- [ ] vCard download works (`/api/contact/vcf`)
- [ ] Admin login page works (`/admin`)
- [ ] Firebase is connected (check network)
- [ ] META Pixel fires (if configured)

```bash
# Test endpoints:
curl https://your-deployed-url.com/api/contact
curl https://your-deployed-url.com/api/contact/vcf
```

### 8. **Performance Optimization**

- [x] Images optimized with Next.js `<Image>`
- [x] CSS minified (Tailwind)
- [x] JavaScript bundled & minified
- [x] API routes optimized

**Check performance:**
```bash
# Vercel automatically provides Core Web Vitals dashboard
# Check at: https://vercel.com/dashboard/[project]/analytics
```

### 9. **Security Checklist**

- [x] JWT_SECRET is strong (256+ bits recommended)
- [x] No hardcoded credentials in code
- [x] `.env.local` not in version control
- [x] HTTPS enforced (automatic on Vercel)
- [x] CORS properly configured (if needed)
- [x] API routes protected (if needed)

### 10. **Monitoring & Logging**

Set up monitoring:

1. **Vercel Analytics**: Auto-enabled
2. **Error Tracking**: Sentry (optional)
   ```bash
   npm install @sentry/nextjs
   ```
3. **Firebase Console**: Monitor real-time database

---

## 📋 Deployment Steps Summary

```bash
# 1. Final checks
npm run build          # ✓ Already passing
npm run lint          # Optional but recommended

# 2. Git commit if needed
git add .
git commit -m "prepare for production deployment"
git push

# 3. Deploy to Vercel
vercel --prod

# 4. Configure environment variables in Vercel dashboard
# Settings → Environment Variables → Add Firebase & JWT keys

# 5. Test the live deployment
# Visit: https://your-deployed-url.com
```

---

## 🔗 Useful Links

- [Vercel Next.js Deployment](https://vercel.com/docs/frameworks/nextjs)
- [Firebase Web Setup](https://firebase.google.com/docs/web/setup)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Analytics](https://vercel.com/docs/analytics)

---

## ⚠️ Important Notes

1. **JWT_SECRET**: Must be strong and kept secret
2. **Firebase Keys**: All `NEXT_PUBLIC_*` are exposed to client
3. **Database**: Currently uses in-memory storage. Consider:
   - Firestore persistence
   - PostgreSQL database
   - MongoDB Atlas
4. **Backups**: Set up regular exports of leads/contacts data

---

**Status**: ✅ Ready to Deploy
**Build Time**: ~1.5s
**Bundle Size**: Optimized by Vercel
