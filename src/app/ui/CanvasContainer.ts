import { type SnakesGame } from "../../game/game"
import { type FieldTheme } from "../../graphics/theme"
import { Viewport } from "../../graphics/viewport"

const CANVAS_ID = "canvas"
const CANVAS_CONTAINER_ID = "canvas-container"

export class CanvasContainer {
  _canvas: HTMLCanvasElement
  readonly viewport: Viewport
  constructor(game: SnakesGame, theme?: FieldTheme) {
    const { width: gameWidth, height: gameHeight } = game
    const canvas = document.getElementById(CANVAS_ID) as (HTMLCanvasElement | null)
    if (canvas == null) {
      throw new Error("Canvas element is not found")
    }
    this._canvas = canvas

    this.viewport = new Viewport(canvas, gameWidth, gameHeight, theme)

    const viewportRatio = gameWidth / gameHeight

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) {
          return
        }

        if (width / height < viewportRatio) {
          canvas.width = width
          canvas.height = width / viewportRatio
        } else {
          canvas.width = height * viewportRatio
          canvas.height = height
        }
      }
      game.draw()
    })

    const canvasContaier = document.getElementById(CANVAS_CONTAINER_ID)
    if (canvasContaier === null) {
      throw new Error("Canvas container element is not found")
    }
    observer.observe(canvasContaier)

    game.output = this.viewport
  }
}

