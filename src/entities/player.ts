import { playerData } from '@/data/playerData';
import { GAME_HEIGHT, GAME_WIDTH, PUSHBACK_DECAY } from '@/core/constants';
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
  invincibilityDuration: number;
  invincible: boolean;
  invincibilityTimer: number;
  collisionDamage: number;
  pushVx: number;
  pushVy: number;
  pushbackForce: number;

  constructor() {
    this.width = playerData.width;
    this.height = playerData.height;
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.collisionRadius = playerData.collisionRadius;
    this.collisionDamage = playerData.collisionDamage;
    this.maxHealth = playerData.maxHealth;
    this.health = this.maxHealth;
    this.invincibilityDuration = playerData.invincibilityDuration;
    this.pushbackForce = playerData.pushbackForce;
    this.invincible = false;
    this.invincibilityTimer = 0;

    this.speed = playerData.speed;

    // Multipliers (for player)
    this.speedMultiplier = 1;
    this.pushVx = 0;
    this.pushVy = 0;
  }

  reset() {
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.speed = playerData.speed;
    this.speedMultiplier = 1;
    this.health = this.maxHealth;
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.pushVx = 0;
    this.pushVy = 0;
  }
  update(dt: number, keys: Record<string, boolean>) {
    if (this.invincible) {
      this.invincibilityTimer -= dt;
      if (this.invincibilityTimer <= 0) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }

    if (this.pushVx !== 0 || this.pushVy !== 0) {
      this.x += this.pushVx * dt;
      this.y += this.pushVy * dt;

      const speed = Math.sqrt(this.pushVx * this.pushVx + this.pushVy * this.pushVy);
      const decay = PUSHBACK_DECAY * dt;
      if (this.speed <= decay) {
        this.pushVx = 0;
        this.pushVy = 0;
      } else {
        const ratio = (speed - decay) / speed;
        this.pushVx *= ratio;
        this.pushVy *= ratio;
      }
    }

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
  applyPushback(dirX: number, dirY: number, force: number) {
    this.pushVx = dirX * force;
    this.pushVy = dirY * force;
  }
  takeDamage(amount: number): boolean {
    if (this.invincible) return false;

    this.health = Math.max(0, this.health - amount);
    this.invincible = true;
    this.invincibilityTimer = this.invincibilityDuration;

    return true;
  }
  isdDead() {
    return this.health <= 0;
  }
}
