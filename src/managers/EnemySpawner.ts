import {
  ENEMY_SPAWN_INTERVAL,
  ENEMY_SPAWN_MERGIN,
  GAME_HEIGHT,
  GAME_WIDTH,
} from '@/core/constants';
import { enemyData } from '@/data/enemyData';
import type { EnemyType } from '@/data/types';
import type { EnemyManager } from '@/managers/EnemyManager';
import { randomInt } from '@/utils/helpers';

export class EnemySpawner {
  enemyManager: EnemyManager;
  spawnTimer: number;
  spawnInterval: number;
  enemyTypes: EnemyType[];
  constructor(enemyManager: EnemyManager) {
    this.enemyManager = enemyManager;
    this.spawnTimer = 0;
    this.spawnInterval = ENEMY_SPAWN_INTERVAL;
    this.enemyTypes = [];
    for (const type in enemyData) {
      this.enemyTypes.push(type as EnemyType);
    }
  }
  update(dt: number) {
    this.spawnTimer += dt;
    if (this.spawnTimer >= this.spawnInterval) {
      this.spawnWave();
      this.spawnTimer = 0;
    }
  }
  spawnWave() {
    const type = this.enemyTypes[randomInt(0, this.enemyTypes.length - 1)];
    // Spawn in at random edge
    const edge = randomInt(0, 3);
    let x: number = 0,
      y: number = 0;
    switch (edge) {
      case 0: // top
        x = randomInt(0, GAME_WIDTH);
        y = -ENEMY_SPAWN_MERGIN;
        break;
      case 1: // right
        x = -ENEMY_SPAWN_MERGIN;
        y = randomInt(0, GAME_HEIGHT);
        break;
      case 2: // bottom
        x = randomInt(0, GAME_WIDTH);
        y = ENEMY_SPAWN_MERGIN + GAME_HEIGHT;
        break;
      case 3: //left
        x = -ENEMY_SPAWN_MERGIN;
        y = randomInt(0, GAME_HEIGHT);
        break;
    }
    this.enemyManager.spawn(type, x, y);
  }
  reset() {
    this.spawnTimer = 0;
  }
}
