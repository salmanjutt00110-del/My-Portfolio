// AudioManager.ts

// Create isolated audio instances for reliable playback
const createAudio = (url: string, volume = 1, loop = false) => {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.loop = loop;
  return audio;
};

// URL Assets from reliable public repositories
const SOUNDS = {
  scroll: createAudio('/sounds/mouse_scroll.mp3', 0.5),
  typing: createAudio('/sounds/keyboard.wav', 0.5),
  techMusic: createAudio('/sounds/ball.mp3', 0.5, true),
  contact: createAudio('https://raw.githubusercontent.com/wesbos/JavaScript30/master/01%20-%20JavaScript%20Drum%20Kit/sounds/tink.wav', 0.5),
  aboutMusic: createAudio('https://raw.githubusercontent.com/photonstorm/phaser3-examples/master/public/assets/audio/oedipus_ark_pandora.mp3', 0.15, true),
  workMusic: createAudio('/sounds/work.mp3', 0.3, true)
};

export class AudioManager {
  private isMuted: boolean = true;
  private lastScrollTime: number = 0;
  private typingInterval: any = null;

  constructor() {
    const init = () => {
      this.isMuted = false;
      this.startTypingLoop();
      window.removeEventListener('click', init);
      window.removeEventListener('keydown', init);
    };
    
    // Require user interaction before playing audio
    window.addEventListener('click', init);
    window.addEventListener('keydown', init);

    // Global scroll listener for scroll sound
    window.addEventListener('scroll', () => {
      this.playScrollSound();
    });
  }

  // Ensure only one background track is playing based on section
  updateSectionMusic(section: 'about' | 'work' | 'tech' | 'none') {
    if (this.isMuted) return;

    SOUNDS.aboutMusic.pause();
    SOUNDS.workMusic.pause();
    SOUNDS.techMusic.pause();

    if (section === 'about') {
      SOUNDS.aboutMusic.play().catch(() => {});
    } else if (section === 'work') {
      SOUNDS.workMusic.play().catch(() => {});
    } else if (section === 'tech') {
      SOUNDS.techMusic.play().catch(() => {});
    }
  }

  playScrollSound() {
    if (this.isMuted) return;
    const now = Date.now();
    // Debounce scroll sound
    if (now - this.lastScrollTime < 150) return;
    this.lastScrollTime = now;
    
    // Clone node for overlapping sounds
    const sound = SOUNDS.scroll.cloneNode() as HTMLAudioElement;
    sound.volume = 0.1;
    sound.play().catch(() => {});
  }

  playProjectScrollSound() {
    if (this.isMuted) return;
    const now = Date.now();
    if (now - this.lastScrollTime < 100) return;
    this.lastScrollTime = now;

    const sound = SOUNDS.scroll.cloneNode() as HTMLAudioElement;
    sound.volume = 0.2; // Slightly louder for project scrub
    sound.playbackRate = 1.5; // Faster pitch for variety
    sound.play().catch(() => {});
  }

  playContactSound() {
    if (this.isMuted) return;
    SOUNDS.contact.currentTime = 0;
    SOUNDS.contact.play().catch(() => {});
  }

  private playTypingBurst() {
    if (this.isMuted) return;
    
    // Play 2-4 rapid keystrokes to simulate a burst of typing
    const strokes = 2 + Math.floor(Math.random() * 3);
    for (let i = 0; i < strokes; i++) {
      setTimeout(() => {
        const sound = SOUNDS.typing.cloneNode() as HTMLAudioElement;
        sound.volume = 0.1 + Math.random() * 0.1;
        sound.play().catch(() => {});
      }, i * 80); 
    }
  }

  private startTypingLoop() {
    if (this.typingInterval) clearInterval(this.typingInterval);
    const loop = () => {
      // Only type if we are at the very top of the page (PC is visible)
      if (window.scrollY < 200) {
        this.playTypingBurst();
      }
      this.typingInterval = setTimeout(loop, 400 + Math.random() * 800);
    };
    loop();
  }
}

export const audioManager = new AudioManager();
