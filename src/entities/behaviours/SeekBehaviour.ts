import { EPS } from '@/core/constants';
import { Behaviours } from '@/entities/behaviours/Behaviours';
import type { Enemies } from '@/entities/Enemies';
import type { Player } from '@/entities/Player';

export class SeekBehaviour extends Behaviours {
  constructor() {
    super();
  }
  override update(enemy: Enemies, dt: number, player: Player) {
    const dx = player.x + player.width / 2 - (enemy.x + enemy.width / 2);
    const dy = player.y + player.height / 2 - (enemy.y + enemy.height / 2);
    const len = Math.hypot(dx, dy);
    if (len > EPS) {
      const normalizeDx = dx / len;
      const normalizeDy = dy / len;
      enemy.x += normalizeDx * enemy.speed * dt;
      enemy.y += normalizeDy * enemy.speed * dt;

      // // angle
      // const targetAngle = Math.atan2(dy, dx);
      // let diff = targetAngle - enemy.angle;
      // diff = Math.atan2(Math.sin(diff), Math.cos(diff));
      // const maxStep = enemy.rotationSpeed * dt;
      // if (Math.abs(diff) < maxStep) {
      //   enemy.angle = targetAngle;
      // } else {
      //   enemy.angle += Math.sign(diff) * maxStep;
      // }
    }
  }
}
