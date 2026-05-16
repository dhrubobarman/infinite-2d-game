import type { enemyData } from '@/data/enemyData';
import type { BehaviourTypes } from '@/entities/behaviours/BehaviourFactory';

export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  behaviourType?: BehaviourTypes;
  color: string;
  image: string;
};

export type PlayerData = {
  width: number;
  height: number;
  speed: number;
  collisionRadius: number;
  image: string;
  maxHealth: number;
};

export type EnemyType = keyof typeof enemyData;
