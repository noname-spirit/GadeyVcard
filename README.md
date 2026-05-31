# 🎨 Vcard - Landing Page Premium

---

## 📋 Changelog

### 22/04/2026

#### Migration complète Supabase → Firebase Auth
- Suppression de `src/lib/supabase/` (client.ts, server.ts) et retrait de toutes les références Supabase dans le code
- Création de `src/lib/firebase/config.ts` — initialisation Firebase avec guard anti-re-init Next.js
- Création de `src/lib/firebase/auth.ts` — instance Auth, GoogleAuthProvider, messages d'erreur en français
- `/login` — connexion email/password + Google Sign-in (Firebase)
- `/register` — création de compte + `updateProfile` + Google Sign-in (Firebase)
- `/forgot-password` — réinitialisation mot de passe via `sendPasswordResetEmail`
- `DashboardLayout` + `settings` — déconnexion via `signOut` Firebase
- `middleware.ts` — nettoyé (code Supabase commenté supprimé)
- `src/app/auth/callback/route.ts` — simplifié (redirect `/dashboard`)

#### Système d'authentification global
- Création de `src/lib/firebase/AuthProvider.tsx` — Context React avec `onAuthStateChanged`, exporte `useAuth()` donnant `{ user, uid, loading }`
- Création de `src/components/ProtectedRoute.tsx` — redirige vers `/` si non connecté, spinner pendant le chargement
- `src/app/layout.tsx` — `AuthProvider` enveloppe toute l'app (UID accessible partout)
- Pages protégées : `DashboardLayout`, `/onboarding`, `/admin` enveloppés dans `ProtectedRoute`
- Redirection post-login vers `/onboarding`

#### Firestore — ajout utilisateur
- Création de `firebase/add-user.js` — fonction `addUser(uid, { displayName, email })` qui crée/met à jour le document `users/{uid}` dans Firestore
- `/register` — appel `addUser` après création de compte (email/password)
- Création de `firestore.rules` — règles de sécurité : users lisent/écrivent leur propre doc, cards publiques en lecture, leads créables par tous

