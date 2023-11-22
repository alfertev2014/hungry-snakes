import { CellEnum, cellIsSnake } from "./cell"
import { Direction, directionOffsetByX, directionOffsetByY, oppositeDirectionOf } from "./direction"
import { type GameField } from "./field"

export enum SnakeStatus {
  NEW,
  DIED,
}

export class Snake {
  readonly field: GameField

  _headX: number
  _headY: number

  _tailX: number
  _tailY: number

  _length: number
  _status: SnakeStatus

  _direction: Direction
  readonly UP: SnakeCell
  readonly RIGHT: SnakeCell
  readonly DOWN: SnakeCell
  readonly LEFT: SnakeCell
  constructor(field: GameField, headX: number, headY: number, direction: Direction) {
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
    this.UP = new SnakeCell(this, Direction.UP)
    this.RIGHT = new SnakeCell(this, Direction.RIGHT)
    this.DOWN = new SnakeCell(this, Direction.DOWN)
    this.LEFT = new SnakeCell(this, Direction.LEFT)
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

  get direction(): Direction {
    return this._direction
  }

  getSnakeCell(direction: Direction): SnakeCell {
    switch (direction) {
      case Direction.UP:
        return this.UP
      case Direction.RIGHT:
        return this.RIGHT
      case Direction.DOWN:
        return this.DOWN
      case Direction.LEFT:
        return this.LEFT
      default:
        throw new Error("Wrong direction!")
    }
  }

  _refreshHeadCell(): void {
    this.field.setCell(this._headX, this._headY, this.getSnakeCell(this._direction))
  }

  changeDirection(direction: Direction): boolean {
    const cell = this.field.getCell(this._headX + directionOffsetByX(direction), this._headY + directionOffsetByY(direction))
    if (cellIsSnake(cell) && cell.snake === this && oppositeDirectionOf(direction) === cell.direction) {
      return false
    }
    this._direction = direction
    this._refreshHeadCell()
    return true
  }

  doStep(): void {
    const nextCell = this.field.getCell(this._headX + directionOffsetByX(this._direction), this._headY + directionOffsetByY(this._direction))
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
      case Direction.UP:
        if (this._headY === 0) {
          return false
        }
        this._headY--
        break
      case Direction.RIGHT:
        if (this._headX === this.field.width - 1) {
          return false
        }
        this._headX++
        break
      case Direction.DOWN:
        if (this._headY === this.field.height - 1) {
          return false
        }
        this._headY++
        break
      case Direction.LEFT:
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
      this._tailX += directionOffsetByX(tailCell.direction)
      this._tailY += directionOffsetByY(tailCell.direction)
    }
  }

  doTailStep(): void {
    this._doTailStep(CellEnum.EMPTY)
  }

  dropFood(): void {
    this._doTailStep(CellEnum.FOOD)
  }

  cut(x: number, y: number): void {
    while (this._tailX !== x || this._tailY !== y) {
      this.dropFood()
    }
    this.dropFood()
  }

  doBite(snake: Snake | undefined): void {
    if (snake != null) {
      snake.cut(this._headX + directionOffsetByX(this._direction), this._headY + directionOffsetByY(this._direction))
      this.doHeadStep()
    }
  }
}

export class SnakeCell {
  readonly snake: Snake
  readonly direction: Direction
  constructor(snake: Snake, direction: Direction) {
    this.snake = snake
    this.direction = direction
  }
}
