import { type SnakesField } from "./field"
import { Snake, type SnakeDirection } from "./snake"

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
}
