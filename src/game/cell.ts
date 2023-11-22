import { SnakeCell } from "./snake"

export enum CellEnum {
  EMPTY,
  FOOD,
  BRICK,
  POISON,
  BOUNDARY,
}

export type CellType = CellEnum | SnakeCell

export const cellIsSnake = (cell: CellType): cell is SnakeCell => {
  return cell instanceof SnakeCell
}
