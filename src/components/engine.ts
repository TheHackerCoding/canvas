import Component from "./component";
import keycode from "keycode";

export default class Engine {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public components: Component[] = [];
  public totalFrames: number = 0;
  public tempFrames: number = 0;
  public fpsTimes: number[] = [];
  public width: number;
  public height: number;
  public on: boolean = false;
  public fps: number = 0;
  public audio: AudioContext = new AudioContext();
  public mousePos: Position = {
    x: 0,
    y: 0,
  };
  public canvasPos: Position = {
    x: 0,
    y: 0,
  };
  public keysDown: {
    [key: number]: boolean;
  } = {};
  public isClicked: boolean = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.height = canvas.height;
    this.width = canvas.width;
    this.ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.canvasPos = {
      x: canvas.offsetLeft,
      y: canvas.offsetTop,
    };
    canvas.ondragstart = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      return false;
    };

    // do nothing in the event handler except canceling the event
    canvas.onselectstart = (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      return false;
    };

    addEventListener(
      "keydown",
      (key) => {
        this.keysDown[key.keyCode] = true;
        // alert(key)
      },
      false
    );

    addEventListener(
      "keyup",
      (key) => {
        delete this.keysDown[key.keyCode];
      },
      false
    );

    canvas.onmousedown = (e) => {
      this.isClicked = true;
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    };

    canvas.onmousemove = (e) => {
      if (this.isClicked) {
        this.isClicked = true;
      }
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    };

    canvas.onmouseup = (e) => {
      this.isClicked = false;
    };

    // canvas.on("click", function (e) {
    //   e.preventDefault();

    //   var mouse = {
    //     x: e.pageX - canvasPosition.x,
    //     y: e.pageY - canvasPosition.y,
    //   };

    //   //do something with mouse position here

    //   return false;
    // });
    // canvas.addEventListener
    // canvas.addEventListener('keypress', )
  }

  addComponent(component: Component) {
    // let comp =
    // component.import(this)
    this.components.push(component);
  }

  pressed(key: string): boolean {
    return this.keysDown[keycode(key)];
  }

  start() {
    this.on = true;
    // setTimeout(this.calculateFPS, 6);
    this.loop();
  }

  getMousePos(): Position {
    return this.mousePos;
  }

  showFPS() {
    // let { ctx, fps } = this;
    // let ctx = this.ctx;
    // let fps = this.fps;
    this.ctx.fillStyle = "Black";
    this.ctx.font = "normal 16pt Arial";
    this.ctx.fillText(this.fps + " fps", 10, 26);
  }

  calculateFPS(x: number) {
    while (this.fpsTimes.length > 0 && this.fpsTimes[0] <= x - 1000) {
      this.fpsTimes.shift();
    }
    this.fpsTimes.push(x);
    this.fps = this.fpsTimes.length;
  }

  showBorder() {
    this.ctx.fillRect(
      this.canvasPos.x,
      this.canvasPos.y,
      this.width,
      this.height
    );
  }

  loop() {
    // let { ctx, width, height, on, showFPS } = this;

    const _loop = (x: number) => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      // this.totalFrames += 1;
      logic();
      // this.components.filter((x) => x.logic())
      this.components.forEach((x) => x.logic())
      if (this.on) {
        this.calculateFPS(requestAnimationFrame(_loop));
      }
      // _loop()
    };

    const logic = () => {
      if (this.pressed("f")) {
        this.showFPS();
      }
      if (this.pressed("b")) {
        this.showBorder();
      }
      if (this.isClicked) {
        let mou = this.getMousePos();
        this.ctx.fillText("Clicked", mou.x, mou.y);
      }
    };

    requestAnimationFrame(_loop);
    // _loop()
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

interface Position {
  x: number;
  y: number;
}
