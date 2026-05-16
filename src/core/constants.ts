import type { AvailableSoundNames } from '@/data/audioData';
import type { Enemies } from '@/entities/Enemies';

export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const GRID_SIZE = 40;
export const CANVAS_MARGIN = 15;

export const EPS = 1e-6;

export const GAME_STATES = {
  MENU: 'menu',
  PLAYING: 'playing',
  PAUSED: 'paused',
} as const;

export const ENEMY_DESPAWN_MARGIN = 200;
export const ENEMY_SPAWN_MERGIN = 100;
export const ENEMY_SPAWN_INTERVAL = 2;

export const EVENTS = {
  SOUND: 'sound',
  GAME_START: 'game:start',
  GAME_PAUSE: 'game:pause',
  GAME_RESUME: 'game:resume',
  GAME_RETURN_TO_MENU: 'game:returnToMenu',
  // Player
  PLAYER_DAMAGED: 'player:damaged',
  PLAYER_DIED: 'player:died',

  // enemy
  ENEMY_DIED: 'enemy:died',
  ENEMY_DAMAGED: 'enemy:damaged',
} as const;

export type AppEvents = {
  [EVENTS.SOUND]: [type: AvailableSoundNames];
  [EVENTS.GAME_START]: [];
  [EVENTS.GAME_PAUSE]: [];
  [EVENTS.GAME_RESUME]: [];
  [EVENTS.GAME_RETURN_TO_MENU]: [];
  // Player
  [EVENTS.PLAYER_DAMAGED]: [health: number, maxHeahth: number];
  [EVENTS.PLAYER_DIED]: [];

  // Enemy
  [EVENTS.ENEMY_DAMAGED]: [enemy: Enemies];
  [EVENTS.ENEMY_DIED]: [enemy: Enemies];
};
