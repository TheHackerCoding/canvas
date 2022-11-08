import { Component, Engine, View, Text, objLength } from "../../../src/index";


export default class UiComponent extends Component {
  public view: View;
  public text: Text;
  public text2: Text;
  public fps: Text
  public keys: Text
  constructor(x: Engine, y?: Component) {
    super(x, y)
    this.view = new View(x.ctx)
    this.text = this.view.text("hello")
    this.fps = this.view.text("fps")
    this.text2 = this.view.text(`(${this.engine?.getMousePos().x}, ${this.engine?.getMousePos().y})`)
    this.keys = this.view.text("keys")
    // this.view.text("bye2")
    // this.view.text("bye3")
  }

  logic() {
    if (this.engine?.pressed("r")) {
      this.text.config.content = "restart"
    }
    if (this.engine?.pressed("t")) {
      this.text.config.content = "tab"
    }
    this.text2.config.content = () => JSON.stringify(this.engine.getMousePos())
    this.keys.config.content = () => objLength(this.engine.keysDown)
    this.view.render()
    this.fps.config.content = this.engine?.fps as unknown as string
  }

  cleanUp(): void {
    // this.view.clear()
  }
}