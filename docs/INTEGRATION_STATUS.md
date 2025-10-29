# État de l'intégration Frontend ↔ Backend

## ✅ Travaux terminés

### 1. Types TypeScript adaptés ([types.ts](../types.ts))
- ✅ Tous les types matchent la structure backend Xano
- ✅ `Subject` → `Theme` avec alias pour compatibilité
- ✅ IDs: `string` → `number`
- ✅ Types d'authentification ajoutés
- ✅ Types de likes et views ajoutés

### 2. Services API complets ([api/](../api/))
| Fichier | Statut | Fonctionnalités |
|---------|--------|-----------------|
| `client.ts` | ✅ | HTTP client avec JWT, localStorage |
| `auth.ts` | ✅ | login, signup, getCurrentUser, logout |
| `categories.ts` | ✅ | CRUD complet |
| `themes.ts` | ✅ | CRUD complet + getByCategory |
| `confessions.ts` | ✅ | CRUD complet + getByTheme |
| `comments.ts` | ✅ | CRUD complet + getByConfession |
| `likes.ts` | ✅ | Toggle likes avec device_id |
| `utils.ts` | ✅ | Device ID generator, formatDate |

### 3. Configuration
- ✅ `.env.local` créé (à configurer avec votre URL Xano)
- ✅ `.env.example` comme référence

### 4. Composants adaptés
- ✅ **LoginPage**: Utilise authService, gestion d'erreurs, états de chargement

### 5. App.tsx nouvelle version
- ✅ Créé [App_new.tsx](../App_new.tsx) avec:
  - Chargement des catégories depuis l'API
  - Toutes opérations CRUD via services API
  - Gestion User (objet complet) au lieu de userId string
  - États de chargement
  - Gestion d'erreurs avec alerts

## 🔄 À finaliser

### 1. Remplacer l'ancien App.tsx
```bash
# Sauvegarde
mv App.tsx App_old_backup.tsx
# Remplacer
mv App_new.tsx App.tsx
```

### 2. Adapter les composants enfants qui utilisent l'ancienne structure

#### [SubjectsPage.tsx](../components/SubjectsPage.tsx)
- ⚠️ Utilise `category.subjects` → Doit utiliser `category._theme_of_category_2`
- ⚠️ Affiche `subject` → Doit utiliser `theme`

#### [ConfessionsPage.tsx](../components/ConfessionsPage.tsx)
- ⚠️ Utilise `subject.confessions` → Doit utiliser `theme._confession`
- ⚠️ Affiche `peach_likes`, `grape_likes` → Doit afficher `like_count`
- ⚠️ Affiche `timestamp` → Doit utiliser `created_at` + formatDate()

#### [ConfessionDetailPage.tsx](../components/ConfessionDetailPage.tsx)
- ⚠️ Utilise `confession.comments` → Doit utiliser `confession._comment_of_confession`
- ⚠️ Doit afficher `_user_object.name` au lieu de `author`
- ⚠️ Doit implémenter les boutons de likes
- ⚠️ Utiliser formatDate() pour `created_at`

#### [AddConfessionForm.tsx](../components/AddConfessionForm.tsx) & autres formulaires
- ⚠️ Adapter pour les nouvelles structures si nécessaire

### 3. Implémenter les boutons de likes

Exemple pour ConfessionDetailPage:
```tsx
const [isLiked, setIsLiked] = useState(false);
const [likeCount, setLikeCount] = useState(confession.like_count);

const handleLike = async () => {
  try {
    const result = await likeService.toggleConfessionLike(confession.id);
    setIsLiked(result.isLiked);
    setLikeCount(prev => result.isLiked ? prev + 1 : prev - 1);
  } catch (error) {
    console.error('Failed to toggle like:', error);
  }
};

// Dans le JSX
<button onClick={handleLike}>
  {isLiked ? '💛' : '🤍'} {likeCount}
</button>
```

### 4. Configuration finale

#### Mettre à jour .env.local
```env
VITE_API_BASE_URL=https://VOTRE-INSTANCE.xano.io/api:v1
```

#### Vérifier le backend Xano
- [ ] Toutes les tables sont créées
- [ ] Tous les endpoints sont déployés
- [ ] L'API est accessible depuis le frontend
- [ ] CORS est configuré correctement

### 5. Tests nécessaires

#### Authentification
- [ ] Signup avec email valide
- [ ] Login avec credentials
- [ ] Token persiste après refresh
- [ ] Logout fonctionne

#### CRUD Categories
- [ ] Créer catégorie
- [ ] Modifier catégorie (si admin/owner)
- [ ] Supprimer catégorie
- [ ] Lister toutes les catégories avec themes

#### CRUD Themes
- [ ] Créer theme dans catégorie
- [ ] Modifier theme
- [ ] Supprimer theme
- [ ] Voir themes par catégorie

#### CRUD Confessions
- [ ] Créer confession dans theme
- [ ] Modifier confession (si owner)
- [ ] Supprimer confession
- [ ] Voir confessions par theme

#### CRUD Comments
- [ ] Ajouter commentaire
- [ ] Modifier commentaire (si owner)
- [ ] Supprimer commentaire
- [ ] Afficher tous les commentaires

#### Likes
- [ ] Like une confession (toggle)
- [ ] Like un commentaire (toggle)
- [ ] Device ID généré et stocké
- [ ] Compteur mis à jour en temps réel

#### Permissions
- [ ] Admin peut tout modifier
- [ ] User peut modifier uniquement son contenu
- [ ] Boutons edit/delete cachés si pas de permission

## 🐛 Problèmes potentiels et solutions

### Les données ne se chargent pas
1. Vérifier l'URL dans `.env.local`
2. Ouvrir la console réseau du navigateur
3. Vérifier que l'API Xano est bien déployée
4. Vérifier les CORS

### Les ID ne matchent pas
- Backend utilise `int`, frontend attend `number` → ✅ Compatible
- Vérifier que les relations FK sont correctes dans Xano

### Les addons ne retournent pas de données
- Vérifier que les addons sont bien définis dans Xano
- Vérifier les noms des addons (ex: `_theme_of_category_2`)

### Token expiré
- Backend: token expire après 24h
- Solution: Implémenter refresh token ou redemander login

### Device ID différent sur mobile/desktop
- C'est normal: un device ID par navigateur
- Si besoin d'un ID unique par user: utiliser user.id au lieu de device_id

## 📝 Commandes utiles

### Démarrer le dev server
```bash
npm run dev
```

### Build pour production
```bash
npm run build
```

### Preview du build
```bash
npm run preview
```

## 📚 Ressources

- [Documentation Xano](https://docs.xano.com/)
- [Guide des queries DB](./db_query_guideline.md)
- [Guide d'intégration](./integration_guide.md)
