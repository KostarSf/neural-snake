import { Game } from "./network-v3-snake/game";
import "./style.css";

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement | null;
const context = canvas?.getContext("2d");

if (!canvas || !context) {
    throw new Error("Canvas not found");
}

const game = new Game();

game.draw(context!);

let stepTimer: number | undefined
let drawTimer: number | undefined;

function setStepTimer(): void {
    if (stepTimer) {
        clearInterval(stepTimer);
    }

    stepTimer = setInterval(() => {
        game.step();
    }, 30);
}

function setDrawTimer(ms = 16): void {
    if (drawTimer) {
        clearInterval(drawTimer);
    }

    drawTimer = setInterval(() => {
        game.draw(context!);
    }, ms);
}

setStepTimer();
setDrawTimer();

document.getElementById("steps-per-frame")?.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    game.processFrames = parseInt(input.value, 10);
});

document.getElementById("frames-per-second")?.addEventListener("input", (event) => {
    const input = event.target as HTMLInputElement;
    const fps = parseInt(input.value, 10);

    // transform fps to ms
    const ms = Math.ceil(1000 / fps);
    setDrawTimer(ms);
});