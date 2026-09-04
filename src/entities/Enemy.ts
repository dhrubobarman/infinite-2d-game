import { ENEMY_DESPAWN_MARGIN, GAME_HEIGHT, GAME_WIDTH, PUSHBACK_DECAY } from '@/core/constants';
import type { EnemyData } from '@/data/types';
import type { Behaviours } from '@/entities/behaviours/Behaviours';
import { Enemies } from '@/entities/Enemies';
import type { Player } from '@/entities/Player';

export class Enemy extends Enemies {
  facingLeft: boolean;
  constructor(data: EnemyData, behaviour: Behaviours) {
    super(data, behaviour);
    this.facingLeft = false;
  }

  spawn(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.health = this.data.health;
    this.active = true;
  }

  reset() {
    this.active = false;
    this.pushVx = 0;
    this.pushVy = 0;
    this.health = this.data.health;
    if (this.behaviour.reset) this.behaviour.reset();
  }

  update(dt: number, player: Player) {
    if (!this.active) return;

    if (this.invincible) {
      this.invincibilityTimer -= dt;
      if (this.invincibilityTimer <= 0) {
        this.invincible = false;
        this.invincibilityTimer = 0;
      }
    }

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

    if (this.pushVx !== 0 || this.pushVy !== 0) {
      this.x += this.pushVx * dt;
      this.y += this.pushVy * dt;
      const speed = Math.sqrt(this.pushVx * this.pushVx + this.pushVy * this.pushVy);
      const decay = PUSHBACK_DECAY * dt;
      if (speed <= decay) {
        this.pushVx = 0;
        this.pushVy = 0;
      } else {
        const ratio = (speed - decay) / speed;
        this.pushVx *= ratio;
        this.pushVy *= ratio;
      }
    }

    const oldX = this.x;
    this.behaviour.update(this, dt, player);
    this.facingLeft = this.x < oldX;
  }
}
