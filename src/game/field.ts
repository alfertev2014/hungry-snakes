import { CellEnum, type CellType } from "./cell"

export class GameField {
  readonly width: number
  readonly height: number
  readonly _cells: CellType[]
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
  }

  getCell(x: number, y: number): CellType {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return CellEnum.BOUNDARY
    }
    return this._cells[x + y * this.width]
  }

  setCell(x: number, y: number, value: CellType): void {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return
    }
    this._cells[x + y * this.width] = value
  }
}
