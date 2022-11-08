import { onError, onMount } from "solid-js";
import BallComponent from "../ballComponent";
import Raytracking from "../raytracingComponent";
import TestComponent from "../testComponent";
import UiComponent from "../uiComponent"
import { Engine } from "../../../../src/index";

const Canvas = ({ width, height }: { width: number, height: number }) => {
  onMount(() => {
    const canvas = document.querySelector('canvas')!;
    // const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let engine = new Engine(canvas, {
      export: true
    })
    //let test = new TestComponent(engine)
    //let ray = new Raytracking(engine)
    let ui = new UiComponent(engine)
    let ball = new BallComponent(engine)
    engine.addComponent(ball)
    //engine.addComponent(ray)
    //engine.addComponent(test)
    engine.addComponent(ui)
    try {
      engine.start()
      console.log("engine started")
    } catch (e: any) {
      alert(e + `at ${e.stack}`)
      console.error(e)
    }
  })

  onError((e) => {
    alert(e)
  })

  return (
    <>
      <canvas width={width} height={height}>
        Game canvas
      </canvas>
    </>
  )


}

export default Canvas
