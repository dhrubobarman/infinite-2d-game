import type { EnemyData } from '@/data/types';

export const enemyData = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 1,
    damage: 1,
    collisionRadius: 24,
    behaviourType: 'drift',
    color: '#ff4444',
    image: 'enemy_drifter',
  },
  seeker: {
    width: 38,
    height: 28,
    speed: 120,
    health: 2,
    damage: 2,
    collisionRadius: 28,
    behaviourType: 'seek',
    color: '#ff8844',
    image: 'enemy_seeker',
  },
} as const satisfies Record<string, EnemyData>;
