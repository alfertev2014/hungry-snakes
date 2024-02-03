import type { PlaceholderComponent } from "rwrtw"
import { type FieldTheme } from "../../graphics/theme"
import { Viewport } from "../../graphics/viewport"
import { cssHSLA } from "../../util"
import { defaultGameConfig } from "../config"
import { GameController } from "../controller"
import CanvasContainer from "./CanvasContainer"
import NewGameForm from "./NewGameForm"
import { source } from "rwrtw/lib/reactive/observable"
import { reContent } from "rwrtw/lib/template/reactive"
import { fr, lc } from "rwrtw/lib/template"

const fieldTheme: FieldTheme = {
  background: "black",
  food: cssHSLA(0, 0, 30),
  brick: cssHSLA(0, 60, 40),
  poison: cssHSLA(300, 100, 10),
}

const MainContainer = (): PlaceholderComponent => {
  let gameController: GameController | undefined
  const config = source(defaultGameConfig)

  const screen = source("NewGame")

  return fr(
    lc({
      dispose() {
        gameController?.stop()
      }
    }),
    reContent(screen, () => {
      switch (screen.current()) {
        case "NewGame":
          return NewGameForm({ initConfig: config.current(), onSubmit: (value) => {
            config.change(value)
            screen.change("Canvas")
          } })
        case "Canvas": {
          const { field: { width, height } } = config.current()
          return CanvasContainer({
            gameWidth: width,
            gameHeight: height,
            onCanvasCreated(canvas) {
              if (gameController == null) {
                const viewport = new Viewport(canvas, width, height, fieldTheme)
                gameController = new GameController(config.current())
                gameController.setGameOutput(viewport)
                gameController.initialize()
                gameController.start()
              }
            },
            onCanvasResized() {
              gameController?.redraw()
            },
          })
        }
        default:
          return null
      }
    })
  )
}

export default MainContainer
