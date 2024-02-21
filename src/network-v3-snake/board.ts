import { Point } from "./math/point";
import { Snake } from "./snake";

export class Board {
    // Allowed values are 0 .. 39
    public readonly width: number = 40;
    public readonly height: number = 40;

    /** Size of each cell in pixels */
    public readonly size: number = 20;

    public snake!: Snake;
    public apple!: Point;

    constructor() {
        this.reset();
    }

    public reset(): void {
        this.snake = new Snake(this);
        this.apple = this.randomCell();
    }

    public randomCell(): Point {
        return new Point(
            Math.floor(Math.random() * this.width),
            Math.floor(Math.random() * this.height)
        );
    }

    public contains(point: Point): boolean {
        return point.x >= 0 && point.x < this.width && point.y >= 0 && point.y < this.height;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.width * this.size, this.height * this.size);

        // this.drawBoard(context);

        this.snake.draw(context);
        this.drawCell(context, this.apple, "red");
    }

    private drawBoard(context: CanvasRenderingContext2D): void {
        context.strokeStyle = "#111111";
        for (let x = 0; x < this.width; x++) {
            for (let y = 0; y < this.height; y++) {
                context.strokeRect(x * this.size, y * this.size, this.size, this.size);
            }
        }
    }

    public drawCell(context: CanvasRenderingContext2D, point: Point, color: string): void {
        context.fillStyle = color;
        context.fillRect(point.x * this.size, point.y * this.size, this.size, this.size);
    }
}
