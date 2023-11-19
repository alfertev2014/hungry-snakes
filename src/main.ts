import { CellEnum } from "./game/cell"
import { SnakesGame } from "./game/game"
import { SnakeDirection } from "./game/snake"
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
  return Math.floor(Math.random() * (max - min) + min);
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

game.createPlayerSnake(Math.floor(WIDTH / 2), Math.floor(HEIGHT / 2), SnakeDirection.SNAKE_UP)

game.draw()

function onKeyDown(e: KeyboardEvent): void {
  if (e.isComposing || e.keyCode === 229) {
    return;
  }
  switch(e.key) {
    case 'Down':
    case 'ArrowDown':
        game.onArrowPressed(SnakeDirection.SNAKE_DOWN);
        game.doPlayerStep()
        break;
    case 'Up':
    case 'ArrowUp':
        game.onArrowPressed(SnakeDirection.SNAKE_UP);
        game.doPlayerStep()
        break;
    case 'Left':
    case 'ArrowLeft':
        game.onArrowPressed(SnakeDirection.SNAKE_LEFT);
        game.doPlayerStep()
        break;
    case 'Right':
    case 'ArrowRight':
        game.onArrowPressed(SnakeDirection.SNAKE_RIGHT);
        game.doPlayerStep()
        break;
  }
  game.draw()
}

window.addEventListener('keydown', onKeyDown);