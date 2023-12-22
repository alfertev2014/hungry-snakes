import { queryChild, queryTemplate } from "../utils"

import "./style.css"

export interface CanvasContainerProps {
  gameWidth: number
  gameHeight: number
  onCanvasResized: () => void
  onCanvasCreated: (canvas: HTMLCanvasElement) => void
}

const CanvasContainer = (
  rootElement: HTMLElement,
  { gameWidth, gameHeight, onCanvasCreated, onCanvasResized }: CanvasContainerProps,
): (() => void) => {
  const template = queryTemplate("CanvasContainer")
  rootElement.appendChild(template.content.cloneNode(true))

  const canvas = queryChild<HTMLCanvasElement>(rootElement, "canvas")
  const canvasContaier = queryChild<HTMLDivElement>(rootElement, ".canvas-container")

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

  return () => {
    observer.disconnect()
  }
}

export default CanvasContainer
