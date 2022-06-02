import Component from "./components/component";

export default class TestComponent extends Component {
  logic() {
    // this.ctx.fillStyle = "blue";
    // this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    // this.ctx.fillStyle = "blue";

    if (this.engine?.isClicked) {
      let mou = this.engine?.getMousePos();
      this.ctx.fillText(`(${mou.x}, ${mou.y})`, mou.x + 100, mou.y + 100);
    }
    
  }
}
