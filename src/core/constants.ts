import type { AvailableSoundNames } from '@/data/audioData';
import type { Enemy } from '@/entities/Enemy';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const GRID_SIZE = 40;
export const CANVAS_MARGIN = 15;

export const EPS = 1e-6;

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
  GAME_OVER: 'gameOver',
  MISSION_COMPLETE: 'missionComplete',
} as const;

export const ENEMY_DESPAWN_MARGIN = 200;
export const ENEMY_SPAWN_MARGIN = 100;
export const ENEMY_SPAWN_INTERVAL = 2;
export const ENEMY_HIT_INVINCIBILITY_DURATION = 1.5;
export const PUSHBACK_DECAY = 800;

export const EVENTS = {
  SOUND: 'sound',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RETURN_TO_MENU: 'game:returnToMenu',
  MISSION_COMPLETE: 'mission:complete',
  // Player
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_DIED: 'player:died',

  // enemy
  ENEMY_DIED: 'enemy:died',
  ENEMY_DAMAGED: 'enemy:damaged',
  ENEMY_KILLED_COUNT: 'enemy:killedCount',
} as const;

type TEvents = typeof EVENTS;
type CustomAppEvents = {
  [EVENTS.SOUND]: [type: AvailableSoundNames];
  [EVENTS.PLAYER_DAMAGED]: [health: number, maxHealth: number];
  [EVENTS.ENEMY_DAMAGED]: [enemy: Enemy];
  [EVENTS.ENEMY_DIED]: [enemy: Enemy];
  [EVENTS.ENEMY_KILLED_COUNT]: [enemyKilled: number];
};

export type AppEvents = {
  [K in TEvents[keyof TEvents]]: K extends keyof CustomAppEvents ? CustomAppEvents[K] : [];
};
