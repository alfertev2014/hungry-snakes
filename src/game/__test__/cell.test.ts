import { describe, expect, test } from "@jest/globals"
import { cellIsSnake } from "../cell"
import { Snake, SnakeDirection } from "../snake"
import { SnakesField } from "../field"
import { NON_SNAKE_CELL_TYPES, SNAKE_DIRECTIONS } from "./const"

describe("Snake cell with direction", () => {
  test("should have sign of snake", () => {
    const field = new SnakesField(3, 3)
    const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_UP)
    for (const direction of SNAKE_DIRECTIONS) {
      const cell = snake.getSnakeCell(direction)
      expect(cellIsSnake(cell)).toBe(true)
    }
  })

  test("should have the same direction and snake id", () => {
    const field = new SnakesField(3, 3)
    const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_UP)
    for (const direction of SNAKE_DIRECTIONS) {
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
