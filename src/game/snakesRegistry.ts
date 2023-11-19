import { cellIsSnake } from "./cell"
import { type SnakesField } from "./field"
import { type DrawingOutput } from "./output"
import { Snake, SnakeDirection } from "./snake"

export class SnakesRegistry {
  readonly _field: SnakesField
  readonly _snakes: Snake[]
  constructor(field: SnakesField) {
    this._field = field
    this._snakes = []
  }

  get count(): number {
    return this._snakes.length
  }

  createSnake(x: number, y: number, direction: SnakeDirection): Snake {
    const snake = new Snake(this._field, x, y, direction)
    this._snakes.push(snake)
    return snake
  }

  contains(snake: Snake): boolean {
    return this._snakes.includes(snake)
  }

  killSnake(snake: Snake): void {
    const found = this._snakes.indexOf(snake)
    if (found >= 0) {
      this._snakes.splice(found, 1)
    }
  }

  drawAll(output: DrawingOutput): void {
    for (const snake of this._snakes) {
      if (snake.length > 0) {
        let x = snake.tailX
        let y = snake.tailY
        let cellNumber = snake.length - 1
        let nextDirection: SnakeDirection | undefined

        while (cellNumber >= 0) {
          const cell = this._field.getCell(x, y)
          if (!cellIsSnake(cell)) {
            throw new Error("Snake is corrupted!!!")
          }
          output.drawSnakeCell(null, x, y, cellNumber, cell.direction, nextDirection)
          nextDirection = cell.direction
          cellNumber--
          switch (nextDirection) {
            case SnakeDirection.SNAKE_UP:
              y--
              break
            case SnakeDirection.SNAKE_RIGHT:
              x++
              break
            case SnakeDirection.SNAKE_DOWN:
              y++
              break
            case SnakeDirection.SNAKE_LEFT:
              x--
              break
          }
        }
      }
    }
  }
}
