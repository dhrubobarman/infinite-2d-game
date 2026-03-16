const availableImages = [
  { name: "player", path: "./images/player.png" },
] as const;

type AvailableImageNames = (typeof availableImages)[number]["name"];

export class ImageManager {
  images: Record<string, { img: HTMLImageElement; loaded: boolean }>;
  constructor() {
    this.images = {};
  }

  load(name: string, path: string) {
    const img = new Image();
    img.src = path;
    img.crossOrigin = "anonymous";
    this.images[name] = { img, loaded: false };
    img.onload = () => {
      this.images[name].loaded = true;
      console.log(
        `Loaded ${name}, path: ${path}, width: ${img.width}, height: ${img.height}`,
        img,
      );
    };
    img.onerror = () => {
      this.images[name].loaded = false;
      console.error(
        `Failed to load ${name}, path: ${path} (will use fallback)`,
      );
    };
  }
  get(name: AvailableImageNames) {
    return this.images[name]?.loaded ? this.images[name].img : null;
  }
  isLoaded(name: AvailableImageNames) {
    return this.images[name] ? this.images[name].loaded : false;
  }
  loadAll() {
    for (const { name, path } of availableImages) {
      this.load(name, path);
    }
  }
}
