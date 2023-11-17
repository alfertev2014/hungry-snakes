import "./style.css"

import { Viewport } from "./ui/viewport"

const canvas = document.getElementById("canvas")
if (canvas == null) {
  throw new Error("Canvas element is not found")
}

const viewport = new Viewport(canvas as HTMLCanvasElement)
