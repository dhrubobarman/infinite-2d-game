import type { EnemyData } from '@/data/types';

export const enemyData = {
  drifter: {
    width: 48,
    height: 48,
    speed: 80,
    health: 5,
    damage: 1,
    collisionRadius: 24,
    behaviourType: 'drift',
    color: '#ff4444',
    image: 'enemy_drifter',
    pushbackForce: 0,
    pushbackImmune: true,
    sounds: {
      hit: 'enemy_drifter_hit',
      death: 'enemy_drifter_death',
    },
  },
  seeker: {
    width: 38,
    height: 28,
    speed: 120,
    health: 3,
    damage: 2,
    collisionRadius: 14,
    behaviourType: 'seek',
    color: '#ff8844',
    image: 'enemy_seeker',
    pushbackForce: 580,
    pushbackImmune: false,
    sounds: {
      hit: 'enemy_seeker_hit',
      death: 'enemy_seeker_death',
    },
  },
} as const satisfies Record<string, EnemyData>;
