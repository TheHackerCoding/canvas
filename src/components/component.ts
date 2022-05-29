import Engine from "./engine";

export default abstract class Component {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  public engine: Engine;
  constructor(x: Engine) {
    this.engine = x
    this.canvas = x.canvas;
    this.ctx = x.ctx;
  }
  
  logic() {}
}