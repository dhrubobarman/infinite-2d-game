import type { AvailableSoundNames } from '@/data/audioData';
import type { enemyData } from '@/data/enemyData';
import type { EnemyBehaviourTypes } from '@/entities/behaviours/enemy/EnemyBehaviourFactory';

export type EnemyData = {
  width: number;
  height: number;
  speed: number;
  health: number;
  damage: number;
  collisionRadius: number;
  behaviourType?: EnemyBehaviourTypes;
  color: string;
  image: string;
  pushbackForce: number;
  pushbackImmune: boolean;
  sounds: { hit: AvailableSoundNames; death: AvailableSoundNames };
};

export type PlayerData = {
  width: number;
  height: number;
  speed: number;
  collisionDamage: number;
  collisionRadius: number;
  image: string;
  maxHealth: number;
  invincibilityDuration: number;
  pushbackForce: number;
};

export type EnemyType = keyof typeof enemyData;
