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
  }
}
