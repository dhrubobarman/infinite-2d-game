import { GAME_HEIGHT, GAME_WIDTH } from "@/utils/constants";
import { clamp } from "@/utils/helpers";

export class Player {
  x: number;
  y: number;
  width: number;
  height: number;
  speed: number;
  speedMultiplier: number;
  constructor() {
    this.width = 64;
    this.height = 64;
    this.x = (GAME_WIDTH - this.width) / 2;
    this.y = (GAME_HEIGHT - this.height) / 2;
    this.speed = 300;

    // Multipliers (for player)
    this.speedMultiplier = 1;
  }
  update(dt: number, keys: Record<string, boolean>) {
    let dx = 0,
      dy = 0;

    if (keys["w"] || keys["arrowup"]) dy -= 1;
    if (keys["s"] || keys["arrowdown"]) dy += 1;
    if (keys["a"] || keys["arrowleft"]) dx -= 1;
    if (keys["d"] || keys["arrowright"]) dx += 1;

    //Normalize diagonal movement
    if (dx || dy) {
      const len = Math.sqrt(dx * dx + dy * dy);
      dx /= len;
      dy /= len;

      this.x += dx * this.speed * this.speedMultiplier * dt;
      this.y += dy * this.speed * this.speedMultiplier * dt;
    }

    // Keep player in bounds
    this.x = clamp(this.x, 0, GAME_WIDTH - this.width);
    this.y = clamp(this.y, 0, GAME_HEIGHT - this.height);
  }
}
