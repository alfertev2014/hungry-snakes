import { type SnakesGame } from "../../../game/game"
import { type FieldTheme } from "../../../graphics/theme"
import { Viewport } from "../../../graphics/viewport"
import { queryTemplate } from "../utils"

const CanvasContainer = (rootElement: HTMLElement, game: SnakesGame, theme?: FieldTheme): (() => void) => {
  const template = queryTemplate("CanvasContainer")
  rootElement.appendChild(template.content.cloneNode(true))

  const { width: gameWidth, height: gameHeight } = game
  const canvas = document.getElementById("canvas") as (HTMLCanvasElement | null)
  if (canvas == null) {
    throw new Error("Canvas element is not found")
  }

  const viewport = new Viewport(canvas, gameWidth, gameHeight, theme)

  const gameRatio = gameWidth / gameHeight

  const observer = new ResizeObserver((entries) => {
    for (const entry of entries) {
      const { width, height } = entry.contentRect
      if (width === 0 || height === 0) {
        return
      }

      if (width / height < gameRatio) {
        canvas.width = width
        canvas.height = width / gameRatio
      } else {
        canvas.width = height * gameRatio
        canvas.height = height
      }
    }
    game.draw()
  })

  const canvasContaier = document.getElementById("canvas-container")
  if (canvasContaier === null) {
    throw new Error("Canvas container element is not found")
  }
  observer.observe(canvasContaier)

  game.output = viewport
  
  return () => {
    observer.disconnect()
  }
}

export default CanvasContainer