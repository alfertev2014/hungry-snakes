import type { PlaceholderComponent } from "rwrtw"

import "./style.css"
import { createRef, el, fr, lc, ref } from "rwrtw/lib/template"

export interface CanvasContainerProps {
  gameWidth: number
  gameHeight: number
  onCanvasResized: () => void
  onCanvasCreated: (canvas: HTMLCanvasElement) => void
}

const CanvasContainer = ({
  gameWidth,
  gameHeight,
  onCanvasCreated,
  onCanvasResized,
}: CanvasContainerProps): PlaceholderComponent => {
  
  const canvas = createRef<HTMLElement>()
  const canvasContainer = createRef<HTMLElement>()

  const gameRatio = gameWidth / gameHeight

  const observer = new ResizeObserver((entries) => {
    if (canvas.current != null) {
      const c = canvas.current as HTMLCanvasElement
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width === 0 || height === 0) {
          return
        }

        if (width / height < gameRatio) {
          c.width = width
          c.height = width / gameRatio
        } else {
          c.width = height * gameRatio
          c.height = height
        }
      }
      onCanvasResized()
    }
  })
  
  return fr(
    lc({
      mount() {
        if (canvasContainer.current != null) {
          onCanvasCreated(canvas.current as HTMLCanvasElement)
          observer.observe(canvasContainer.current)
        }
      },
      unmount() {
        if (canvasContainer.current != null) {
          observer.unobserve(canvasContainer.current)
        }
      },
      dispose: () => {
        observer.disconnect()
      }
    }),
    el("div", { class: "canvas-container"}, ref(canvasContainer))(
      el("canvas", null, ref(canvas))("Canvas support is required")
    )
  )
}

export default CanvasContainer
