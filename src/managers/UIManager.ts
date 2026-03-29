import type { Game } from "@/core/Game";
// import { createElement } from "@/utils/helpers";

const panels = {
  mainMenu: "#mainMenu",
  pauseMenu: "#pauseMenu",
  loadingScreen: "#loadingScreen",
} as const;

type PanelId = keyof typeof panels;

const buttons = {
  playBtn: "#playBtn",
  resumeBtn: "#resumeBtn",
  quitBtn: "#quitBtn",
} as const;
type ButtonId = keyof typeof buttons;

export class UIManager {
  game: Game;
  buttons: Record<string, HTMLButtonElement> = {};
  panels: Record<string, HTMLDivElement> = {};

  constructor(game: Game) {
    this.game = game;
    this.getAllElements();
    this.setupEventListeners();
  }

  private getAllElements() {
    // buttons
    this.buttons = Object.fromEntries(
      Object.entries(buttons).map(([key, selector]) => [
        key,
        document.querySelector(selector)!,
      ]),
    ) as Record<ButtonId, HTMLButtonElement>;

    // containers
    this.panels = Object.fromEntries(
      Object.entries(panels).map(([key, selector]) => [
        key,
        document.querySelector(selector)!,
      ]),
    ) as Record<PanelId, HTMLDivElement>;
  }

  setupEventListeners() {
    this.buttons.playBtn?.addEventListener("click", this.handleStartGame);
    this.buttons.resumeBtn?.addEventListener("click", this.handleResume);
    this.buttons.quitBtn?.addEventListener("click", this.handleQuit);
    document.querySelectorAll("button").forEach((btn) => {
      btn.onmouseenter = () => {
        this.game.audioManager.play("button_hover");
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
    document
      .querySelectorAll(".ui-panel")
      .forEach((d) => d.classList.remove("active"));
  }
  showPanel(panelId: PanelId) {
    this.hideAllPanels();
    this.panels[panelId].classList.add("active");
  }
  hidePanel(panleId: PanelId) {
    this.panels[panleId].classList.remove("active");
  }

  destroy() {
    this.buttons.playBtn?.removeEventListener("click", this.handleStartGame);
    this.buttons.resumeBtn?.removeEventListener("click", this.handleResume);
    this.buttons.quitBtn?.removeEventListener("click", this.handleQuit);
  }
}
