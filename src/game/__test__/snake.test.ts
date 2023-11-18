import { describe, expect, test, beforeEach } from "@jest/globals"
import { SnakesField } from "../field"
import { Snake, SnakeDirection, SnakeStatus } from "../snake"
import { SNAKE_DIRECTIONS } from "./const"

describe("Snakes", () => {
  let field: SnakesField

  beforeEach(() => {
    field = new SnakesField(3, 3)
  })

  describe("Created snake", () => {
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

    test("places snake link UP onto field", () => {
      const snake = new Snake(field, 2, 1, SnakeDirection.SNAKE_UP)
      const cell = field.getCell(2, 1)
      expect(cell).toBe(snake.UP)
    })
    test("places snake link RIGHT onto field", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_RIGHT)
      const cell = field.getCell(1, 1)
      expect(cell).toBe(snake.RIGHT)
    })
    test("places snake link DOWN onto field", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_DOWN)
      const cell = field.getCell(1, 1)
      expect(cell).toBe(snake.DOWN)
    })
    test("places snake link LEFT onto field", () => {
      const snake = new Snake(field, 0, 0, SnakeDirection.SNAKE_LEFT)
      const cell = field.getCell(0, 0)
      expect(cell).toBe(snake.LEFT)
    })
  })

  describe("Doing head step", () => {    
    test("should increment snake length 1", () => {
      const snake = new Snake(field, 2, 1, SnakeDirection.SNAKE_UP)
      snake.doHeadStep()
      expect(snake.length).toBe(2)
    })
    test("should increment snake length 1 every time", () => {
      const snake = new Snake(field, 0, 0, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()
      expect(snake.length).toBe(3)
    })
    test("out of field boundary UP should do nothing", () => {
      const snake = new Snake(field, 1, 0, SnakeDirection.SNAKE_UP)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
    })
    test("out of field boundary RIGHT should do nothing", () => {
      const snake = new Snake(field, 2, 0, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(0)
    })
    test("out of field boundary DOWN should do nothing", () => {
      const snake = new Snake(field, 1, 2, SnakeDirection.SNAKE_DOWN)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(2)
    })
    test("out of field boundary LEFT should do nothing", () => {
      const snake = new Snake(field, 0, 2, SnakeDirection.SNAKE_LEFT)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(2)
    })
    test("to direction UP should move head", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_UP)
      snake.doHeadStep()
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
    })
    test("to direction RIGHT should move head", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(1)
    })
    test("to direction DOWN should move head", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_DOWN)
      snake.doHeadStep()
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(2)
    })
    test("to direction LEFT should move head", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_LEFT)
      snake.doHeadStep()
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(1)
    })
    test("set new head cell to the snake link UP onto field", () => {
      const snake = new Snake(field, 2, 1, SnakeDirection.SNAKE_UP)
      snake.doHeadStep()
      const cell = field.getCell(2, 0)
      expect(cell).toBe(snake.UP)
    })
    test("set new head cell to the snake link RIGHT onto field", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      const cell = field.getCell(2, 1)
      expect(cell).toBe(snake.RIGHT)
    })
    test("set new head cell to the snake link DOWN onto field", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_DOWN)
      snake.doHeadStep()
      const cell = field.getCell(1, 2)
      expect(cell).toBe(snake.DOWN)
    })
    test("set new head cell to the snake link LEFT onto field", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_LEFT)
      snake.doHeadStep()
      const cell = field.getCell(0, 1)
      expect(cell).toBe(snake.LEFT)
    })
  })
  describe("Changing direction", () => {
    test("when length is 1 should change snake direction and snake link", () => {
      const snake = new Snake(field, 1, 1, SnakeDirection.SNAKE_LEFT)
      for (const direction of SNAKE_DIRECTIONS) {
        snake.changeDirection(direction)
        expect(snake.direction).toBe(direction)
        expect(field.getCell(snake.headX, snake.headY)).toBe(snake.getSnakeCell(direction))
      }
    })
    test("when length > 1 should not change to opposite of previous direction", () => {
      const snake = new Snake(field, 0, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.changeDirection(SnakeDirection.SNAKE_LEFT)
      expect(snake.direction).toBe(SnakeDirection.SNAKE_RIGHT)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.RIGHT)
    })
    test("when length > 1 should not change to opposite of previous direction after turning to the left hand side", () => {
      const snake = new Snake(field, 0, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.changeDirection(SnakeDirection.SNAKE_UP)
      snake.changeDirection(SnakeDirection.SNAKE_LEFT)
      expect(snake.direction).toBe(SnakeDirection.SNAKE_UP)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.UP)
    })
    test("when length > 1 should not change to opposite of previous direction after turning to the right hand side", () => {
      const snake = new Snake(field, 0, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.changeDirection(SnakeDirection.SNAKE_DOWN)
      snake.changeDirection(SnakeDirection.SNAKE_LEFT)
      expect(snake.direction).toBe(SnakeDirection.SNAKE_DOWN)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.DOWN)
    })
    test("should be allowed for opposite direction when head is turning to the left hand side", () => {
      const snake = new Snake(field, 0, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.changeDirection(SnakeDirection.SNAKE_DOWN)
      snake.changeDirection(SnakeDirection.SNAKE_UP)
      expect(snake.direction).toBe(SnakeDirection.SNAKE_UP)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.UP)
    })
    test("should be allowed for opposite direction when head is turning to the right hand side", () => {
      const snake = new Snake(field, 0, 1, SnakeDirection.SNAKE_RIGHT)
      snake.doHeadStep()
      snake.changeDirection(SnakeDirection.SNAKE_UP)
      snake.changeDirection(SnakeDirection.SNAKE_DOWN)
      expect(snake.direction).toBe(SnakeDirection.SNAKE_DOWN)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.DOWN)
    })
  })
})
