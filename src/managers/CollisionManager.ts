import { EVENTS, type AppEvents } from '@/core/constants';
import type { EventEmitter } from '@/core/EventEmitter';
import type { Enemy } from '@/entities/Enemy';
import type { Player } from '@/entities/Player';
import type { CollisionSystem } from '@/systems/CollisionSystem';

export class CollisionManager {
  collisionSystem: CollisionSystem;
  events: EventEmitter<AppEvents>;
  constructor(collisionSystem: CollisionSystem, events: EventEmitter<AppEvents>) {
    this.collisionSystem = collisionSystem;
    this.events = events;
  }

  update(player: Player, enemies: Enemy[]) {
    this.checkPlayerVsEnemies(player, enemies);
  }

  checkPlayerVsEnemies(player: Player, enemies: Enemy[]) {
    for (const enemy of enemies) {
      if (!enemy.active) continue;

      if (this.collisionSystem.checkCircleCircle(player, enemy)) {
        const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);
        const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);
        const dist = Math.sqrt(dx * dx + dy * dy);
        const nx = dist > 0 ? dx / dist : 1;
        const ny = dist > 0 ? dy / dist : 0;

        const enemyDamageApplied = enemy.takeDamage(player.collisionDamage);
        if (enemyDamageApplied) {
          this.events.emit(EVENTS.ENEMY_DAMAGED, enemy);
          if (enemy.isdDead()) {
            enemy.active = false;
            this.events.emit(EVENTS.ENEMY_DIED, enemy);
          } else if (!enemy.data.pushbackImmune) {
            enemy.applyPushback(-nx, -ny, enemy.data.pushbackForce);
          }
        }

        const playerDamageApplied = player.takeDamage(enemy.damage);
        if (playerDamageApplied) {
          this.events.emit(EVENTS.PLAYER_DAMAGED, player.health, player.maxHealth);
          if (player.isdDead()) {
            this.events.emit(EVENTS.PLAYER_DIED);
            return;
          }
          if (enemy.data.pushbackImmune) {
            player.applyPushback(nx, ny, player.pushbackForce);
          }
        }
      }
    }
  }
}
