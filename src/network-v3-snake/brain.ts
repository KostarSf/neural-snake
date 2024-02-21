import { Matrix } from "./math/matrix";

export class Brain {
    public readonly inputSize: number = 24;
    public readonly hiddenSize: number = 12;
    public readonly outputSize: number = 4;

    private inputToHidden: Matrix = Matrix.random(this.hiddenSize, this.inputSize + 1);
    private hiddenToOutput: Matrix = Matrix.random(this.outputSize, this.hiddenSize + 1);

    public think(inputs: number[]): number[] {
        const inputsWithBias = [...inputs, 1];
        const sums = this.inputToHidden.mult(Matrix.column(inputsWithBias)).flat();
        const hidden = sums.map(Brain.ReLU);

        const hiddenWithBias = [...hidden, 1];
        const output = this.hiddenToOutput.mult(Matrix.column(hiddenWithBias)).flat();

        return output;
    }

    private static ReLU(x: number): number {
        return Math.max(0, x);
    }
}
