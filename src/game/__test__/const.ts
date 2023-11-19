import { CellEnum } from "../cell"
import { SnakeDirection } from "../snake"

export const NON_SNAKE_CELL_TYPES = [CellEnum.EMPTY, CellEnum.FOOD, CellEnum.BRICK, CellEnum.POISON]
export const SNAKE_DIRECTIONS: SnakeDirection[] = [
  SnakeDirection.SNAKE_UP,
  SnakeDirection.SNAKE_RIGHT,
  SnakeDirection.SNAKE_DOWN,
  SnakeDirection.SNAKE_LEFT,
]
