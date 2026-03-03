# 📋 Getting Started - Smart vCard

**Résumé crucial pour que votre Smart vCard fonctionne ✨**

---

## ⚡ Les 3 choses ESSENTIELLES à faire

### 1️⃣ Créer Firebase Firestore

```bash
1. Allez à firebase.google.com
2. Créer un projet "smart-vcard"
3. Créer Firestore Database (Mode Test)
4. Copier les 6 identifiants
```

**Où copier les identifiants ?** Settings → Project Settings → Vos apps

### 2️⃣ Créer `.env.local`

À la **racine du projet**, créer un fichier `.env.local` :

```
NEXT_PUBLIC_FIREBASE_API_KEY=VOTRE_CLE_ICI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=VOTRE_AUTH_DOMAIN.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=VOTRE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=VOTRE_BUCKET.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=VOTRE_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=VOTRE_APP_ID
```

⚠️ **Ne partagez JAMAIS ce fichier !** Il est dans `.gitignore`

### 3️⃣ Lancer le projet

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 📝 Commandes npm utiles

```bash
# Développement (Auto-reload)
npm run dev

# Build production
npm run build

# Démarrer le build production
npm start

# Vérifier les erreurs
npm run lint
```

---

## 🎨 Personnalisations rapides

Ouvrir `app/page.tsx` et trouver :

### 1. Changer le nom
```typescript
<h2 className="text-3xl font-bold text-center mb-2">Lionel</h2>
```
➜ Remplacer `"Lionel"` par votre nom

### 2. Changer le titre
```typescript
<p className="text-center text-orange-400 font-medium mb-8">
  Designer & Stratège Marketing
</p>
```
➜ Remplacer par votre titre

### 3. Ajouter vos réseaux sociaux
Chercher les liens avec :
```typescript
<a href="https://instagram.com" ...
<a href="https://youtube.com" ...
<a href="https://example.com" ...
```
➜ Remplacer par vos URLs

### 4. Modifier le vCard à télécharger
Ouvrir `public/contact.vcf` et changer :
```vcf
FN:Lionel
TITLE:Designer & Stratège Marketing
TEL:+66XXXXXXXXXX
EMAIL:votre@email.com
URL:https://votre-site.com
```

---

## 🔥 Firebase - Configuration requise

**ÉtaOkpe 1 : Créer Firestore**
- Mode Test ← Important pour le développement
- Région : europe-west1

**Étape 2 : Configurer les règles**

Aller à Firestore → Règles → Remplacer par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leads/{document=**} {
      allow read, write: if true;
    }
  }
}
```

Puis cliquer "Publier"

---

## ✅ Vérification rapide

Après avoir lancé `npm run dev` :

| ✓ À tester     | Ce que vous devriez voir     |
| -------------- | ---------------------------- |
| Page charge    | Design noir premium          |
| Language FR/EN | Les textes changent          |
| Card flip      | La carte pivote (3D)         |
| Formulaire     | Input + Bouton envoyer       |
| Submit form    | Message vert ✓ Succès        |
| Firebase       | Document créé dans Firestore |

---

## 📁 Structure obligatoire

```
messite/
├── app/
│   └── page.tsx              ← À personnaliser
├── lib/
│   └── firebase.ts           ← Config Firebase
├── public/
│   └── contact.vcf           ← À personnaliser
├── .env.local                ← À créer avec identifiants
└── package.json
```

---

## 🚨 Problèmes courants & solutions

### "Cannot find module firebase"
```bash
npm install
```

### ".env.local not found"
Créer le fichier `.env.local` à la racine

### "Permission denied" dans la console
Vérifier Firestore → Règles → `allow read, write: if true;`

### "apiKey is undefined"
`.env.local` n'est pas correctement rempli ou le serveur n'a pas été redémarré

---

## 📱 Tester sur mobile

```bash
# 1. Trouver votre IP
ifconfig | grep inet

# 2. Sur le téléphone (même WiFi)
http://YOUR_IP:3000
```

---

## 🚀 Déployer en 2 minutes

```bash
# Installer Vercel CLI
npm i -g vercel

# Déployer
vercel
```

N'oubliez pas d'ajouter les variables d'environnement ! 📌

---

## 📚 Documentation complète

Vous trouverez dans le projet :

- 📖 [README.md](./README.md) - Guide complet
- 🚀 [QUICK_START.md](./QUICK_START.md) - Démarrage
- 🔥 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase détaillé
- ✅ [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) - Checklist étape par étape
- 📊 [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md) - Tracking Meta
- 📐 [ARCHITECTURE.md](./ARCHITECTURE.md) - Technique

---

## 💡 Tips & Tricks

**Tip 1 : Auto-reload**
Le développement avec `npm run dev` recharge automatiquement quand vous changez le code.

**Tip 2 : Pas de credit card**
Firebase Spark Plan est gratuit (100 opérations/jour suffisent pour tester).

**Tip 3 : Hot Reload**
Vous devez redémarrer le serveur SEULEMENT si vous changez les variables d'environnement.

**Tip 4 : DevTools**
Appuyez sur F12 pour voir les erreurs et debug.

**Tip 5 : Production**
Changez les règles Firestore pour arrêter les writes une fois en production.

---

## 🎯 Ordre d'exécution recommandé

1. ✅ Créer Firebase (5 min)
2. ✅ Créer `.env.local` (2 min)
3. ✅ Lancer `npm run dev` (1 min)
4. ✅ Ouvrir http://localhost:3000 (1 min)
5. ✅ Tester le formulaire (2 min)
6. ✅ Vérifier Firestore (2 min)
7. ✅ Personnaliser le contenu (5 min)
8. ✅ Tester sur mobile (3 min)
9. ✅ Déployer sur Vercel (5 min)

**Total : ~30 minutes pour aller en live ! 🚀**

---

## 🤝 En cas de problème

1. Vérifier la console (F12)
2. Vérifier `.env.local` (6 variables requises)
3. Vérifier Firebase Firestore (accessible ?)
4. Relancer le serveur : `npm run dev`
5. Consulter la documentation complète

---

## 📞 Support

Documentation complète :
- Chaque fichier a des commentaires
- Chaque étape est documentée
- Les erreurs sont expliquées

Consultez [SETUP_CHECKLIST.md](./SETUP_CHECKLIST.md) pour un guide détaillé étape par étape.

---

## 🎊 Vous êtes prêt !

C'est tout ce que vous avez besoin de savoir pour commencer.

**Maintenant ?** Créez Firebase et lancez le projet ! 🚀

---

**Questions ? Consultez la documentation. Erreur ? Vérifiez la console (F12).**

**Bonne chance ! 🍀**
