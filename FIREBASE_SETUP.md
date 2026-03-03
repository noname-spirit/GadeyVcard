# 🔐 Configuration Firebase Complète

Guide détaillé pour configurer Firebase Firestore pour votre Smart vCard.

---

## 📋 Prérequis

- Un compte Google
- Un accès à Firebase Console
- L'URL de votre site (ex: `http://localhost:3000` en développement)

---

## Step 1️⃣ : Créer un Projet Firebase

### A. Créer le projet

1. Allez à [console.firebase.google.com](https://console.firebase.google.com)
2. Connectez-vous avec votre compte Google
3. Cliquez sur **"Ajouter un projet"**
4. Entrez un nom pour votre projet (ex: `smart-vcard`)
5. Cliquez sur **"Continuer"**

### B. Activer Google Analytics (Optionnel)

6. Vous pouvez désactiver Google Analytics si vous le souhaitez
7. Cliquez sur **"Créer le projet"**
8. Attendez que le projet soit créé (~30 secondes)

---

## Step 2️⃣ : Récupérer les identifiants Firebase

### A. Accéder aux paramètres du projet

1. Cliquez sur l'icône ⚙️ **Paramètres du projet** en haut à gauche
2. Allez à l'onglet **"Paramètres"**
3. Recherchez la section **"Vos apps"**

### B. Créer une application web

4. Cliquez sur l'icône **`</>`** pour ajouter une app web
5. Entrez un nom pour votre app (ex: `Smart vCard Web`)
6. Cochez "Aussi configurer Firebase Hosting pour cette app"
7. Cliquez sur **"Enregistrer l'app"**

### C. Récupérer la configuration

8. Vous verrez un bloc de code Firebase. Copiez les valeurs suivantes :

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

### D. Ajouter les variables d'environnement

9. Ouvrez le fichier `.env.local` dans votre projet
10. Ajoutez les valeurs :

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_APP_ID
```

---

## Step 3️⃣ : Créer Firestore Database

### A. Créer la base de données

1. Dans la console Firebase, cliquez sur **"Firestore Database"** dans le menu à gauche
2. Cliquez sur **"Créer une base de données"**
3. Vous y êtes ? Continuez...

### B. Configurer la base de données

4. Sélectionnez **"Démarrer en mode test"** (pour le développement)
5. Cliquez sur **"Suivant"**
6. Sélectionnez votre région (ex: `europe-west1` pour l'Europe)
7. Cliquez sur **"Créer une base de données"**

⏳ Attendez quelques secondes que la base soit créée...

---

## Step 4️⃣ : Configurer les règles de sécurité

### ⚠️ Important pour le développement

Vous verrez une avertissement "Vos règles de règles de sécurité ne sont pas sécurisées". C'est normal en mode test. Voici comment configurer les règles :

### A. Accéder aux règles

1. Cliquez sur l'onglet **"Règles"** en haut
2. Vous verrez le code des règles actuelles

### B. Remplacer les règles

3. Remplacez tout le contenu par :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permettre à tout le monde de lire et écrire dans la collection 'leads'
    // À CHANGER POUR LA PRODUCTION !
    match /leads/{document=**} {
      allow read, write: if true;
    }
  }
}
```

4. Cliquez sur **"Publier"**

### ⚠️ SÉCURITÉ PRODUCTION

Pour un site en production, changez les règles à :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // En production, autorisez uniquement les écritures
    // (Les utilisateurs ne devraient pas lire les données d'autres utilisateurs)
    match /leads/{document=**} {
      allow create: if true;
      allow read, write: if false;
    }
  }
}
```

---

## Step 5️⃣ : Vérifier la configuration

### A. Tester la connexion

1. Lancez votre projet en développement :

```bash
npm run dev
```

2. Ouvrez [http://localhost:3000](http://localhost:3000)
3. Ouvrez les DevTools (F12)
4. Allez dans l'onglet **"Console"**

### B. Chercher les erreurs

5. Vérifiez qu'il n'y a pas d'erreur Firebase dans la console
6. Si vous voyez une erreur, vérifiez vos variables d'environnement

### C. Tester le formulaire

7. Remplissez et soumettez le formulaire
8. Si le formulaire fonctionne, vous verrez :
   - ✅ Un message "Merci ! Vos informations ont été enregistrées."
   - 📊 Les données dans la Firestore Console

### D. Vérifier dans Firestore

9. Retournez à la console Firebase
10. Cliquez sur **"Firestore Database"**
11. Vous devriez voir une collection **"leads"** avec un document
12. Le document contient : `name`, `contact`, `timestamp`, `language`

✅ Vous avez réussi si vous voyez les données !

---

## 📊 Vérifier les données dans Firestore

### Accéder aux documents

1. Cliquez sur la collection **"leads"**
2. Vous verrez tous les documents soumis
3. Cliquez sur un document pour voir les détails

### Structures des documents

Chaque document aura cette structure :

```javascript
{
  name: "Jean Dupont",           // Nom du visiteur
  contact: "jean@example.com",   // Email ou Line ID
  timestamp: Timestamp(...),     // Date/Heure d'envoi
  language: "fr"                 // Langue du formulaire
}
```

### Exporter les données

Pour exporter les données :

1. Cliquez sur le menu ⋮ à côté de "leads"
2. Cliquez sur **"Exporter les collections"**
3. Choisissez le format (JSON ou les faire envoyer à Cloud Storage)

---

## 🔍 Dépannage Firebase

### Erreur : "Permission denied"

**Cause** : Les règles Firestore ne permettent pas l'accès

**Solution** :
1. Vérifiez que vous êtes en mode test
2. Vérifiez que les règles autorisent `allow read, write: if true;`
3. Publiez à nouveau les règles

### Erreur : "PROJECT_ID not found"

**Cause** : Le `projectId` est incorrect

**Solution** :
1. Allez dans Firebase Console
2. Cliquez sur ⚙️ Paramètres du projet
3. Copiez le Project ID exact
4. Mettez à jour `.env.local`
5. Redémarrez votre serveur développement

### Les données n'apparaissent pas

**Cause 1** : HTTPS non activé (sur un vrai domaine)
- Solution : Utilisez HTTPS en production

**Cause 2** : La collection n'a pas été créée
- Solution : Soumettez le formulaire une fois pour créer la collection

**Cause 3** : Erreur JavaScript
- Solution : Vérifiez la console (F12) pour les erreurs

### Le formulaire dit "Envoi en cours..." indéfiniment

**Cause** : Firebase ne peut pas être atteint

**Solution** :
1. Vérifiez votre connexion Internet
2. Vérifiez que les identifiants Firebase sont corrects
3. Vérifiez les règles Firestore

---

## 🌍 Passer en Production

### Avant de passer en prod

1. **Changez les règles de sécurité** (voir section Step 4)
2. **Testez sur mobile** (essayez depuis un téléphone)
3. **Vérifiez qu'il n'y a pas d'erreurs** (DevTools Console)
4. **Testez le formulaire** (soumettez une fois)

### Pour Vercel

1. Allez à votre dashboard Vercel
2. Sélectionnez votre projet
3. Allez à **Settings** → **Environment Variables**
4. Ajoutez toutes les variables de `.env.local`
5. Redéployez

### Pour d'autres hébergeurs

Ajoutez les mêmes variables d'environnement dans le système d'hébergement (voir leur documentation).

---

## 📱 Tester sur un vrai téléphone

### En développement local

1. Trouvez votre adresse IP locale :

```bash
# macOS / Linux
ifconfig | grep inet

# Windows
ipconfig
```

2. Note l'IP (ex: `192.168.1.100`)

3. Sur votre téléphone (sur le même WiFi) :
   - Ouvrez le navigateur
   - Allez à : `http://YOUR_IP:3000`

Une fois en prod, utilisez simplement l'URL de votre domaine.

---

## 🎓 Ressources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firestore Real-time Database](https://firebase.google.com/docs/firestore)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

## ✅ Checklist

- [ ] Projet Firebase créé
- [ ] Configuration Firebase copiée
- [ ] `.env.local` rempli avec les identifiants
- [ ] Firestore Database créée
- [ ] Règles de sécurité configurées
- [ ] Formulaire testé en local
- [ ] Données vérifiées dans Firestore
- [ ] Variables d'environnement ajoutées à l'hébergeur
- [ ] Rules mises à jour pour la production
- [ ] Déploiement réussi !

---

**Besoin d'aide ?** Consultez la [documentation Firebase officielle](https://firebase.google.com/docs/firestore) ou posez une question sur Stack Overflow.
