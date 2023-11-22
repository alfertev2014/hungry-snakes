import { cellIsSnake } from "./cell"
import { Direction } from "./direction"
import { type GameField } from "./field"
import { type DrawingOutput } from "./output"
import { Snake } from "./snake"

export class SnakesRegistry {
  readonly _field: GameField
  readonly _snakes: Snake[]
  constructor(field: GameField) {
    this._field = field
    this._snakes = []
  }

  get count(): number {
    return this._snakes.length
  }

  createSnake(x: number, y: number, direction: Direction): Snake {
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
        let nextDirection: Direction | undefined

        while (cellNumber >= 0) {
          const cell = this._field.getCell(x, y)
          if (!cellIsSnake(cell)) {
            throw new Error("Snake is corrupted!!!")
          }
          output.drawSnakeCell(null, x, y, cellNumber, cell.direction, nextDirection)
          nextDirection = cell.direction
          cellNumber--
          switch (nextDirection) {
            case Direction.UP:
              y--
              break
            case Direction.RIGHT:
              x++
              break
            case Direction.DOWN:
              y++
              break
            case Direction.LEFT:
              x--
              break
          }
        }
      }
    }
  }
}
