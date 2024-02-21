import "./style.css"
import { Board } from "./network-v3-snake/board";

const canvas = document.getElementById(
  "game-canvas"
) as HTMLCanvasElement | null;

const board = new Board();

function draw() {
  if (!canvas) {
    throw new Error("Canvas not found");
  }

  const context = canvas.getContext("2d");
  if (context) {
    board.draw(context);
  }
}

function setupTimer() {
  return setInterval(() => {
    board.snake.step();
    draw();
  }, 50);
}

let timer: number | undefined = setupTimer();

canvas?.addEventListener("click", () => {
  if (timer) {
    clearInterval(timer);
    timer = undefined;
  } else {
    timer = setupTimer();
  }
});

draw();
