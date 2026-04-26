const availableImages = [
  { name: 'player', path: './images/player.png' },
  { name: 'enemy_drifter', path: './images/enemy/enemy_drifter.png' },
  { name: 'enemy_seeker', path: './images/enemy/enemy_seeker.png' },
] as const;

export type AvailableImageNames = (typeof availableImages)[number]['name'];

export class ImageManager {
  images: Record<string, { img: HTMLImageElement; loaded: boolean }>;
  constructor() {
    this.images = {};
  }

  load(name: string, path: string): Promise<Boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = path;
      img.crossOrigin = 'anonymous';
      this.images[name] = { img, loaded: false };
      img.onload = () => {
        this.images[name].loaded = true;
        console.log(`[DEV] Image loaded ${name}`);
        resolve(true);
      };
      img.onerror = () => {
        this.images[name].loaded = false;
        console.error(`Failed to load ${name}, path: ${path} (will use fallback)`);
        resolve(false);
      };
    });
  }
  get(name: AvailableImageNames) {
    return this.images[name]?.loaded ? this.images[name].img : null;
  }
  isLoaded(name: AvailableImageNames) {
    return this.images[name] ? this.images[name].loaded : false;
  }
  async loadAll() {
    const promises: Promise<Boolean>[] = [];
    for (const { name, path } of availableImages) {
      promises.push(this.load(name, path));
    }
    await Promise.all(promises);
    // TODO: remove before shipping
    const DEBUG_DELAY = 1000;
    await new Promise((resolve) => setTimeout(resolve, DEBUG_DELAY));
  }

  destroy() {
    for (const name in this.images) {
      const img = this.images[name].img;
      img.onload = null;
      img.onerror = null;
      img.src = '';
    }
    this.images = {};
  }
}
