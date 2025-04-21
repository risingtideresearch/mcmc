import './style.css'
import {model} from './examples/semiring'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <canvas id="canvas" width="400" height="400">
    </canvas>
  </div>
`

const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!
model.initWalkers(10000)

let done = false

function redraw() {
  model.drawSamples(canvas)
  if(!done)
    window.setTimeout(redraw, 50)
}
window.setTimeout(redraw, 100)
window.addEventListener("keydown", function(event) {
  done = true
})