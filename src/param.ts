
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
    return raw
}

export function logJacobian(param: Param, raw: number): number {
    return 0
}