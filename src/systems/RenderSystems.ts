import type { Game } from '@/core/Game';
import { Player } from '@/entities/Player';
import type { ImageManager } from '@/managers/ImageManager';
import { GAME_HEIGHT, GAME_STATES, GAME_WIDTH, GRID_SIZE } from '@/core/constants';
import type { Enemy } from '@/entities/Enemy';

export class RenderSystem {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  imageManager: ImageManager;
  constructor(canvas: HTMLCanvasElement, imageManager: ImageManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    this.imageManager = imageManager;
  }

  render(state: Game['state'], player: Player, enemies: Enemy[] = []) {
    if (state === GAME_STATES.MENU) {
      this.renderMenuBackground();
    } else {
      this.ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
      this.renderGrid();
      this.renderEnemies(enemies);
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
  renderEnemies(enemies: Enemy[]) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      const enemyImage = this.imageManager.get(enemy.data.image);

      if (enemyImage) {
        this.ctx.save();
        if (enemy.facingLeft) {
          this.ctx.translate(enemy.x + enemy.width, enemy.y);
          this.ctx.scale(-1, 1);
          this.ctx.drawImage(enemyImage, 0, 0, enemy.width, enemy.height);
        } else {
          this.ctx.drawImage(enemyImage, enemy.x, enemy.y, enemy.width, enemy.height);
        }
        this.ctx.restore();
      } else {
        this.ctx.fillStyle = enemy.data.color;
        this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
      }
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
