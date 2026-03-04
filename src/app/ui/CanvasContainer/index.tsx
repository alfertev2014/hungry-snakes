import type { TemplateContent } from "rwrtw"

import "./style.css"
import { createRef, lc } from "rwrtw"

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
}: CanvasContainerProps): TemplateContent => {
  
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
  
  return <>
    {lc({
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
    })}
    <div class="canvas-container" ref={canvasContainer}>
      <canvas ref={canvas}>Canvas support is required</canvas>
    </div>
  </>
}

export default CanvasContainer
