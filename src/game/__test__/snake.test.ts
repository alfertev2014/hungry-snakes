import { describe, expect, test, beforeAll } from "@jest/globals"
import { SnakesField } from "../field"
import { Snake, SnakeDirection, SnakeStatus } from "../snake"

describe("Created snake", () => {
  let field: SnakesField

  beforeAll(() => {
    field = new SnakesField(3, 3)
  })

  test("should have length equal to 1", () => {
    const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_UP)
    expect(snake.length).toBe(1)
  })

  test("should have status NEW", () => {
    const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_UP)
    expect(snake.status).toBe(SnakeStatus.NEW)
  })

  test("should have head and tail cell at the same coords", () => {
    const snake = new Snake(field, 2, 1, SnakeDirection.SNAKE_UP)
    expect(snake.headX).toBe(snake.tailX)
    expect(snake.headY).toBe(snake.tailY)
    expect(snake.headX).toBe(2)
    expect(snake.headY).toBe(1)
  })

  test("should be in field dimentions", () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new Snake(field, -1, 2, SnakeDirection.SNAKE_UP)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new Snake(field, 0, -2, SnakeDirection.SNAKE_UP)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new Snake(field, 3, 2, SnakeDirection.SNAKE_UP)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new Snake(field, 2, 3, SnakeDirection.SNAKE_UP)
    }).toThrow()
  })
})