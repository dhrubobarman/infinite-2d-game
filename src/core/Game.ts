import { Player } from "@/entities/Player";
import { ImageManager } from "@/managers/ImageManager";
import { UIManager } from "@/managers/UiManager";
import { RenderSystem } from "@/systems/RenderSystems";
import { GAME_HEIGHT, GAME_WIDTH } from "@/utils/constants";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio = GAME_WIDTH / GAME_HEIGHT;
  renderSystem: RenderSystem;
  player: Player;
  keys: Record<string, boolean>;
  lastTime: number = 0;
  imageManager: ImageManager;
  uiManager: UIManager;
  state: "playing" | "menu" | "paused" | (string & {});
  private rafId: number | null = null;

  constructor() {
    this.canvas = document.getElementById("gameCanvas")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.state = "menu";

    this.imageManager = new ImageManager();
    this.imageManager.loadAll();

    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.player = new Player();

    this.uiManager = new UIManager(this);

    this.keys = {};
  }
  private init() {
    this.setupCanvas();
    this.setupInput();

    // start the game loop
    this.lastTime = performance.now();
    this.rafId = requestAnimationFrame((t) => this.gameloop(t));
  }
  private gameloop(timeStamp: number) {
    if (this.lastTime === 0) {
      this.lastTime = timeStamp;
    }
    const dt = Math.min((timeStamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timeStamp;
    this.update(dt);
    this.render();
    this.rafId = requestAnimationFrame((t) => this.gameloop(t));
  }

  private update(dt: number) {
    if (this.state !== "playing") return;
    this.player.update(dt, this.keys);
  }

  private render() {
    if (this.state === "menu") {
      this.ctx.fillStyle = "#0f3460";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    } else {
      this.renderSystem.render(this.player);
    }
  }

  resetGame() {
    this.player.reset();
    this.lastTime = performance.now();
  }
  startGame() {
    this.state = "playing";
    this.uiManager.hideAllPanels();
    this.resetGame();
  }
  pause() {
    this.state = "paused";
    this.uiManager.showPausePanel();
  }
  resume() {
    this.state = "playing";
    this.uiManager.hidePausePanel();
  }

  returnToMenu() {
    this.state = "menu";
    this.uiManager.hideAllPanels();
    this.uiManager.showMainMenu();
  }
  private setupInput() {
    window.addEventListener("keydown", this.handleKeyDown);
    window.addEventListener("keyup", this.handleKeyUp);
    window.addEventListener("contextmenu", this.handleContextMenu);
    window.addEventListener("blur", this.handleBlur);
  }
  private handleKeyDown = (e: KeyboardEvent) => {
    const key = e.key.toLowerCase();
    this.keys[key] = true;
    if (key === "escape") {
      if (this.state === "playing") {
        this.pause();
      } else if (this.state === "paused") {
        this.resume();
      }
    }
  };
  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.key.toLowerCase()] = false;
  };
  private handleContextMenu = () => {
    this.keys = {};
  };
  private handleBlur = () => {
    this.keys = {};
  };

  private handleResize = () => {
    this.resizeCanvas();
  };

  // canvas setup
  private setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", this.handleResize);
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
  }

  private resizeCanvas() {
    let w: number, h: number;
    const margin = 5;

    const availableWidth = window.innerWidth - margin * 2;
    const availableHeight = window.innerHeight - margin * 2;

    if (availableWidth / availableHeight > this.ratio) {
      h = availableHeight;
      w = h * this.ratio;
    } else {
      w = availableWidth;
      h = w / this.ratio;
    }

    this.rafId = requestAnimationFrame(() => {
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.canvas.style.margin = `${margin}px`;
    });
  }
  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    // remove event listeners
    window.removeEventListener("keydown", this.handleKeyDown);
    window.removeEventListener("keyup", this.handleKeyUp);
    window.removeEventListener("contextmenu", this.handleContextMenu);
    window.removeEventListener("blur", this.handleBlur);
    window.removeEventListener("resize", this.handleResize);

    // clear input state
    this.keys = {};

    // optional: clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // optional: cleanup UI
    if (this.uiManager && "destroy" in this.uiManager) {
      (this.uiManager as any).destroy?.();
      this.uiManager = null as unknown as any;
    }

    // optional: cleanup managers
    if (this.imageManager && "destroy" in this.imageManager) {
      (this.imageManager as any).destroy?.();
    }

    // break references (helps GC)
    // @ts-ignore
    this.player = null;
    // @ts-ignore
    this.renderSystem = null;
  }
}
