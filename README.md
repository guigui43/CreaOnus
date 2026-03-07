# CreaOnus - Karaoké Musical

Site statique pour présenter les créations musicales faites avec [Suno AI](https://suno.ai), avec un mode karaoké synchronisé.

## Fonctionnalités

- **Lecteur audio** avec contrôles complets (play, pause, suivant, précédent)
- **Mode karaoké** avec synchronisation des paroles en temps réel
- **Playlist interactive** pour naviguer entre les chansons
- **Design moderne et responsive** (desktop, tablette, mobile)
- **5 variantes visuelles** : Elegant, Neon Gaming, Minimal, Retro, Rainbow
- **Déploiement automatique** sur GitHub Pages

## Structure du projet

```
CreaOnus/
├── index.html              # Page principale (style original)
├── demo.html               # 🎨 Démo des thèmes
├── themes.html             # 🎯 Raccourci sélecteur de variantes
├── elegant.html            # 💎 Raccourci thème Elegant (redirection propre)
├── neon.html               # 🌟 Raccourci thème Neon Gaming (redirection propre)
├── minimal.html            # 🤍 Raccourci thème Minimal (redirection propre)
├── retro.html              # 📻 Raccourci thème Retro (redirection propre)
├── rainbow.html            # 🌈 Raccourci thème Rainbow (redirection propre)
├── test-404-fix.html       # 🔧 Test correction erreur 404 CSS
├── ERREUR_404_RESOLUE.md   # 📋 Documentation correction erreur CSS
├── css/
│   └── style.css           # Styles du site original
├── js/
│   ├── app.js              # Logique de l'application
│   ├── songs.js            # Configuration des chansons
│   └── path-helper.js      # Helper pour ajustement des chemins
├── musics/                 # Dossier pour les fichiers audio
│   └── (vos fichiers .mp3)
├── variants/               # 🎨 Variantes visuelles complètes
│   ├── index.html         # 🎯 Sélecteur de variantes
│   ├── elegant/           # 💎 Style luxueux
│   ├── neon/              # 🌟 Style cyberpunk gaming
│   ├── minimal/           # 🤍 Style épuré moderne
│   ├── retro/             # 📻 Style vintage 70/80
│   ├── rainbow/           # 🌈 Style coloré festif
│   └── README.md          # Guide des variantes
└── .github/
    └── workflows/
        └── deploy.yml      # Workflow GitHub Pages
```

## Comment ajouter une chanson

### 1. Ajouter le fichier audio

Placez votre fichier `.mp3` dans le dossier `musics/`.

### 2. Configurer la chanson dans `js/songs.js`

Ajoutez une nouvelle entrée dans le tableau `SONGS` :

```javascript
{
    id: 4,  // Numéro unique
    title: "Titre de la chanson",
    artist: "Nom de l'artiste",
    album: "Nom de l'album",
    duration: "3:45",
    audioFile: "musics/ma-chanson.mp3",
    audioUrl: "",  // Optionnel: URL externe
    cover: "",     // Optionnel: image de couverture
    lyrics: [
        { time: 0, text: "♪ Introduction ♪" },
        { time: 5, text: "Première ligne de paroles" },
        { time: 10, text: "Deuxième ligne de paroles" },
        // ... etc
    ]
}
```

### 3. Format des timestamps

Les timestamps dans `lyrics` correspondent au temps en secondes où chaque ligne doit s'afficher :

- `time: 0` - Début de la chanson
- `time: 5` - À 5 secondes
- `time: 10.5` - À 10.5 secondes (précision décimale possible)

## 🎨 Variantes Visuelles

Le site CreaOnus propose **5 styles visuels différents** pour personnaliser votre expérience :

### 🎯 Sélecteur de Variantes
Accédez au sélecteur : **[themes.html](themes.html)** ou **[variants/index.html](variants/index.html)**

### 🚀 URLs Simplifiées

#### ✅ **URLs qui MARCHENT**
- **Sélecteur** : `http://localhost:3000/demo.html`
- **Elegant** : `http://localhost:3000/elegant.html` ou `http://localhost:3000/variants/elegant/index.html`  
- **Neon Gaming** : `http://localhost:3000/neon.html` ou `http://localhost:3000/variants/neon/index.html`
- **Minimal** : `http://localhost:3000/minimal.html` ou `http://localhost:3000/variants/minimal/index.html`
- **Retro** : `http://localhost:3000/retro.html` ou `http://localhost:3000/variants/retro/index.html`
- **Rainbow** : `http://localhost:3000/rainbow.html` ou `http://localhost:3000/variants/rainbow/index.html`

#### ❌ **URLs qui NE MARCHENT PAS**
- ❌ `http://localhost:3000/variants/elegant` (sans /index.html)
- ❌ `http://localhost:3000/variants/rainbow` (sans /index.html)

#### 🔍 **Test des URLs**
- **Test complet** : `http://localhost:3000/test-urls.html`

### 💎 Elegant - Style Luxueux
- Couleurs dorées et champagne
- Effets de verre (glass morphism)  
- Animations élégantes et raffinées
- **Accès direct** : `elegant.html` ou `variants/elegant/index.html`

### 🌟 Neon Gaming - Style Cyberpunk
- Couleurs néon (cyan, magenta, vert)
- Effets de lueur et particules
- Interface style terminal/gaming
- **Accès direct** : `neon.html` ou `variants/neon/index.html`

### 🤍 Minimal - Style Épuré
- Design minimaliste moderne
- Couleurs neutres (blanc, gris, bleu)
- Interface claire inspirée des apps contemporaines
- **Accès direct** : `minimal.html` ou `variants/minimal/index.html`

### 📻 Retro - Style Vintage 70/80
- Ambiance jukebox et vinyles
- Couleurs vintage (orange, marron, rouge)
- Écrans CRT avec lignes de balayage
- **Accès direct** : `retro.html` ou `variants/retro/index.html`

### 🌈 Rainbow - Style Coloré Festif
- Couleurs arc-en-ciel et dégradés
- Effets magiques avec particules
- Interface joyeuse et festive
- **Accès direct** : `rainbow.html` ou `variants/rainbow/index.html`

> 📖 **Guide complet** : Consultez `variants/README.md` pour plus de détails  
> 🔧 **Problème de styles** : Consultez `DEPANNAGE_CSS.md` si les thèmes s'affichent sans couleur  
> ✅ **Erreur 404 résolue** : Plus d'erreur CSS dans la console (voir `ERREUR_404_RESOLUE.md`)

## Déploiement sur GitHub Pages

### Méthode automatique (recommandée)

1. Poussez votre code sur la branche `main`
2. Le workflow GitHub Actions déploie automatiquement le site

### Méthode manuelle

1. Allez dans **Settings** > **Pages**
2. Source: **GitHub Actions**
3. Le site sera disponible à: `https://[votre-username].github.io/CreaOnus/`

## Utilisation locale

1. Clonez le repository
2. Ouvrez `index.html` dans un navigateur
3. Ou utilisez un serveur local:
   ```bash
   # Avec Python
   python -m http.server 8000
   
   # Avec Node.js
   npx serve
   ```

## Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Espace` | Play/Pause |
| `→` | Avancer de 5 secondes |
| `←` | Reculer de 5 secondes |

## Personnalisation

### Modifier les couleurs

Éditez les variables CSS dans `css/style.css` :

```css
:root {
    --primary: #6366f1;      /* Couleur principale */
    --secondary: #ec4899;    /* Couleur secondaire */
    --background: #0f0f1a;   /* Fond */
    --surface: #1a1a2e;      /* Surfaces */
}
```

### Ajouter une image de couverture

Pour chaque chanson, vous pouvez spécifier une image:

```javascript
{
    ...
    cover: "images/ma-couverture.jpg",
    ...
}
```

## Licence

Ce projet est libre d'utilisation. Les musiques sont générées avec Suno AI.

---

Créé avec amour pour partager les créations musicales Suno.
