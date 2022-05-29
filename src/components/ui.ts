// ui -> window -> widgets
class UI {
  public windows: Window[] = []
  constructor(public ctx: CanvasRenderingContext2D) { }

  addWindow() {
    let win = new Window()
  }
}

class Window {
  constructor(public name: string, public width: number, public height: number) { }
}

export {
  UI
}