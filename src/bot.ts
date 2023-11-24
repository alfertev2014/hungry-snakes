import { Direction, directionOffsetByX, directionOffsetByY, oppositeDirectionOf } from "./game/direction"
import { type SnakeControl } from "./game/snakesRegistry"
import { random } from "./util"

export class SimpleRandomBot {
  readonly snakeControl: SnakeControl
  constructor(snakeControl: SnakeControl) {
    this.snakeControl = snakeControl
  }

  doNextAction(): void {
    if (this.snakeControl.length === 0) {
      return
    }

    let nextDirection: Direction = this.snakeControl.direction
    switch (random(1, 5)) {
      case 1:
        nextDirection = Direction.UP
        break
      case 2:
        nextDirection = Direction.RIGHT
        break
      case 3:
        nextDirection = Direction.DOWN
        break
      case 4:
        nextDirection = Direction.LEFT
        break
    }

    const { headX, headY, tailX, tailY, direction } = this.snakeControl

    for (let i = 0; i < 2; ++i) {
      if (nextDirection === oppositeDirectionOf(direction)) {
        nextDirection = direction
      }

      const nextX = headX + directionOffsetByX(nextDirection)
      const nextY = headY + directionOffsetByY(nextDirection)
      const nextCell = this.snakeControl.getCell(nextX, nextY)

      if (this.snakeControl.isSelfSnake(nextCell)) {
        if (nextDirection === nextCell.direction || (nextX === tailX && nextY === tailY)) {
          break
        } else {
          nextDirection = oppositeDirectionOf(nextCell.direction)
        }
      } else {
        break
      }
    }

    this.snakeControl.onArrowPressed(nextDirection)
  }
}
