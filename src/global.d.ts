import { Game } from "@/core/Game";

declare global {
  interface Window {
    __GAME__?: Game;
  }
}
