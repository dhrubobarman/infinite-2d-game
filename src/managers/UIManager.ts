import { EVENTS, type AppEvents } from '@/core/constants';
import type { EventEmitter } from '@/core/EventEmitter';

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
  events: EventEmitter<AppEvents>;
  buttons: Map<ButtonId, HTMLButtonElement> = new Map();
  panels: Map<PanelId, HTMLDivElement> = new Map();
  timerEl: HTMLDivElement | null = null;

  constructor(events: EventEmitter<AppEvents>) {
    this.events = events;
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

    this.buttons.forEach((btn) => {
      btn.onmouseenter = () => {
        this.events.emit(EVENTS.SOUND, 'button_hover');
      };
    });
  }

  private handleStartGame = () => {
    this.events.emit(EVENTS.GAME_START);
  };
  private handleResume = () => {
    this.events.emit(EVENTS.GAME_RESUME);
  };
  private handleQuit = () => {
    this.events.emit(EVENTS.GAME_RETURN_TO_MENU);
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
