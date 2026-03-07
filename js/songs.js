/**
 * Configuration des chansons
 * Structure: chaque chanson est dans un sous-dossier musics/{nom}/
 * - default.mp3 (ou autre fichier audio)
 * - default.jpeg (cover art)
 * - default.lyrics (paroles)
 */

const SONGS = [
    {
        id: 1,
        title: "Rémy Choco, toujours plein de peps",
        artist: "GuiiuG",
        album: "Reggae",
        folder: "remy",
        audioFile: "musics/remy/Remy-Choco-toujours-plein-de-peps-reggae-3.mp3",
        cover: "musics/remy/default.jpeg",
        lyrics: [
            { time: 0, text: "♪ Intro ♪" },
            { time: 4, text: "[Verset 1]" },
            { time: 15, text: "Rémy plonge dans la piscine, hockey sub-aquatique," },
            { time: 20, text: "Crosse de hockey, il slalome, mets des Benson acrobatiques !" },
            { time: 25, text: "Sur son vélo, il pédale comme un fou," },
            { time: 29, text: "Vent dans les cheveux, énergie à revendre!" },
            { time: 33, text: "Plein d'humour, il blague, tout l'monde se marre," },
            { time: 37, text: "Rémy Choco, t'es l'champion, la star des canards !" },
            { time: 42, text: "[Refrain]" },
            { time: 44, text: "Rémy, Rémy Choco, toujours plein d'joie et de peps !" },
            { time: 49, text: "Avec Laetitia sa femme, Livia et Appo ses princesses !" },
            { time: 54, text: "On tourne, on saute, on chante à tue-tête," },
            { time: 59, text: "La fête avec Rémy, c'est d'la dynamite sans cesse !" },
            { time: 64, text: "Choco, Choco, ouais ouais ouais !" },
            { time: 67, text: "Rémy, Rémy Choco, toujours plein d'joie et de peps !" },
            { time: 72, text: "Choco, Choco, ouais ouais ouais !" },
            { time: 77, text: "[Verset 2]" },
            { time: 79, text: "Marié à Laetitia, la plus belle des reines," },
            { time: 84, text: "Livia et Appo, ses deux filles divines !" },
            { time: 89, text: "Il court, il rit, jamais fatigué l'bougre," },
            { time: 93, text: "Hockey sous l'eau ou vélo en pleine furie," },
            { time: 97, text: "Rémy c'est l'énergie, l'humour qui pétille," },
            { time: 101, text: "Avec lui, la vie c'est une grande rigolade !" },
            { time: 106, text: "[Refrain]" },
            { time: 108, text: "Rémy, Rémy Choco, toujours plein d'joie et de peps !" },
            { time: 113, text: "Avec Laetitia sa femme, Livia et Appo ses princesses !" },
            { time: 118, text: "On tourne, on saute, on chante à tue-tête," },
            { time: 123, text: "La fête avec Rémy, c'est la vie sans cesse !" },
            { time: 128, text: "Choco, Choco, ouais ouais ouais !" },
            { time: 131, text: "Rémy, Rémy Choco, toujours plein d'joie et de peps !" },
            { time: 136, text: "Choco, Choco, ouais ouais ouais !" },
            { time: 141, text: "[Pont]" },
            { time: 143, text: "Allez Rémy, montre-nous tes tricks sous l'eau !" },
            { time: 147, text: "Pédale plus fort, fais-nous rire encore !" },
            { time: 151, text: "Laetitia, Livia, Appo, on vous embrasse," },
            { time: 155, text: "La mi-fa Choco, c'est d'lamour à gogo !" },
            { time: 160, text: "[Outro]" },
            { time: 162, text: "Rémy Choco forever, énergie infinie !" },
            { time: 166, text: "À la prochaine mon ami!" },
            { time: 169, text: "À la prochaine mon poto! mon Choco!" },
            { time: 173, text: "Et surtout pas de i sur Rémy sinon c'est fini !" }
        ]
    },
    {
        id: 2,
        title: "Timéo Yeah yeah",
        artist: "GuiiuG",
        album: "Anniversaire",
        folder: "timeo",
        audioFile: "musics/timeo/Timeo-Yeah-yeah-suite.mp3",
        cover: "musics/timeo/default.jpeg",
        lyrics: [
            { time: 0, text: "♪ Intro ♪" },
            { time: 4, text: "(Yeah, yeah !)" },
            { time: 7, text: "Ce matin, il bondit du lit," },
            { time: 10, text: "Treize ans déjà ! Quel tsunami !" },
            { time: 14, text: "Il a troqué sa trottinette pour une manette," },
            { time: 18, text: "Le monde est à lui, prêt pour la conquête !" },
            { time: 22, text: "Fortnite, Rocket League, il va tout roxer !" },
            { time: 28, text: "[Couplet 1]" },
            { time: 30, text: "Treize ans d'énergie, entouré d'amis," },
            { time: 34, text: "La manette branchée," },
            { time: 37, text: "Les potes connectés," },
            { time: 40, text: "L'aventure commence." },
            { time: 43, text: "C'est la game de sa vie," },
            { time: 46, text: "Le son à fond, casque sans fil," },
            { time: 50, text: "Avec ambiance de folie," },
            { time: 54, text: "Timéo ....mais.... t'es craqué au sous-sol !!!" },
            { time: 60, text: "[Refrain]" },
            { time: 62, text: "Timéo ho ho hey oh, c'est la fête !" },
            { time: 68, text: "[Couplet 2]" },
            { time: 70, text: "La Switch s'enflamme, les scores explosent," },
            { time: 74, text: "La musique pulse," },
            { time: 77, text: "Les parents crient," },
            { time: 80, text: "Mais pourquoi donc ...?" },
            { time: 83, text: "Timéo, il est où ton vélo!" },
            { time: 87, text: "Dehors il fait beau !" },
            { time: 91, text: "Une sortie entre amis et en un instant..." },
            { time: 95, text: "Mais en un clic, il repart dans sa partie." },
            { time: 100, text: "[Refrain final]" },
            { time: 102, text: "Timéo ho ho hey oh, c'est la fête et c'est si chouette !" },
            { time: 107, text: "Souviens-toi toujours, on est fiers de tes prouesses." },
            { time: 112, text: "Fiers de toi, aujourd'hui comme demain," },
            { time: 116, text: "Maman et papa seront toujours là." },
            { time: 120, text: "Et ta sœur s'ennuierait sans ton éclat." },
            { time: 125, text: "Treize ans de bonheur et de joie!" },
            { time: 128, text: "Une petite chanson rien que pour toi" },
            { time: 132, text: "Timéo ho ho hey oh, c'est la fête !" },
            { time: 136, text: "Un très bel anniversaire à toi" },
            { time: 142, text: "[Pont]" },
            { time: 144, text: "(Ha) mince... Qu'est-ce qu'on a dit ?!" },
            { time: 148, text: "Ta sœur s'ennuie grave sans toi - même pas vrai, elle te kiffe promis !" },
            { time: 153, text: "Et vlà, bam, boom, bing ! C'est dit," },
            { time: 157, text: "Avec toi, notre amour grandit !" },
            { time: 161, text: "La famille unie, pour la vie !" },
            { time: 166, text: "Wesh wesh canne-à-pêche," },
            { time: 169, text: "Garde la pêche, c'est ton jour de fête !" },
            { time: 173, text: "13 ans, chiffre chanceux," },
            { time: 176, text: "Heureux, joyeux, c'est contagieux !" },
            { time: 180, text: "Un garçon adorable qu'on aime à la (folie) !!" },
            { time: 185, text: "Wesh wesh canne-à-pêche..." },
            { time: 190, text: "Timéo ho ho hey oh !" },
            { time: 194, text: "C'est la der' des ders, le grand final !" },
            { time: 198, text: "Timéo ho ho hey oh, t'es notre champion !" },
            { time: 203, text: "♪ Outro ♪" }
        ]
    }
];

// Fonction pour détecter et ajuster les chemins automatiquement
function adjustPathsForContext(songs) {
    // Détecte si on est dans un sous-dossier de variantes
    const isInVariant = window.location.pathname.includes('/variants/');
    const pathPrefix = isInVariant ? '../../' : '';
    
    if (!isInVariant) return songs; // Pas besoin d'ajuster si on est à la racine
    
    return songs.map(song => ({
        ...song,
        audioFile: song.audioFile && !song.audioFile.startsWith('http') && !song.audioFile.startsWith('../') 
            ? pathPrefix + song.audioFile 
            : song.audioFile,
        cover: song.cover && !song.cover.startsWith('http') && !song.cover.startsWith('../') 
            ? pathPrefix + song.cover 
            : song.cover
    }));
}

// Ajuste automatiquement les chemins selon le contexte (racine ou variante)
if (typeof window !== 'undefined') {
    window.SONGS = adjustPathsForContext(SONGS);
} else {
    // Pour Node.js ou autres environnements
    window.SONGS = SONGS;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SONGS;
}
