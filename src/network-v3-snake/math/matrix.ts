import { Random } from "./random";

export class Matrix {
    public readonly rows: number;
    public readonly columns: number;

    public readonly cells: number[][];

    constructor(rows: number, columns: number);
    constructor(cells: number[][]);
    constructor(rowsOrCells: number | number[][], columns?: number) {
        if (typeof rowsOrCells === "number") {
            this.rows = rowsOrCells;
            this.columns = columns!;
            this.cells = new Array<number[]>(rowsOrCells)
                .fill(0 as any as number[])
                .map(() => new Array<number>(columns!).fill(0));
        } else {
            this.rows = rowsOrCells.length;
            this.columns = rowsOrCells[0].length;
            this.cells = rowsOrCells;
        }
    }

    public static random(rows: number, columns: number): Matrix {
        return new Matrix(rows, columns).map(() => Random.float(-1, 1));
    }

    public map(callback: (value: number, row: number, column: number) => number): Matrix {
        const cells = this.cells.map((row, i) => row.map((value, j) => callback(value, i, j)));
        return new Matrix(cells);
    }

    public get(row: number, column: number): number {
        return this.cells[row][column];
    }

    public set(row: number, column: number, value: number): void {
        this.cells[row][column] = value;
    }

    public mult(matrix: Matrix): Matrix {
        if (this.columns !== matrix.rows) {
            throw new Error("Invalid matrix dimensions");
        }

        return new Matrix(this.rows, matrix.columns).map((_, i, j) => {
            let sum = 0;
            for (let k = 0; k < this.columns; k++) {
                sum += this.get(i, k) * matrix.get(k, j);
            }
            return sum;
        });
    }

    public cross(matrix: Matrix): Matrix {
        if (this.rows !== matrix.rows || this.columns !== matrix.columns) {
            throw new Error("Invalid matrix dimensions");
        }

        return this.map((value, i, j) => value * matrix.get(i, j));
    }

    public static geneticCross(a: Matrix, b: Matrix, mutationRate: number): Matrix {
        if (a.rows !== b.rows || a.columns !== b.columns) {
            throw new Error("Invalid matrix dimensions");
        }

        return a.map((value, i, j) => {
            if (Math.random() > 0.5) {
                value = b.get(i, j);
            }

            if (Math.random() < mutationRate) {
                value = Math.max(-1, Math.min(1, value + Random.gaussian(0, 1)));
            }

            return value;
        });
    }

    public geneticCross(matrix: Matrix, mutationRate: number): Matrix {
        return Matrix.geneticCross(this, matrix, mutationRate);
    }

    public static column(vector: number[]): Matrix {
        return new Matrix(vector.length, 1).map((_, i) => vector[i]);
    }

    public flat(): number[] {
        return this.cells.flat();
    }

    public toJSON(): number[][] {
        return this.cells;
    }
}
