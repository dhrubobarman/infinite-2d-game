import { ENEMY_HIT_INVINCIBILITY_DURATION } from '@/core/constants';
import type { EnemyData } from '@/data/types';
import type { BehaviourTypes } from '@/entities/behaviours/BehaviourFactory';
import type { Behaviours } from '@/entities/behaviours/Behaviours';

export class Enemies {
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
}
