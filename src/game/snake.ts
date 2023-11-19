import { CellEnum, cellIsSnake } from "./cell"
import { type SnakesField } from "./field"

export enum SnakeDirection {
  SNAKE_UP,
  SNAKE_RIGHT,
  SNAKE_DOWN,
  SNAKE_LEFT,
}

export const isOppositeDirection = (
  directionA: SnakeDirection | undefined,
  directionB: SnakeDirection | undefined,
): boolean => {
  switch (directionA) {
    case SnakeDirection.SNAKE_UP:
      return directionB === SnakeDirection.SNAKE_DOWN
    case SnakeDirection.SNAKE_RIGHT:
      return directionB === SnakeDirection.SNAKE_LEFT
    case SnakeDirection.SNAKE_DOWN:
      return directionB === SnakeDirection.SNAKE_UP
    case SnakeDirection.SNAKE_LEFT:
      return directionB === SnakeDirection.SNAKE_RIGHT
  }
  return false
}

export enum SnakeStatus {
  NEW,
  DIED,
}

export class Snake {
  readonly field: SnakesField

  _headX: number
  _headY: number

  _tailX: number
  _tailY: number

  _length: number
  _status: SnakeStatus

  _direction: SnakeDirection
  readonly UP: SnakeCell
  readonly RIGHT: SnakeCell
  readonly DOWN: SnakeCell
  readonly LEFT: SnakeCell
  constructor(field: SnakesField, headX: number, headY: number, direction: SnakeDirection) {
    if (headX < 0 || headX >= field.width) {
      throw new Error("Creating snake: headX is out of field dimention")
    }
    if (headY < 0 || headY >= field.height) {
      throw new Error("Creating snake: headY is out of field dimention")
    }
    this.field = field
    this._headX = headX
    this._headY = headY
    this._tailX = headX
    this._tailY = headY
    this._length = 1
    this._status = SnakeStatus.NEW
    this._direction = direction
    this.UP = new SnakeCell(this, SnakeDirection.SNAKE_UP)
    this.RIGHT = new SnakeCell(this, SnakeDirection.SNAKE_RIGHT)
    this.DOWN = new SnakeCell(this, SnakeDirection.SNAKE_DOWN)
    this.LEFT = new SnakeCell(this, SnakeDirection.SNAKE_LEFT)
    this._refreshHeadCell()
  }

  get length(): number {
    return this._length
  }

  get status(): SnakeStatus {
    return this._status
  }

  get headX(): number {
    return this._headX
  }

  get headY(): number {
    return this._headY
  }

  get tailX(): number {
    return this._tailX
  }

  get tailY(): number {
    return this._tailY
  }

  get direction(): SnakeDirection {
    return this._direction
  }

  getSnakeCell(direction: SnakeDirection): SnakeCell {
    switch (direction) {
      case SnakeDirection.SNAKE_UP:
        return this.UP
      case SnakeDirection.SNAKE_RIGHT:
        return this.RIGHT
      case SnakeDirection.SNAKE_DOWN:
        return this.DOWN
      case SnakeDirection.SNAKE_LEFT:
        return this.LEFT
      default:
        throw new Error("Wrong direction!")
    }
  }

  _refreshHeadCell(): void {
    this.field.setCell(this._headX, this._headY, this.getSnakeCell(this._direction))
  }

  changeDirection(direction: SnakeDirection): boolean {
    const cell = this.field.getAjacentCell(this._headX, this._headY, direction)
    if (cellIsSnake(cell) && cell.snake === this && isOppositeDirection(direction, cell.direction)) {
      return false
    }
    this._direction = direction
    this._refreshHeadCell()
    return true
  }

  doStep(): void {
    const nextCell = this.field.getAjacentCell(this._headX, this._headY, this._direction)
    switch (nextCell) {
      case CellEnum.EMPTY:
        this.doHeadStep()
        this.doTailStep()
        break
      case CellEnum.FOOD:
        this.doHeadStep()
        break
      case CellEnum.BRICK:
        // do nothing
        break
      case CellEnum.POISON:
        this.doHeadStep()
        this.doTailStep()
        this.doTailStep()
        break
      default:
        this.doBite(nextCell.snake)
    }
  }

  doHeadStep(): void {
    if (this._length <= 0) {
      return
    }
    if (this._moveHeadForward()) {
      this._refreshHeadCell()
      this._length++
    }
  }

  _moveHeadForward(): boolean {
    switch (this._direction) {
      case SnakeDirection.SNAKE_UP:
        if (this._headY === 0) {
          return false
        }
        this._headY--
        break
      case SnakeDirection.SNAKE_RIGHT:
        if (this._headX === this.field.width - 1) {
          return false
        }
        this._headX++
        break
      case SnakeDirection.SNAKE_DOWN:
        if (this._headY === this.field.height - 1) {
          return false
        }
        this._headY++
        break
      case SnakeDirection.SNAKE_LEFT:
        if (this._headX === 0) {
          return false
        }
        this._headX--
        break
      default:
        return false
    }
    return true
  }

  _doTailStep(dropCell: CellEnum): void {
    if (this._length <= 0 || this._status === SnakeStatus.DIED) {
      return
    }
    const tailCell = this.field.getCell(this._tailX, this._tailY)
    if (!cellIsSnake(tailCell)) {
      throw Error("Tail step is not valid! Tail cell is not snake.")
    }
    this.field.setCell(this._tailX, this._tailY, dropCell)
    this._length--
    if (this._length <= 0) {
      this._status = SnakeStatus.DIED
    } else {
      this._moveTailToDirection(tailCell.direction)
    }
  }

  _moveTailToDirection(direction: SnakeDirection): void {
    switch (direction) {
      case SnakeDirection.SNAKE_UP:
        this._tailY--
        break
      case SnakeDirection.SNAKE_RIGHT:
        this._tailX++
        break
      case SnakeDirection.SNAKE_DOWN:
        this._tailY++
        break
      case SnakeDirection.SNAKE_LEFT:
        this._tailX--
        break
    }
  }

  doTailStep(): void {
    this._doTailStep(CellEnum.EMPTY)
  }

  dropFood(): void {
    this._doTailStep(CellEnum.FOOD)
  }

  cut(x: number, y: number): void {
    while (this._tailX !== x && this._tailY !== y) {
      this.dropFood()
    }
    this.doTailStep()
  }

  doBite(snake: Snake | undefined): void {
    if (snake != null) {
      this._moveHeadForward()
      snake.cut(this._headX, this._headY)
      this._refreshHeadCell()
    }
  }
}

export class SnakeCell {
  readonly snake: Snake
  readonly direction: SnakeDirection
  constructor(snake: Snake, direction: SnakeDirection) {
    this.snake = snake
    this.direction = direction
  }
}
