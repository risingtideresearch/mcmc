import './style.css'
import {Model} from './model'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="400" height="400">
    </canvas>
  </div>
`

const model = new Model()
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
    sd: 10,
    value: y(params)
  }
})


model.draw(function(params, ctx) {
  ctx.beginPath()
  ctx.moveTo(x(params)+1,y(params)+1)
  ctx.lineTo(x(params),y(params))
  ctx.closePath()
  ctx.stroke()
})

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
model.initWalkers(10000)

let epochs = 0

function redraw() {
  if(epochs < 50) {
    model.drawSamples(canvas, 1000)
    window.setTimeout(redraw, 50)
    epochs += 1
  }
}
window.setTimeout(redraw, 100)