import { Dictionary, newStorage } from './engine';
import { Axios } from "axios"

type Data = string | number | boolean
type MetadataType = "image"

interface Metadata {
  data: Data,
  type: MetadataType,
}

export default class Assets {
  // stuff in here is for cached stuff?
  private assets: Dictionary<Metadata> = newStorage(localStorage, "asset.")
  //  private client: Axios
  //  constructor() {
  //    this.client = new Axios({})
  //  }

  get numOfAssets(): number { return Object.keys(this.assets).length }

  loadImage(url: string, cache: boolean = true): HTMLImageElement {
    let id = btoa(url)
    let cacheCheck = this.assets[id]
    let img: HTMLImageElement;
    if (cacheCheck) {
      img = new Image();
      img.src = cacheCheck.data as string;
      return img
    }
    img = new Image();
    img.crossOrigin = "Anonymous"
    if (cache) {
      img.addEventListener("load", () => {
        let temp = document.createElement("canvas")
        let ctx = temp.getContext("2d")!
        temp.width = img.width;
        temp.height = img.height;
        ctx.drawImage(img, 0, 0)
        this.assets[id] = {
          data: temp.toDataURL("image/png"),
          type: "image"
        }
      }, false)
    }
    img.src = url;
    return img!
  }
}
