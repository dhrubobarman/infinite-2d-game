import type { enemyData } from '@/data/enemyData';
import type { BehaviourTypes } from '@/entities/behaviours/BehaviourFactory';
import type { AvailableImageNames } from '@/managers/ImageManager';

export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  behaviourType?: BehaviourTypes;
  color: string;
  image: AvailableImageNames;
};

export type EnemyType = keyof typeof enemyData;
