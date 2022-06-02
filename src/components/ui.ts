// MainView -> View -> Widgets

class MainView {
  public views: View[] = [];

  constructor() { }
}


class View {
  constructor(public ctx: CanvasRenderingContext2D) { }

  logic(x: (y: View) => void): void {
    x(this)
  }

  add(widget: Widget) {
    let x = 
  }

  addText(text: string): void {

  }
}

abstract class Widget {
  public config: {} = {}
}

class Text extends Widget {

}

export {
  MainView,
  View,
  Widget
}