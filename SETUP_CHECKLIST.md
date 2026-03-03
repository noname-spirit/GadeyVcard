# ✅ Checklist de Configuration & Prochaines Étapes

Guide d'installation étape par étape pour que votre Smart vCard soit 100% opérationnelle.

---

## 🎯 Phase 1 : Configuration Firebase (ESSENTIAL)

### Étape 1.1 : Créer un compte Firebase

- [ ] Aller à [firebase.google.com](https://firebase.google.com)
- [ ] Cliquer sur "Go to console"
- [ ] Se connecter avec votre compte Google
- [ ] Créer un nouveau projet "smart-vcard"

**Temps estimé** : 5 minutes

### Étape 1.2 : Récupérer les identifiants

- [ ] Aller aux **Paramètres du projet** (⚙️)
- [ ] Cliquer sur "Vos apps"
- [ ] Créer une app web (icône `</>`)
- [ ] Copier la configuration Firebase

**Template à copier** :
```
apiKey: ...
authDomain: ...
projectId: ...
storageBucket: ...
messagingSenderId: ...
appId: ...
```

### Étape 1.3 : Créer le fichier `.env.local`

À la **racine du projet**, créer un fichier  `.env.local` :

```bash
# Copier depuis Firebase Console
NEXT_PUBLIC_FIREBASE_API_KEY=COPIER_ICI
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=COPIER_ICI
NEXT_PUBLIC_FIREBASE_PROJECT_ID=COPIER_ICI
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=COPIER_ICI
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=COPIER_ICI
NEXT_PUBLIC_FIREBASE_APP_ID=COPIER_ICI
```

✅ **Vérification** : Le fichier `.env.local` existe et contient les 6 variables

### Étape 1.4 : Créer Firestore Database

- [ ] Dans Firebase Console, cliquer sur "Firestore Database"
- [ ] Cliquer "Créer une base de données"
- [ ] Sélectionner **"Mode test"** (pour le développement)
- [ ] Cliquer "Suivant"
- [ ] Sélectionner la région Europe (`europe-west1`)
- [ ] Cliquer "Créer une base de données"

**Attendre** : ~30 secondes

### Étape 1.5 : Configurer les règles Firestore

- [ ] Dans Firestore, aller à l'onglet **"Règles"**
- [ ] Remplacer par le code ci-dessous :

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

- [ ] Cliquer **"Publier"**

✅ **Vérification** : Firestore est créée et les règles sont publiées

---

## 🎨 Phase 2 : Personnalisation du Contenu

### Étape 2.1 : Modifier les informations personnelles

Ouvrir `app/page.tsx` et trouver (autour de la ligne 180) :

```typescript
<h2 className="text-3xl font-bold text-center mb-2">Lionel</h2>
<p className="text-center text-orange-400 font-medium mb-8">
  Designer & Stratège Marketing
</p>
```

**À faire** :
- [ ] Remplacer `"Lionel"` par votre nom
- [ ] Remplacer `"Designer & Stratège Marketing"` par votre titre

### Étape 2.2 : Ajouter vos liens sociaux

Toujours dans `app/page.tsx` (autour de la ligne 190), trouver :

```typescript
<a href="https://instagram.com" ...
<a href="https://youtube.com" ...
<a href="https://example.com" ...
```

**À faire** :
- [ ] Remplacer `https://instagram.com` par votre profil Instagram
- [ ] Remplacer `https://youtube.com` par votre chaîne YouTube
- [ ] Remplacer `https://example.com` par votre site web

### Étape 2.3 : Mettre à jour le fichier vCard

Ouvrir `public/contact.vcf` :

```vcf
BEGIN:VCARD
VERSION:3.0
FN:VOTRE_NOM_ICI
TITLE:VOTRE_TITRE_ICI
TEL:+33XXXXXXXXXX
EMAIL:VOTRE_EMAIL@EXAMPLE.COM
URL:https://VOTRE-SITE.COM
...
END:VCARD
```

**À faire** :
- [ ] Remplacer `FN` par votre nom complet
- [ ] Remplacer `TITLE` par votre titre professionnel
- [ ] Remplacer `TEL` par votre numéro de téléphone
- [ ] Remplacer `EMAIL` par votre email
- [ ] Remplacer `URL` par votre site web

### Étape 2.4 : Changer la photo de profil (optionnel)

Ouvrir `app/page.tsx` (autour de la ligne 165) :

```typescript
<div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center">
  <span className="text-4xl font-bold">L</span>
</div>
```

**Pour ajouter une vraie image** :
- [ ] Uploader une image dans `public/` (ex: `photo.jpg`)
- [ ] Remplacer le span `<L>` par :

```typescript
<Image 
  src="/photo.jpg" 
  alt="Profile" 
  width={128} 
  height={128}
  className="rounded-full"
/>
```

- [ ] Ajouter l'import en haut : `import Image from 'next/image';`

---

## 🧪 Phase 3 : Tests en Local

### Étape 3.1 : Lancer le serveur de développement

```bash
npm run dev
```

Vous devriez voir :
```
▲ Next.js 16.1.6
  Local:        http://localhost:3000
```

✅ **Vérification** : Le serveur démarre sans erreur

### Étape 3.2 : Ouvrir et tester

- [ ] Ouvrir [http://localhost:3000](http://localhost:3000) dans le navigateur
- [ ] Vérifier que tout s'affiche correctement
- [ ] La page ne devrait pas avoir d'erreurs en rouge dans la console

### Étape 3.3 : Tester les fonctionnalités

**Language Toggle** :
- [ ] Cliquer sur "FR" et "EN" en haut à droite
- [ ] Les textes devraient changer

**3D Card Flip** :
- [ ] Cliquer sur le bouton "Voir QR Code"
- [ ] La carte devrait pivoter et montrer le QR Code
- [ ] Cliquer sur "Retour" pour revenir à la face avant

**QR Code** :
- [ ] Ouvrir le QR Code depuis votre téléphone
- [ ] Il devrait ouvrir [http://localhost:3000](http://localhost:3000)

**Télécharger le contact** :
- [ ] Cliquer sur "Enregistrer le contact"
- [ ] Un fichier `Lionel_Contact.vcf` devrait se télécharger

**Formulaire de leads** :
- [ ] Remplir le formulaire (Nom + Email)
- [ ] Cliquer "Envoyer"
- [ ] Vous deviez voir ✓ "Merci ! Vos informations ont été enregistrées."

### Étape 3.4 : Vérifier les données dans Firebase

- [ ] Aller à [firebase.google.com](https://firebase.google.com)
- [ ] Firestore → Collection "leads"
- [ ] Vous deviez voir votre document enregistré avec : `name`, `contact`, `timestamp`, `language`

✅ **Vérification** : Toutes les fonctionnalités marchent et les données arrivent dans Firebase

---

## 📱 Phase 4 : Tests sur Mobile

### Étape 4.1 : Tester en local sur votre téléphone

1. Ouvrir un terminal et trouver votre adresse IP :

```bash
# macOS / Linux
ifconfig | grep "inet " | grep -v 127.0.0.1

# Windows
ipconfig
```

2. Sur votre téléphone (connecté au même WiFi) :
- [ ] Ouvrir le navigateur
- [ ] Aller à : `http://YOUR_IP:3000` (remplacer YOUR_IP par l'adresse trouvée)
- [ ] Le site devrait s'afficher correctement

### Étape 4.2 : Vérifier la responsivité

- [ ] La mise en page devrait s'adapter au mobile (une colonne)
- [ ] Les boutons devraient être touchables facilement
- [ ] Aucun texte ne devrait déborder

✅ **Vérification** : Le site fonctionne parfaitement sur mobile

---

## 🌐 Phase 5 : Ajouter Meta Pixel (Optionnel)

Si vous voulez tracker les conversions pour du retargeting :

### Étape 5.1 : Créer un Pixel Meta

- [ ] Aller à [facebook.com/ads/manager](https://facebook.com/ads/manager)
- [ ] Tools → Events Manager
- [ ] Connecter votre site (Web → Pixel)
- [ ] Copier votre **Pixel ID**

### Étape 5.2 : Ajouter au `.env.local`

```bash
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

### Étape 5.3 : Vérifier dans Meta Events Manager

- [ ] Aller à Meta Events Manager
- [ ] Test Events (activé)
- [ ] Soumettre un formulaire depuis votre site
- [ ] L'événement "Lead" devrait apparaître dans Events Manager

Pour plus de détails, voir [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md)

---

## 🚀 Phase 6 : Déploiement en Production

### Étape 6.1 : Préparer pour la production

- [ ] Changer les règles Firestore (voir [FIREBASE_SETUP.md](./FIREBASE_SETUP.md))
- [ ] Tester le build : `npm run build`
- [ ] Aucune erreur ne devrait apparaître

### Étape 6.2 : Déployer sur Vercel

```bash
npm i -g vercel
vercel
```

- [ ] Suivre les instructions
- [ ] Ajouter les variables d'environnement (`.env.local`)
- [ ] Déployer

Votre site sera accessible à une URL unique (ex: `smart-vcard.vercel.app`)

### Étape 6.3 : Ajouter un domaine personnalisé (optionnel)

- [ ] Aller à Vercel Settings → Domains
- [ ] Ajouter votre domaine personnalisé
- [ ] Mettre à jour les DNS chez votre fournisseur de domaine

✅ **Vérification** : Le site est accessible en production

---

## 🎯 Phase 7 : Post-Lancement

### Étape 7.1 : Partager votre vCard

- [ ] Copier l'URL de votre site
- [ ] Partager sur LinkedIn, Instagram, WhatsApp, etc.
- [ ] Personnes peuvent maintenant scanner le QR Code ou soumettre leurs infos

### Étape 7.2 : Monitorer les conversions

- [ ] Vérifier régulièrement Firebase Firestore
- [ ] Nombre de leads enregistrés
- [ ] Langue la plus utilisée

### Étape 7.3 : Optimiser

- [ ] Analyser les logs
- [ ] Améliorer la description
- [ ] Ajouter d'autres réseaux sociaux si nécessaire

---

## 🆘 Dépannage & Support

### "Permission denied" dans la console

✅ **Fix** :
1. Allez à Firebase Console
2. Firestore → Règles
3. Vérifiez : `allow read, write: if true;`
4. Vérifiez que vous êtes en "mode test"

### Le formulaire dit "Envoi en cours..."

✅ **Fix** :
1. Ouvrez DevTools (F12)
2. Console → cherchez des erreurs
3. Vérifiez que `.env.local` a les bonnes valeurs
4. Redémarrez le serveur

### Les données n'apparaissent pas dans Firebase

✅ **Fix** :
1. Allez à Firebase Console
2. Firestore → Collection "leads"
3. Si la collection n'existe pas, soumettez le formulaire une fois
4. Elle devrait être créée automatiquement

### La carte 3D ne tourne pas

✅ **Fix** :
1. Vérifiez votre navigateur (Chrome/Firefox sont mieux)
2. Ouvrez DevTools → Console
3. Cherchez des erreurs Framer Motion

---

## 📇 Fichiers à Mémoriser

| Fichier              | À modifier pour                   |
| -------------------- | --------------------------------- |
| `app/page.tsx`       | Personnes, titre, urls, couleurs  |
| `public/contact.vcf` | Fichier vCard pour téléchargement |
| `.env.local`         | Identifiants Firebase & Pixel ID  |
| `app/globals.css`    | Couleurs & thème global           |

---

## ✅ Checklist Finale

### Avant le lancement

- [ ] Firebase configuré et testé
- [ ] `.env.local` rempli
- [ ] Firestore Database créée et accessible
- [ ] Contenu personnalisé (nom, titre, photo)
- [ ] Liens sociaux à jour
- [ ] Formulaire testé en local
- [ ] Données enregistrées dans Firebase
- [ ] Site responsive sur mobile
- [ ] Au moins 1 test d'envoi effectué
- [ ] Pas d'erreurs dans la console

### Après le déploiement

- [ ] URL accessible en HTTPS
- [ ] QR Code scanne correctement
- [ ] Formulaire fonctionne en production
- [ ] Données sauvegardées dans Firebase
- [ ] Pixel Meta (optionnel) fonctionne
- [ ] SEO des pages OK
- [ ] Mobile UX parfait

---

## 🎓 Documentation Complète

- 📖 [README.md](./README.md) - Vue d'ensemble complet
- 🚀 [QUICK_START.md](./QUICK_START.md) - Démarrage rapide
- 🔥 [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase détaillé
- 📊 [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md) - Tracking convertis
- 📐 [ARCHITECTURE.md](./ARCHITECTURE.md) - Architecture technique

---

## 🎊 Félicitations !

Vous avez tout ce qu'il faut pour lancer votre Smart vCard ! 

**Prochaines étapes** :
1. Suivez les phases 1-7 ci-dessus
2. Posez des questions si nécessaire
3. Lancez et partagez ! 🚀

**Support** : Consultez la documentation ou posez des questions sur Stack Overflow / GitHub.

Good luck! 🍀
