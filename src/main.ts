import { CellEnum } from "./game/cell"
import { Direction } from "./game/direction"
import { SnakesGame } from "./game/game"
import "./style.css"

import { Viewport } from "./ui/viewport"

const canvas = document.getElementById("canvas")
if (canvas == null) {
  throw new Error("Canvas element is not found")
}

const WIDTH = 100
const HEIGHT = 80

const viewport = new Viewport(canvas as HTMLCanvasElement, WIDTH, HEIGHT)

function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min) + min)
}

const game = new SnakesGame(WIDTH, HEIGHT)
game.output = viewport

for (let i = 0; i < 200; ++i) {
  game.putCell(random(0, WIDTH), random(0, HEIGHT), CellEnum.FOOD)
}

for (let i = 0; i < 30; ++i) {
  game.putCell(random(0, WIDTH), random(0, HEIGHT), CellEnum.BRICK)
}

for (let i = 0; i < 10; ++i) {
  game.putCell(random(0, WIDTH), random(0, HEIGHT), CellEnum.POISON)
}

const player = game.createPlayerSnake(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2), Direction.UP)

game.draw()

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
