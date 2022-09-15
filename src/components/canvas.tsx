import { onError, onMount } from "solid-js";
import Raytracking from "../raytracingComponent";
import TestComponent from "../testComponent";
import Engine from "./engine";

const Canvas = ({ width, height }: { width: number, height: number }) => {
  onMount(() => {
    const canvas = document.querySelector('canvas')!;
    // const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    let engine = new Engine(canvas, {
      export: true
    })
    //let test = new TestComponent(engine)
    //let ray = new Raytracking(engine)
    //engine.addComponent(ray)
    //engine.addComponent(test)
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
