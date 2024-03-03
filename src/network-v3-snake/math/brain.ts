import { Matrix } from "./matrix";

export class Brain {
    public static readonly inputSize: number = 24;
    public static readonly hiddenSize: number = 12;
    public static readonly outputSize: number = 4;

    public static readonly mutationRate: number = 0.02;

    private inputToHidden: Matrix;
    private hiddenToOutput: Matrix;

    constructor(inputToHidden: Matrix, hiddenToOutput: Matrix) {
        this.inputToHidden = inputToHidden;
        this.hiddenToOutput = hiddenToOutput;
    }

    public static random(): Brain {
        return new Brain(
            Matrix.random(Brain.hiddenSize, Brain.inputSize + 1),
            Matrix.random(Brain.outputSize, Brain.hiddenSize + 1)
        );
    }

    public think(inputs: number[]): number[] {
        const inputsWithBias = [...inputs, 1];
        const sums = this.inputToHidden.mult(Matrix.column(inputsWithBias)).flat();
        const hidden = sums.map(Brain.swish);

        const hiddenWithBias = [...hidden, 1];
        const output = this.hiddenToOutput.mult(Matrix.column(hiddenWithBias)).flat();

        return output;
    }

    private static ReLU(x: number): number {
        return Math.max(0, x);
    }

    private static tanh(x: number): number {
        return Math.tanh(x);
    }

    private static leakyReLU(x: number): number {
        return Math.max(0.01 * x, x);
    }

    private static sigmoid(x: number): number {
        return 1 / (1 + Math.exp(-x));
    }

    private static swish(x: number): number {
        return x / (1 + Math.exp(-x));
    }

    private static softmax(x: number[]): number[] {
        const max = Math.max(...x);
        const exp = x.map((xi) => Math.exp(xi - max));
        const sum = exp.reduce((a, b) => a + b, 0);

        return exp.map((xi) => xi / sum);
    }

    public static cross(a: Brain, b: Brain): Brain {
        return new Brain(
            Matrix.geneticCross(a.inputToHidden, b.inputToHidden, Brain.mutationRate),
            Matrix.geneticCross(a.hiddenToOutput, b.hiddenToOutput, Brain.mutationRate)
        );
    }
}
