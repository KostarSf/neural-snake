export class Point {
    public static readonly zero = new Point(0, 0);

    public static readonly up = new Point(0, -1);
    public static readonly down = new Point(0, 1);
    public static readonly left = new Point(-1, 0);
    public static readonly right = new Point(1, 0);
    public static readonly upLeft = new Point(-1, -1);
    public static readonly upRight = new Point(1, -1);
    public static readonly downLeft = new Point(-1, 1);
    public static readonly downRight = new Point(1, 1);

    public static get fourDirections(): Point[] {
        return [Point.up, Point.down, Point.left, Point.right];
    }

    public static get eightDirections(): Point[] {
        return [
            Point.up,
            Point.upRight,
            Point.right,
            Point.downRight,
            Point.down,
            Point.downLeft,
            Point.left,
            Point.upLeft,
        ];
    }

    constructor(public x: number, public y: number) {}

    public add(point: Point): Point {
        return new Point(this.x + point.x, this.y + point.y);
    }

    public sub(point: Point): Point {
        return new Point(this.x - point.x, this.y - point.y);
    }

    public scale(point: Point): Point {
        return new Point(this.x * point.x, this.y * point.y);
    }

    public equals(point: Point): boolean {
        return this.x === point.x && this.y === point.y;
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }
}
