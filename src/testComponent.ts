import Component from "./components/component";

export default class TestComponent extends Component {
  logic() {
    if (this.engine?.isClicked) {
      let mou = this.engine?.getMousePos();
      this.ctx.fillText(`(${mou.x}, ${mou.y})`, mou.x +100, mou.y +100);
    }
  }
}