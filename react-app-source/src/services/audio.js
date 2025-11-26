/**
 * Audio Service for managing background music playback
 */

class AudioService {
  constructor() {
    this.audio = null;
    this.listeners = new Set();
    this.keepAliveInterval = null;
    this.initialized = false;
  }

  initialize() {
    if (this.initialized) return;

    this.audio = new Audio('/assets/audio/instrumental_background.mp3');
    this.audio.loop = true;
    this.audio.preload = 'auto';

    this.restoreState();
    this.setupEventListeners();

    // Keep-alive mechanism (check every 2 seconds)
    this.keepAliveInterval = setInterval(() => this.keepAlive(), 2000);

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

    this.initialized = true;
  }

  restoreState() {
    const anthemPlaying = sessionStorage.getItem('anthemPlaying') === 'true';
    const anthemPosition = parseFloat(sessionStorage.getItem('anthemPosition') || '0');
    const musicMuted = sessionStorage.getItem('musicMuted') === 'true';

    if (anthemPosition > 0) {
      this.audio.currentTime = anthemPosition;
    }

    this.audio.muted = musicMuted;

    if (anthemPlaying) {
      this.audio.play().then(() => {
        this.notifyListeners();
      }).catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  setupEventListeners() {
    this.audio.addEventListener('play', () => {
      sessionStorage.setItem('anthemPlaying', 'true');
      this.notifyListeners();
    });

    this.audio.addEventListener('pause', () => {
      sessionStorage.setItem('anthemPlaying', 'false');
      this.notifyListeners();
    });

    this.audio.addEventListener('timeupdate', () => {
      sessionStorage.setItem('anthemPosition', this.audio.currentTime.toString());
    });

    this.audio.addEventListener('ended', () => {
      sessionStorage.setItem('anthemPlaying', 'false');
      this.notifyListeners();
    });

    this.audio.addEventListener('error', (e) => {
      console.error('Audio playback error:', e);
      sessionStorage.setItem('anthemPlaying', 'false');
      this.notifyListeners();
    });
  }

  keepAlive() {
    const shouldBePlaying = sessionStorage.getItem('anthemPlaying') === 'true';
    const isPaused = this.audio?.paused;

    if (shouldBePlaying && isPaused) {
      this.audio.play().catch(err => {
        console.log('Audio autoplay prevented:', err);
      });
    }
  }

  handleVisibilityChange() {
    if (document.hidden) {
      sessionStorage.setItem('anthemPosition', this.audio.currentTime.toString());
      sessionStorage.setItem('anthemPlaying', (!this.audio.paused).toString());
    } else {
      const shouldBePlaying = sessionStorage.getItem('anthemPlaying') === 'true';
      if (shouldBePlaying && this.audio.paused) {
        this.audio.play().catch(err => {
          console.log('Audio resume prevented:', err);
        });
      }
    }
  }

  play() {
    if (!this.initialized) this.initialize();
    return this.audio.play().then(() => {
      sessionStorage.setItem('anthemPlaying', 'true');
      this.notifyListeners();
    }).catch(err => {
      console.error('Failed to play audio:', err);
      throw err;
    });
  }

  pause() {
    if (!this.audio) return;
    this.audio.pause();
    sessionStorage.setItem('anthemPlaying', 'false');
    this.notifyListeners();
  }

  toggle() {
    if (!this.initialized) this.initialize();
    if (this.audio.paused) {
      return this.play();
    } else {
      this.pause();
    }
  }

  setMuted(muted) {
    if (!this.audio) return;
    this.audio.muted = muted;
    sessionStorage.setItem('musicMuted', muted.toString());
    this.notifyListeners();
  }

  toggleMute() {
    this.setMuted(!this.audio?.muted);
  }

  isPlaying() {
    return this.audio ? !this.audio.paused : false;
  }

  isMuted() {
    return this.audio?.muted || false;
  }

  getCurrentTime() {
    return this.audio?.currentTime || 0;
  }

  setCurrentTime(time) {
    if (this.audio) {
      this.audio.currentTime = time;
      sessionStorage.setItem('anthemPosition', time.toString());
    }
  }

  getDuration() {
    return this.audio?.duration || 0;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notifyListeners() {
    const state = {
      isPlaying: this.isPlaying(),
      isMuted: this.isMuted()
    };
    this.listeners.forEach(listener => listener(state));
  }

  destroy() {
    if (this.keepAliveInterval) {
      clearInterval(this.keepAliveInterval);
    }
    if (this.audio) {
      this.audio.pause();
      this.audio.src = '';
    }
  }
}

// Singleton instance
const audioService = new AudioService();
export default audioService;
