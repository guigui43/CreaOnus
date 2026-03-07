# 🎨 Variantes Visuelles CreaOnus

Ce dossier contient **5 variantes visuelles** différentes du site de karaoké CreaOnus, chacune avec son propre style et son ambiance unique.

## 🎭 Les Variantes Disponibles

### 1. 💎 **Elegant** - Style Luxueux et Raffiné
- **Couleurs** : Or, noir, champagne
- **Style** : Luxueux avec effets de verre (glass morphism)
- **Polices** : Playfair Display (titres) + Inter
- **Atmosphère** : Sophistiquée, premium, classe
- **Animations** : Douces et élégantes
- **Fichier** : `variants/elegant/index.html`

### 2. 🌟 **Neon Gaming** - Style Cyberpunk
- **Couleurs** : Cyan, magenta, vert néon, orange
- **Style** : Gaming/Cyberpunk avec effets néon
- **Polices** : Orbitron (monospace) + Rajdhani
- **Atmosphère** : Futuriste, high-tech, gaming
- **Animations** : Effets de lueur, glitch, particules
- **Fichier** : `variants/neon/index.html`

### 3. 🤍 **Minimal** - Style Épuré et Moderne
- **Couleurs** : Blanc, gris, noir, bleu accent
- **Style** : Minimaliste, épuré, moderne
- **Polices** : Inter + Space Grotesk
- **Atmosphère** : Calme, propre, professionnel
- **Animations** : Subtiles et fluides
- **Fichier** : `variants/minimal/index.html`

### 4. 📻 **Retro** - Style Vintage Années 70/80
- **Couleurs** : Orange, marron, jaune, rouge vintage
- **Style** : Jukebox rétro, vinyles, écrans CRT
- **Polices** : Righteous + Fredoka
- **Atmosphère** : Nostalgique, vintage, chaleureuse
- **Animations** : Disques qui tournent, effets rétro
- **Fichier** : `variants/retro/index.html`

### 5. 🌈 **Rainbow** - Style Coloré et Festif
- **Couleurs** : Arc-en-ciel complet, dégradés colorés
- **Style** : Joyeux, coloré, féérique
- **Polices** : Comfortaa + Nunito
- **Atmosphère** : Festive, magique, énergique
- **Animations** : Aurores, particules, étincelles
- **Fichier** : `variants/rainbow/index.html`

## 📂 Structure des Fichiers

Chaque variante contient :
```
variants/
├── elegant/
│   ├── index.html          # Page HTML avec structure adaptée
│   └── style.css          # Styles CSS spécifiques
├── neon/
│   ├── index.html
│   └── style.css
├── minimal/
│   ├── index.html
│   └── style.css
├── retro/
│   ├── index.html
│   └── style.css
├── rainbow/
│   ├── index.html
│   └── style.css
└── README.md              # Ce fichier
```

## 🚀 Comment Utiliser

### Méthode 1 : Accès Direct
1. Ouvrez directement le fichier `index.html` de la variante souhaitée dans votre navigateur
2. Exemple : `variants/elegant/index.html`

### Méthode 2 : Serveur Local
```bash
# Depuis le dossier variants
cd variants/elegant
python -m http.server 8000
# Puis ouvrir http://localhost:8000
```

### Méthode 3 : Copier une Variante
Pour remplacer le style principal :
1. Copiez le contenu de `variants/[variante]/style.css`
2. Collez-le dans `css/style.css` (racine du projet)
3. Adaptez le HTML principal si nécessaire

## 🔗 Liens vers les Ressources Communes

Toutes les variantes utilisent les mêmes :
- **JavaScript** : `../../js/songs.js` et `../../js/app.js`
- **Musiques** : Dossier `../../musics/`
- **Données** : Configuration des chansons partagée

## 📱 Responsive Design

Toutes les variantes sont :
- ✅ **Responsive** (mobile, tablette, desktop)
- ✅ **Accessible** (contrôles clavier, focus visible)
- ✅ **Optimisées** (animations fluides, performance)

## 🎨 Personnalisation

### Variables CSS
Chaque variante utilise des variables CSS que vous pouvez modifier :

```css
:root {
    --primary-color: #your-color;
    --secondary-color: #your-color;
    /* ... */
}
```

### Ajouter une Nouvelle Variante
1. Créez un nouveau dossier dans `variants/`
2. Copiez `minimal/index.html` comme base
3. Créez votre `style.css` personnalisé
4. Adaptez les liens vers les ressources communes

## 🎵 Fonctionnalités Communes

Toutes les variantes incluent :
- 🎵 **Lecteur audio** complet
- 🎤 **Mode karaoké** avec synchronisation des paroles
- 📱 **Interface responsive**
- ⌨️ **Contrôles clavier** (Espace, flèches)
- 🎚️ **Contrôles de volume**
- 📋 **Playlist interactive**

## 🎯 Choisir sa Variante

**Pour un site professionnel** → **Elegant** ou **Minimal**  
**Pour les gamers** → **Neon Gaming**  
**Pour la nostalgie** → **Retro**  
**Pour les enfants/fêtes** → **Rainbow**  

## 🔧 Support Technique

Toutes les variantes sont compatibles avec :
- ✅ Chrome, Firefox, Safari, Edge
- ✅ iOS Safari, Chrome Mobile
- ✅ Écrans de toutes tailles
- ✅ Mode sombre/clair automatique (selon la variante)

---

**🎉 Amusez-vous bien avec votre karaoké musical !** 🎤✨