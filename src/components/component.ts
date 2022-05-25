export default class Component {
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
  }
}