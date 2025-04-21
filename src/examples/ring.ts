import {Model} from '../model'

export const model = new Model(1000)
const x = model.param()
const y = model.param()

model.observe(function(params) {
  const dx = x(params) - 200
  const dy = y(params) - 200
  const dist = Math.sqrt(dx*dx + dy*dy)

  return {
    dist: "normal",
    mean: 50,
    sd: 5,
    value: dist
  }
})

model.draw(function(params, ctx) {
  ctx.beginPath()
  ctx.moveTo(x(params)+1,y(params)+1)
  ctx.lineTo(x(params),y(params))
  ctx.closePath()
  ctx.stroke()
})
