'use strict';

/* ═══════════════════════════════════════════════════════════════════
   CreaOnus – Karaoke Application
   Lyrics auto-timing: lines are distributed evenly over song duration.
═══════════════════════════════════════════════════════════════════ */

class CreaOnus {
  constructor() {
    this._audio          = document.getElementById('audio');
    this._songs          = [];
    this._currentSong    = -1;
    this._currentVariant = 0;
    this._lyrics         = [];   // [{ text, isHeader, time }]
    this._activeLine     = -1;
    this._syncLyricsOn   = true;
    this._muted          = false;
    this._dragging       = false;
    this._wakeLock       = null;

    this._init();
  }

  // ─────────────────────────────────────────────────────────────────
  //  Bootstrap
  // ─────────────────────────────────────────────────────────────────
  async _init() {
    this._bindAudioEvents();
    this._bindControlEvents();
    this._bindProgressEvents();
    this._bindKeyboard();
    this._bindMobileSidebar();
    this._bindPullToRefresh();

    try {
      const res = await fetch('playlist.json');
      if (!res.ok) throw new Error('playlist.json introuvable');
      const data = await res.json();
      this._songs = data.songs;
      this._renderPlaylist();

      // Restore from URL params if present
      const params = new URLSearchParams(location.search);
      const songId  = params.get('s');
      const varId   = params.get('v');
      let si = 0, vi = -1;
      if (songId) {
        const found = this._songs.findIndex(s => s.id === songId);
        if (found >= 0) {
          si = found;
          if (varId) {
            const fv = this._songs[si].variants.findIndex(v => v.id === varId);
            if (fv >= 0) vi = fv;
          }
        }
      }
      if (vi < 0) vi = this._mainVariantIdx(this._songs[si]);
      if (this._songs.length > 0) this._selectSong(si, vi, false);
    } catch (err) {
      console.error('[CreaOnus]', err);
      document.getElementById('playlist').innerHTML =
        '<div class="playlist-loading">⚠ Impossible de charger la playlist.</div>';
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  Playlist Rendering
  // ─────────────────────────────────────────────────────────────────
  _renderPlaylist() {
    const container = document.getElementById('playlist');
    container.innerHTML = '';

    this._songs.forEach((song, si) => {
      // Song wrapper
      const songEl = document.createElement('div');
      songEl.className = 'playlist-song';
      songEl.dataset.si = si;

      // Song header row
      const header = document.createElement('div');
      header.className = 'playlist-song-header';
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.setAttribute('aria-label', `${song.title} – ${song.artist}`);
      header.innerHTML = `
        <div class="playlist-song-num">${si + 1}</div>
        <div class="playlist-playing-icon" aria-hidden="true">
          <div class="playing-bars"><span></span><span></span><span></span></div>
        </div>
        <img class="playlist-cover"
             src="${this._esc(song.cover)}"
             alt=""
             loading="lazy"
             onerror="this.style.visibility='hidden'">
        <div class="playlist-info">
          <div class="playlist-song-title">${this._esc(song.title)}</div>
          <div class="playlist-song-meta">${this._esc(song.artist)} · ${song.variants.length} style${song.variants.length > 1 ? 's' : ''}</div>
        </div>`;

      header.addEventListener('click', () => this._selectSong(si, this._mainVariantIdx(song)));
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._selectSong(si, this._mainVariantIdx(song)); }
      });
      songEl.appendChild(header);

      // Variant buttons
      const variantsEl = document.createElement('div');
      variantsEl.className = 'playlist-variants';
      variantsEl.id = `pv-${si}`;

      const sorted = song.variants
        .map((v, vi) => ({ v, vi }))
        .sort((a, b) => (b.v.main ? 1 : 0) - (a.v.main ? 1 : 0));

      sorted.forEach(({ v, vi }) => {
        const btn = document.createElement('button');
        btn.className = 'playlist-variant-btn' + (v.main ? ' main' : '');
        btn.textContent = v.main ? `★ ${v.label}` : v.label;
        if (v.main) btn.setAttribute('title', 'Variante principale');
        btn.dataset.vi = vi;
        btn.setAttribute('aria-label', `${v.label} – ${song.title}`);
        btn.addEventListener('click', e => {
          e.stopPropagation();
          this._selectSong(si, vi);
        });
        variantsEl.appendChild(btn);
      });

      songEl.appendChild(variantsEl);
      container.appendChild(songEl);
    });
  }

  _mainVariantIdx(song) {
    const idx = song.variants.findIndex(v => v.main);
    return idx >= 0 ? idx : 0;
  }

  // ─────────────────────────────────────────────────────────────────
  //  Song / Variant Selection
  // ─────────────────────────────────────────────────────────────────
  async _selectSong(si, vi = 0, autoplay = true) {
    this._currentSong    = si;
    this._currentVariant = vi;

    const song    = this._songs[si];
    const variant = song.variants[vi];

    // Update URL params
    const params = new URLSearchParams({ s: song.id, v: variant.id });
    history.replaceState(null, '', '?' + params.toString());

    // Update now-playing info
    document.getElementById('songTitle').textContent  = song.title;
    document.getElementById('songArtist').textContent = song.artist;

    // Album cover (clear first to trigger transition if same src)
    const coverEl = document.getElementById('vinylCover');
    coverEl.src = '';
    coverEl.src = song.cover;
    coverEl.onerror = () => { coverEl.style.visibility = 'hidden'; };
    coverEl.onload  = () => { coverEl.style.visibility = 'visible'; };

    // Variant chips in main panel
    this._renderVariantChips(song, vi);

    // Playlist UI
    this._updatePlaylistHighlight();

    // Reset player display
    document.getElementById('totalTime').textContent  = '0:00';
    document.getElementById('currentTime').textContent = '0:00';
    this._setProgress(0);

    // Download button
    const dlBtn = document.getElementById('downloadBtn');
    dlBtn.href = variant.file;
    dlBtn.download = `${song.title} – ${variant.label}.mp3`;
    dlBtn.removeAttribute('aria-disabled');

    // Apply syncLyrics mode: variant flag takes priority over current user state.
    // "syncLyrics" field is a boolean (default: true when absent).
    if (variant.syncLyrics === false) {
      this._applySyncLyrics(false);
    } else if (variant.syncLyrics === true) {
      this._applySyncLyrics(true);
    }
    // If the field is absent, preserve whatever the user set manually.

    // Load lyrics then audio (so timing can be applied on metadata)
    // Per-variant lyrics take priority over the song-level default
    this._lyrics    = [];
    this._activeLine = -1;
    await this._loadLyrics(variant.lyrics ?? song.lyrics);

    this._audio.src = variant.file;
    this._audio.load();
    if (autoplay) this._audio.play().catch(() => { /* user gesture required */ });
  }

  _renderVariantChips(song, activeVi) {
    const cont = document.getElementById('variants');
    cont.innerHTML = '';
    const sorted = song.variants
      .map((v, i) => ({ v, i }))
      .sort((a, b) => (b.v.main ? 1 : 0) - (a.v.main ? 1 : 0));
    sorted.forEach(({ v, i }) => {
      const btn = document.createElement('button');
      btn.className  = 'variant-chip' + (i === activeVi ? ' active' : '');
      btn.textContent = v.label;
      btn.setAttribute('aria-pressed', i === activeVi ? 'true' : 'false');
      btn.addEventListener('click', () => this._selectSong(this._currentSong, i));
      cont.appendChild(btn);
    });
  }

  _updatePlaylistHighlight() {
    document.querySelectorAll('.playlist-song').forEach(el => {
      const si = parseInt(el.dataset.si, 10);
      const isActive = si === this._currentSong;
      el.classList.toggle('active', isActive);
      el.classList.toggle('playing', isActive && !this._audio.paused);

      el.querySelectorAll('.playlist-variant-btn').forEach(btn => {
        const vi = parseInt(btn.dataset.vi, 10);
        btn.classList.toggle('active', isActive && vi === this._currentVariant);
        btn.setAttribute('aria-pressed', (isActive && vi === this._currentVariant) ? 'true' : 'false');
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────
  //  Lyrics
  // ─────────────────────────────────────────────────────────────────
  async _loadLyrics(url) {
    const scroll = document.getElementById('lyricsScroll');
    scroll.innerHTML = '<div class="lyrics-placeholder"><p>Chargement des paroles…</p></div>';
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Paroles introuvables');
      const text = await res.text();
      this._parseLyrics(text);
      this._renderLyrics();
    } catch {
      scroll.innerHTML = '<div class="lyrics-placeholder"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"/></svg><p>Paroles non disponibles</p></div>';
      this._lyrics = [];
    }
  }

  /**
   * Parse lyrics from raw text.
   *
   * Supports two formats:
   *
   * 1. LRC format – explicit timestamps on each line:
   *      [01:23.45] Ma première ligne
   *      [01:25.00] Ma deuxième ligne
   *      [Refrain]            ← section headers stay as-is (no timestamp required)
   *
   * 2. Plain format – no timestamps; timing is auto-distributed on loadedmetadata.
   *      [Verset 1]
   *      Première ligne
   *      Deuxième ligne
   *
   * Mixed files are accepted: lines without a timestamp get time=0 and will be
   * assigned via _distributeTiming() at the end.
   */
  _parseLyrics(raw) {
    // LRC timestamp pattern: [mm:ss], [mm:ss.x], [mm:ss.xx], [mm:ss.xxx]
    const LRC_RE = /^\[(\d{1,2}):(\d{2})(?:[.,](\d{1,3}))?\]\s*/;

    this._lyrics    = [];
    this._lrcTimed  = false; // true when at least one LRC timestamp found

    raw.split('\n').forEach(line => {
      const raw = line.trim();
      if (!raw) return;

      const m = LRC_RE.exec(raw);
      if (m) {
        // LRC line
        const min  = parseInt(m[1], 10);
        const sec  = parseInt(m[2], 10);
        const ms   = m[3] ? parseInt(m[3].padEnd(3, '0'), 10) : 0;
        const time = min * 60 + sec + ms / 1000;
        const text = raw.slice(m[0].length).trim();
        if (!text) return; // skip pure-timestamp lines (e.g. song-end markers)
        const isHeader = /^\[.+\]$/.test(text);
        this._lyrics.push({ text, isHeader, time, timed: true });
        this._lrcTimed = true;
      } else {
        // Plain line
        const isHeader = /^\[.+\]$/.test(raw);
        this._lyrics.push({ text: raw, isHeader, time: 0, timed: false });
      }
    });
  }

  /**
   * Distribute timestamps evenly across un-timed lyrics lines.
   * Called on `loadedmetadata` when duration becomes available.
   * If all lines already have LRC timestamps, nothing is changed.
   *
   * Section headers (e.g. [Refrain]) get a short fixed slot;
   * lyric lines share the remaining duration equally.
   */
  _distributeTiming(duration) {
    if (!duration || !this._lyrics.length) return;

    // If every line has an explicit LRC timestamp, nothing to distribute
    if (this._lrcTimed && this._lyrics.every(l => l.timed)) return;

    // Filter only the un-timed lines
    const untimedLines = this._lyrics.filter(l => !l.timed);
    if (!untimedLines.length) return;

    // Build a sorted list of existing timed anchors to fill gaps between them
    // For simplicity: distribute un-timed lines over the full duration
    const HEADER_SLOT  = 1.5;
    const headerCount  = untimedLines.filter(l => l.isHeader).length;
    const contentCount = untimedLines.length - headerCount;
    if (!contentCount) return;

    const totalHeaderTime = Math.min(headerCount * HEADER_SLOT, duration * 0.12);
    const timePerLine     = (duration - totalHeaderTime) / contentCount;

    let t = 0;
    for (const l of this._lyrics) {
      if (l.timed) continue;
      l.time = t;
      t += l.isHeader ? HEADER_SLOT : timePerLine;
    }
  }

  _renderLyrics() {
    const scroll = document.getElementById('lyricsScroll');
    if (!this._lyrics.length) {
      scroll.innerHTML = '<div class="lyrics-placeholder"><p>Paroles non disponibles</p></div>';
      return;
    }

    scroll.innerHTML = '';
    this._lyrics.forEach((lyric, i) => {
      const el = document.createElement('div');
      el.className = 'lyric-line' + (lyric.isHeader ? ' lyric-header' : '');
      el.dataset.i = i;
      el.textContent = lyric.text;

      if (!lyric.isHeader) {
        el.addEventListener('click', () => {
          this._audio.currentTime = lyric.time;
          if (this._audio.paused) this._audio.play().catch(() => {});
        });
      }

      scroll.appendChild(el);
    });
  }

  /**
   * Highlight the current lyric line using a reversed binary search.
   * Only updates the DOM when the active line actually changes.
   */
  _syncLyrics(currentTime) {
    if (!this._syncLyricsOn || !this._lyrics.length) return;

    // Reversed binary search: largest index where time <= currentTime
    let lo = 0, hi = this._lyrics.length - 1, found = -1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      if (this._lyrics[mid].time <= currentTime) { found = mid; lo = mid + 1; }
      else hi = mid - 1;
    }

    if (found === this._activeLine) return;
    this._activeLine = found;

    const lines = document.querySelectorAll('#lyricsScroll .lyric-line');
    lines.forEach((el, i) => {
      el.classList.remove('lyric-past', 'lyric-current', 'lyric-future');
      if      (i < found)  el.classList.add('lyric-past');
      else if (i === found) el.classList.add('lyric-current');
      else                  el.classList.add('lyric-future');
    });

    // Smooth scroll the lyrics container to keep active line centred
    if (found >= 0 && lines[found]) {
      const container = document.getElementById('lyricsScroll');
      const lineRect  = lines[found].getBoundingClientRect();
      const ctnRect   = container.getBoundingClientRect();
      const offset    = lineRect.top - ctnRect.top - container.clientHeight / 2 + lineRect.height / 2;
      container.scrollBy({ top: offset, behavior: 'smooth' });
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  Audio Controls
  // ─────────────────────────────────────────────────────────────────
  _togglePlay() {
    if (this._currentSong < 0) return;
    if (this._audio.paused) this._audio.play().catch(() => {});
    else this._audio.pause();
  }

  _prev() {
    if (this._currentSong < 0) return;
    // If >3 s in, restart current track
    if (this._audio.currentTime > 3) { this._audio.currentTime = 0; return; }
    // Otherwise go to previous variant or previous song
    if (this._currentVariant > 0) {
      this._selectSong(this._currentSong, this._currentVariant - 1);
    } else if (this._currentSong > 0) {
      const prevSi = this._currentSong - 1;
      this._selectSong(prevSi, this._songs[prevSi].variants.length - 1);
    }
  }

  _next() {
    if (this._currentSong < 0) return;
    const song = this._songs[this._currentSong];
    if (this._currentVariant < song.variants.length - 1) {
      this._selectSong(this._currentSong, this._currentVariant + 1);
    } else if (this._currentSong < this._songs.length - 1) {
      this._selectSong(this._currentSong + 1, 0);
    }
  }

  _toggleSyncLyrics() {
    this._applySyncLyrics(!this._syncLyricsOn);
  }

  _applySyncLyrics(on) {
    this._syncLyricsOn = on;
    const btn     = document.getElementById('karaokeToggle');
    const section = document.getElementById('karaokeSection');
    btn.classList.toggle('active', on);
    btn.setAttribute('aria-pressed', String(on));
    section.classList.toggle('karaoke-off', !on);
    // When turning sync off, clear the active line highlight immediately
    if (!on) {
      document.querySelectorAll('#lyricsScroll .lyric-line').forEach(el => {
        el.classList.remove('lyric-past', 'lyric-current', 'lyric-future');
      });
      this._activeLine = -1;
    }
  }

  _toggleMute() {
    this._muted = !this._muted;
    this._audio.muted = this._muted;
    document.querySelector('.icon-volume').style.display = this._muted ? 'none' : '';
    document.querySelector('.icon-mute').style.display   = this._muted ? ''     : 'none';
    document.getElementById('volBtn').setAttribute('aria-label',
      this._muted ? 'Activer le son' : 'Couper le son');
  }

  // ─────────────────────────────────────────────────────────────────
  //  Progress Bar
  // ─────────────────────────────────────────────────────────────────
  _setProgress(ratio) {
    const pct = `${(ratio * 100).toFixed(2)}%`;
    document.getElementById('progressFill').style.width  = pct;
    document.getElementById('progressThumb').style.left  = pct;
    document.getElementById('progressBar').setAttribute('aria-valuenow', Math.round(ratio * 100));
  }

  _updateProgress() {
    const { currentTime, duration } = this._audio;
    if (!duration) return;

    const ratio = currentTime / duration;
    this._setProgress(ratio);
    document.getElementById('currentTime').textContent = this._fmt(currentTime);

    // Update buffered range
    if (this._audio.buffered.length) {
      const buffEnd   = this._audio.buffered.end(this._audio.buffered.length - 1);
      const buffRatio = Math.min(buffEnd / duration, 1);
      document.getElementById('progressBuffered').style.width = `${buffRatio * 100}%`;
    }
  }

  _seekFromPointer(clientX) {
    const bar  = document.getElementById('progressBar');
    const rect = bar.getBoundingClientRect();
    const x    = Math.max(0, Math.min(clientX - rect.left, rect.width));
    if (this._audio.duration) {
      this._audio.currentTime = (x / rect.width) * this._audio.duration;
    }
  }

  // ─────────────────────────────────────────────────────────────────
  //  Event Binding
  // ─────────────────────────────────────────────────────────────────
  _bindAudioEvents() {
    const audio = this._audio;

    audio.addEventListener('timeupdate', () => {
      this._updateProgress();
      this._syncLyrics(audio.currentTime);
    });

    audio.addEventListener('loadedmetadata', () => {
      document.getElementById('totalTime').textContent = this._fmt(audio.duration);
      this._distributeTiming(audio.duration);
      this._renderLyrics();   // re-render after timing is known
      this._activeLine = -1;
    });

    audio.addEventListener('ended', () => this._next());

    audio.addEventListener('play', () => {
      document.getElementById('vinyl').style.animationPlayState = 'running';
      document.querySelector('.icon-play').style.display  = 'none';
      document.querySelector('.icon-pause').style.display = 'block';
      document.getElementById('playBtn').setAttribute('aria-label', 'Pause');
      this._updatePlaylistHighlight();
      this._acquireWakeLock();
    });

    audio.addEventListener('pause', () => {
      document.getElementById('vinyl').style.animationPlayState = 'paused';
      document.querySelector('.icon-play').style.display  = 'block';
      document.querySelector('.icon-pause').style.display = 'none';
      document.getElementById('playBtn').setAttribute('aria-label', 'Play');
      this._updatePlaylistHighlight();
      this._releaseWakeLock();
    });

    audio.addEventListener('error', () => {
      console.warn('[CreaOnus] Erreur audio – fichier introuvable ou format non supporté.');
    });
  }

  async _acquireWakeLock() {
    if (!('wakeLock' in navigator)) return;
    try {
      this._wakeLock = await navigator.wakeLock.request('screen');
      this._wakeLock.addEventListener('release', () => { this._wakeLock = null; });
    } catch { /* permission refusée ou non supporté */ }
  }

  _releaseWakeLock() {
    if (this._wakeLock) { this._wakeLock.release(); this._wakeLock = null; }
  }

  _bindControlEvents() {
    document.getElementById('playBtn').addEventListener('click',       () => this._togglePlay());
    document.getElementById('prevBtn').addEventListener('click',       () => this._prev());
    document.getElementById('nextBtn').addEventListener('click',       () => this._next());
    document.getElementById('karaokeToggle').addEventListener('click', () => this._toggleSyncLyrics());
    document.getElementById('volBtn').addEventListener('click',        () => this._toggleMute());

    const volSlider = document.getElementById('volumeSlider');
    this._audio.volume = parseFloat(volSlider.value);
    volSlider.addEventListener('input', e => {
      this._audio.volume = parseFloat(e.target.value);
      if (this._muted) {
        this._muted = false;
        this._audio.muted = false;
        document.querySelector('.icon-volume').style.display = '';
        document.querySelector('.icon-mute').style.display   = 'none';
      }
    });
  }

  _bindProgressEvents() {
    const bar = document.getElementById('progressBar');

    // Mouse
    bar.addEventListener('mousedown', e => {
      this._dragging = true;
      bar.classList.add('dragging');
      this._seekFromPointer(e.clientX);
    });
    document.addEventListener('mousemove', e => {
      if (this._dragging) this._seekFromPointer(e.clientX);
    });
    document.addEventListener('mouseup', () => {
      if (this._dragging) { this._dragging = false; bar.classList.remove('dragging'); }
    });

    // Touch
    bar.addEventListener('touchstart', e => {
      this._dragging = true;
      bar.classList.add('dragging');
      this._seekFromPointer(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchmove', e => {
      if (this._dragging) this._seekFromPointer(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => {
      if (this._dragging) { this._dragging = false; bar.classList.remove('dragging'); }
    });
  }

  _bindKeyboard() {
    document.addEventListener('keydown', e => {
      // Ignore when focus is inside an input field
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          this._togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          this._audio.currentTime = Math.max(0, this._audio.currentTime - 5);
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (this._audio.duration) {
            this._audio.currentTime = Math.min(this._audio.duration, this._audio.currentTime + 5);
          }
          break;
        case 'KeyM':
          this._toggleMute();
          break;
        case 'KeyK':
          this._toggleSyncLyrics();
          break;
      }
    });
  }

  _bindPullToRefresh() {
    if (window.innerWidth > 640) return;

    const THRESHOLD = 72;   // px to trigger refresh
    const indicator = document.getElementById('ptrIndicator');
    const label     = indicator.querySelector('.ptr-label');
    const spinner   = indicator.querySelector('.ptr-spinner');
    let startY = 0, pulling = false, refreshing = false;

    const lyricsScroll = document.getElementById('lyricsScroll');

    document.addEventListener('touchstart', e => {
      if (refreshing) return;
      // Only pull when the lyrics container is scrolled to top
      if (lyricsScroll.scrollTop > 0) return;
      startY = e.touches[0].clientY;
      pulling = true;
    }, { passive: true });

    document.addEventListener('touchmove', e => {
      if (!pulling || refreshing) return;
      const dy = e.touches[0].clientY - startY;
      if (dy <= 0) { pulling = false; return; }

      indicator.classList.add('ptr-active');
      const progress = Math.min(dy / THRESHOLD, 1);
      const offset   = Math.min(dy * 0.4, THRESHOLD * 0.6);
      indicator.style.transform = `translateY(${offset - indicator.offsetHeight}px)`;
      spinner.style.strokeDashoffset = 31.4 * (1 - progress);
      spinner.style.transform = `rotate(${progress * 180}deg)`;

      if (dy >= THRESHOLD) {
        indicator.classList.add('ptr-ready');
        label.textContent = 'Relâcher pour actualiser';
      } else {
        indicator.classList.remove('ptr-ready');
        label.textContent = 'Tirer pour actualiser';
      }
    }, { passive: true });

    const finish = async () => {
      if (!pulling) return;
      pulling = false;
      const dy = parseFloat(indicator.style.transform.replace(/[^\d.-]/g, '')) + indicator.offsetHeight;
      if (dy >= THRESHOLD * 0.4) {
        refreshing = true;
        indicator.classList.add('ptr-refreshing');
        indicator.classList.remove('ptr-ready');
        label.textContent = 'Actualisation…';
        indicator.style.transform = `translateY(0px)`;
        await new Promise(r => setTimeout(r, 600));
        location.reload();
      } else {
        indicator.classList.remove('ptr-active', 'ptr-ready');
        indicator.style.transform = `translateY(-100%)`;
      }
    };

    document.addEventListener('touchend',    finish, { passive: true });
    document.addEventListener('touchcancel', finish, { passive: true });
  }

  _bindMobileSidebar() {
    const sidebar  = document.getElementById('sidebar');
    const overlay  = document.getElementById('sidebarOverlay');
    const openBtn  = document.getElementById('mobilePlaylistBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');

    const open  = () => { sidebar.classList.add('open');  overlay.classList.add('visible'); };
    const close = () => { sidebar.classList.remove('open'); overlay.classList.remove('visible'); };

    openBtn?.addEventListener('click', open);
    closeBtn?.addEventListener('click', close);
    overlay.addEventListener('click', close);

    // Close sidebar when a song/variant is chosen on mobile
    document.getElementById('playlist').addEventListener('click', () => {
      if (window.innerWidth <= 640) close();
    });
  }

  // ─────────────────────────────────────────────────────────────────
  //  Utilities
  // ─────────────────────────────────────────────────────────────────
  _fmt(sec) {
    if (!isFinite(sec) || sec < 0) return '0:00';
    return `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
  }

  /** Escape HTML to prevent XSS when inserting dynamic data via innerHTML */
  _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}

window.addEventListener('DOMContentLoaded', () => new CreaOnus());
