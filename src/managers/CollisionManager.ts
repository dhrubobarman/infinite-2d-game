import { EVENTS, type AppEvents } from '@/core/constants';
import type { EventEmitter } from '@/core/EventEmitter';
import type { Enemies } from '@/entities/Enemies';
import type { Player } from '@/entities/Player';
import type { CollisionSystem } from '@/systems/CollisionSystem';

export class CollisionManager {
  collisionSystem: CollisionSystem;
  events: EventEmitter<AppEvents>;
  constructor(collisionSystem: CollisionSystem, events: EventEmitter<AppEvents>) {
    this.collisionSystem = collisionSystem;
    this.events = events;
  }

  update(player: Player, enemies: Enemies[]) {
    this.checkPlayerVsEnemies(player, enemies);
  }

  checkPlayerVsEnemies(player: Player, enemies: Enemies[]) {
    for (const enemy of enemies) {
      if (!enemy.active) continue;
      if (this.collisionSystem.checkCircleCircle(player, enemy)) {
        enemy.active = false;
        const damageApplied = player.takeDamage(enemy.damage);
        if (damageApplied) {
          this.events.emit(EVENTS.PLAYER_DAMAGED, player.health, player.maxHealth);
        }
        this.events.emit(EVENTS.ENEMY_DIED, enemy);
      }
    }
  }
}
