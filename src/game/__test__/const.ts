import { CellEnum } from "../cell"
import { Direction } from "../direction"

export const NON_SNAKE_CELL_TYPES = [CellEnum.EMPTY, CellEnum.FOOD, CellEnum.BRICK, CellEnum.POISON]
export const DIRECTIONS: Direction[] = [
  Direction.UP,
  Direction.RIGHT,
  Direction.DOWN,
  Direction.LEFT,
]
