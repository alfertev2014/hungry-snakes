import { lc, reContent, source, type TemplateContent } from "rwrtw"
import { type FieldTheme } from "../../graphics/theme"
import { Viewport } from "../../graphics/viewport"
import { cssHSLA } from "../../util"
import { defaultGameConfig, GameConfig } from "../config"
import { GameController } from "../controller"
import CanvasContainer from "./CanvasContainer"
import NewGameForm from "./NewGameForm"

const fieldTheme: FieldTheme = {
  background: "black",
  food: cssHSLA(0, 0, 30),
  brick: cssHSLA(0, 60, 40),
  poison: cssHSLA(300, 100, 10),
}


const MainContainer = (): TemplateContent => {
  let gameController: GameController | undefined
  const config = source<GameConfig>(defaultGameConfig)

  const screen = source<string>("NewGame")

  return <>
    {lc({
      dispose() {
        gameController?.stop()
      }
    })}
    {reContent(screen, (value) => {
      switch (value) {
        case "NewGame":
          return <NewGameForm initConfig={config.current()} onSubmit={(value) => {
            config.change(value)
            screen.change("Canvas")
          }}
          />
        case "Canvas": {
          const { field: { width, height } } = config.current()
          return <CanvasContainer
            gameWidth={width}
            gameHeight={height}
            onCanvasCreated={(canvas) => {
              if (gameController == null) {
                const viewport = new Viewport(canvas, width, height, fieldTheme)
                gameController = new GameController(config.current())
                gameController.setGameOutput(viewport)
                gameController.initialize()
                gameController.start()
              }
            }}
            onCanvasResized={() => {
              gameController?.redraw()
            }}
          />
        }
        default:
          return null
      }
    })}
  </>
}

export default MainContainer
