# 🚀 Guide de Déploiement en Production

## ✅ Checklist Pre-Déploiement

### 1. Vérifications Locales
- [x] Build réussie: `npm run build`
- [x] Pas d'erreurs TypeScript
- [x] Pas d'erreurs de linting
- [x] Tests des fonctionnalités principales

### 2. Configuration pour la Production

#### Variables d'Environnement Requises
Copier `.env.example` et remplir toutes les valeurs:

```bash
cp .env.example .env.production
```

**CRITICAL - Variables obligatoires:**

| Variable                          | Description                             | Exemple             |
| --------------------------------- | --------------------------------------- | ------------------- |
| `NEXT_PUBLIC_FIREBASE_API_KEY`    | Clé API Firebase                        | `AIzaSy...`         |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID du projet Firebase                   | `smartvcard-d5f0b`  |
| `RESEND_API_KEY`                  | Clé API Resend pour les emails          | `re_...`            |
| `ADMIN_NOTIFICATION_EMAIL`        | Email pour les notifications            | `admin@example.com` |
| `JWT_SECRET`                      | Clé secrète JWT (minimum 32 caractères) | Voir ci-dessous     |

Générer un JWT_SECRET sécurisé:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

---

## 🌐 Déploiement sur Vercel (Recommandé)

### Étape 1: Préparer le Repo Git
```bash
git add .
git commit -m "chore: prepare for production deployment"
git push origin main
```

### Étape 2: Lier à Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Cliquer "Add New Project"
3. Importer ton repository GitHub
4. Sélectionner le framework: **Next.js**

### Étape 3: Configurer les Variables d'Environnement
Dans **Project Settings > Environment Variables**, ajouter:

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

### Étape 4: Déployer
- Cliquer "Deploy"
- Attendre la fin de la build (~2-3 min)
- Tester le site en production

---

## 🐳 Déploiement via Docker

### Option A: Sur un VPS (Heroku, DigitalOcean, etc.)

```bash
# 1. Build l'image Docker
docker build -t messite:latest .

# 2. Tag pour ton registre (ex: Docker Hub)
docker tag messite:latest votre-username/messite:latest

# 3. Push l'image
docker push votre-username/messite:latest

# 4. Sur le serveur, lancer:
docker run -d \
  -p 3000:80 \
  -e NEXT_PUBLIC_FIREBASE_API_KEY="..." \
  -e NEXT_PUBLIC_FIREBASE_PROJECT_ID="..." \
  -e RESEND_API_KEY="..." \
  -e ADMIN_NOTIFICATION_EMAIL="..." \
  -e JWT_SECRET="..." \
  votre-username/messite:latest
```

### Option B: Avec Docker Compose

```bash
# 1. Créer un fichier .env.production
cp .env.example .env.production
# (Remplir toutes les valeurs)

# 2. Lancer les services
docker-compose -f docker-compose.yml up -d

# 3. Voir les logs
docker-compose logs -f app
```

---

## 📧 Configuration Resend (Emails)

### 1. Créer un compte Resend
- Aller sur [resend.com](https://resend.com)
- S'inscrire gratuitement
- Vérifier votre email

### 2. Obtenir la Clé API
- Dashboard > API Keys
- Copier votre clé API (commence par `re_`)
- Ajouter à `.env.production`

### 3. Configurer le Domaine
- Pour la production, utiliser un domaine personnalisé
- Dashboard > Domains > Add Domain
- Suivre les instructions pour configurer les DNS records

### 4. Tester l'Envoi d'Email
```typescript
// Vérifier que les emails s'envoient lors de la soumission du formulaire
// Les leads devraient recevoir une confirmation
// L'admin devrait recevoir une notification
```

---

## 🔒 Sécurité

### Avant le Déploiement
- [ ] Jamais committer `.env.local` ou `.env.production`
- [ ] Vérifier que `.env.production` est dans `.gitignore`
- [ ] Générer un nouveau JWT_SECRET unique pour la production
- [ ] Changer les identifiants admin par défaut
- [ ] Vérifier que Firebase Firestore a les bonnes règles de sécurité

### Règles Firebase Firestore (Importante!)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Leads collection - publique en lecture, privée en écriture
    match /leads/{document=**} {
      allow read: if request.auth != null;
      allow create: if request.time.toMillis() <= now.toMillis() + 5000;
      allow delete: if request.auth != null;
    }
    
    // Contact info - publique en lecture
    match /contact_info/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

---

## 📝 Domain Personnalisé

### Pour Vercel:
1. Project Settings > Domains
2. Ajouter ton domaine
3. Configurer les DNS records selon les instructions

### DNS Records à Ajouter (pour plupart des registrars):
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com

Type: A (ou Alias si disponible)
Name: @
Value: 76.76.19.21
```

---

## 🧪 Vérifications Post-Déploiement

### Health Checks
- [ ] Site accessible sur le domaine
- [ ] Page d'accueil charge correctement
- [ ] QR Code fonctionne
- [ ] Bouton "Contact" fonctionne
- [ ] Bouton "Enregistrer le contact" fonctionne sur mobile

### Fonctionnalités
- [ ] Soumission de lead enregistre les données
- [ ] Emails de notification arrivent à l'admin
- [ ] Confirmation d'email arrive au lead
- [ ] Page admin fonctionne (login + affichage leads)
- [ ] VCF télécharge correctement

### Performance
- [ ] Vercel Analytics actif
- [ ] Temps de réponse < 2s
- [ ] Images optimisées (Lighthouse score > 90)

---

## 🔄 Mises à Jour en Production

### Pour Vercel
```bash
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main
# → Automatiquement déployé!
```

### Pour Docker
```bash
# 1. Faire les changements localement
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push origin main

# 2. Sur le serveur
docker-compose down
docker-compose up -d --build
```

---

## 🆘 Troubleshooting

### Les emails ne s'envoient pas
- [ ] Vérifier `RESEND_API_KEY` est correcte
- [ ] Vérifier `ADMIN_NOTIFICATION_EMAIL` est valide
- [ ] Vérifier les logs Resend dashboard

### Firebase Firestore ne fonctionne pas
- [ ] Vérifier les identifiants Firebase
- [ ] Vérifier que Firestore est activé dans la console Firebase
- [ ] Vérifier les règles de sécurité

### Site semble cassé après déploiement
- [ ] Vérifier les logs de déploiement
- [ ] Vérifier que toutes les env vars sont configurées
- [ ] Lancer `npm run build` localement pour tester

---

## 📞 Support

Pour toute question:
1. Vérifier la documentation Next.js: https://nextjs.org/docs
2. Vérifier la documentation Vercel: https://vercel.com/docs
3. Vérifier les logs de déploiement
4. Contacter le support Resend si problème d'emails

---

**Status:** ✅ Prêt pour la production  
**Dernière mise à jour:** 4 mars 2026  
**Version:** 0.1.0
