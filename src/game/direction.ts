export enum Direction {
  UP,
  RIGHT,
  DOWN,
  LEFT,
}

export const oppositeDirectionOf = (direction: Direction): Direction => {
  switch (direction) {
    case Direction.UP:
      return Direction.DOWN
    case Direction.RIGHT:
      return Direction.LEFT
    case Direction.DOWN:
      return Direction.UP
    case Direction.LEFT:
      return Direction.RIGHT
  }
}

export const directionOffsetByX = (direction: Direction): number => {
  switch (direction) {
    case Direction.RIGHT:
      return 1
    case Direction.LEFT:
      return -1
    default:
      return 0
  }
}

export const directionOffsetByY = (direction: Direction): number => {
  switch (direction) {
    case Direction.UP:
      return -1
    case Direction.DOWN:
      return 1
    default:
      return 0
  }
}
