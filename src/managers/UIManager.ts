import type { Game } from '@/core/Game';
// import { createElement } from "@/utils/helpers";

const panels = {
  mainMenu: '#mainMenu',
  pauseMenu: '#pauseMenu',
  loadingScreen: '#loadingScreen',
} as const;

type PanelId = keyof typeof panels;

const buttons = {
  playBtn: '#playBtn',
  resumeBtn: '#resumeBtn',
  quitBtn: '#quitBtn',
} as const;
type ButtonId = keyof typeof buttons;

export class UIManager {
  game: Game;
  buttons: Map<ButtonId, HTMLButtonElement> = new Map();
  panels: Map<PanelId, HTMLDivElement> = new Map();
  timerEl: HTMLDivElement | null = null;

  constructor(game: Game) {
    this.game = game;
    this.getAllElements();
    this.setupEventListeners();
  }

  private getAllElements() {
    // buttons
    this.buttons = new Map(
      Object.entries(buttons).map(([key, selector]) => [key, document.querySelector(selector)!])
    ) as Map<ButtonId, HTMLButtonElement>;

    // containers
    this.panels = new Map(
      Object.entries(panels).map(([key, selector]) => [key, document.querySelector(selector)!])
    ) as Map<PanelId, HTMLDivElement>;
    this.timerEl = document.querySelector<HTMLDivElement>('#timer')!;
  }

  setupEventListeners() {
    this.buttons.get('playBtn')?.addEventListener('click', this.handleStartGame);
    this.buttons.get('resumeBtn')?.addEventListener('click', this.handleResume);
    this.buttons.get('quitBtn')?.addEventListener('click', this.handleQuit);

    document.querySelectorAll('button').forEach((btn) => {
      btn.onmouseenter = () => {
        this.game.playSound('button_hover');
      };
    });
  }

  private handleStartGame = () => {
    this.game.startGame();
  };
  private handleResume = () => {
    this.game.resume();
  };
  private handleQuit = () => {
    this.game.returnToMenu();
  };

  hideAllPanels() {
    this.panels.forEach((d) => {
      d?.classList?.remove('active');
    });
  }
  showPanel(panelId: PanelId) {
    this.hideAllPanels();
    this.panels.get(panelId)?.classList.add('active');
  }
  hidePanel(panleId: PanelId) {
    this.panels.get(panleId)?.classList.remove('active');
  }

  showTimer() {
    if (this.timerEl) this.timerEl.style.display = 'block';
  }
  hideTimer() {
    if (this.timerEl) this.timerEl.style.display = 'none';
  }
  updateTimer(time: number) {
    if (!this.timerEl) return;
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    this.timerEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  }

  destroy() {
    this.buttons.get('playBtn')?.removeEventListener('click', this.handleStartGame);
    this.buttons.get('resumeBtn')?.removeEventListener('click', this.handleResume);
    this.buttons.get('quitBtn')?.removeEventListener('click', this.handleQuit);
  }
}
