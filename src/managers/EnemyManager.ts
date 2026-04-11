import { enemyData } from '@/data/enemyData';
import { Enemy } from '@/entities/Enemy';
import type { Player } from '@/entities/Player';
import { ObjectPooler } from '@/utils/ObjectPooler';

export class EnemyManager {
  pool: ObjectPooler<Enemy>;
  constructor() {
    const ENEMY_POOL_SIZE = 10;

    // create a pool
    this.pool = new ObjectPooler(() => {
      return new Enemy(enemyData.drifter);
    }, ENEMY_POOL_SIZE);
  }

  spawn(x: number, y: number) {
    const enemy = this.pool.get();
    enemy.spawn(x, y);
    return enemy;
  }

  getActiveEnemies() {
    return this.pool.activeList;
  }

  update(dt: number, player: Player) {
    this.pool.updateAll(dt, player);
  }
  reset() {
    this.pool.releaseAll();
  }
}
