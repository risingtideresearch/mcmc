import {Distribution, logp} from './dist'
import { Param, BoundedParam, UnboundedParam, PositiveParam, logJacobian, transform } from './param'
import {Walkers, init, steps, sample} from './emcee'

type ParamFn = (params: number[]) => number

function paramFn(param: Param): ParamFn {
    function value(params: number[]): number {
        const raw = params[param.id]
        return transform(param, raw)
    }
    return value
}

type DistFn = (params: number[]) => Distribution 

type CanvasFn = (params: number[], ctx: CanvasRenderingContext2D) => void

export class Model {
    params: Param[] = []
    distFns: DistFn[] = []
    canvasFns: CanvasFn[] = []
    walkers?: Walkers
    samples: number

    constructor(samples: number) {
        this.samples = samples
    }

    param(): ParamFn {
        const param: UnboundedParam = {
            id: this.params.length,
            type: "unbounded"
        }
        this.params.push(param)
        return paramFn(param)
    }

    posParam(): ParamFn {
        const param: PositiveParam = {
            id: this.params.length,
            type: "positive"
        }
        this.params.push(param)
        return paramFn(param)
    }

    boundedParam(min: number, max: number): ParamFn {
        const param: BoundedParam = {
            id: this.params.length,
            type: "bounded",
            min, max
        }
        this.params.push(param)
        return paramFn(param)
    }

    observe(fn: DistFn) {
        this.distFns.push(fn)
    }

    draw(fn: CanvasFn) {
        this.canvasFns.push(fn)
    }

    logp(params: number[]) {
        let total = 0.0
        this.params.forEach((p) => total += logJacobian(p, params[p.id]))
        this.distFns.forEach((d) => total += logp(d(params)))
        return total
    }

    drawOn(params: number[], ctx: CanvasRenderingContext2D) {
        this.canvasFns.forEach((f) => f(params, ctx))
    }

    initWalkers(walkers: number) {
        const self = this
        this.walkers = init(this.params.length, walkers, function(params: number[]) {
            return self.logp(params)
        })
    }

    drawSamples(canvas: HTMLCanvasElement) {
        const self = this
        if(this.walkers) {
            console.log(steps(this.walkers, 1))
            const ctx = canvas.getContext("2d")!
            ctx.fillStyle = "white"
            ctx.fillRect(0, 0, 400, 400)
            ctx.strokeStyle = "black"
            ctx.strokeRect(0,0,400,400)
            sample(this.walkers, this.samples).forEach(function(params) {
                self.drawOn(params, ctx)
            })
        }
    }
}