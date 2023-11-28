import { describe, expect, test } from "@jest/globals"
import { cellIsSnake } from "../cell"
import { Snake } from "../snake"
import { GameField } from "../field"
import { NON_SNAKE_CELL_TYPES, DIRECTIONS } from "./const"
import { Direction } from "../direction"

describe("Snake cell with direction", () => {
  test("should have sign of snake", () => {
    const field = new GameField(3, 3)
    const snake = new Snake(field, 1, 1, Direction.UP)
    for (const direction of DIRECTIONS) {
      const cell = snake.getSnakeCell(direction)
      expect(cellIsSnake(cell)).toBe(true)
    }
  })

  test("should have the same direction and snake id", () => {
    const field = new GameField(3, 3)
    const snake = new Snake(field, 1, 1, Direction.UP)
    for (const direction of DIRECTIONS) {
      const cell = snake.getSnakeCell(direction)
      expect(cell.snake).toBe(snake)
      expect(cell.direction).toBe(direction)
    }
  })
})

describe("Non-snake cell", () => {
  test("sould not be snake", () => {
    for (const nonSnake of NON_SNAKE_CELL_TYPES) {
      expect(cellIsSnake(nonSnake)).toBe(false)
    }
  })
})
