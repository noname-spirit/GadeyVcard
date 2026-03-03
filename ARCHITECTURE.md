# 📐 Architecture du Projet Smart vCard

Vue d'ensemble technique et structure des fichiers.

---

## 🏗️ Structure des dossiers

```
messite/
│
├── 📄 app/                           # Application Next.js (App Router)
│   ├── page.tsx                      # Page d'accueil (composant principal)
│   ├── layout.tsx                    # Layout racine + métadonnées
│   ├── globals.css                   # Styles globaux
│   └── favicon.ico                   # Icône du site
│
├── 📚 lib/
│   └── firebase.ts                   # Config Firebase
│
├── 🎨 public/
│   └── contact.vcf                   # Fichier vCard pour téléchargement
│
├── ⚙️ Config Files
│   ├── next.config.ts                # Config Next.js
│   ├── tsconfig.json                 # Config TypeScript
│   ├── tailwind.config.ts            # Config Tailwind CSS (v4)
│   ├── postcss.config.mjs            # Config PostCSS
│   ├── eslint.config.mjs             # Config ESLint
│   └── package.json                  # Dépendances + scripts
│
├── 📖 Documentation
│   ├── README.md                     # Guide complet
│   ├── QUICK_START.md                # Démarrage rapide
│   ├── FIREBASE_SETUP.md             # Setup Firebase
│   └── META_PIXEL_SETUP.md           # Configuration Meta Pixel
│
├── 🔐 Environment
│   └── .env.local                    # Variables d'environnement (À CRÉER)
│
├── 🔧 Development
│   ├── node_modules/                 # Dépendances installées
│   ├── .next/                        # Build cache
│   ├── .git/                         # Git repository
│   └── .gitignore                    # Git ignore rules
│
└── 📋 Version
    └── package-lock.json             # Lock file npm

```

---

## 🔄 Flux de données

```
┌─────────────────────────────────────────────────┐
│              Utilisateur Final                   │
│           (Navigateur / Mobile)                  │
└─────────────────┬───────────────────────────────┘
                  │
                  ▼
        ┌─────────────────────┐
        │  app/page.tsx       │
        │  (Composant React)  │
        │                     │
        │ ✓ 3D Flip Card      │
        │ ✓ QR Code           │
        │ ✓ Lead Form         │
        │ ✓ Language Toggle   │
        └──────────┬──────────┘
                   │
         ┌─────────┴─────────┐
         ▼                   ▼
    ┌─────────┐         ┌──────────┐
    │ Firebase │        │ Meta Pixel│
    │Firestore │        │(Tracking) │
    └─────────┘         └──────────┘
         │
         ▼
    ┌──────────────────┐
    │  Collection      │
    │  "leads"         │
    │  {               │
    │    name: "...",  │
    │    contact: "...",
    │    timestamp,    │
    │    language      │
    │  }               │
    └──────────────────┘
```

---

## 🧩 Composants et Modules

### `app/page.tsx` - Page Principale

**Responsabilités** :
- État global (langue, flip, formulaire)
- Rendu visuel complet
- Gestion des événements utilisateur

**Sections** :
1. **Language Selector** : Boutons FR/EN
2. **Header** : Titre et sous-titre animés
3. **3D Flip Card** :
   - Face A : Identité (photo, nom, titre, sociales)
   - Face B : QR Code dynamique
4. **Lead Form** : Capture de contactos
5. **Footer** : Copyright

**Animations** :
- Framer Motion pour les transitions
- 3D rotation avec `rotateY`
- Entrées progressives avec délais

