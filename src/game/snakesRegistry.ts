import { type CellType, cellIsSnake } from "./cell"
import { Direction } from "./direction"
import { type GameField } from "./field"
import { type DrawingOutput } from "./output"
import { Snake, type SnakeCell } from "./snake"

export interface SnakeControl {
  onArrowPressed: (direction: Direction) => void
  doPlayerStep: () => void
  get headX(): number
  get headY(): number
  get tailX(): number
  get tailY(): number
  get length(): number
  get direction(): Direction
  getCell: (x: number, y: number) => CellType
  isSelfSnake: (cell: CellType) => cell is SnakeCell
}

class SnakeControlImpl implements SnakeControl {
  readonly _snake: Snake
  constructor(snake: Snake) {
    this._snake = snake
  }

  get headX(): number {
    return this._snake.headX
  }

  get headY(): number {
    return this._snake.headY
  }

  get tailX(): number {
    return this._snake.tailX
  }

  get tailY(): number {
    return this._snake.tailY
  }

  get length(): number {
    return this._snake.length
  }

  get direction(): Direction {
    return this._snake.direction
  }

  getCell(x: number, y: number): CellType {
    return this._snake.field.getCell(x, y)
  }

  isSelfSnake(cell: CellType): cell is SnakeCell {
    return cellIsSnake(cell) && this._snake === cell.snake
  }

  onArrowPressed(direction: Direction): void {
    if (this._snake?.changeDirection(direction) ?? false) {
      this.doPlayerStep()
    }
  }

  doPlayerStep(): void {
    this._snake?.doStep()
  }
}

export class SnakesRegistry {
  readonly _field: GameField
  readonly _snakes: SnakeControlImpl[]
  constructor(field: GameField) {
    this._field = field
    this._snakes = []
  }

  get count(): number {
    return this._snakes.length
  }

  createSnake(x: number, y: number, direction: Direction): SnakeControl {
    const snake = new Snake(this._field, x, y, direction)
    const control = new SnakeControlImpl(snake)
    this._snakes.push(control)
    return control
  }

  contains(control: SnakeControl): boolean {
    return control instanceof SnakeControlImpl && this._snakes.includes(control)
  }

  killSnake(control: SnakeControl): void {
    if (control instanceof SnakeControlImpl) {
      const found = this._snakes.indexOf(control)
      if (found >= 0) {
        this._snakes.splice(found, 1)
      }
    }
  }

  tick(): void {
    for (const control of this._snakes) {
      control._snake.doStep()
    }
  }

  drawAll(output: DrawingOutput): void {
    for (const control of this._snakes) {
      const snake = control._snake
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
