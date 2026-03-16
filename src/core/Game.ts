import { Player } from "@/entities/player";
import { RenderSystem } from "@/systems/RenderSystems";
import { GAME_HEIGHT, GAME_WIDTH } from "@/utils/constants";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  ratio = GAME_WIDTH / GAME_HEIGHT;
  renderSystem: RenderSystem;
  player: Player;

  constructor() {
    this.canvas = document.getElementById("gameCanvas")! as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.init();
    this.renderSystem = new RenderSystem(this.canvas);
    this.player = new Player();
  }
  init() {
    this.setupCanvas();
    requestAnimationFrame((t) => this.gameloop(t));
  }
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
  gameloop(_timeStamp: number) {
    this.renderSystem.render(this.player);
    requestAnimationFrame((t) => this.gameloop(t));
  }
}
