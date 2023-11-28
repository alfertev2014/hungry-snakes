import { CellEnum } from "../game/cell"
import { Direction, directionOffsetByX, directionOffsetByY, oppositeDirectionOf } from "../game/direction"
import { type SnakeControl } from "../game/snakesRegistry"
import { random } from "../util"

const randomDirection = (): Direction => {
  switch (random(0, 100) % 4) {
    case 0:
      return Direction.UP
    case 1:
      return Direction.RIGHT
    case 2:
      return Direction.DOWN
    case 3:
      return Direction.LEFT
    default:
      return Direction.UP
  }
}

export class SimpleRandomBot {
  readonly snakeControl: SnakeControl
  constructor(snakeControl: SnakeControl) {
    this.snakeControl = snakeControl
  }

  doNextAction(): void {
    if (this.snakeControl.length === 0) {
      return
    }

    let nextDirection: Direction = randomDirection()
    const { headX, headY, tailX, tailY } = this.snakeControl

    for (let i = 0; i < 3; ++i) {
      const nextX = headX + directionOffsetByX(nextDirection)
      const nextY = headY + directionOffsetByY(nextDirection)
      const nextCell = this.snakeControl.getCell(nextX, nextY)

      if (this.snakeControl.isSelfSnake(nextCell)) {
        if (nextDirection === nextCell.direction || (nextX === tailX && nextY === tailY)) {
          break
        } else {
          nextDirection = oppositeDirectionOf(nextCell.direction)
        }
      } else if (nextCell === CellEnum.BOUNDARY || nextCell === CellEnum.BRICK) {
        nextDirection = randomDirection()
        break
      } else {
        break
      }
    }

    this.snakeControl.onArrowPressed(nextDirection)
  }
}
