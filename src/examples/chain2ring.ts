import {Model} from '../model'

export const model = new Model(5)
const angle1 = model.boundedParam(0, 2*Math.PI)
const angle2 = model.boundedParam(0, 2*Math.PI)
const length = 100

function pt1(params: number[]): {x: number, y: number} {
    return {
        x: 200 + Math.cos(angle1(params)) * length,
        y: 200 + Math.sin(angle1(params)) * length
    }
}

function pt2(params: number[]): {x: number, y: number} {
    const p1 = pt1(params)
    return {
        x: p1.x + Math.cos(angle2(params)) * length,
        y: p1.y + Math.sin(angle2(params)) * length
    }
}

model.observe(function(params) {
  const p2 = pt2(params)
  const dx = p2.x - 200
  const dy = p2.y - 200
  const dist = Math.sqrt(dx*dx + dy*dy)

  return {
    dist: "normal",
    mean: 100,
    sd: 10,
    value: dist
  }
})

model.draw(function(params, ctx) {

    const p1 = pt1(params)
    const p2 = pt2(params)

  ctx.beginPath()
  ctx.moveTo(200, 200)
  ctx.lineTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
})
