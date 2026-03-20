import { Player } from "@/entities/Player";
import type { ImageManager } from "@/managers/ImageManager";
import { GRID_SIZE } from "@/utils/constants";

export class RenderSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageManager: ImageManager;
  constructor(canvas: HTMLCanvasElement, imageManager: ImageManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
    this.imageManager = imageManager;
  }

  render(player: Player) {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderGrid();
    this.renderPlayer(player);
  }
  renderPlayer(player: Player) {
    const playerImage = this.imageManager.get("player");
    if (playerImage) {
      this.ctx.drawImage(
        playerImage,
        player.x,
        player.y,
        player.width,
        player.height,
      );
    } else {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }
  renderGrid() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let i = 0; i < this.canvas.width; i += GRID_SIZE) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, this.canvas.height);
    }
    for (let i = 0; i < this.canvas.height; i += GRID_SIZE) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(this.canvas.width, i);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
