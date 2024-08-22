import { type CellEnum } from "./cell"
import { type Direction } from "./direction"

export interface DrawingOutput {
  clearWithBackground: () => void
  drawCell: (x: number, y: number, cell: CellEnum) => void
  drawSnakeCell: (
    style: object | null,
    x: number,
    y: number,
    cellNumber: number,
    direction: Direction,
    nextDirection?: Direction,
  ) => void
}
