import { CellEnum } from "./game/cell"
import { Direction } from "./game/direction"
import { SnakesGame } from "./game/game"
import "./style.css"

import { Viewport } from "./ui/viewport"

const canvas = document.getElementById("canvas") as (HTMLCanvasElement | null)
if (canvas == null) {
  throw new Error("Canvas element is not found")
}

const GAME_WIDTH = 120
const GAME_HEIGHT = 90

const viewport = new Viewport(canvas, GAME_WIDTH, GAME_HEIGHT)

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

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
      canvas.width = width;
      canvas.height = width / VIEWPORT_RATIO;
    } else {
      canvas.width = height * VIEWPORT_RATIO;
      canvas.height = height;
    }
  }
  game.draw()
});

const canvasContaier = document.getElementById("canvas-container")
if (canvasContaier === null) {
  throw new Error("Canvas container element is not found")
}
observer.observe(canvasContaier)

for (let i = 0; i < 200; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.FOOD)
}

for (let i = 0; i < 30; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.BRICK)
}

for (let i = 0; i < 10; ++i) {
  game.putCell(random(0, GAME_WIDTH), random(0, GAME_HEIGHT), CellEnum.POISON)
}

const player = game.createPlayerSnake(Math.floor(GAME_WIDTH / 2), Math.floor(GAME_HEIGHT / 2), Direction.UP)

setInterval(() => {
  game.tick()
  game.draw()
}, 400)


function onKeyDown(e: KeyboardEvent): void {
  if (e.isComposing || e.keyCode === 229) {
    return
  }
  switch (e.key) {
    case "Down":
    case "ArrowDown":
      player.onArrowPressed(Direction.DOWN)
      break
    case "Up":
    case "ArrowUp":
      player.onArrowPressed(Direction.UP)
      break
    case "Left":
    case "ArrowLeft":
      player.onArrowPressed(Direction.LEFT)
      break
    case "Right":
    case "ArrowRight":
      player.onArrowPressed(Direction.RIGHT)
      break
  }
  game.draw()
}

window.addEventListener("keydown", onKeyDown)
