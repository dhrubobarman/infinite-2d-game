import { GRID_SIZE } from "@/utils/constants";

export class RenderSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.renderGrid();
  }
  renderGrid() {
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.5)";
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
