import { enemyData } from '@/data/enemyData';
import type { EnemyType } from '@/data/types';
import { BehaviourFactory } from '@/entities/behaviours/BehaviourFactory';
import { Enemy } from '@/entities/Enemy';
import type { Player } from '@/entities/Player';
import { ObjectPooler } from '@/utils/ObjectPooler';

const ENEMY_POOL_SIZE = 10;

export class EnemyManager {
  pools: Record<string, ObjectPooler<Enemy>>;
  constructor() {
    this.pools = {};

    for (const type in enemyData) {
      const typedType = type as keyof typeof enemyData;
      this.pools[typedType] = new ObjectPooler(() => {
        const data = enemyData[typedType];
        const behaviour = BehaviourFactory.createBehaviour(data.behaviourType || 'seek');

        return new Enemy(data, behaviour);
      }, ENEMY_POOL_SIZE);
    }
  }

  spawn(type: EnemyType = 'drifter', x: number, y: number) {
    const pool = this.pools[type];
    if (!pool) {
      console.warn('Unknon enemy type');
      return null;
    }
    const enemy = pool.get();
    enemy.spawn(x, y);
    return enemy;
  }

  getActiveEnemies() {
    const enemies: Enemy[] = [];
    for (const type in this.pools) {
      const pool = this.pools[type];
      if (!pool) continue;
      enemies.push(...pool.activeList);
    }
    return enemies;
  }

  update(dt: number, player: Player) {
    for (const type in this.pools) {
      const pool = this.pools[type];
      if (!pool) continue;
      pool.updateAll(dt, player);
    }
  }
  reset() {
    for (const type in this.pools) {
      const pool = this.pools[type];
      if (!pool) continue;
      pool.releaseAll();
    }
  }
}
