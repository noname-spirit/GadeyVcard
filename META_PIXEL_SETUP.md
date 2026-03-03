# Setup Guide - Meta Pixel Retargeting

Pour activer le retargeting Meta (Facebook) sur votre Smart vCard, suivez ces étapes :

## 1. Créer un Pixel Meta

1. Allez à [facebook.com/ads/manager](https://facebook.com/ads/manager)
2. Cliquez sur "Tools" → "Events Manager"
3. Cliquez sur "Connect Data Sources" → "Web"
4. Sélectionnez "Pixel" et cliquez sur "Connect"
5. Remplissez les informations de votre site web
6. Vous recevrez un **Pixel ID** (vous en aurez besoin)

## 2. Configurer les variables d'environnement

Ouvrez le fichier `.env.local` et ajoutez :

```bash
NEXT_PUBLIC_META_PIXEL_ID=YOUR_PIXEL_ID_HERE
```

Remplacez `YOUR_PIXEL_ID_HERE` par votre véritable Pixel ID.

## 3. Événements suivis

Le code suit automatiquement les événements suivants :

- **PageView** : Lorsqu'un utilisateur visite la page
- **Lead** : Lorsqu'un utilisateur soumet le formulaire de capture de leads
- **Download** : Lorsqu'un utilisateur télécharge le contact vCard

## 4. Configuration avancée (Optionnel)

### Ajouter des critères de pixel personnalisés

Modifiez `app/page.tsx` pour ajouter plus d'événements personnalisés :

```typescript
if (window.fbq) {
  window.fbq('track', 'ViewContent', {
    content_type: 'vcard',
    value: 0.00,
    currency: 'USD',
  });
}
```

### Créer une audience personnalisée

1. Dans Events Manager, allez à "Audiences"
2. Créez une "Custom Audience" basée sur votre Pixel
3. Ciblez les utilisateurs qui ont complété l'événement "Lead"
4. Utilisez cette audience pour des publicités de retargeting

## 5. Vérifier que le Pixel fonctionne

1. Ouvrez votre site dans le navigateur
2. Ouvrez les DevTools (F12)
3. Allez dans l'onglet "Network"
4. Rafraîchissez la page
5. Cherchez les requêtes vers `connect.facebook.net` - elles confirment que le Pixel est actif

## 6. Tester les événements

Pour tester les événements :

1. Allez à Events Manager
2. Cliquez sur "Test Events"
3. Entrez votre URL
4. Interagissez avec votre site (soumettez le formulaire, téléchargez vCard)
5. Les événements apparaîtront en temps réel

## Avantages du Retargeting

- 📊 **Suivi de conversion** : Suivez qui envoie ses données
- 🎯 **Audiences personnalisées** : Créez des listes d'intéressés
- 📢 **Publicités ciblées** : Montrez des publicités aux visiteurs
- 💹 **ROI mesuré** : Comparez les coûts et résultats

## Dépannage

**Les événements ne s'apparaissent pas ?**
- Vérifiez que le Pixel ID est correct dans `.env.local`
- Assurez-vous que le site utilise HTTPS (requis pour le Pixel)
- Vérifiez que JavaScript est activé
- Attendez 15-30 minutes pour que les événements s'affichent

**Le Pixel bloque mon site ?**
- Le Meta Pixel est asynchrone et n'affecte pas les performances
- Il ne s'exécute que si `process.env.NEXT_PUBLIC_META_PIXEL_ID` est défini

---

**Besoin d'aide ?** Consultez la [documentation officielle de Meta Pixel](https://developers.facebook.com/docs/facebook-pixel/)
