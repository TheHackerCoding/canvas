import Component from "./component";
import keycode from "keycode";
import { objLength } from "../utils";

export default class Engine {
  public components: Component[] = [];
  public totalFrames: number = 0;
  public fpsTimes: number[] = [];
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
  public state: {
    [key: string]: unknown
  } = {}

  constructor(
    public canvas: HTMLCanvasElement,
    public height = canvas.height,
    public width = canvas.width,
    public ctx = canvas.getContext("2d")!
  ) {
    this.canvasPos = {
      x: canvas.offsetLeft,
      y: canvas.offsetTop,
    };
    canvas.addEventListener("ondragstart", (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      return false;
    });

    // do nothing in the event handler except canceling the event
    canvas.addEventListener("onselectstart", (e) => {
      if (e && e.preventDefault) {
        e.preventDefault();
      }
      if (e && e.stopPropagation) {
        e.stopPropagation();
      }
      return false;
    });

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

    canvas.addEventListener("mousedown", (e) => {
      this.isClicked = true;
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    });

    // canvas.onmousedown = (e) => {
    //   this.isClicked = true;
    //   this.mousePos = {
    //     x: e.pageX - this.canvasPos.x,
    //     y: e.pageY - this.canvasPos.y,
    //   };
    // };

    canvas.addEventListener("mousemove", (e) => {
      // if clicked then STAY CLICKED
      this.isClicked = this.isClicked
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    });

    canvas.addEventListener("pointermove", (e) => {
      this.isClicked = this.isClicked
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    });

    canvas.addEventListener("mouseup", () => {
      this.isClicked = false;
    });

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

  showDebug() {
    this.ctx.fillText(`${this.width} x ${this.height}`, 10, 36);
    this.ctx.fillText(`frames: ${this.totalFrames}`, 10, 46);
    this.ctx.fillText(`${objLength(this.keysDown)} keys pressed`, 10, 56);
    this.ctx.fillText(`${objLength(this.state)} things in engine state`, 10, 66);
  }

  lockPointer() {
    this.canvas.requestPointerLock()
  }

  fullscreen() {
    this.canvas.requestFullscreen()
  }

  calculateFPS(x: number) {
    this.totalFrames += 1
    while (this.fpsTimes.length > 0 && this.fpsTimes[0] <= x - 1000) {
      this.fpsTimes.shift();
    }
    this.fpsTimes.push(x);
    this.fps = this.fpsTimes.length;
  }

  showBorder() {
    this.ctx.strokeRect(
      0,
      0,
      this.width,
      this.height
    );
  }

  loop() {

    const _loop = (x: number) => {
      this.ctx.clearRect(0, 0, this.width, this.height);
      // this.totalFrames += 1;
      logic();
      // this.components.filter((x) => x.logic())
      this.components.forEach((x) => x.logic());
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
      if (this.pressed("d")) {
        this.showDebug()
      }
      if (this.pressed("c")) {
        //this.canvas.style.cursor = "pointer"
        this.fullscreen()
      }
      if (this.isClicked) {
        let mou = this.getMousePos();
        this.ctx.fillText("Clicked", mou.x, mou.y);
      }
    };

    requestAnimationFrame(_loop);
  }
}

interface Position {
  x: number;
  y: number;
}
