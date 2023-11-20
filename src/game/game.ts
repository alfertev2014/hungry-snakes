import { type CellEnum, type CellType, cellIsSnake } from "./cell"
import { SnakesField } from "./field"
import { type DrawingOutput } from "./output"
import { type Snake, type SnakeDirection } from "./snake"
import { SnakesRegistry } from "./snakesRegistry"

export class SnakesGame {
  _field: SnakesField
  _snakesRegistry: SnakesRegistry
  _playerSnake: Snake | null
  output: DrawingOutput | null
  constructor(width: number, height: number) {
    this._field = new SnakesField(width, height)
    this._snakesRegistry = new SnakesRegistry(this._field)
    this._playerSnake = null
    this.output = null
  }

  get width(): number {
    return this._field.width
  }

  get height(): number {
    return this._field.height
  }

  get snakesCount(): number {
    return this._snakesRegistry.count
  }

  putCell(x: number, y: number, cell: CellEnum): void {
    this._field.setCell(x, y, cell)
  }

  getCell(x: number, y: number): CellType {
    return this._field.getCell(x, y)
  }

  createPlayerSnake(x: number, y: number, direction: SnakeDirection): void {
    this._playerSnake = this._snakesRegistry.createSnake(x, y, direction)
  }

  onArrowPressed(direction: SnakeDirection): void {
    if ((this._playerSnake?.changeDirection(direction)) ?? false) {
      this.doPlayerStep()
    }
  }

  doPlayerStep(): void {
    this._playerSnake?.doStep()
  }

  draw(): void {
    if (this.output !== null) {
      this.output.clearWithBackground()
      for (let y = 0; y < this._field.height; ++y) {
        for (let x = 0; x < this._field.width; ++x) {
          const cell = this._field.getCell(x, y)
          if (!cellIsSnake(cell)) {
            this.output.drawCell(x, y, cell)
          }
        }
      }
      this._snakesRegistry.drawAll(this.output)
    }
  }
}
