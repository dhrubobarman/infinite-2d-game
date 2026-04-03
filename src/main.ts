import { Game } from '@/core/Game';
import './style.css';

// if (!window.__GAME__) {
//   window.__GAME__ = new Game();
// }

// const existing = window.__GAME__;

// if (import.meta.hot) {
//   import.meta.hot.accept(() => {
//     existing.uiManager?.destroy();
//   });
//   import.meta.hot.dispose(() => {
//     existing?.destroy();
//   });
// }

// if (existing) {
//   console.log("Disposing old game...");
//   existing?.destroy();
// }

window.__GAME__ = new Game();
