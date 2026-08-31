import type { Game } from '@/core/Game';
import { Player } from '@/entities/Player';
import type { ImageManager } from '@/managers/ImageManager';
import { GAME_HEIGHT, GAME_STATES, GAME_WIDTH, GRID_SIZE } from '@/core/constants';
import type { Enemy } from '@/entities/Enemy';

const FLASH_MIN_ALPHA = 0.1;
const FLASH_ALPHA_RANGE = 0.8;
const FLASH_SPEED = 10;

const HEALTH_BAR_HEIGHT = 4;
const HEALTH_BAR_OFFSET = 6;
const HEALTH_BAR_BG = 'rgb(0, 0, 0, 0.6)';
const HEALTH_BAR_FILL = '#ff5f6d';

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
    if (player.invincible) {
      this.ctx.globalAlpha =
        FLASH_MIN_ALPHA +
        FLASH_ALPHA_RANGE * Math.abs(Math.sin(player.invincibilityTimer * FLASH_SPEED));
    }
    if (playerImage) {
      this.ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
    } else {
      this.ctx.fillStyle = 'red';
      this.ctx.fillRect(player.x, player.y, player.width, player.height);
    }
    this.ctx.globalAlpha = 1;
  }
  renderEnemies(enemies: Enemy[]) {
    for (let i = 0; i < enemies.length; i++) {
      const enemy = enemies[i];
      if (!enemy.active) continue;
      const enemyImage = this.imageManager.get(enemy.data.image as any);

      if (enemy.invincible) {
        this.ctx.globalAlpha =
          FLASH_MIN_ALPHA +
          FLASH_ALPHA_RANGE * Math.abs(Math.sin(enemy.invincibilityTimer * FLASH_SPEED));
      }

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
      this.ctx.globalAlpha = 1;

      if (enemy.health < enemy.data.health) {
        this.renderEnemyHealthbar(enemy);
      }
    }
  }

  renderEnemyHealthbar(enemy: Enemy) {
    const percent = enemy.health / enemy.data.health;
    const x = enemy.x;
    const y = enemy.y - HEALTH_BAR_OFFSET - HEALTH_BAR_HEIGHT;
    const w = enemy.width;

    this.ctx.fillStyle = HEALTH_BAR_BG;
    this.ctx.fillRect(x, y, w, HEALTH_BAR_HEIGHT);
    this.ctx.fillStyle = HEALTH_BAR_FILL;
    this.ctx.fillRect(x, y, Math.ceil(w * percent), HEALTH_BAR_HEIGHT);
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
