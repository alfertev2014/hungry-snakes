import { describe, expect, test } from "@jest/globals"
import {
  CellEnum,
  type SnakeDirection,
  cellGetSnakeDirection,
  cellGetSnakeId,
  cellIsSnake,
  makeSnakeCell,
} from "../cell"

const nonSnakeType = [CellEnum.EMPTY, CellEnum.FOOD, CellEnum.BRICK, CellEnum.POISON]
const snakeDirections: SnakeDirection[] = [
  CellEnum.SNAKE_UP,
  CellEnum.SNAKE_RIGHT,
  CellEnum.SNAKE_DOWN,
  CellEnum.SNAKE_LEFT,
]

describe("Make snake cell with direction", () => {
  test("should not be non-snake cell", () => {
    const snakeId = 42
    for (const direction of snakeDirections) {
      const cell = makeSnakeCell(snakeId, direction)
      expect(cell).not.toBe(CellEnum.EMPTY)
      expect(cell).not.toBe(CellEnum.FOOD)
      expect(cell).not.toBe(CellEnum.POISON)
      expect(cell).not.toBe(CellEnum.BRICK)
    }
  })

  test("should have sign of snake", () => {
    const snakeId = 42
    for (const direction of snakeDirections) {
      const cell = makeSnakeCell(snakeId, direction)
      expect(cellIsSnake(cell)).toBe(true)
    }
  })

  test("should have the same direction and snake id", () => {
    const snakeId = 42
    for (const direction of snakeDirections) {
      const cell = makeSnakeCell(snakeId, direction)
      expect(cellGetSnakeId(cell)).toBe(snakeId)
      expect(cellGetSnakeDirection(cell)).toBe(direction)
    }
  })
})

describe("Non-snake cell", () => {
  test("sould not be snake", () => {
    for (const nonSnake of nonSnakeType) {
      expect(cellIsSnake(nonSnake)).toBe(false)
      expect(cellGetSnakeDirection(nonSnake)).toBeUndefined()
      expect(cellGetSnakeId(nonSnake)).toBeUndefined()
    }
  })
})
