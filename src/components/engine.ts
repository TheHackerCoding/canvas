import type Component from "./component";
import keycode from "keycode";
import { objLength } from "../utils";

const PREFIX = "eng-"

const newStorage = (location: Storage): Dictionary<string> => {
  let loc: Dictionary<string> = {}
  for (const [key, value] of Object.entries(location)) {
    if (key.startsWith(PREFIX)) {
      loc[key] = value;
    }
  };
  loc = new Proxy(loc, {
    get(_target, prop) {
      return location.get(prop)
    },
    set(_target, prop, val) {
      location.set(prop, val)
      return true
    },
    deleteProperty(_target, p) {
      location.delete(p)
      return true
    },
    has(_target, prop) {
      return location.has(prop)
    }
  });
  return loc
}

export default class Engine {
  // oops sadly this is needed
  public layers: Dictionary<HTMLCanvasElement> = {};
  public components: Component[] = [];
  public totalFrames: number = 0;
  public oldTimestamp: number = 0;
  public secondsPassed: number = 0;
  public on: boolean = false;
  public fps: number = 0;
  public audio: AudioContext;
  public mousePos: Position = {
    x: 0,
    y: 0,
  };
  public canvasPos: Position = {
    x: 0,
    y: 0,
  };
  public keysDown: Dictionary<boolean> = {};
  public isClicked: boolean = false;
  public localState: Dictionary<unknown> = {};
  public engineState: Dictionary<string> = newStorage(localStorage);
  public cacheState: Dictionary<string> = newStorage(sessionStorage);

  constructor(
    public canvas: HTMLCanvasElement,
    config?: EngineConfig,
    public height = canvas.height,
    public width = canvas.width,
    //public ctx = canvas.getContext("2d", { alpha: false })!
    public ctx = canvas.getContext("2d")!,
  ) {
    if (config) {
      if (config.export) {
        (config.export) ? window.engine = this : undefined
      }
    }
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

    canvas.addEventListener("mousemove", (e) => {
      // if clicked then STAY CLICKED
      this.isClicked = this.isClicked;
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    });

    canvas.addEventListener("pointermove", (e) => {
      this.isClicked = this.isClicked;
      this.mousePos = {
        x: e.pageX - this.canvasPos.x,
        y: e.pageY - this.canvasPos.y,
      };
    });

    canvas.addEventListener("mouseup", () => {
      this.isClicked = false;
    });

    // uhhh
    this.audio = new AudioContext();
  }

  createCanvas(x: string): HTMLCanvasElement {
    let canvas = document.createElement("canvas");
    canvas.width = this.canvas.width;
    canvas.height = this.canvas.height;
    this.layers[x] = canvas;
    return canvas;
  }

  addComponent(component: Sinural<Component>) {
    // let comp =
    // component.import(this)
    if (component.constructor === Array) {
      this.components = this.components.concat(component);
    } else {
      this.components.push(component as Component);
    }
  }

  pressed(key: string): boolean {
    return this.keysDown[keycode(key)];
  }

  start() {
    this.on = true;
    // setTimeout(this.calculateFPS, 6);
    console.log(this.oldTimestamp)
    this.oldTimestamp = 0
    window.requestAnimationFrame(this.gameLoop)
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
    this.ctx.fillText(
      `${objLength(this.engineState)} things in engine state`,
      10,
      66
    );
  }

  lockPointer() {
    this.canvas.requestPointerLock();
  }

  fullscreen() {
    this.canvas.requestFullscreen();
  }

  showBorder() {
    this.ctx.strokeRect(0, 0, this.width, this.height);
  }

  gameLoop = (timestamp: number) => {
    //this.oldTimestamp = 0
    //console.log("timestamp" + this.oldTimestamp)
    this.secondsPassed = (timestamp - this.oldTimestamp) / 1000;
    this.oldTimestamp = timestamp;
    this.fps = Math.round(1 / this.secondsPassed)
    this.ctx.clearRect(0, 0, this.width, this.height);
    // this.totalFrames += 1;
    this.logic();
    // this.components.filter((x) => x.logic())
    //this.components.forEach((x) => x.logic());
    if (this.on) {
      window.requestAnimationFrame(this.gameLoop)
    }
  }

  logic() {
    if (this.pressed("f")) {
      this.showFPS();
    }
    if (this.pressed("b")) {
      this.showBorder();
    }
    if (this.pressed("d")) {
      this.showDebug();
    }
    if (this.pressed("c")) {
      //this.canvas.style.cursor = "pointer"
      this.fullscreen();
    }
    if (this.pressed("s")) {
      this.ctx.font = '10px sans-serif'
    }
    if (this.isClicked) {
      let mou = this.getMousePos();
      this.ctx.fillText("Clicked", mou.x, mou.y);
    }
  }
}

interface Position {
  x: number;
  y: number;
}

type Dictionary<V> = {
  [key in Key]: V;
};

type Key = string | number | symbol;

interface EngineConfig {
  export?: boolean
}

declare global {
  interface Window {
    engine?: Engine
  }
}

// single or plural (weird word mix)
type Sinural<T> = T | T[]