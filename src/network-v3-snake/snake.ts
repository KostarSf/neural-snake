import { Board } from "./board";
import { Brain } from "./brain";
import { Point } from "./math/point";

export class Snake {
    private readonly initialLength = 6;

    private _board: Board;
    private _brain: Brain;

    private body: Point[];

    public get board(): Board {
        return this._board;
    }

    public get brain(): Brain {
        return this._brain;
    }

    public get head(): Point {
        return this.body[0];
    }

    constructor(board: Board) {
        this._board = board;
        this._brain = new Brain();

        const pos = board.randomCell();
        this.body = new Array<Point>(this.initialLength).fill(pos);
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.body.forEach((point) => {
            this.board.drawCell(context, point, "white");
        });
    }

    public step(): void {
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

        if (!this.board.contains(newHead) || this.body.some((point) => point.equals(newHead))) {
            this.board.reset();
            return;
        }

        this.body.unshift(newHead);
        if (!newHead.equals(this.board.apple)) {
            this.body.pop();
        }
    }
}
