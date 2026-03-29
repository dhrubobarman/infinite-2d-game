import { Player } from "@/entities/Player";
import { AudioManager } from "@/managers/AudioManager";
import { ImageManager } from "@/managers/ImageManager";
import { UIManager } from "@/managers/UIManager";
import { RenderSystem } from "@/systems/RenderSystems";
import { GAME_HEIGHT, GAME_WIDTH } from "@/utils/constants";

export class Game {
  canvas: HTMLCanvasElement;
  ratio = GAME_WIDTH / GAME_HEIGHT;
  renderSystem: RenderSystem;
  player: Player;
  keys: Record<string, boolean>;
  lastTime: number = 0;
  imageManager: ImageManager;
  uiManager: UIManager;
  state: "playing" | "menu" | "paused" | (string & {});
  private rafId: number | null = null;
  audioManager: AudioManager;
  time: number;

  constructor() {
    this.canvas = document.getElementById("gameCanvas")! as HTMLCanvasElement;
    this.state = "menu";
    this.time = 0;

    this.imageManager = new ImageManager();
    this.audioManager = new AudioManager();

    this.renderSystem = new RenderSystem(this.canvas, this.imageManager);
    this.player = new Player();

    this.uiManager = new UIManager(this);

    this.keys = {};

    this.init();
  }
  private async init() {
    await Promise.all([
      this.imageManager.loadAll(),
      this.audioManager.loadAll(),
    ]);

    this.uiManager.showPanel("mainMenu");
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
    if (this.state === "playing") {
      this.time += dt;
      this.uiManager.updateTimer(this.time);
    }
    this.update(dt);
    this.renderSystem.render(this.state, this.player);
    this.rafId = requestAnimationFrame((t) => this.gameloop(t));
  }

  private update(dt: number) {
    if (this.state !== "playing") return;
    this.player.update(dt, this.keys);
  }

  resetGame() {
    this.player.reset();
    this.lastTime = performance.now();
    this.time = 0;
  }
  startGame() {
    this.audioManager.play("button_click");
    this.state = "playing";
    this.uiManager.hideAllPanels();
    this.resetGame();
    this.uiManager.showTimer();
  }
  pause() {
    this.audioManager.play("pause");
    this.state = "paused";
    this.uiManager.showPanel("pauseMenu");
  }
  resume() {
    this.audioManager.play("unpause");
    this.state = "playing";
    this.uiManager.hideAllPanels();
  }
  returnToMenu() {
    this.audioManager.play("button_click");
    this.state = "menu";
    this.uiManager.hideAllPanels();
    this.uiManager.hideTimer();
    this.uiManager.showPanel("mainMenu");
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