#### Corrections CSP & Firebase
- `next.config.ts` — ajout de `https://apis.google.com` et `https://accounts.google.com` dans `script-src` (popup Google Sign-in)
- Suppression de `measurementId` dans les configs Firebase (évite l'erreur Analytics en SSR)

#### Onboarding → Firestore
- Création de `firebase/add-onboarding.js` — envoie les données du wizard dans la collection `cards`
  - **`slugify(name)`** : génère un slug URL-safe depuis un nom (accents supprimés, espaces → tirets)
  - **`addOnboarding(uid, data)`** : crée le document `cards/{slug}` avec toutes les données OnboardingData structurées (`contact`, `socials`, `template`, `accentColor`, timestamps)
- `src/app/onboarding/page.tsx` — `handleComplete` appelle `addOnboarding(uid, data)` puis redirige vers `/dashboard`
- `firestore.rules` — règle `cards` mise à jour : création autorisée si `request.auth.uid == request.resource.data.uid`

---

Une Landing Page mobile-first ultra-moderne pour partager vos coordonnées de manière élégante et capturer les informations des personnes que vous rencontrez.

**Créée pour :** Designer & Stratège Marketing basé en Thaïlande  
**Design :** Apple-like épuré avec animations 3D fluides  
**Thème :** Dark Premium avec glassmorphism et accents orange-corail

---

## ✨ Caractéristiques

### 🃏 Carte 3D Flip Animée
- **Face A (Identité)** : Photo de profil, Nom, Titre, Icônes sociales (Instagram, YouTube, Site Web)
- **Face B (QR Code)** : QR Code dynamique généré en temps réel
- **Interaction** : Animation 3D réaliste avec Framer Motion au clic

### 📋 Formulaire de Capture de Leads
- Champs : Nom + Email ou Line ID
- Enregistrement automatique dans Firebase Firestore
- Messages de feedback animés avec succès/erreur
- Événements Meta Pixel pour retargeting

### 🌍 Bilingue FR/EN
- Détection automatique de la langue du navigateur
- Sélecteur discret en haut à droite
- Toutes les interactions traduites

### ⚡ Performance Mobile
- Design mobile-first
- Optimisé pour 4G/5G
- Animations fluides et rapides
- Aucun JavaScript lourd inutile

### 📥 Téléchargement vCard
- Téléchargement direct du contact aux formats standard
- Icône intuitive avec feedback

---

## 🚀 Installation

### 1. Prérequis

- Node.js 18+ (installa depuis [nodejs.org](https://nodejs.org))
- npm ou yarn
- Un compte Firebase (gratuit : plan Spark)

### 2. Installation locale

```bash
# Cloner ou télécharger le projet
cd /Users/username/Documents/messite

# Installer les dépendances
npm install

# Créer le fichier .env.local (voir section Configuration)
# Voir ci-dessous pour les variables d'environnement
```

### 3. Configuration Firebase

#### Étape 1 : Créer un projet Firebase

1. Allez à [firebase.google.com](https://firebase.google.com)
2. Cliquez sur "Go to console"
3. Cliquez sur "Créer un projet"
4. Nommez votre projet (ex: "smart-vcard")
5. Acceptez les conditions
6. Créez le projet

#### Étape 2 : Récupérer vos identifiants Firebase

1. Dans la console Firebase, allez aux ⚙️ **Paramètres du projet**
2. Cliquez sur "Vos apps"
3. Cliquez sur l'icône `</>` pour créer une application web
4. Nommez votre app (ex: "Smart vCard Web")
5. Copiez les valeurs de configuration Firebase

#### Étape 3 : Créer la base de données Firestore

1. Dans la console Firebase, cliquez sur "Firestore Database"
2. Cliquez sur "Créer une base de données"
3. Choisissez le mode "Démarrage en mode test"
4. Sélectionnez votre région (ex: "europe-west1")
5. Créez la base

#### Étape 4 : Configurer les règles de sécurité

1. Dans Firestore, allez à l'onglet **Règles**
2. Remplacez par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre à tout le monde de lire et écrire dans la collection 'leads'
    match /leads/{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Publiez les règles

### 4. Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet avec vos identifiants Firebase :

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID

# Meta Pixel ID (Optionnel - pour el retargeting)
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID
```

**Où trouver ces valeurs ?**
- Allez aux **Paramètres du projet** dans Firebase Console
- Cliquez sur "Vos apps"
- Les valeurs sont dans la configuration de votre application web

---

## 🔧 Lancer le projet

### Mode développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

Le site se recharge automatiquement lors de modifications de fichiers.

### Build production

```bash
npm run build
npm start
```

---

## 📁 Structure du projet

```
messite/
├── app/
│   ├── page.tsx              # Page principale avec tous les composants
│   ├── layout.tsx            # Layout racine et métadonnées
│   ├── globals.css           # Styles globaux
│   └── favicon.ico
├── lib/
│   └── firebase.ts           # Configuration Firebase
├── public/
│   └── contact.vcf           # Fichier vCard à télécharger
├── node_modules/             # Dépendances
├── .env.local                # Variables d'environnement (À CRÉER)
├── .gitignore
├── next.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── README.md
```

---

## 📦 Dépendances principales

| Package           | Rôle                            |
| ----------------- | ------------------------------- |
| **next**          | Framework React avec App Router |
| **react**         | Bibliothèque UI                 |
| **tailwindcss**   | Styling CSS utilitaire          |
| **framer-motion** | Animations 3D fluides           |
| **firebase**      | Base de données Firestore       |
| **lucide-react**  | Icônes SVG                      |
| **qrcode.react**  | Génération QR Code              |

---

## 🎨 Personnalisation

### Changer le nom et titre

Ouvrez `app/page.tsx` et modifiez :

```typescript
<h2 className="text-3xl font-bold text-center mb-2">Lionel</h2>
<p className="text-center text-orange-400 font-medium mb-8">
  Designer & Stratège Marketing
</p>
```

### Changer l'URL des réseaux sociaux

Cherchez dans `app/page.tsx` :

```typescript
<a href="https://instagram.com" ...
<a href="https://youtube.com" ...
<a href="https://example.com" ...
```

### Modifier la vCard à télécharger

Ouvrez `public/contact.vcf` et mettez à jour :

```vcf
FN:YOUR_NAME
TITLE:YOUR_TITLE
TEL:+YOUR_PHONE
EMAIL:YOUR_EMAIL
URL:https://your-website.com
```

### Changer les couleurs

Les couleurs sont définies dans `app/page.tsx` avec les classes Tailwind :
- **Orange (principal)** : `from-orange-500 to-orange-600`
- **Fond noir** : `from-zinc-950 via-black to-zinc-950`
- **Texte** : `text-white`, `text-zinc-400`

Pour personnaliser, modifiez `tailwind.config.ts` ou utilisez des couleurs personnalisées dans les className.

### Modifier les traductions

Ouvrez `app/page.tsx` et modifiez l'objet `translations` :

```typescript
const translations = {
  fr: {
    title: 'Votre titre ici',
    // ...
  },
  en: {
    title: 'Your title here',
    // ...
  },
};
```

---

## 🌐 Déploiement

### Déployer sur Vercel (Recommandé)

1. Pushez votre code sur GitHub
2. Allez à [vercel.com](https://vercel.com)
3. Importez votre repository
4. Ajoutez les variables d'environnement (`.env.local`)
5. Cliquez sur "Deploy"

```bash
# Ou avec la CLI Vercel
npm i -g vercel
vercel
```

### Déployer sur Netlify

1. Connectez votre repository GitHub
2. Ajoutez les variables d'environnement
3. Build command: `npm run build`
4. Publish directory: `.next`

---

## 📊 Suivi des conversions

### Firebase Firestore

Les leads sont stockés dans une collection `leads` avec :

```javascript
{
  name: "Jean Dupont",
  contact: "jean@example.com",
  timestamp: Timestamp,
  language: "fr"
}
```

### Meta Pixel Retargeting

Pour configurer le retargeting Meta (Facebook), consultez [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md)

---

## ⚡ Optimisations de performance

- ✅ Image optimization avec Next.js
- ✅ Code splitting automatique
- ✅ Animations GPU avec Framer Motion
- ✅ Fonts optimisées (Inter)
- ✅ SEO-friendly avec métadonnées
- ✅ PWA-ready (peut être hors ligne)

---

## 🐛 Dépannage

### Le formulaire n'envoie pas les données ?

1. Vérifiez que `.env.local` a les bonnes identifiants Firebase
2. Ouvrez DevTools (F12) → Console → cherchez des erreurs
3. Vérifiez que Firestore est activé dans Firebase
4. Vérifiez les règles de sécurité Firestore

### Le QR Code ne fonctionne pas ?

1. Vérifiez que vous utilisez HTTPS (en local, utilise http://localhost est OK)
2. Scannez depuis votre téléphone

### Les animations sont lentes ?

1. Mettez à jour Framer Motion : `npm update framer-motion`
2. Fermez les autres onglets
3. Réduisez les complexité de l'animation

### Firebase dit "Permission denied" ?

1. Vérifiez les règles Firestore (voir section Configuration)
2. Assurez-vous que la collection `leads` existe
3. Vérifiez que vous êtes en mode "test" (pas de restriction d'authentification)

---

## 📱 Optimisation mobile

Le site est **mobile-first** par défaut. Pour tester sur mobile :

```bash
# En développement, accédez depuis votre téléphone
# sur le même réseau WiFi à :
# http://YOUR_IP:3000
# Trouvez votre IP avec : ipconfig (Windows) ou ifconfig (Mac/Linux)
```

---

## 🔐 Sécurité

⚠️ **Important** : Le fichier `.env.local` ne doit JAMAIS être commité. Il est dans `.gitignore`.

Les clés Firebase dans `.env` commençant par `NEXT_PUBLIC_` sont públiques (nécessaire pour Firestore), ce qui est normal.

Pour la production, utilisez toujours HTTPS et les règles Firestore appropriées.

---

## 📝 Licence

Ce projet est libre d'utilisation à titre personnel.

---

## 🤝 Support

Pour des questions ou bugs, créez une issue ou contactez le développeur.

**Stack Tech :**
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS v4+
- Framer Motion v11
- Firebase Firestore
- Lucide React
- QRCode React

---

### 🎉 Vous êtes prêt !

Personnalisez, déployez et commencez à capturer des leads. Bonne chance ! 🚀

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# SmartVcard
# SmartVcard
# Generateur_Vcard
# Generateur_Vcard
# Generateur_Vcard
# GadeyVcard
