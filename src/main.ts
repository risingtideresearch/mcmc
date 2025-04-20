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

model.observe(function(params) {
  return {
    dist: "normal",
    mean: 250,
    sd: 50,
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

let done = false

function redraw() {
  model.drawSamples(canvas, 1000)
  if(!done)
    window.setTimeout(redraw, 50)
}
window.setTimeout(redraw, 100)
window.addEventListener("keydown", function(event) {
  done = true
})