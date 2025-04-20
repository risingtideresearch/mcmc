import {Model} from '../model'

export const model = new Model()
const x = model.param()
const y = model.param()

model.observe(function(params) {
  return {
    dist: "normal",
    mean: 200,
    sd: 50,
    value: x(params)
  }
})

model.observe(function(params) {
  return {
    dist: "normal",
    mean: 200,
    sd: 15,
    value: y(params)
  }
})

model.draw(function(params, ctx) {
  ctx.strokeStyle = "blue"
  ctx.beginPath()
  ctx.moveTo(x(params)+1,y(params)+1)
  ctx.lineTo(x(params),y(params))
  ctx.closePath()
  ctx.stroke()
})
