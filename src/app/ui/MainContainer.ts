import { type FieldTheme } from "../../graphics/theme"
import { Viewport } from "../../graphics/viewport"
import { cssHSLA } from "../../util"
import { type GameConfig, defaultGameConfig } from "../config"
import { GameController } from "../controller"
import CanvasContainer from "./CanvasContainer"
import NewGameForm from "./NewGameForm"

const fieldTheme: FieldTheme = {
  background: "black",
  food: cssHSLA(0, 0, 30),
  brick: cssHSLA(0, 60, 40),
  poison: cssHSLA(300, 100, 10),
}

const MainContainer = (rootElement: HTMLElement): (() => void) => {
  let currentComponentDispose: () => void
  let gameController: GameController
  let currentConfig = defaultGameConfig

  const onNewGame = (config: GameConfig): void => {
    currentComponentDispose()
    rootElement.replaceChildren()

    const { width: gameWidth, height: gameHeight } = config.field

    currentComponentDispose = CanvasContainer(rootElement, {
      gameWidth,
      gameHeight,
      onCanvasCreated(canvas) {
        const viewport = new Viewport(canvas, gameWidth, gameHeight, fieldTheme)
        gameController = new GameController(config)
        gameController.setGameOutput(viewport)
        gameController.initialize()
        gameController.start()
      },
      onCanvasResized() {
        gameController.redraw()
      },
    })
    currentConfig = config
  }

  currentComponentDispose = NewGameForm(rootElement, currentConfig, onNewGame)

  return () => {
    gameController.stop()
    currentComponentDispose()
  }
}

export default MainContainer
