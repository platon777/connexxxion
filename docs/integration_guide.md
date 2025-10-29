# Guide d'intégration Frontend → Backend

## Résumé des changements effectués

### ✅ Complétées

1. **Types TypeScript** ([types.ts](../types.ts))
   - Adapté pour matcher la structure backend Xano
   - `Subject` → `Theme`
   - `string` IDs → `number` IDs
   - Ajout des types d'addon fields (`_theme`, `_user_object`, etc.)

2. **Configuration** ([.env.local](../.env.local))
   - Créé fichier pour l'URL de l'API Xano
   - Variable: `VITE_API_BASE_URL`

3. **Services API** ([api/](../api/))
   - `client.ts`: Client HTTP avec gestion JWT
   - `auth.ts`: Login, signup, getCurrentUser
   - `categories.ts`: CRUD catégories
   - `themes.ts`: CRUD thèmes (subjects)
   - `confessions.ts`: CRUD confessions + views
   - `comments.ts`: CRUD commentaires
   - `likes.ts`: Toggle likes pour confessions/comments
   - `utils.ts`: Device ID, formatDate

4. **LoginPage** ([components/LoginPage.tsx](../components/LoginPage.tsx))
   - Appelle authService.login() et authService.signup()
   - Gestion des erreurs et états de chargement
   - Email requis au lieu de username simple

### ⏳ En cours

5. **App.tsx** - Adapter pour utiliser l'API
   - Charger categories depuis `/category`
   - Appeler API pour toutes opérations CRUD
   - Gérer les états de chargement

### 🔄 Prochaines étapes

6. **Adapter les composants enfants**
   - Afficher les infos utilisateur depuis `_user_object`
   - Utiliser `created_at` au lieu de `timestamp`
   - Afficher `like_count` unifié

7. **Implémenter les boutons de likes**
   - Appeler `likeService.toggleConfessionLike()`
   - Appeler `likeService.toggleCommentLike()`
   - Rafraîchir le compteur après toggle

## Mappages Backend ↔ Frontend

| Frontend (Ancien) | Backend (Xano) | Notes |
|-------------------|----------------|-------|
| `Subject` | `Theme` | Renommé |
| `userId: string` | `user: number` | Type changé |
| `subjectId` | `theme` | Nom de champ changé |
| `peach_likes + grape_likes` | `like_count` | Unifié |
| `timestamp` | `created_at` | Format ISO |
| `subjects[]` | `_theme_of_category_2[]` | Via addon |

## Structure des données backend

### Category avec addon
```json
{
  "id": 1,
  "created_at": "2025-01-15T10:00:00Z",
  "name": "Conseils",
  "theme_count": 5,
  "_theme_of_category_2": [
    {
      "id": 1,
      "name": "Relations",
      "category": 1,
      "number_of_confess": 12,
      "_confession": [...]
    }
  ]
}
```

### Confession avec addons
```json
{
  "id": 1,
  "created_at": "2025-01-15T10:00:00Z",
  "user": 5,
  "theme": 1,
  "title": "Ma confession",
  "content": "...",
  "view_count": 142,
  "like_count": 23,
  "comment_count": 8,
  "_user_object": {
    "id": 5,
    "name": "Anonymous123"
  },
  "_theme": {...},
  "_comment_of_confession": [...]
}
```

## Configuration requise

### 1. Mettre à jour .env.local
```env
VITE_API_BASE_URL=https://votre-instance.xano.io/api:v1
```

### 2. Installer les dépendances (si nécessaire)
Aucune dépendance supplémentaire requise - utilise fetch natif.

### 3. S'assurer que le backend Xano est déployé
- Toutes les tables créées
- Tous les endpoints déployés
- API accessible publiquement

## Tests recommandés

1. **Authentification**
   - ✅ Signup avec email/password
   - ✅ Login avec credentials
   - ✅ Token stocké dans localStorage
   - ✅ getCurrentUser() fonctionne

2. **CRUD Operations**
   - ⏳ Créer/modifier/supprimer catégorie
   - ⏳ Créer/modifier/supprimer thème
   - ⏳ Créer/modifier/supprimer confession
   - ⏳ Créer/modifier/supprimer commentaire

3. **Likes**
   - ⏳ Toggle like confession
   - ⏳ Toggle like commentaire
   - ⏳ Device ID unique généré

4. **Permissions**
   - ⏳ Admin peut tout modifier
   - ⏳ User peut modifier son contenu
   - ⏳ Affichage conditionnel des boutons

## Notes importantes

- **Device ID**: Généré au premier chargement, stocké dans localStorage
- **JWT Token**: Expire après 24h (86400 secondes)
- **Pagination**: Backend supporte pagination mais non implémenté dans le frontend
- **Realtime**: Backend broadcast sur channel "confessions" mais non écouté dans le frontend
- **Validation**: Backend valide automatiquement (filters dans les schémas)
