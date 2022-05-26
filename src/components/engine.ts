import Component from "./component";
import hotkeys from 'hotkeys-js';

export default class Engine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public components: Component[];
  public width: number;
  public height: number;
  public on: boolean = false;
  public fps: number = 0;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.height = canvas.height;
    this.width = canvas.width;
    // canvas.addEventListener
    // canvas.addEventListener('keypress', )
  }

  addComponent(component: Component) {
    // let comp =
    this.components.push(component);
  }

  start() {
    this.on = true;
    this.loop()
  }

  showFPS() {
    let { ctx, fps } = this;
    ctx.fillStyle = "Black";
    ctx.font = "normal 16pt Arial";
    ctx.fillText(fps + " fps", 10, 26);
  }

  loop() {
    let { ctx, width, height, on, showFPS } = this;

    const _loop = () => {
      showFPS()
      ctx.clearRect(0, 0, width, height);
      if (on) requestAnimationFrame(_loop)
    }
    
    //Clear screen
    // ctx.canvas.onkeydown((e) => {
    //   alert(e.code)
    // })
    // canvas.addEventListener("keypress", (e) => {
    //   console.log(e)
    //   alert(e.code)
    // }, false)
    // hotkeys('f', () => {
    //   // alert("pressed")
    //   this.showFPS()
    // })
  }
}

// oops i accidentally make a whole event listener tracker
// type Events = {
//   [event in keyof HTMLElementEventMap]: {
//     listeners: {
//       listener: Engine | Component,
//       code: ()
//     }[]
//   }
// };

// type Events = {
//   [event in keyof HTMLElementEventMap]: {
    
//   }
// };
