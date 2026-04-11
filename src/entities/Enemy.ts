import { ENEMY_DESPAWN_MARGIN, GAME_HEIGHT, GAME_WIDTH } from '@/core/constants';
import type { EnemyData } from '@/data/types';
import type { Player } from '@/entities/Player';
const EPS = 1e-6;

export class Enemy {
  private readonly data: EnemyData;
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  angle: number;
  rotationSpeed: number;
  active: boolean;
  constructor(data: EnemyData) {
    this.data = data;

    // Position dimention
    this.x = 0;
    this.y = 0;
    this.width = data.width;
    this.height = data.height;
    this.angle = 0;

    // Stats
    this.health = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.collisionRadius = data.collisionRadius;
    this.rotationSpeed = data.rotationSpeed ?? 0;
    this.active = false;
  }

  spawn(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = this.data.health;
    this.active = true;
  }

  reset() {
    this.active = false;
    this.health = this.data.health;
  }

  update(dt: number, player: Player) {
    if (!this.active) return;

    // Despawn if too far offscreen
    if (
      this.x < -ENEMY_DESPAWN_MARGIN ||
      this.x > GAME_WIDTH + ENEMY_DESPAWN_MARGIN ||
      this.y < -ENEMY_DESPAWN_MARGIN ||
      this.y > GAME_HEIGHT + ENEMY_DESPAWN_MARGIN
    ) {
      this.active = false;
      return;
    }

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const len = Math.hypot(dx, dy);
    if (len > EPS) {
      const normalizeDx = dx / len;
      const normalizeDy = dy / len;
      this.x += normalizeDx * this.speed * dt;
      this.y += normalizeDy * this.speed * dt;

      // angle
      const targetAngle = Math.atan2(dy, dx);
      let diff = targetAngle - this.angle;
      diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      const maxStep = this.rotationSpeed * dt;
      if (Math.abs(diff) < maxStep) {
        this.angle = targetAngle;
      } else {
        this.angle += Math.sign(diff) * maxStep;
      }
    }
  }
}
