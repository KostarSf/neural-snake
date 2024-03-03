import { Snake } from "../snake";
import { Brain } from "./brain";

export class Breed {
    private readonly scores: [Brain, score: number][];
    private readonly totalScore: number;

    constructor(snakes: Snake[]) {
        this.scores = snakes.map((snake) => [snake.brain, snake.score] as const);
        this.scores.sort(([, a], [, b]) => b - a);

        this.totalScore = this.scores.reduce((acc, [, score]) => acc + score, 0);
    }

    public topN(n: number): Brain[] {
        return this.scores.slice(0, n).map(([brain]) => brain);
    }

    public best(): Brain {
        return this.scores[0][0];
    }

    public spawn(): Brain {
        return Brain.cross(this.chooseParent(), this.chooseParent());
    }

    private chooseParent(): Brain {
        const randomScore = Math.random() * this.totalScore;
        let runningScore = 0;

        for (const [brain, score] of this.scores) {
            runningScore += score;

            if (runningScore >= randomScore) {
                return brain;
            }
        }

        return this.scores[this.scores.length - 1][0];
    }
}
