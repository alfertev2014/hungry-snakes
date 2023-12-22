import { type FieldTheme } from "../../graphics/theme"
import { Viewport } from "../../graphics/viewport"
import { cssHSLA } from "../../util"
import { type GameConfig, defaultGameConfig } from "../config"
import { GameController } from "../controller"
import CanvasContainer from "./CanvasContainer"
import NewGameForm from "./NewGameForm"
import { FwParent } from "./fw"

const fieldTheme: FieldTheme = {
  background: "black",
  food: cssHSLA(0, 0, 30),
  brick: cssHSLA(0, 60, 40),
  poison: cssHSLA(300, 100, 10),
}

const MainContainer = (rootElement: HTMLElement): (() => void) => {
  let gameController: GameController
  let currentConfig = defaultGameConfig
  const root: FwParent = new FwParent()

  const onNewGame = (config: GameConfig): void => {
    root.dispose()
    rootElement.replaceChildren()

    const { width: gameWidth, height: gameHeight } = config.field

    root.createComponent(
      CanvasContainer,
      {
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
      },
      rootElement,
    )
    currentConfig = config
  }

  root.createComponent(NewGameForm, { initConfig: currentConfig, onSubmit: onNewGame }, rootElement)

  return () => {
    gameController.stop()
    root.dispose()
  }
}

export default MainContainer
