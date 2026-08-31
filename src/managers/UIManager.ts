import { EVENTS, type AppEvents } from '@/core/constants';
import type { EventEmitter } from '@/core/EventEmitter';

const panels = {
  mainMenu: '#mainMenu',
  pauseMenu: '#pauseMenu',
  loadingScreen: '#loadingScreen',
  gameOverMenu: '#gameOverMenu',
  missionCompleteMenu: `#missionCompleteMenu`,
} as const;

const elements = {
  hudEl: '#hud',
  healthBarFill: '#healthBarFill',
  timerEl: '#timer',
} as const;
type Elements = keyof typeof elements;

type PanelId = keyof typeof panels;

export class UIManager {
  events: EventEmitter<AppEvents>;
  panels: Map<PanelId, HTMLDivElement> = new Map();
  elements: Map<Elements, HTMLElement> = new Map();

  constructor(events: EventEmitter<AppEvents>) {
    this.events = events;
    this.getAllElements();
    this.setupEventListeners();
  }

  private getAllElements() {
    // containers
    this.panels = new Map(
      Object.entries(panels).map(([key, selector]) => [key, document.querySelector(selector)!])
    ) as Map<PanelId, HTMLDivElement>;
    this.elements = new Map(
      Object.entries(elements).map(([key, selector]) => [key, document.querySelector(selector)!])
    ) as Map<Elements, HTMLDivElement>;
  }

  setupEventListeners() {
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='start']`)
      ?.forEach((btn) => btn.addEventListener('click', this.handleStartGame));
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='resume']`)
      ?.forEach((btn) => btn.addEventListener('click', this.handleResume));
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='returnToMenu']`)
      ?.forEach((btn) => btn.addEventListener('click', this.handleQuit));

    document
      .querySelectorAll<HTMLButtonElement>(`[data-action]`)
      ?.forEach((btn) => btn.addEventListener('mouseenter', this.playButtonHoverSound));
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
  private playButtonHoverSound = () => {
    this.events.emit(EVENTS.SOUND, 'button_hover');
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
  hidePanel(panelId: PanelId) {
    this.panels.get(panelId)?.classList.remove('active');
  }

  showHud() {
    if (this.elements.get('hudEl')) this.elements.get('hudEl')!.style.display = 'block';
  }
  hideHud() {
    if (this.elements.get('hudEl')) this.elements.get('hudEl')!.style.display = 'none';
  }
  updateTimer(time: number) {
    const timerEl = this.elements.get('timerEl');
    if (!timerEl) return;
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    timerEl.textContent = `${mins}:${String(secs).padStart(2, '0')}`;
  }

  destroy() {
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='start']`)
      ?.forEach((btn) => btn.removeEventListener('click', this.handleStartGame));
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='resume']`)
      ?.forEach((btn) => btn.removeEventListener('click', this.handleResume));
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action='returnToMenu']`)
      ?.forEach((btn) => btn.removeEventListener('click', this.handleQuit));
    document
      .querySelectorAll<HTMLButtonElement>(`[data-action]`)
      ?.forEach((btn) => btn.removeEventListener('mouseenter', this.playButtonHoverSound));
  }
  updateHealthBar(health: number, maxHealth: number) {
    const healthBarFill = this.elements.get('healthBarFill');
    if (!healthBarFill) return;

    const pct = Math.max(0, health / maxHealth);
    healthBarFill.style.setProperty('--health-pct', `${pct}`);
  }
}
