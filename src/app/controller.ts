import { SimpleRandomBot } from "../bot/simpleRandom"
import { CellEnum, cellIsSnake } from "../game/cell"
import { Direction } from "../game/direction"
import { SnakesGame } from "../game/game"
import { CanvasContainer } from "../ui/canvas"
import { type FieldTheme, type DrawingSnakeStyle } from "../ui/theme"
import { cssHSLA, random } from "../util"
import { BRICKS_COUNT, FOOD_COUNT, GAME_HEIGHT, GAME_WIDTH, POISON_COUNT } from "./config"

const randomSnakeStyle = (): DrawingSnakeStyle => {
  const h = random(0, 360)
  const headH = h + 60
  return {
    color: cssHSLA(h, 100, 40),
    headColor: cssHSLA(headH, 100, 50),
  }
}

const fieldTheme: FieldTheme = {
  background: "black",
  food: cssHSLA(0, 0, 30),
  brick: cssHSLA(0, 60, 40),
  poison: cssHSLA(300, 100, 10)
}

export class GameController {
  readonly game: SnakesGame
  readonly canvasContainer: CanvasContainer
  readonly bots: SimpleRandomBot[]
  constructor() {
    this.game = new SnakesGame(GAME_WIDTH, GAME_HEIGHT)
    this.canvasContainer = new CanvasContainer(this.game, fieldTheme)
    this.bots = []
  }

  _initializeField(): void {
    for (let i = 0; i < FOOD_COUNT; ++i) {
      this.game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.FOOD)
    }
    
    for (let i = 0; i < BRICKS_COUNT; ++i) {
      this.game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.BRICK)
    }
    
    for (let i = 0; i < POISON_COUNT; ++i) {
      this.game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.POISON)
    }
  }

  _initializePlayer(): void {
    const player = this.game.createPlayerSnake(Math.floor(GAME_WIDTH / 2), Math.floor(GAME_HEIGHT / 2), Direction.UP)

    const onKeyDown = (e: KeyboardEvent): void => {
      if (e.isComposing || e.keyCode === 229) {
        return
      }
      switch (e.key) {
        case "Down":
        case "ArrowDown":
          player.onArrowPressed(Direction.DOWN)
          player.doPlayerStep()
          break
        case "Up":
        case "ArrowUp":
          player.onArrowPressed(Direction.UP)
          player.doPlayerStep()
          break
        case "Left":
        case "ArrowLeft":
          player.onArrowPressed(Direction.LEFT)
          player.doPlayerStep()
          break
        case "Right":
        case "ArrowRight":
          player.onArrowPressed(Direction.RIGHT)
          player.doPlayerStep()
          break
      }
      this.game.draw()
    }
    
    window.addEventListener("keydown", onKeyDown)
  }

  _initializeBots(): void {
    for (let i = 0; i < 20; ++i) {
      const x = random(0, GAME_WIDTH)
      const y = random(0, GAME_HEIGHT)
      if (!cellIsSnake(this.game.getCell(x, y))) {
        const control = this.game.createSnake(x, y, Direction.UP, randomSnakeStyle())
        this.bots.push(new SimpleRandomBot(control))
      }
    }
  }

  _startTimer(): void {
    setInterval(() => {
      for (const bot of this.bots) {
        bot.doNextAction()
      }
      this.game.tick()
      this.game.draw()
    }, 200)
  }

  start(): void {
    this._initializeField()
    this._initializePlayer()
    this._initializeBots()
    this._startTimer()
  }
}
