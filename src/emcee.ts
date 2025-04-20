export interface Walkers {
    parameters: number
    count: number
    state: Float64Array,
    scratch: number[]
    logp: (params: number[]) => number
}

export function init(parameters: number, count: number, logp: (params: number[]) => number): Walkers {
    const state = new Float64Array(count * (parameters + 1))
    const scratch = new Array(parameters)

    const walkers = {
        parameters, count, logp,
        state, scratch
    }

    for(let i = 0; i < count; i++) {
        for(let j = 0; j < parameters; j++) 
           scratch[j] = randomGaussian()
        updateFromScratch(walkers, i, logp(scratch))
   }

   return walkers
}

function updateFromScratch(walkers: Walkers, idx: number, logp: number) {
    const base = idx * (walkers.parameters + 1)
    const state = walkers.state
    const scratch = walkers.scratch
    for(let i = 0; i < walkers.parameters; i++)
        state[base+i] = scratch[i]
    walkers.state[base + walkers.parameters] = logp
}

function readLogp(walkers: Walkers, idx: number): number {
    return walkers.state[(idx+1) * (walkers.parameters + 1) - 1]
}


function randomGaussian(): number {
    const u1 = 1.0 - Math.random()
    const u2 = Math.random()
    return Math.sqrt(Math.log(u1) * -2) *
        Math.cos(u2 * Math.PI * 2)
}

function randomZ(): number {
    const x = Math.random() + 1
    return x*x / 2
}

function randomIndex(walkers: Walkers): number {
    return Math.floor(Math.random() * walkers.count)
}

function step(walkers: Walkers, srcIdx: number): boolean {
    let targetIdx = randomIndex(walkers)
    while(targetIdx == srcIdx)
        targetIdx = randomIndex(walkers)

    const z = randomZ()
    stretchMove(walkers, srcIdx, targetIdx, z)
    const oldLogp = readLogp(walkers, srcIdx)
    const newLogp = walkers.logp(walkers.scratch)
    if(accept(walkers, oldLogp, newLogp, z)) {
        updateFromScratch(walkers, srcIdx, newLogp)
        return true
    } else {
        return false
    }
}

function accept(walkers: Walkers, oldLogp: number, newLogp: number, z: number): boolean {
    if(newLogp >= oldLogp)
        return true
    const adjust = Math.log(z) * (walkers.parameters - 1)
    const q = newLogp - oldLogp + adjust
    return Math.log(Math.random()) < q
}

function stretchMove(walkers: Walkers, srcIdx: number, targetIdx: number, z: number) {
    const state = walkers.state
    const scratch = walkers.scratch
    const parameters = walkers.parameters
    const srcBase = srcIdx * (parameters + 1)
    const targetBase = targetIdx * (parameters + 1)
    for(let i = 0; i < parameters; i++) {
        const a = state[srcBase + i]
        const b = state[targetBase + i]
        scratch[i] = a + ((b-a)*z)
    }
}
export function steps(walkers: Walkers, epochs: number): number {
    let accepted = 0
    for(let i = 0; i < epochs; i++) {
        for(let j = 0; j < walkers.count; j++) {
            if(step(walkers, j))
                accepted += 1
        }
    }
    return accepted / (epochs*walkers.count)
}

export function sample(walkers: Walkers, n: number): Array<Array<number>> {
    const result: Array<Array<number>> = []
    for(let i = 0; i < n; i++) {
        const p: Array<number> = []
        for(let j = 0; j < walkers.parameters; j++) {
            p[j] = walkers.state[(i*(walkers.parameters+1))+j]
        }
        result.push(p)
    }
    return result
}