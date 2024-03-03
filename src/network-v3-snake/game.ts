import { Board } from "./board";
import { Breed } from "./math/breed";
import { Snake } from "./snake";

export class Game {
    public static readonly worlds: number = 100;
    public static readonly keepTopN: number = 1;

    private boards: Board[];
    private generation: number = 1;

    public processFrames: number = 1;

    constructor() {
        this.boards = new Array(Game.worlds).fill(0).map(() => new Board());
    }

    public step(): void {
        let deaths = 0;

        for (let i = 0; i < this.processFrames; i++) {
            this.boards.forEach((board) => {
                board.snake.step();
                if (!board.snake.alive) {
                    deaths++;
                }
            });

            if (deaths === this.boards.length) {
                break;
            }
        }

        if (this.boards.every((board) => !board.snake.alive)) {
            this.nextGeneration();
        }
    }

    private nextGeneration(): void {
        const breed = new Breed(this.boards.map((board) => board.snake));
        const newGeneration = breed
            .topN(Game.keepTopN)
            .concat(new Array(Game.worlds - Game.keepTopN).fill(0).map(() => breed.spawn()));

        this.boards = newGeneration.map((brain) => new Board(brain));
        this.generation++;
    }

    public draw(context: CanvasRenderingContext2D): void {
        Board.clear(context);
        this.boards.forEach((board) => {
            board.drawApple(context);
            board.snake.draw(context);
        });

        const topAliveSnake = this.boards
            .filter((board) => board.snake.alive)
            .sort((a, b) => b.snake.score - a.snake.score)[0]?.snake as Snake | undefined;

        if (topAliveSnake) {
            context.fillStyle = "yellow";
            context.font = "bold 16px Arial"; // Set the font size to 16px
            context.fillText(`Generation: ${this.generation}`, 10, 20);
            context.fillText(`Lifetime: ${topAliveSnake.lifetime}`, 10, 40);
            context.fillText(`Remain: ${topAliveSnake.timeRemaining}`, 10, 60);
            context.fillText(`Apples: ${topAliveSnake.applesEaten}`, 10, 80);
            context.fillText(`Score: ${topAliveSnake.score}`, 10, 100);
        }
    }
}