### `lib/firebase.ts` - Configuration Firebase

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
```

**Export** : `db` (instance Firestore)

### `app/layout.tsx` - Layout Racine

- Métadonnées (titre, description, OG tags)
- Font import (Inter)
- Viewport + mobile meta tags

### `app/globals.css` - Styles Globaux

- Import Tailwind CSS
- Variables CSS personnalisées
- Glassmorphism effects
- Scrollbar styling

---

## 📦 Dépendances Clés

| Package           | Version | Rôle            |
| ----------------- | ------- | --------------- |
| **next**          | 16.1.6+ | Framework & SSR |
| **react**         | 19.0+   | UI Library      |
| **typescript**    | 5+      | Type Safety     |
| **tailwindcss**   | 4+      | Styling         |
| **framer-motion** | 11+     | Animations 3D   |
| **firebase**      | 11+     | Database        |
| **qrcode.react**  | 1.0+    | QR Code Gen     |
| **lucide-react**  | Latest  | Icons           |

---

## 🎨 Thème & Design

### Couleurs

| Élément           | Couleur              | Usage             |
| ----------------- | -------------------- | ----------------- |
| Fond principal    | `zinc-950` / `black` | Fond dark premium |
| Texte             | `white` / `zinc-400` | Texte et labels   |
| Accent primaire   | `orange-500/600`     | Boutons, CTA      |
| Accent secondaire | `white/10`           | Borders, hovers   |

### Typography

- **Font** : Inter (Google Fonts)
- **Sizes** : 
  - H1 : 4-6xl
  - H2 : 2-3xl
  - Body : base (1rem)
  - Small : sm (0.875rem)

### Spacing

- **Padding** : 8px, 16px, 24px, 32px
- **Gap** : 16px, 24px, 32px
- **Radius** : 11px (moyenne), 16px (xl), 40px (full)

---

## 🔐 Variables d'Environnement

### Public (Safe in Frontend)

```bash
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_META_PIXEL_ID
```

### Sécurité

- ✅ Les clés Firebase sont intentionnellement publiques (nécessaire pour Firestore)
- ✅ C'est normal que `NEXT_PUBLIC_*` soit accessible en frontend
- ✅ Utilisez les règles Firestore pour la véritable sécurité

---

## 🔄 Cycle de vie

### 1. Initialisation (Page Load)

```typescript
useEffect(() => {
  // Détect la langue du navigateur
  const browserLang = navigator.language.split('-')[0];
  setLanguage(browserLang);
}, []);
```

### 2. Interaction (Card Flip)

```typescript
onClick={() => setIsFlipped(!isFlipped)}
// Anime rotateY de 0 à 180
```

### 3. Form Submission

```typescript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  // Validation
  // Appel Firebase
  // Feedback utilisateur
  // Événement Meta Pixel
}
```

### 4. Side Effects

- Meta Pixel track (PageView, Lead, Download)
- Animations avec Framer Motion
- Chargement des données depuis Firebase

---

## 📊 Firestore Structure

### Collection : `leads`

```javascript
leads/
├── doc1/
│   ├── name: "Jean Dupont"
│   ├── contact: "jean@example.com"
│   ├── timestamp: Timestamp(2026-03-03)
│   └── language: "fr"
├── doc2/
│   ├── name: "Jane Smith"
│   ├── contact: "jane@example.com"
│   ├── timestamp: Timestamp(2026-03-03)
│   └── language: "en"
└── ...
```

### Règles Firestore

```javascript
match /leads/{document=**} {
  allow create: if true;      // Autoriser les écritures
  allow read: if false;        // Aucune lecture publique
}
```

---

## 🚀 Performance

### Optimisations

- ✅ Image optimization (Next.js)
- ✅ Code splitting automatique
- ✅ Lazy loading des composants
- ✅ CSS-in-JS minimal (Tailwind)
- ✅ Meta Pixel async (non-bloquant)
- ✅ Animations GPU (transform 3D)

### Métriques cibles

- **LCP** < 2.5s
- **FID** < 100ms
- **CLS** < 0.1
- **Mobile speed** : Fast on 4G

---

## 🔧 Build Process

### Development

```bash
npm run dev
# - Fast refresh Hot Reload
# - Source maps
# - Dev server sur port 3000
```

### Production

```bash
npm run build
# - Turbopack compilation
# - TypeScript checking
# - Route optimization
# - Static export

npm start
# - Production server
```

---

## 📱 Responsive Design

### Breakpoints

- **Mobile** : < 640px
- **Tablet** : 640px - 1024px
- **Desktop** : > 1024px

### Mobile Optimizations

- Touch-friendly buttons (48x48px min)
- Column layout (max-w-sm = 28rem)
- Full viewport height (min-h-screen)
- Optimized for 4G/5G

---

## 🧪 Testing

### Manuel Testing Checklist

- [ ] Form submission
- [ ] 3D card flip animation
- [ ] Language toggle (FR/EN)
- [ ] QR code generation
- [ ] vCard téléchargement
- [ ] Firebase data save
- [ ] Mobile responsiveness
- [ ] Animations fluides

### Développeur

- [ ] Console errors check
- [ ] Performance Audits
- [ ] Lighthouse score
- [ ] Cross-browser testing

---

## 🚢 Deployment

### Vercel (Recommended)

- Zero-config deployment
- Automatic edge functions
- Environment variables support
- Automatic HTTPS

### Alternatives

- Netlify
- AWS Amplify
- Railway
- Render

---

## 📚 Ressources

- [Next.js Docs](https://nextjs.org/docs)
- [React Hooks](https://react.dev/reference/react)
- [Tailwind CSS](https://tailwindcss.com)
- [Framer Motion](https://www.framer.com/motion)
- [Firebase](https://firebase.google.com/docs)

---

## 🎯 Next Steps

1. Configurer Firebase
2. Ajouter variables d'environnement
3. Personnaliser le contenu
4. Tester localement
5. Configurer Meta Pixel
6. Déployer en production
7. Monitoriser les conversions

---

**Architecture créée avec ❤️ pour performance et facilité de maintenance.**
