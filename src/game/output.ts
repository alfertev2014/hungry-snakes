import { type CellEnum } from "./cell"
import { type Direction } from "./direction"

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface SnakeStyle {}

export interface DrawingOutput {
  clearWithBackground: () => void
  drawCell: (x: number, y: number, cell: CellEnum) => void
  drawSnakeCell: (
    style: SnakeStyle | null,
    x: number,
    y: number,
    cellNumber: number,
    direction: Direction,
    nextDirection?: Direction,
  ) => void
}
