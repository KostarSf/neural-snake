export class Random {
    public static float(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static int(min: number, max: number): number {
        return Math.floor(Random.float(min, max));
    }

    public static gaussian(mean: number, std: number): number {
        let u = 0;
        let v = 0;
        while (u === 0) u = Math.random();
        while (v === 0) v = Math.random();
        const value = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
        return value * std + mean;
    }
}
