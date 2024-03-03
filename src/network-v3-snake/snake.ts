import { Board } from "./board";
import { Brain } from "./math/brain";
import { Point } from "./math/point";

export class Snake {
    private readonly initialLength = 6;
    private readonly initialTimeRemaining = 100;
    private readonly timePerApple = 100;

    private _board: Board;
    private _brain: Brain;

    private body: Point[];
    private color: string = "white";

    public get board(): Board {
        return this._board;
    }

    public get brain(): Brain {
        return this._brain;
    }

    public get head(): Point {
        return this.body[0];
    }

    public alive: boolean = true;
    public lifetime: number = 0;
    public applesEaten: number = 0;
    public timeRemaining: number = this.initialTimeRemaining;

    public get score(): number {
        return Math.pow(this.lifetime, 2) + Math.pow(this.applesEaten * this.timePerApple, 2);
    }

    constructor(board: Board, brain?: Brain) {
        this._board = board;
        this._brain = brain ?? Brain.random();

        const pos = board.randomCell();
        this.body = new Array<Point>(this.initialLength).fill(pos);

        this.color = this.generateRandomColor();
    }

    public draw(context: CanvasRenderingContext2D): void {
        if (!this.alive) {
            return;
        }

        this.body.forEach((point) => {
            this.board.drawCell(context, point, this.color);
        });
    }

    private generateRandomColor(): string {
        const random = () => Math.floor(Math.random() * 30 + 226);
        return `rgb(${random()}, ${random()}, ${random()})`;
    }

    public step(): void {
        if (!this.alive) {
            return;
        }

        const observations = this.observe();
        const actions = this.brain.think(observations);

        const maxIndex = actions.indexOf(Math.max(...actions));
        this.move(Point.fourDirections[maxIndex]);
    }

    private observe(): number[] {
        return Point.eightDirections
            .map((direction) => [
                this.distanceToWall(direction),
                this.distanceToApple(direction),
                this.distanceToSelf(direction),
            ])
            .flat();
    }

    private distanceToWall(direction: Point): number {
        let distance = 1;
        let pos = this.head.add(direction);

        for (; this.board.contains(pos); pos = pos.add(direction)) {
            distance++;
        }

        return 1 / distance;
    }

    private distanceToApple(direction: Point): number {
        let distance = 1;
        let pos = this.head.add(direction);

        for (; this.board.contains(pos); pos = pos.add(direction)) {
            if (pos.equals(this.board.apple)) {
                return 1 / distance;
            }

            distance++;
        }

        return 0;
    }

    private distanceToSelf(direction: Point): number {
        let distance = 1;
        let pos = this.head.add(direction);

        for (; this.board.contains(pos); pos = pos.add(direction)) {
            if (this.body.some((point) => point.equals(pos))) {
                return 1 / distance;
            }

            distance++;
        }

        return 0;
    }

    private move(direction: Point): void {
        const newHead = this.head.add(direction);

        if (
            !this.board.contains(newHead) ||
            this.body.some((point) => point.equals(newHead)) ||
            this.timeRemaining <= 0
        ) {
            this.alive = false;
            return;
        }

        this.lifetime++;
        this.timeRemaining--;

        this.body.unshift(newHead);
        if (newHead.equals(this.board.apple)) {
            this.applesEaten++;
            this.timeRemaining += this.timePerApple;
            this.board.placeApple();
        } else {
            this.body.pop();
        }
    }

    public info(): string {
        return `Lifetime: ${this.lifetime} \nRemain: ${this.timeRemaining} \nApples: ${this.applesEaten} \nScore: ${this.score}`;
    }
}
