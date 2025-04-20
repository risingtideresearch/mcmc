
export interface UnboundedParam {
    id: number
    type: "unbounded"
}

export interface PositiveParam {
    id: number
    type: "positive"
}

export interface BoundedParam {
    id: number
    type: "bounded"
    min: number
    max: number
}

export type Param = UnboundedParam | PositiveParam | BoundedParam

export function transform(param: Param, raw: number): number {
    switch(param.type) {
        case "unbounded":
            return raw
        case "positive":
            return Math.exp(raw)
        case "bounded":
            const ex = Math.exp(raw)
            const sigmoid = ex / (1.0 + ex)
            return sigmoid * (param.max - param.min) + param.min
    }
}

export function logJacobian(param: Param, raw: number): number {
    switch(param.type) {
        case "unbounded":
            return 0
        case "positive":
            return raw
        case "bounded":
            const ex = Math.exp(raw)
            const sigmoid = ex / (1.0 + ex)
            return Math.log(sigmoid) + Math.log(1.0 - sigmoid)  + Math.log(param.max - param.min)
    }
}