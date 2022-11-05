import Component from "./components/component";

export default class BallComponent extends Component {
  public radius = 20;
  public x = this.canvas.width / 2;
  public y = this.canvas.height / 2;
  public dx = 2;
  public dy = -2;

  drawBall() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    this.ctx.fillStyle = "#0095DD";
    this.ctx.fill();
    this.ctx.closePath();
  }

  logic() {
    this.drawBall()
    if (this.x + this.dx > this.canvas.width - this.radius || this.x + this.dx < this.radius) {
      this.dx = -this.dx;
    }
    if (this.y + this.dy > this.canvas.height - this.radius || this.y + this.dy < this.radius) {
      this.dy = -this.dy;
    }

    this.x += this.dx;
    this.y += this.dy;
  }
}
