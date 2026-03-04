# ⚡ Quick Deploy Guide

## 🎯 Déploiement en 5 Minutes

### Option 1: Vercel (Le Plus Rapide) ⭐

```bash
# 1. Vérifier que tout est OK
./verify-deployment.sh

# 2. Committer les changements
git add .
git commit -m "chore: ready for production"
git push origin main

# 3. Sur Vercel Dashboard:
# - Importer le repo
# - Ajouter les env vars
# - Cliquer "Deploy"
# → Terminé! 🎉
```

**Variables d'Environnement à Ajouter:**
```
NEXT_PUBLIC_FIREBASE_API_KEY=REDACTED_FIREBASE_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=smartvcard-d5f0b.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=smartvcard-d5f0b
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=smartvcard-d5f0b.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=42665772190
NEXT_PUBLIC_FIREBASE_APP_ID=1:42665772190:web:15338166cc3e33028ae78f
RESEND_API_KEY=REDACTED_RESEND_KEY
ADMIN_NOTIFICATION_EMAIL=bonjour@noname-spirit.com
JWT_SECRET=17b5cc0c976b69357a0193ebcb56642f1a869582ce7c87512ce0736b216f31f8
```

---

### Option 2: Docker Local/VPS

```bash
# 1. Vérifier que Docker est installé
docker --version

# 2. Vérifier les fichiers
./verify-deployment.sh

# 3. Créer le fichier .env.production
cp .env.example .env.production
# (Remplir les valeurs)

# 4. Lancer avec Docker Compose
docker-compose up -d

# 5. Accéder le site
# http://localhost:3000
```

---

## ✅ Checklist Finale

Avant de déployer, vérifier:

```bash
# 1. La build réussit
npm run build

# 2. Pas d'erreurs TypeScript
npm run lint

# 3. Les variables d'env sont présentes
.env.local (ou .env.production)

# 4. Git est à jour
git status  # (should be clean)
```

---

## 🔗 Liens Utiles

| Service              | Lien                                | Action               |
| -------------------- | ----------------------------------- | -------------------- |
| **Vercel**           | https://vercel.com                  | Import repo & Deploy |
| **Resend**           | https://resend.com                  | Obtenir API key      |
| **Firebase Console** | https://console.firebase.google.com | Voir les données     |
| **GitHub**           | https://github.com                  | Voir les commits     |

---

## 📋 Post-Déploiement

✅ Tester que:
- [ ] Site charge correctement
- [ ] QR code fonctionne
- [ ] Formulaire soumet/envoie emails
- [ ] Admin page accessible
- [ ] Contacts s'enregistrent

---

## 🚨 En Cas de Problème

**Logs Vercel:**
```bash
vercel logs --follow
```

**Logs Docker:**
```bash
docker-compose logs -f
```

**Redéployer:**
```bash
git push origin main  # (Vercel redéploie auto)
# ou
docker-compose restart
```

---

**Vous êtes prêt à déployer! 🚀**
