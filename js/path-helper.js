/**
 * Helper pour ajuster les chemins selon le contexte (racine ou variante)
 */
class PathHelper {
    constructor() {
        // Détecte si on est dans un sous-dossier de variantes
        this.isInVariant = window.location.pathname.includes('/variants/');
        this.pathPrefix = this.isInVariant ? '../../' : '';
    }

    /**
     * Ajuste un chemin pour qu'il fonctionne depuis n'importe quel contexte
     * @param {string} path - Le chemin original (relatif à la racine)
     * @returns {string} - Le chemin ajusté
     */
    adjustPath(path) {
        if (!path) return path;
        
        // Si le chemin commence déjà par ../, ne pas le modifier
        if (path.startsWith('../')) return path;
        
        // Si chemin absolu (http/https), ne pas le modifier
        if (path.startsWith('http')) return path;
        
        return this.pathPrefix + path;
    }

    /**
     * Ajuste tous les chemins dans les données de chanson
     * @param {Array} songs - Tableau des chansons
     * @returns {Array} - Tableau avec chemins ajustés
     */
    adjustSongPaths(songs) {
        return songs.map(song => ({
            ...song,
            audioFile: song.audioFile ? this.adjustPath(song.audioFile) : song.audioFile,
            audioUrl: song.audioUrl, // Les URLs externes ne changent pas
            cover: song.cover ? this.adjustPath(song.cover) : song.cover
        }));
    }
}

// Instance globale
window.pathHelper = new PathHelper();