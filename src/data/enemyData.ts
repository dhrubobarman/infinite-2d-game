import type { EnemyData } from '@/data/types';

export const enemyData: Record<string, EnemyData> = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 1,
    damage: 1,
    collisionRadius: 24,
    rotationSpeed: 5,
  },
};
