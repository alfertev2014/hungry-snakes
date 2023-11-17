export const CellEnum = {
  EMPTY: 0,
  FOOD: 1,
  BRICK: 2,
  POISON: 3,
  SNAKE_UP: 4,
  SNAKE_RIGHT: 5,
  SNAKE_DOWN: 6,
  SNAKE_LEFT: 7,
} as const

export type CellType = typeof CellEnum

export type SnakeDirection =
  | CellType["SNAKE_UP"]
  | CellType["SNAKE_RIGHT"]
  | CellType["SNAKE_DOWN"]
  | CellType["SNAKE_LEFT"]

export const makeSnakeCell = (id: number, direction: SnakeDirection): number => {
  return (id << 3) | direction
}

export const cellIsSnake = (cell: number): boolean => {
  return (cell & 0b00000100) !== 0
}

export const cellGetSnakeId = (cell: number): number | undefined => {
  if (cellIsSnake(cell)) {
    return cell >> 3
  }
}

export const cellGetSnakeDirection = (cell: number): SnakeDirection | undefined => {
  if (cellIsSnake(cell)) {
    return (cell & 0b00000111) as SnakeDirection
  }
}

export const isOppositeDirection = (
  directionA: SnakeDirection | undefined,
  directionB: SnakeDirection | undefined,
): boolean => {
  switch (directionA) {
    case CellEnum.SNAKE_UP:
      return directionB === CellEnum.SNAKE_DOWN
    case CellEnum.SNAKE_RIGHT:
      return directionB === CellEnum.SNAKE_LEFT
    case CellEnum.SNAKE_DOWN:
      return directionB === CellEnum.SNAKE_UP
    case CellEnum.SNAKE_LEFT:
      return directionB === CellEnum.SNAKE_RIGHT
  }
  return false
}
