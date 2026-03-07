# Ajoutez vos fichiers audio ici

## Formats supportés
- MP3 (recommandé)
- WAV
- OGG
- M4A

## Comment ajouter une chanson

1. Placez votre fichier audio dans ce dossier
2. Éditez `js/songs.js` pour ajouter la configuration
3. Spécifiez le chemin: `audioFile: "musics/votre-fichier.mp3"`

## Exemple

Si vous avez un fichier `ma-chanson.mp3`:

```javascript
// Dans js/songs.js
{
    id: 4,
    title: "Ma Chanson",
    artist: "Mon Nom",
    audioFile: "musics/ma-chanson.mp3",
    lyrics: [...]
}
```
