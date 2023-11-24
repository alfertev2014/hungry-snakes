import { type CellEnum, type CellType, cellIsSnake } from "./cell"
import { type Direction } from "./direction"
import { GameField } from "./field"
import { type DrawingOutput } from "./output"
import { type SnakeControl, SnakesRegistry } from "./snakesRegistry"

export class SnakesGame {
  _field: GameField
  _snakesRegistry: SnakesRegistry
  _playerSnake: SnakeControl | null
  output: DrawingOutput | null
  constructor(width: number, height: number) {
    this._field = new GameField(width, height)
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

  get isPlayerAlive(): boolean {
    return this._playerSnake !== null
  }

  putCell(x: number, y: number, cell: CellEnum): void {
    this._field.setCell(x, y, cell)
  }

  getCell(x: number, y: number): CellType {
    return this._field.getCell(x, y)
  }

  createSnake(x: number, y: number, direction: Direction): SnakeControl {
    return this._snakesRegistry.createSnake(x, y, direction)
  }

  createPlayerSnake(x: number, y: number, direction: Direction): SnakeControl {
    this._playerSnake = this._snakesRegistry.createSnake(x, y, direction)
    return this._playerSnake
  }

  get playerSnake(): SnakeControl | null {
    return this._playerSnake
  }

  tick(): void {
    this._playerSnake?.doPlayerStep()
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
