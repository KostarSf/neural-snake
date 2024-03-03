import { Brain } from "./math/brain";
import { Point } from "./math/point";
import { Snake } from "./snake";

export class Board {
    // Allowed values are 0 .. 39
    public static readonly width: number = 40;
    public static readonly height: number = 40;

    /** Size of each cell in pixels */
    public static readonly size: number = 20;

    public snake!: Snake;
    public apple!: Point;

    constructor(brain?: Brain) {
        this.snake = new Snake(this, brain);
        this.placeApple();
    }

    public placeApple(): void {
        this.apple = this.randomCell();
    }

    public randomCell(): Point {
        return new Point(
            Math.floor(Math.random() * Board.width),
            Math.floor(Math.random() * Board.height)
        );
    }

    public contains(point: Point): boolean {
        return point.x >= 0 && point.x < Board.width && point.y >= 0 && point.y < Board.height;
    }

    public static clear(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, Board.width * Board.size, Board.height * Board.size);
    }

    public drawApple(context: CanvasRenderingContext2D): void {
        if (!this.snake.alive) {
            return;
        }

        this.drawCell(context, this.apple, "red");
    }

    public drawCell(context: CanvasRenderingContext2D, point: Point, color: string): void {
        context.fillStyle = color;
        context.fillRect(point.x * Board.size, point.y * Board.size, Board.size, Board.size);
    }
}
