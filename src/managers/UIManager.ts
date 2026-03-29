import type { Game } from "@/core/Game";
// import { createElement } from "@/utils/helpers";

export class UIManager {
  game: Game;
  playBtn: HTMLButtonElement | null = null;
  resumeBtn: HTMLButtonElement | null = null;
  quitBtn: HTMLButtonElement | null = null;

  mainMenu: HTMLDivElement | null = null;
  pauseMenu: HTMLDivElement | null = null;
  loadingScreen: HTMLDivElement | null = null;

  constructor(game: Game) {
    this.game = game;
    this.getAllElements();
    this.setupUi();
  }

  private getAllElements() {
    // buttons
    this.playBtn = document.querySelector<HTMLButtonElement>("#playBtn")!;
    this.resumeBtn = document.querySelector<HTMLButtonElement>("#resumeBtn")!;
    this.quitBtn = document.querySelector<HTMLButtonElement>("#quitBtn");

    // containers
    this.mainMenu = document.querySelector<HTMLDivElement>("#mainMenu")!;
    this.pauseMenu = document.querySelector<HTMLDivElement>("#pauseMenu")!;
    this.loadingScreen =
      document.querySelector<HTMLDivElement>("#loadingScreen");
  }

  private handleStartGame = () => {
    this.game.audioManager.play("button_click");
    this.game.startGame();
  };
  private handleResume = () => {
    this.game.audioManager.play("button_click");
    this.game.resume();
  };
  private handleQuit = () => {
    this.game.audioManager.play("button_click");
    this.game.returnToMenu();
  };

  setupUi() {
    this.playBtn?.addEventListener("click", this.handleStartGame);
    this.resumeBtn?.addEventListener("click", this.handleResume);
    this.quitBtn?.addEventListener("click", this.handleQuit);
    document.querySelectorAll("button").forEach((btn) => {
      btn.onmouseenter = () => {
        this.game.audioManager.play("button_hover");
      };
    });
  }
  hideAllPanels() {
    document
      .querySelectorAll(".ui-panel")
      .forEach((d) => d.classList.remove("active"));
  }
  hidePausePanel() {
    this.pauseMenu?.classList.remove("active");
  }
  showPausePanel() {
    this.pauseMenu?.classList.add("active");
  }
  showMainMenu() {
    this.mainMenu?.classList.add("active");
  }
  hideMainMenu() {
    this.mainMenu?.classList.remove("active");
  }
  hideLoadingScreen() {
    this.loadingScreen?.classList.remove("active");
  }

  destroy() {
    this.playBtn?.removeEventListener("click", this.handleStartGame);
    this.resumeBtn?.removeEventListener("click", this.handleResume);
    this.quitBtn?.removeEventListener("click", this.handleQuit);
  }
}
