import { CellEnum, type CellType, cellIsSnake } from "./cell"
import { Direction, directionOffsetByX, directionOffsetByY, oppositeDirectionOf } from "./direction"
import { type GameField } from "./field"

export class Snake {
  readonly field: GameField

  _headX: number
  _headY: number

  _tailX: number
  _tailY: number

  _length: number

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
    if (cellIsSnake(field.getCell(headX, headY))) {
      throw new Error("Creating snake in place of already existing snake")
    }
    this.field = field
    this._headX = headX
    this._headY = headY
    this._tailX = headX
    this._tailY = headY
    this._length = 1
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

  get isDead(): boolean {
    return this._length <= 0
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

  nextHeadCell(direction: Direction): CellType {
    return this.field.getCell(this._headX + directionOffsetByX(direction), this._headY + directionOffsetByY(direction))
  }

  changeDirection(direction: Direction): boolean {
    if (this.isDead) {
      return false
    }
    const cell = this.nextHeadCell(direction)
    if (cellIsSnake(cell) && cell.snake === this && oppositeDirectionOf(direction) === cell.direction) {
      return false
    }
    this._direction = direction
    this._refreshHeadCell()
    return true
  }

  doForcedStep(): void {
    this._doStep(true)
  }

  doStep(): void {
    this._doStep()
  }

  _doStep(force: boolean = false): void {
    if (this.isDead) {
      return
    }
    const nextCell = this.nextHeadCell(this._direction)
    switch (nextCell) {
      case CellEnum.EMPTY:
        this._doHeadStep()
        this.doTailStep()
        break
      case CellEnum.FOOD:
        this._doHeadStep()
        break
      case CellEnum.BOUNDARY:
      case CellEnum.BRICK:
        if (force) {
          this._doTailStep(CellEnum.FOOD)
        }
        break
      case CellEnum.POISON:
        this._doHeadStep()
        this.doTailStep()
        this.doTailStep()
        break
      default: {
        const snake = nextCell.snake
        const biteX = this._headX + directionOffsetByX(this._direction)
        const biteY = this._headY + directionOffsetByY(this._direction)
        const toTail = snake.countToTail(biteX, biteY)
        if (snake === this && !force && toTail > 1) {
          // do nothing
        } else {
          snake.cut(biteX, biteY)
          this._doHeadStep()
        }
      }
    }
  }

  _doHeadStep(): void {
    if (this.isDead) {
      return
    }
    this._headX += directionOffsetByX(this._direction)
    this._headY += directionOffsetByY(this._direction)
    this._refreshHeadCell()
    this._length++
  }

  doHeadStep(): void {
    const nextCell = this.nextHeadCell(this._direction)
    if (cellIsSnake(nextCell)) {
      throw new Error("Doing head step into snake cell")
    }
    if (nextCell !== CellEnum.BOUNDARY) {
      this._doHeadStep()
    }
  }

  _doTailStep(dropCell: CellEnum): void {
    if (this.isDead) {
      return
    }
    const tailCell = this.field.getCell(this._tailX, this._tailY)
    if (!cellIsSnake(tailCell)) {
      throw Error("Tail step is not valid! Tail cell is not snake.")
    }
    this.field.setCell(this._tailX, this._tailY, dropCell)
    this._length--
    if (this._length > 0) {
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
    const cutCell = this.field.getCell(x, y)
    if (cellIsSnake(cutCell) && cutCell.snake === this) {
      while (this._tailX !== x || this._tailY !== y) {
        this.dropFood()
      }
      this.dropFood()
    }
  }

  countToTail(x: number, y: number): number {
    const cutCell = this.field.getCell(x, y)
    if (cellIsSnake(cutCell) && cutCell.snake === this) {
      let count = 1
      let tailX = this.tailX
      let tailY = this.tailY
      while (tailX !== x || tailY !== y) {
        const tailCell = this.field.getCell(tailX, tailY)
        if (!cellIsSnake(tailCell)) {
          throw Error("Tail counting is not valid! Cell is not snake.")
        }
        tailX += directionOffsetByX(tailCell.direction)
        tailY += directionOffsetByY(tailCell.direction)

        count++
      }
      return count
    }
    return 0
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
