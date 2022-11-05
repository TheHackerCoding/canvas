import cuid from 'cuid';
import { Position } from './engine';


// View -> Widget

export abstract class Widget {
  public config: WidgetSettings<unknown> = {};

  constructor(public ctx: CanvasRenderingContext2D, public origin: Position = { x: 0, y: 0 }) { }

  render() { }

  spaceUsed(): number { return 0 }
}

export class View {
  public widgets: Widget[] = [];
  public config: ViewConfig = {
    padding: 10,
  }

  constructor(public ctx: CanvasRenderingContext2D) { }

  public alignment: Alignment = {
    horizontal: 'left',
    vertical: 'left',
  }

  convertAlignment(x: Alignment): Alignment {
    let y: Alignment = {
      vertical: 0,
      horizontal: 0
    }
    const convert = (x: string): number => {
      let y = 0
      switch (x) {
        case 'center':
          y = this.ctx.canvas.width / 2
          break;
        case 'left':
          // need to add a little bit of padding
          // y = 0 
          y = (2 / 100) * this.ctx.canvas.height
          break;
        case 'right':
          y = this.ctx.canvas.width
          break;
        default:
          y = 0
      }
      console.log("convert:", y)
      return y
    }

    // if (typeof x.horizontal === 'string') {
    //   y.horizontal = convert(x.horizontal)
    // }
    typeof x.horizontal === 'string' ? y.horizontal = convert(x.horizontal) : y.horizontal = x.horizontal
    typeof x.vertical === 'string' ? y.vertical = convert(x.vertical) : y.vertical = x.vertical
    return y
  }

  calculateSpace() {
    if (this.widgets.length === 0) {
      // console.log("nothing here");

      // return this.convertAlignment(this.alignment).vertical
      // add some spacing for the first thing 
      // 2.5% of canvas height
      return (2.5 / 100) * this.ctx.canvas.height;
    } else {
      // console.log("something here");
      let x = 0
      // this.widgets.forEach((y) => {
      //   x += y.spaceUsed() + this.config.padding
      // })
      // var arrayLength = this.widgets.length;
      // for (var i = 0; i < arrayLength; i++) {
      //   x += this.widgets[i].spaceUsed() + this.config.padding
      // }
      // alert(`x: ${x}`)
      let last = this.widgets[this.widgets.length - 1].origin.y
      x = last + this.config.padding
      return x
    }
  }

  text(x: string): Text {
    // alert("making text")
    let space = this.calculateSpace()
    // alert(`space: ${space}` )
    let ali = this.convertAlignment(this.alignment)
    // console.log(ali)
    // alert(JSON.stringify(ali))
    let y = new Text(this.ctx, {
      x: ali.horizontal as number,
      y: ali.vertical as number + space + this.config.padding
    }, x)
    this.widgets.push(y)
    return y
  }

  clear() {
    this.widgets = []
  }

  render() {
    this.widgets.forEach(widget => widget.render())
    var arrayLength = this.widgets.length;
    // for (var i = 0; i < arrayLength; i++) {
    //   this.widgets[i].render()
    //   //Do something
    // }
  }
}

export class Text extends Widget {
  public config: WidgetSettings<TextConfig>;
  constructor(public ctx: CanvasRenderingContext2D, public origin: Position, content: string) {
    super(ctx, origin);
    this.config = {
      font: "normal 16pt Arial",
      stroke: false,
      id: `text-${cuid()}`,
      content,
      enabled: true,
      center: false,
    }
  }

  render() {
    if (this.config.enabled) {
      // alert("rendering")
      this.ctx.font = this.config.font as string
      let shift = 0
      if (this.config.center) {
        let x = this.calculateSpace()
        shift = x.width / 2
      }
      let res = typeof this.config.content === 'function' ? this.config.content() : this.config.content
      if (!this.config.stroke) {
        this.ctx.fillText(res as string, this.origin.x - shift, this.origin.y)
        // console.log(this.origin.x, this.origin.y)
      } else {
        this.ctx.strokeText(res as string, this.origin.x - shift, this.origin.y)
      }
    }
  }

  calculateSpace(): TextMetrics {
    return this.ctx.measureText(this.config.content as string)
  }

  spaceUsed(): number {
    // reinforce font size
    this.ctx.font = this.config.font as string
    let metrics = this.calculateSpace()
    return metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
  }
}

interface TextConfig {
  font: string;
  stroke: boolean;
  content: string | (() => unknown);
  center: boolean;
}

interface _WidgetSettings {
  size: number;
  id: string;
  enabled: boolean;
}

type WidgetSettings<T> = Partial<_WidgetSettings> & Partial<T>;

interface Alignment {
  vertical: AlignmentPositions | number,
  horizontal: AlignmentPositions | number
}

type AlignmentPositions = "left" | "center" | "right"

interface ViewConfig {
  padding: number
}