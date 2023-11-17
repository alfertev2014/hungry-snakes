import {
  CellEnum,
  cellGetSnakeDirection,
  cellGetSnakeId,
  isOppositeDirection,
  makeSnakeCell,
  type SnakeDirection,
} from "./cell"
import { type SnakesField } from "./field"

export class Snake {
  readonly field: SnakesField
  readonly id: number
  _direction: SnakeDirection

  _headX: number
  _headY: number

  _tailX: number
  _tailY: number

  constructor(field: SnakesField, id: number, headX: number, headY: number, direction: SnakeDirection) {
    this.field = field
    this.id = id
    this._headX = headX
    this._headY = headY
    this._tailX = headX
    this._tailY = headY
    this._direction = direction
    this.refreshHeadCell()
  }

  refreshHeadCell(): void {
    this.field.setCell(this._headX, this._headY, makeSnakeCell(this.id, this._direction))
  }

  changeDirection(direction: SnakeDirection): boolean {
    const cell = this.field.getAjacentCell(this._headX, this._headY, direction)
    if (cellGetSnakeId(cell) === this.id && isOppositeDirection(direction, cellGetSnakeDirection(cell))) {
      return false
    }
    this._direction = direction
    this.refreshHeadCell()
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
        this.doTailStep()
        break
      case CellEnum.POISON:
        this.doHeadStep()
        this.doTailStep()
        this.doTailStep()
        break
      default:
        this.doBite(cellGetSnakeId(nextCell))
    }
  }

  doHeadStep(): void {
    this.moveHeadForward()
    this.refreshHeadCell()
  }

  moveHeadForward(): void {
    switch (this._direction) {
      case CellEnum.SNAKE_UP:
        this._headY--
        break
      case CellEnum.SNAKE_RIGHT:
        this._headX++
        break
      case CellEnum.SNAKE_DOWN:
        this._headY++
        break
      case CellEnum.SNAKE_LEFT:
        this._headX--
        break
    }
  }

  doTailStep(): void {
    const tailCell = this.field.getCell(this._tailX, this._tailY)
    const direction = cellGetSnakeDirection(tailCell)
    if (direction == null) {
      throw Error("Tail step is not valid! Direction is undefined")
    }
    this.field.setCell(this._tailX, this._tailY, CellEnum.EMPTY)
    this.moveTailToDirection(direction)
  }

  moveTailToDirection(direction: SnakeDirection): void {
    switch (direction) {
      case CellEnum.SNAKE_UP:
        this._tailY--
        break
      case CellEnum.SNAKE_RIGHT:
        this._tailX++
        break
      case CellEnum.SNAKE_DOWN:
        this._tailY++
        break
      case CellEnum.SNAKE_LEFT:
        this._tailX--
        break
    }
  }

  doBite(snakeId: number | undefined): void {
    if (snakeId != null) {
      const snake = this.field.getSnakeById(snakeId)
      if (snake != null) {
        this.moveHeadForward()
        snake.cut(this._headX, this._headY)
        this.refreshHeadCell()
      }
    }
  }

  cut(x: number, y: number): void {
    while (this._tailX !== x && this._tailY !== y) {
      this.dropFood()
    }
    this.doTailStep()
  }

  dropFood(): void {
    const tailDirection = cellGetSnakeDirection(this.field.getCell(this._tailX, this._tailY))
    if (tailDirection == null) {
      throw new Error("Failed to do drop food from tail! Undefined tail direction")
    }
    this.field.setCell(this._tailX, this._tailY, CellEnum.FOOD)
    this.moveTailToDirection(tailDirection)
  }

  die(): void {
    this.field.killSnake(this.id)
  }
}
