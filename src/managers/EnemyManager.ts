import { enemyData } from '@/data/enemyData';
import { Enemy } from '@/entities/Enemy';
import type { Player } from '@/entities/Player';

export class EnemyManager {
  enemy: Enemy;
  constructor() {
    this.enemy = new Enemy(enemyData.drifter);
  }

  spawn(x: number, y: number) {
    this.enemy.spawn(x, y);
  }

  getActiveEnemies() {
    return [this.enemy];
  }

  update(dt: number, player: Player) {
    this.enemy.update(dt, player);
  }
}
