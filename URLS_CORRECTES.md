# 🌐 URLs Correctes pour CreaOnus

## ❌ **URLs qui NE MARCHENT PAS**

Ces URLs donnent des erreurs 404 ou ne chargent pas correctement :

```
❌ http://localhost:3000/variants/elegant
❌ http://localhost:3000/variants/neon  
❌ http://localhost:3000/variants/minimal
❌ http://localhost:3000/variants/retro
❌ http://localhost:3000/variants/rainbow
❌ http://localhost:3000/rainbow
❌ http://localhost:3000/elegant
```

## ✅ **URLs CORRECTES qui MARCHENT**

### 🏠 **Site Principal**
```
✅ http://localhost:3000/
✅ http://localhost:3000/index.html
```

### 🎯 **Sélecteur de Thèmes**
```
✅ http://localhost:3000/demo.html
✅ http://localhost:3000/themes.html
✅ http://localhost:3000/variants/index.html
```

### 🎨 **Thèmes - Version Longue (Recommandée)**
```
✅ http://localhost:3000/variants/elegant/index.html
✅ http://localhost:3000/variants/neon/index.html
✅ http://localhost:3000/variants/minimal/index.html
✅ http://localhost:3000/variants/retro/index.html
✅ http://localhost:3000/variants/rainbow/index.html
```

### 🚀 **Thèmes - Raccourcis Rapides**
```
✅ http://localhost:3000/elegant.html
✅ http://localhost:3000/neon.html
✅ http://localhost:3000/minimal.html
✅ http://localhost:3000/retro.html
✅ http://localhost:3000/rainbow.html
```

### 🆕 **Nouveaux Raccourcis dans variants/**
```
✅ http://localhost:3000/variants/elegant.html
✅ http://localhost:3000/variants/neon.html
✅ http://localhost:3000/variants/minimal.html
✅ http://localhost:3000/variants/retro.html
✅ http://localhost:3000/variants/rainbow.html
```

## 🔍 **Outils de Diagnostic**
```
✅ http://localhost:3000/test-css.html          # Test des CSS
✅ http://localhost:3000/check-files.html       # Vérification fichiers
✅ http://localhost:3000/variants/test-simple.html   # Test simple
```

## 💡 **Pourquoi certaines URLs ne marchent pas ?**

Le serveur `npx serve` ne fait **pas de redirection automatique** :
- `variants/elegant` → C'est un **dossier**
- `variants/elegant/` → C'est un **dossier** avec slash  
- `variants/elegant/index.html` → C'est un **fichier** ✅

## 🎯 **Méthode la Plus Simple**

**Utilisez toujours l'interface de sélection :**

1. **Ouvrez** : `http://localhost:3000/demo.html`
2. **Cliquez** sur le thème de votre choix
3. **Vous êtes redirigé** automatiquement vers la bonne URL

## 🔧 **Si vous préférez taper les URLs manuellement**

**Format court :** `localhost:3000/[theme].html`
- `localhost:3000/rainbow.html`
- `localhost:3000/elegant.html`

**Format long :** `localhost:3000/variants/[theme]/index.html`  
- `localhost:3000/variants/rainbow/index.html`
- `localhost:3000/variants/elegant/index.html`

## 📱 **Test Rapide**

Copiez-collez ces URLs pour tester :

```
http://localhost:3000/demo.html
http://localhost:3000/rainbow.html
http://localhost:3000/variants/elegant/index.html
```

---

💡 **Astuce** : Marquez `demo.html` comme favori pour avoir toujours accès à tous les thèmes d'un clic !