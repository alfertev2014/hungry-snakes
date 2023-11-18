import { CellEnum, type CellType } from "./cell"
import { SnakeDirection, type Snake } from "./snake"

export class SnakesField {
  readonly width: number
  readonly height: number
  readonly _cells: CellType[]
  readonly _snakes: Map<number, Snake>
  constructor(width: number, height: number) {
    if (width <= 0 || height <= 0) {
      throw new Error("Dimensions of field must be grater than zero")
    }
    this.width = width
    this.height = height
    this._cells = new Array(width * height)
    for (let i = 0; i < this._cells.length; ++i) {
      this._cells[i] = CellEnum.EMPTY
    }
    this._snakes = new Map()
  }

  getCell(x: number, y: number): CellType {
    return this._cells[x + y * this.width]
  }

  setCell(x: number, y: number, value: CellType): void {
    this._cells[x + y * this.width] = value
  }

  getAjacentCell(x: number, y: number, direction: SnakeDirection): CellType {
    switch (direction) {
      case SnakeDirection.SNAKE_UP:
        if (y === 0) {
          return CellEnum.BRICK
        }
        return this.getCell(x, y - 1)
      case SnakeDirection.SNAKE_RIGHT:
        if (x === this.width - 1) {
          return CellEnum.BRICK
        }
        return this.getCell(x + 1, y)
      case SnakeDirection.SNAKE_DOWN:
        if (y === this.height - 1) {
          return CellEnum.BRICK
        }
        return this.getCell(x, y + 1)
      case SnakeDirection.SNAKE_LEFT:
        if (x === 0) {
          return CellEnum.BRICK
        }
        return this.getCell(x - 1, y)
    }
  }
}
