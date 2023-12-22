import { type FwComponent } from "../fw"
import { queryChild, queryTemplate } from "../utils"

import "./style.css"

export interface CanvasContainerProps {
  gameWidth: number
  gameHeight: number
  onCanvasResized: () => void
  onCanvasCreated: (canvas: HTMLCanvasElement) => void
}

const CanvasContainer: FwComponent<CanvasContainerProps> = ({
  gameWidth,
  gameHeight,
  onCanvasCreated,
  onCanvasResized,
}) => {
  const template = queryTemplate("CanvasContainer")
  const content = template.content.cloneNode(true) as DocumentFragment

  const canvas = queryChild<HTMLCanvasElement>(content, "canvas")
  const canvasContaier = queryChild<HTMLDivElement>(content, ".canvas-container")

  onCanvasCreated(canvas)

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
    onCanvasResized()
  })
  observer.observe(canvasContaier)

  return {
    fragment: content,
    dispose: () => {
      observer.disconnect()
    },
  }
}

export default CanvasContainer
