
interface NormalDistribution {
    dist: "normal"
    value: number
    mean: number
    sd: number
}

export type Distribution = NormalDistribution

export function logp(dist: Distribution): number {
    switch(dist.dist) {
        case "normal":
            const d = dist.value - dist.mean
            const d2 = d*d
            const sd2 = dist.sd * dist.sd
            const log2pisd2 = Math.log(sd2 * 2.0 * Math.PI)
            return (d2 / (-2.0 * sd2)) - (0.5 * log2pisd2)
    }
}