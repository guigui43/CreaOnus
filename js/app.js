/**
 * CreaOnus - Application Karaoké
 * Gestion du lecteur audio et synchronisation des paroles
 */

class KaraokePlayer {
    constructor() {
        // Utilise window.SONGS (avec chemins ajustés) ou SONGS en fallback
        this.songs = window.SONGS || SONGS;
        this.currentSongIndex = 0;
        this.isPlaying = false;
        this.isKaraokeMode = true;
        this.currentLyricIndex = -1;
        
        this.initElements();
        this.initEventListeners();
        this.renderPlaylist();
        this.loadSong(0);
    }

    initElements() {
        // Audio
        this.audio = document.getElementById('audio-player');
        
        // Controls
        this.playBtn = document.getElementById('play-btn');
        this.prevBtn = document.getElementById('prev-btn');
        this.nextBtn = document.getElementById('next-btn');
        this.progressBar = document.getElementById('progress-bar');
        this.volumeSlider = document.getElementById('volume-slider');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        
        // Display
        this.songTitle = document.getElementById('song-title');
        this.songArtist = document.getElementById('song-artist');
        this.lyricsContainer = document.getElementById('lyrics-container');
        this.playlistEl = document.getElementById('playlist');
        this.vinyl = document.querySelector('.vinyl');
        
        // Karaoke toggle
        this.karaokeToggle = document.getElementById('karaoke-toggle');
    }

    initEventListeners() {
        // Play/Pause
        this.playBtn.addEventListener('click', () => this.togglePlay());
        
        // Navigation
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        
        // Progress bar
        this.progressBar.addEventListener('input', (e) => {
            const time = (e.target.value / 100) * this.audio.duration;
            this.audio.currentTime = time;
        });
        
        // Volume
        this.volumeSlider.addEventListener('input', (e) => {
            this.audio.volume = e.target.value / 100;
        });
        
        // Audio events
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        this.audio.addEventListener('loadedmetadata', () => this.updateDuration());
        this.audio.addEventListener('ended', () => this.nextSong());
        
        // Karaoke mode
        this.karaokeToggle.addEventListener('click', () => this.toggleKaraokeMode());
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                e.preventDefault();
                this.togglePlay();
            } else if (e.code === 'ArrowRight') {
                this.audio.currentTime += 5;
            } else if (e.code === 'ArrowLeft') {
                this.audio.currentTime -= 5;
            }
        });
    }

    renderPlaylist() {
        this.playlistEl.innerHTML = this.songs.map((song, index) => `
            <div class="playlist-item ${index === this.currentSongIndex ? 'active' : ''}" 
                 data-index="${index}">
                <div class="playlist-item-number">${index + 1}</div>
                <div class="playlist-item-info">
                    <h4>${song.title}</h4>
                    <p>${song.artist}</p>
                </div>
                <div class="playlist-item-duration">${song.duration}</div>
            </div>
        `).join('');

        // Add click listeners
        this.playlistEl.querySelectorAll('.playlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const index = parseInt(item.dataset.index);
                this.loadSong(index);
                this.play();
            });
        });
    }

    loadSong(index) {
        this.currentSongIndex = index;
        const song = this.songs[index];
        
        // Update audio source
        const audioSource = song.audioUrl || song.audioFile;
        this.audio.src = audioSource;
        
        // Update display
        this.songTitle.textContent = song.title;
        this.songArtist.textContent = song.artist;
        
        // Reset progress
        this.progressBar.value = 0;
        this.currentTimeEl.textContent = '0:00';
        
        // Render lyrics
        this.renderLyrics(song.lyrics);
        
        // Update playlist active state
        this.updatePlaylistActive();
        
        // Reset lyric index
        this.currentLyricIndex = -1;
    }

    renderLyrics(lyrics) {
        if (!lyrics || lyrics.length === 0) {
            this.lyricsContainer.innerHTML = '<p class="placeholder-text">Pas de paroles disponibles</p>';
            return;
        }

        this.lyricsContainer.innerHTML = lyrics.map((line, index) => `
            <div class="lyric-line future" data-time="${line.time}" data-index="${index}">
                ${line.text}
            </div>
        `).join('');

        // Add click listeners to lyrics for seeking
        this.lyricsContainer.querySelectorAll('.lyric-line').forEach(line => {
            line.addEventListener('click', () => {
                const time = parseFloat(line.dataset.time);
                this.audio.currentTime = time;
            });
        });
    }

    updateProgress() {
        if (this.audio.duration) {
            const progress = (this.audio.currentTime / this.audio.duration) * 100;
            this.progressBar.value = progress;
            this.currentTimeEl.textContent = this.formatTime(this.audio.currentTime);
            
            // Update lyrics highlighting
            if (this.isKaraokeMode) {
                this.updateLyricsHighlight();
            }
        }
    }

    updateDuration() {
        this.durationEl.textContent = this.formatTime(this.audio.duration);
    }

    updateLyricsHighlight() {
        const currentTime = this.audio.currentTime;
        const song = this.songs[this.currentSongIndex];
        
        if (!song.lyrics) return;

        let newIndex = -1;
        
        // Find current lyric line
        for (let i = song.lyrics.length - 1; i >= 0; i--) {
            if (currentTime >= song.lyrics[i].time) {
                newIndex = i;
                break;
            }
        }

        if (newIndex !== this.currentLyricIndex) {
            this.currentLyricIndex = newIndex;
            
            // Update all lyric lines
            const lines = this.lyricsContainer.querySelectorAll('.lyric-line');
            lines.forEach((line, index) => {
                line.classList.remove('past', 'current', 'future');
                
                if (index < newIndex) {
                    line.classList.add('past');
                } else if (index === newIndex) {
                    line.classList.add('current');
                    this.scrollToLyric(line);
                } else {
                    line.classList.add('future');
                }
            });
        }
    }

    scrollToLyric(element) {
        const container = this.lyricsContainer;
        const elementRect = element.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();
        
        const scrollTop = element.offsetTop - (containerRect.height / 2) + (elementRect.height / 2);
        
        container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
    }

    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    play() {
        this.audio.play().catch(err => {
            console.log('Playback error:', err);
        });
        this.isPlaying = true;
        this.playBtn.classList.add('playing');
        this.vinyl.classList.add('playing');
    }

    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.playBtn.classList.remove('playing');
        this.vinyl.classList.remove('playing');
    }

    prevSong() {
        const newIndex = this.currentSongIndex === 0 
            ? this.songs.length - 1 
            : this.currentSongIndex - 1;
        this.loadSong(newIndex);
        if (this.isPlaying) this.play();
    }

    nextSong() {
        const newIndex = (this.currentSongIndex + 1) % this.songs.length;
        this.loadSong(newIndex);
        if (this.isPlaying) this.play();
    }

    updatePlaylistActive() {
        this.playlistEl.querySelectorAll('.playlist-item').forEach((item, index) => {
            item.classList.toggle('active', index === this.currentSongIndex);
        });
    }

    toggleKaraokeMode() {
        this.isKaraokeMode = !this.isKaraokeMode;
        this.karaokeToggle.classList.toggle('active', this.isKaraokeMode);
        
        if (!this.isKaraokeMode) {
            // Remove all highlighting
            this.lyricsContainer.querySelectorAll('.lyric-line').forEach(line => {
                line.classList.remove('past', 'current', 'future');
            });
        } else {
            // Re-apply highlighting
            this.updateLyricsHighlight();
        }
    }

    formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.karaokePlayer = new KaraokePlayer();
});
