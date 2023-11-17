import { CellEnum, type SnakeDirection } from "./cell"
import { type Snake } from "./snake"

export class SnakesField {
  readonly width: number
  readonly height: number
  readonly _field: Uint32Array
  readonly _snakes: Map<number, Snake>
  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Dimensions of field must be grater than zero")
    }
    this.width = width
    this.height = height
    this._field = new Uint32Array(width * height)
    this._snakes = new Map()
  }

  getCell(x: number, y: number): number {
    return this._field[x + y * this.width]
  }

  setCell(x: number, y: number, value: number): void {
    this._field[x + y * this.width] = value
  }

  getAjacentCell(x: number, y: number, direction: SnakeDirection): number {
    switch (direction) {
      case CellEnum.SNAKE_UP:
        if (y === 0) {
          return CellEnum.BRICK
        }
        return this.getCell(x, y - 1)
      case CellEnum.SNAKE_RIGHT:
        if (x === this.width - 1) {
          return CellEnum.BRICK
        }
        return this.getCell(x + 1, y)
      case CellEnum.SNAKE_DOWN:
        if (y === this.height - 1) {
          return CellEnum.BRICK
        }
        return this.getCell(x, y + 1)
      case CellEnum.SNAKE_LEFT:
        if (x === 0) {
          return CellEnum.BRICK
        }
        return this.getCell(x - 1, y)
    }
  }

  getSnakeById(id: number): Snake | undefined {
    return this._snakes.get(id)
  }

  killSnake(id: number): void {
    this._snakes.delete(id)
  }

  get snakeCount(): number {
    return this._snakes.size
  }
}
