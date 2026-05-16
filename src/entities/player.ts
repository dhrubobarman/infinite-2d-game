import { playerData } from '@/data/playerData';
import { GAME_HEIGHT, GAME_WIDTH } from '@/core/constants';
import { clamp } from '@/utils/helpers';

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  speedMultiplier: number;
  collisionRadius: number;
  health: number;
  maxHealth: number;

  constructor() {
    this.width = playerData.width;
    this.height = playerData.height;
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.collisionRadius = playerData.collisionRadius;
    this.maxHealth = playerData.maxHealth;
    this.health = this.maxHealth;

    this.speed = playerData.speed;

    // Multipliers (for player)
    this.speedMultiplier = 1;
  }

  reset() {
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.speed = playerData.speed;
    this.speedMultiplier = 1;
    this.health = this.maxHealth;
  }
  update(dt: number, keys: Record<string, boolean>) {
    let dx = 0,
      dy = 0;

    if (keys['w'] || keys['arrowup']) dy -= 1;
    if (keys['s'] || keys['arrowdown']) dy += 1;
    if (keys['a'] || keys['arrowleft']) dx -= 1;
    if (keys['d'] || keys['arrowright']) dx += 1;

    //Normalize diagonal movement
    if (dx || dy) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      this.x += dx * this.speed * this.speedMultiplier * dt;
      this.y += dy * this.speed * this.speedMultiplier * dt;
    }

    // Keep player in bounds
    this.x = clamp(this.x, 0, GAME_WIDTH - this.width);
    this.y = clamp(this.y, 0, GAME_HEIGHT - this.height);
  }
  takeDamage(amount: number) {
    this.health = Math.max(0, this.health - amount);
    return true;
  }
}
