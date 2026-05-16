import type { PlayerData } from '@/data/types';

export const playerData = {
  width: 64,
  height: 64,
  speed: 300,
  collisionRadius: 28,
  image: 'player',
  maxHealth: 12,
} as const satisfies PlayerData;
