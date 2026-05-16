import { availableSounds, type AvailableSoundNames } from '@/data/audioData';

export class AudioManager {
  sounds: Record<string, { audio: HTMLAudioElement; loaded: boolean }>;
  constructor() {
    this.sounds = {};
  }
  load(name: string, path: string): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const audio = new Audio();
      this.sounds[name] = { audio, loaded: false };
      audio.onloadeddata = () => {
        this.sounds[name].loaded = true;
        console.log(`[DEV] Audio loaded ${name}`);
        resolve(true);
      };
      audio.onerror = () => {
        this.sounds[name].loaded = false;
        console.error(`Failed to load ${name}, path: ${path} (will use fallback)`);
        resolve(false);
      };
      audio.src = path;
      audio.crossOrigin = 'anonymous';
    });
  }
  play(name: AvailableSoundNames) {
    const sound = this.sounds[name]?.loaded ? this.sounds[name] : null;
    if (sound) {
      sound.audio.currentTime = 0;
      sound.audio.play().catch((err) => {
        console.log(`Could not play ${name}:`, err);
      });
    }
  }
  async loadAll() {
    const promises: Promise<boolean>[] = [];
    for (const { name, path } of availableSounds) {
      promises.push(this.load(name, path));
    }
    await Promise.all(promises);
  }
}
