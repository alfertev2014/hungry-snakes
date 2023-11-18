import {
  CellEnum,
  cellIsSnake,
} from "./cell"
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

export class Snake {
  readonly field: SnakesField
  _direction: SnakeDirection

  _headX: number
  _headY: number

  _tailX: number
  _tailY: number

  readonly UP: SnakeCell
  readonly RIGHT: SnakeCell
  readonly DOWN: SnakeCell
  readonly LEFT: SnakeCell

  constructor(field: SnakesField, headX: number, headY: number, direction: SnakeDirection) {
    this.field = field
    this._headX = headX
    this._headY = headY
    this._tailX = headX
    this._tailY = headY
    this._direction = direction
    this.UP = new SnakeCell(this, SnakeDirection.SNAKE_UP)
    this.RIGHT = new SnakeCell(this, SnakeDirection.SNAKE_RIGHT)
    this.DOWN = new SnakeCell(this, SnakeDirection.SNAKE_DOWN)
    this.LEFT = new SnakeCell(this, SnakeDirection.SNAKE_LEFT)
    this.refreshHeadCell()
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

  refreshHeadCell(): void {
    this.field.setCell(this._headX, this._headY, this.getSnakeCell(this._direction))
  }

  changeDirection(direction: SnakeDirection): boolean {
    const cell = this.field.getAjacentCell(this._headX, this._headY, direction)
    if (cellIsSnake(cell) && cell.snake === this && isOppositeDirection(direction, cell.direction)) {
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
        this.doBite(nextCell.snake)
    }
  }

  doHeadStep(): void {
    this.moveHeadForward()
    this.refreshHeadCell()
  }

  moveHeadForward(): void {
    switch (this._direction) {
      case SnakeDirection.SNAKE_UP:
        this._headY--
        break
      case SnakeDirection.SNAKE_RIGHT:
        this._headX++
        break
      case SnakeDirection.SNAKE_DOWN:
        this._headY++
        break
      case SnakeDirection.SNAKE_LEFT:
        this._headX--
        break
    }
  }

  doTailStep(): void {
    const tailCell = this.field.getCell(this._tailX, this._tailY)
    if (!cellIsSnake(tailCell)) {
      throw Error("Tail step is not valid! Tail cell is not snake.")
    }
    const direction = tailCell.direction
    this.field.setCell(this._tailX, this._tailY, CellEnum.EMPTY)
    this.moveTailToDirection(direction)
  }

  moveTailToDirection(direction: SnakeDirection): void {
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

  doBite(snake: Snake | undefined): void {
    if (snake != null) {
      this.moveHeadForward()
      snake.cut(this._headX, this._headY)
      this.refreshHeadCell()
    }
  }

  cut(x: number, y: number): void {
    while (this._tailX !== x && this._tailY !== y) {
      this.dropFood()
    }
    this.doTailStep()
  }

  dropFood(): void {
    const tailCell = this.field.getCell(this._tailX, this._tailY)
    if (!cellIsSnake(tailCell)) {
      throw new Error("Failed to do drop food from tail! Tail cell is not snake.")
    }
    this.field.setCell(this._tailX, this._tailY, CellEnum.FOOD)
    this.moveTailToDirection(tailCell.direction)
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