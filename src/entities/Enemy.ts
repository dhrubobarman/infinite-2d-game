import {
  ENEMY_DESPAWN_MARGIN,
  ENEMY_HIT_INVINCIBILITY_DURATION,
  GAME_HEIGHT,
  GAME_WIDTH,
  PUSHBACK_DECAY,
} from '@/core/constants';
import type { EnemyData } from '@/data/types';
import type { BehaviourTypes } from '@/entities/behaviours/BehaviourFactory';
import type { Behaviours } from '@/entities/behaviours/Behaviours';
import type { Player } from '@/entities/Player';

export class Enemy {
  facingLeft: boolean;
  readonly data: EnemyData;
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  active: boolean;
  behaviourType: BehaviourTypes;
  x: number;
  y: number;
  behaviour: Behaviours;
  invincible: boolean;
  invincibilityTimer: number;
  pushVx: number;
  pushVy: number;

  constructor(data: EnemyData, behaviour: Behaviours) {
    this.data = data;

    // Position dimention
    this.x = 0;
    this.y = 0;
    this.width = data.width;
    this.height = data.height;

    // Stats
    this.health = data.health;
    this.speed = data.speed;
    this.damage = data.damage;
    this.collisionRadius = data.collisionRadius;

    this.active = false;
    this.behaviourType = data.behaviourType ?? 'seek';

    this.behaviour = behaviour;
    this.invincible = false;
    this.invincibilityTimer = 0;
    this.pushVx = 0;
    this.pushVy = 0;
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

  takeDamage(amount: number): boolean {
    if (this.invincible) return false;
    this.health = Math.max(0, this.health - amount);
    this.invincible = true;
    this.invincibilityTimer = ENEMY_HIT_INVINCIBILITY_DURATION;
    return true;
  }
  isdDead() {
    return this.health <= 0;
  }
  applyPushback(dirX: number, dirY: number, force: number) {
    this.pushVx = dirX * force;
    this.pushVy = dirY * force;
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
