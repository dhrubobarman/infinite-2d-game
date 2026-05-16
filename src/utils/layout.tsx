import { cn } from '@/utils/helpers';
export { jsx, jsxs, Fragment } from './domFns';

const gameContainer = document.getElementById('gameContainer')!;

const layout = (
  <>
    <canvas id="gameCanvas" />
    <div id="hud" className="pointer-events-none absolute inset-0 z-1000 hidden starting:opacity-0">
      <div
        id="timer"
        className="absolute top-17.5 left-2/4 -translate-x-2/4 text-[40px] font-bold text-[#4a9eff]"
      >
        0:00
      </div>
      <div
        id="healthBarContainer"
        className={cn(
          'absolute top-6.25 left-1/4 h-6.25 w-1/2 border-3 border-[#eee] bg-black/50',
          '-skew-x-20 overflow-hidden',
          'shadow-[6px_6px_0px_#4a9eff]'
        )}
      >
        <div id="healthBarFill" className="h-full w-full">
          <div
            className={cn(
              'absolute inset-0 origin-left scale-x-(--health-pct,1)',
              'bg-linear-90 from-[#ffb3c1] from-85% to-white to-85%',
              'transition-transform delay-500 duration-500 ease-out'
            )}
          ></div>
          <div
            className={cn(
              'absolute inset-0 origin-left scale-x-(--health-pct,1)',
              'bg-linear-0 from-[#ff5f6d] from-50% to-[#d90429] to-50%',
              'transition-transform duration-200 ease-out',
              'z-2'
            )}
          ></div>
        </div>
      </div>
    </div>
    <div id="mainMenu" className="ui-panel">
      <h1>Game Starter Kit</h1>
      <button id="playBtn">Play</button>
      <div className="mt-4 text-[12px]">
        <p>WASD - Move</p>
        <p>ESC - Pause</p>
      </div>
    </div>
    <div id="pauseMenu" className="ui-panel">
      <h2>Paused</h2>
      <button id="resumeBtn">RESUME</button>
      <button id="quitBtn">QUIT TO MENU</button>
    </div>
    <div id="loadingScreen" className="ui-panel active">
      <h1>Loading...</h1>
      <p>Sherpening the pixels</p>
    </div>
  </>
);

gameContainer.appendChild(layout);
