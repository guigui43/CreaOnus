# CreaOnus 🎵

Application web de karaoké pour présenter des créations musicales générées avec **Suno AI**.

---

## Fonctionnalités

- **Lecteur audio** — Play/Pause, Précédent, Suivant, barre de progression cliquable/draggable, contrôle du volume
- **Suivi des paroles** — Surlignage automatique de la ligne en cours synchronisé avec la lecture, défilement fluide
- **Multi-variantes** — Chaque chanson peut avoir plusieurs versions (style, arrangement…), chacune avec ses propres paroles optionnelles
- **Playlist** — Sélection par chanson et par variante, indicateur animé de la piste en cours
- **Design responsive** — Thème sombre, vinyle animé, compatible mobile / tablette / desktop

### Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Espace` | Play / Pause |
| `←` | Reculer de 5 secondes |
| `→` | Avancer de 5 secondes |
| `M` | Couper / activer le son |
| `K` | Activer / désactiver le suivi des paroles |

---

## Lancer l'application

### Depuis VS Code

Ouvrir le panneau **Run & Debug** (`Ctrl+Shift+D`) et choisir une configuration :

- **Lancer CreaOnus (Edge)**
- **Lancer CreaOnus (Chrome)**
- **Lancer CreaOnus (Firefox)** *(nécessite l'extension [Debugger for Firefox](https://marketplace.visualstudio.com/items?itemName=firefox-devtools.vscode-firefox-debug))*

Le serveur local démarre automatiquement sur `http://localhost:3000`.

### En ligne de commande

```bash
npx serve -l 3000
```

Puis ouvrir `http://localhost:3000` dans un navigateur.

---

## Ajouter une chanson

### 1. Structure des fichiers

```
musics/
└── ma-chanson/
    ├── default.jpeg      # pochette album
    ├── default.lyrics    # paroles (format plain ou LRC)
    ├── variante-1.mp3
    └── variante-2.mp3
```

### 2. Déclarer dans `playlist.json`

```json
{
  "id": "ma-chanson",
  "title": "Titre affiché",
  "artist": "Artiste",
  "cover": "musics/ma-chanson/default.jpeg",
  "lyrics": "musics/ma-chanson/default.lyrics",
  "variants": [
    {
      "id": "v1",
      "label": "Version 1",
      "file": "musics/ma-chanson/variante-1.mp3"
    },
    {
      "id": "v2",
      "label": "Version 2",
      "file": "musics/ma-chanson/variante-2.mp3",
      "lyrics": "musics/ma-chanson/variante-2.lyrics",
      "karaoke": false
    }
  ]
}
```

#### Propriétés d'un variant

| Champ | Type | Défaut | Description |
|-------|------|--------|-------------|
| `id` | string | — | Identifiant unique |
| `label` | string | — | Libellé affiché dans la playlist |
| `file` | string | — | Chemin vers le fichier MP3 |
| `lyrics` | string | `song.lyrics` | Paroles spécifiques à cette variante (optionnel) |
| `karaoke` | boolean | *(état actuel)* | `true` force le suivi ON, `false` force le suivi OFF, absent = conserve l'état de l'utilisateur |

---

## Format des paroles (`.lyrics`)

### Format plain (timing automatique)

Les temps sont distribués automatiquement sur la durée de la chanson.

```
[Verset 1]
Première ligne de paroles
Deuxième ligne de paroles

[Refrain]
Ligne du refrain
```

Les lignes entre crochets (`[Refrain]`, `[Verset 1]`…) sont traitées comme des **en-têtes de section** : affichées en petit, non cliquables, aucun slot de timing notable.

### Format LRC (timing précis)

Préfixer chaque ligne d'un timestamp `[mm:ss.xx]` pour une synchronisation exacte.

```
[Verset 1]
[00:04.50] Première ligne de paroles
[00:08.20] Deuxième ligne de paroles

[Refrain]
[00:32.00] Ligne du refrain
[00:36.50] Suite du refrain
```

- Les centièmes de seconde sont **optionnels** : `[00:32]` et `[00:32.00]` sont équivalents
- Les en-têtes de section n'ont **pas** besoin de timestamp
- **Format mixte supporté** : les lignes sans timestamp reçoivent un timing automatique, les lignes avec timestamp sont ancrées précisément

---

## Structure du projet

```
CreaOnus/
├── index.html         # Structure HTML
├── style.css          # Thème sombre, responsive
├── app.js             # Logique applicative
├── playlist.json      # Déclaration des chansons et variantes
├── musics/
│   ├── remy/
│   │   ├── default.jpeg
│   │   ├── default.lyrics
│   │   ├── default.suno   # variante phonétique Suno
│   │   └── *.mp3
│   └── timeo/
│       ├── default.jpeg
│       ├── default.lyrics
│       └── *.mp3
└── .vscode/
    ├── launch.json    # Configurations Run & Debug
    └── tasks.json     # Tâche serveur local
```
