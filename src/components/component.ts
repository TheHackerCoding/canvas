import Engine from "./engine";

export default abstract class Component {
  public canvas: HTMLCanvasElement;
  //public offscreenCanvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public engine: Engine;
  public isChildComponent: Component | false = false
  constructor(x: Engine, parent?: Component) {
    this.engine = x
    this.canvas = x.canvas;
    //this.offscreenCanvas = x.offscreenCanvas;
    this.ctx = x.ctx;
    if (parent) {
      this.isChildComponent = parent
    }
    this.init()
  }

  init() { }

  logic() { }
}