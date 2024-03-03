import { Board } from "./board";
import { getDefaultProgress } from "./default-progress";
import { Brain } from "./math/brain";
import { Breed } from "./math/breed";
import { Snake } from "./snake";

export class Game {
    public static readonly worlds: number = 100;
    public static readonly keepTopN: number = 1;

    private boards: Board[];
    private generation: number = 1;
    private worlds: number = Game.worlds;
    private keepTopN: number = Game.keepTopN;

    public processFrames: number = 1;

    constructor(worlds: number = Game.worlds, keepTopN: number = Game.keepTopN) {
        const [brain, generation] = this.loadSnakeAndGeneration();
        this.worlds = worlds;
        this.keepTopN = keepTopN;
        this.generation = generation;
        this.boards = new Array(this.worlds).fill(0).map(() => new Board(brain));
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
            .topN(this.keepTopN)
            .concat(new Array(this.worlds - this.keepTopN).fill(0).map(() => breed.spawn()));

        this.saveSnakeAndGeneration(newGeneration[0], this.generation);

        this.boards = newGeneration.map((brain) => new Board(brain));
        this.generation++;
    }

    public resetProgress(): void {
        localStorage.removeItem("snake");
        window.location.reload();
    }

    public defaultProgress(): void {
        const [brain, generation] = getDefaultProgress();
        this.saveSnakeAndGeneration(brain, generation);
        window.location.reload();
    }

    private saveSnakeAndGeneration(brain: Brain, generation: number) {
        const data = { brain: JSON.stringify(brain), generation };
        localStorage.setItem("snake", JSON.stringify(data));
    }

    private loadSnakeAndGeneration(): [Brain | undefined, number] {
        const data = localStorage.getItem("snake");
        if (!data) {
            return [...getDefaultProgress()];
        }

        try {
            const { brain, generation } = JSON.parse(data);
            return [Brain.fromJSON(brain), generation];
        } catch (err) {
            console.error(err);
            return [undefined, 1];
        }
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
