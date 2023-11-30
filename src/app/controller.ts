import { SimpleRandomBot } from "../bot/simpleRandom"
import { CellEnum, cellIsSnake } from "../game/cell"
import { Direction } from "../game/direction"
import { SnakesGame } from "../game/game"
import { type DrawingSnakeStyle } from "../graphics/theme"
import { cssHSLA, random } from "../util"
import { type GameConfig } from "./config"
import { type DrawingOutput } from "../game/output"

const randomSnakeStyle = (): DrawingSnakeStyle => {
  const h = random(0, 360)
  const headH = h + 60
  return {
    color: cssHSLA(h, 100, 40),
    headColor: cssHSLA(headH, 100, 50),
  }
}

export class GameController {
  readonly game: SnakesGame
  readonly bots: SimpleRandomBot[]
  config: GameConfig
  _intervalId: number | null = null
  constructor(config: GameConfig) {
    this.config = config
    const { width, height } = this.config.field
    this.game = new SnakesGame(width, height)
    this.bots = []
    this._intervalId = null
  }

  _initializeField(): void {
    const { width, height } = this.config.field
    const { foodCount = 0, brickCount = 0, poisonCount = 0 } = this.config.cellGeneration ?? {}
    for (let i = 0; i < foodCount; ++i) {
      this.game.putCell(random(0, width), random(0, height), CellEnum.FOOD)
    }

    for (let i = 0; i < brickCount; ++i) {
      this.game.putCell(random(0, width), random(0, height), CellEnum.BRICK)
    }

    for (let i = 0; i < poisonCount; ++i) {
      this.game.putCell(random(0, width), random(0, height), CellEnum.POISON)
    }
  }

  _initializePlayer(): void {
    const { width, height } = this.config.field
    const player = this.game.createPlayerSnake(Math.floor(width / 2), Math.floor(height / 2), Direction.UP)

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
    const { width, height } = this.config.field
    const botCount = this.config.botGeneration?.count ?? 0
    for (let i = 0; i < botCount; ++i) {
      const x = random(0, width)
      const y = random(0, height)
      if (!cellIsSnake(this.game.getCell(x, y))) {
        const control = this.game.createSnake(x, y, Direction.UP, randomSnakeStyle())
        this.bots.push(new SimpleRandomBot(control))
      }
    }
  }

  _startTimer(): void {
    this._intervalId = window.setInterval(() => {
      for (const bot of this.bots) {
        bot.doNextAction()
      }
      this.game.tick()
      this.game.draw()
    }, 200)
  }

  setGameOutput(output: DrawingOutput): void {
    this.game.output = output
  }

  redraw(): void {
    this.game.draw()
  }

  initialize(): void {
    this._initializeField()
    this._initializePlayer()
    this._initializeBots()
  }

  start(): void {
    this._startTimer()
  }

  stop(): void {
    if (this._intervalId !== null) {
      window.clearInterval(this._intervalId)
    }
  }
}
