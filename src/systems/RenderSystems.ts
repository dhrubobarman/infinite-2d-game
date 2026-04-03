import type { Game } from '@/core/Game';
import { Player } from '@/entities/Player';
import type { ImageManager } from '@/managers/ImageManager';
import { GAME_HEIGHT, GAME_STATES, GAME_WIDTH, GRID_SIZE } from '@/core/constants';

export class RenderSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageManager: ImageManager;
  constructor(canvas: HTMLCanvasElement, imageManager: ImageManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.imageManager = imageManager;
  }

  render(state: Game['state'], player: Player) {
    if (state === GAME_STATES.MENU) {
      this.renderMenuBackground();
    } else {
      this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      this.renderGrid();
      this.renderPlayer(player);
    }
  }
  renderPlayer(player: Player) {
    const playerImage = this.imageManager.get('player');
    if (playerImage) {
      this.ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
  }
  renderGrid() {
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let i = 0; i < GAME_WIDTH; i += GRID_SIZE) {
      this.ctx.moveTo(i, 0);
      this.ctx.lineTo(i, GAME_HEIGHT);
    }
    for (let i = 0; i < GAME_HEIGHT; i += GRID_SIZE) {
      this.ctx.moveTo(0, i);
      this.ctx.lineTo(GAME_WIDTH, i);
    }
    this.ctx.stroke();
    this.ctx.closePath();
  }
  renderMenuBackground() {
    this.ctx.fillStyle = '#0f3460';
    this.ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  }
}
