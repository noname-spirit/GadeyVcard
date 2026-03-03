# 🚀 Quick Start Guide

Démarrer votre Smart vCard en moins de 5 minutes !

---

## ⚡ Installation Express (5 minutes)

### 1. Installation des dépendances

```bash
# Le projet est déjà créé, mais si vous le clonez :
npm install
```

### 2. Configuration Firebase

**IMPORTANTE** : Vous devez d'abord créer un projet Firebase !

1. Allez à [firebase.google.com](https://firebase.google.com)
2. Créez un nouveau projet (voir [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) pour les détails)
3. Copiez vos identifiants Firebase

### 3. Variables d'environnement

Créez un fichier `.env.local` à la racine :

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_PROJECT.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

### 4. Démarrer le serveur

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 Personnalisations immédiates

### Changer le nom et titre

Ouvrez `app/page.tsx` et trouvez (ligne ~180) :

```typescript
<h2 className="text-3xl font-bold text-center mb-2">Lionel</h2>
<p className="text-center text-orange-400 font-medium mb-8">
  Designer & Stratège Marketing
</p>
```

Remplacez `"Lionel"` et `"Designer & Stratège Marketing"` par vos values.

### Changer les liens sociaux

Trouvez (ligne ~190) :

```typescript
<a href="https://instagram.com" ...
<a href="https://youtube.com" ...
<a href="https://example.com" ...
```

Remplacez par vos URLs réelles.

### Modifier le fichier vCard à télécharger

Ouvrez `public/contact.vcf` :

```vcf
FN:Votre Nom
TITLE:Votre Titre
TEL:+33123456789
EMAIL:votre@email.com
URL:https://www.votre-site.com
```

---

## 📊 Tester le formulaire

1. Remplissez le formulaire (Nom + Email/Line ID)
2. Cliquez sur "Envoyer"
3. Vous devriez voir un message vert "✓ Merci !"
4. Les données sont sauvegardées dans Firebase Firestore

**Vérifier les données** :
- Allez à [firebase.google.com](https://firebase.google.com)
- Firestore → Collection "leads"
- Vous verrez vos soumissions

---

## 🌍 Déployer (Bonus)

### Sur Vercel (Recommandé)

```bash
# Installer la CLI Vercel
npm i -g vercel

# Déployer
vercel
```

### Ajouter les variables d'environnement

1. Allez sur vercel.com/dashboard
2. Sélectionnez votre projet
3. Settings → Environment Variables
4. Ajoutez toutes les variables de `.env.local`
5. Redéployez

✅ Votre site est live !

---

## 📱 Tester sur votre téléphone

En développement local :

```bash
# Trouvez votre adresse IP
ifconfig | grep inet

# Sur votre téléphone (même WiFi) :
# http://YOUR_IP:3000
```

---

## 🆘 Problèmes courants

| ❌ Problème                          | ✅ Solution                                     |
| ----------------------------------- | ---------------------------------------------- |
| "Permission denied" dans la console | Vérifiez les règles Firestore (mode test ?)    |
| Le formulaire ne valide pas         | Remplissez tous les champs                     |
| Pas de message de succès            | Vérifiez `.env.local` et redémarrez le serveur |
| Le QR Code ne scanne pas            | Utilisez HTTPS (en prod)                       |

---

## 📚 Documentation complète

- [README.md](./README.md) - Everything vous devez savoir
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Setup Firebase détaillé
- [META_PIXEL_SETUP.md](./META_PIXEL_SETUP.md) - Pixel Meta pour retargeting

---

**🎊 Vous êtes prêt ! Commencez à partager votre vCard beautifully !**
