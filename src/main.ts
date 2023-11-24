import { SimpleRandomBot } from "./bot"
import { CellEnum, cellIsSnake } from "./game/cell"
import { Direction } from "./game/direction"
import { SnakesGame } from "./game/game"
import "./style.css"

import { Viewport } from "./ui/viewport"
import { random } from "./util"

const canvas = document.getElementById("canvas") as HTMLCanvasElement | null
if (canvas == null) {
  throw new Error("Canvas element is not found")
}

const GAME_WIDTH = 120
const GAME_HEIGHT = 90

const viewport = new Viewport(canvas, GAME_WIDTH, GAME_HEIGHT)

const game = new SnakesGame(GAME_WIDTH, GAME_HEIGHT)
game.output = viewport

const VIEWPORT_RATIO = GAME_WIDTH / GAME_HEIGHT

const observer = new ResizeObserver((entries) => {
  for (const entry of entries) {
    const { width, height } = entry.contentRect
    if (width === 0 || height === 0) {
      return
    }

    if (width / height < VIEWPORT_RATIO) {
      canvas.width = width
      canvas.height = width / VIEWPORT_RATIO
    } else {
      canvas.width = height * VIEWPORT_RATIO
      canvas.height = height
    }
  }
  game.draw()
})

const canvasContaier = document.getElementById("canvas-container")
if (canvasContaier === null) {
  throw new Error("Canvas container element is not found")
}
observer.observe(canvasContaier)

for (let i = 0; i < 2000; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.FOOD)
}

for (let i = 0; i < 30; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.BRICK)
}

for (let i = 0; i < 10; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.POISON)
}

const player = game.createPlayerSnake(Math.floor(GAME_WIDTH / 2), Math.floor(GAME_HEIGHT / 2), Direction.UP)

const bots: SimpleRandomBot[] = []
for (let i = 0; i < 20; ++i) {
  const x = random(0, GAME_WIDTH)
  const y = random(0, GAME_HEIGHT)
  if (!cellIsSnake(game.getCell(x, y))) {
    const control = game.createSnake(x, y, Direction.UP)
    bots.push(new SimpleRandomBot(control))
  }
}

setInterval(() => {
  for (const bot of bots) {
    bot.doNextAction()
  }
  game.tick()
  game.draw()
}, 200)

function onKeyDown(e: KeyboardEvent): void {
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
  game.draw()
}

window.addEventListener("keydown", onKeyDown)
