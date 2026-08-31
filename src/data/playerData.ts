import type { PlayerData } from '@/data/types';

export const playerData = {
  width: 64,
  height: 64,
  speed: 300,
  collisionRadius: 28,
  collisionDamage: 1,
  image: 'player',
  maxHealth: 12,
  invincibilityDuration: 2,
  pushbackForce: 520,
} as const satisfies PlayerData;

export const missionData = {
  surviveTime: 60,
  killCount: 10,
} as const;
