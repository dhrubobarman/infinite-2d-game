import { Player } from "@/entities/player";
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

  constructor() {
    this.canvas = document.getElementById("gameCanvas")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.renderSystem = new RenderSystem(this.canvas);
    this.player = new Player();
    this.keys = {};
  }
  init() {
    this.setupCanvas();
    this.setupInput();

    // start the game loop
    this.lastTime = performance.now();
    requestAnimationFrame((t) => this.gameloop(t));
  }
  setupInput() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key.toLowerCase()] = true;
    });
    window.addEventListener("keyup", (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });
  }

  gameloop(timeStamp: number) {
    const dt = Math.min((timeStamp - this.lastTime) / 1000, 0.1);
    this.lastTime = timeStamp;
    this.update(dt);
    this.renderSystem.render(this.player);
    requestAnimationFrame((t) => this.gameloop(t));
  }

  update(dt: number) {
    this.player.update(dt, this.keys);
  }

  // canvas setup
  setupCanvas() {
    this.resizeCanvas();
    window.addEventListener("resize", this.resizeCanvas.bind(this));
    this.canvas.width = GAME_WIDTH;
    this.canvas.height = GAME_HEIGHT;
  }
  resizeCanvas() {
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

    requestAnimationFrame(() => {
      this.canvas.style.width = `${w}px`;
      this.canvas.style.height = `${h}px`;
      this.canvas.style.margin = `${margin}px`;
    });
  }
}
