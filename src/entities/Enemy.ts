import type { EnemyData } from '@/data/types';
import type { Player } from '@/entities/Player';
const EPS = 1e-6;

export class Enemy {
  readonly data: EnemyData;
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
  }

  spawn(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = this.data.health;
  }

  update(dt: number, player: Player) {
    const dx = player.x - this.x;
    const dy = player.y - this.y;

    const len = Math.hypot(dx, dy);
    if (len > EPS) {
      const normalizeDx = dx / len;
      const normalizeDy = dy / len;
      this.x += normalizeDx * this.speed * dt;
      this.y += normalizeDy * this.speed * dt;

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
