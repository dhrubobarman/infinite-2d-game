import { Behaviours } from '@/entities/behaviours/Behaviours';
import type { Enemies } from '@/entities/Enemies';
import type { Player } from '@/entities/Player';

export class DriftBehaviour extends Behaviours {
  angle: number;
  rotationSpeed: number;
  changeTimer: number;
  changeInterval: number;
  constructor() {
    super();
    this.angle = Math.random() * Math.PI * 2;
    this.rotationSpeed = 5;
    this.changeTimer = 0;
    this.changeInterval = 2;
  }
  override update(enemy: Enemies, dt: number, player: Player) {
    void player;
    this.changeTimer += dt;
    if (this.changeTimer >= this.changeInterval) {
      this.changeTimer = 0;
      this.angle = Math.random() * Math.PI * 2;
    }
    const dx = Math.cos(this.angle);
    const dy = Math.sin(this.angle);

    enemy.x += dx * enemy.speed * dt;
    enemy.y += dy * enemy.speed * dt;
  }

  override reset() {
    this.angle = Math.random() * Math.PI * 2;
    this.changeTimer = 0;
  }
}
