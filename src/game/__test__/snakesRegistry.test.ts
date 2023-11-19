import { describe, expect, test, beforeEach } from "@jest/globals"
import { SnakesRegistry } from "../snakesRegistry"
import { SnakesField } from "../field"
import { Snake, SnakeDirection } from "../snake"

describe("Snakes registry", () => {
  let field: SnakesField

  beforeEach(() => {
    field = new SnakesField(2, 3)
  })

  test("should be empty when created", () => {
    const snakes = new SnakesRegistry(field)
    expect(snakes.count).toBe(0)
  })

  describe("When creating snakes", () => {
    test("should have size 1 when snake is created", () => {
      const snakes = new SnakesRegistry(field)
      snakes.createSnake(1, 1, SnakeDirection.SNAKE_UP)
      expect(snakes.count).toBe(1)
    })

    test("Just created snake should be in registry", () => {
      const snakes = new SnakesRegistry(field)
      const snake = snakes.createSnake(1, 1, SnakeDirection.SNAKE_UP)
      expect(snakes.contains(snake)).toBeTruthy()
    })

    test("sould contain all create snakes", () => {
      const SNAKE_COUNT = 10
      const snakes = new SnakesRegistry(field)
      const createdSnakes: Snake[] = []
      for (let i = 0; i < SNAKE_COUNT; ++i) {
        const snake = snakes.createSnake(1, 1, SnakeDirection.SNAKE_UP)
        createdSnakes.push(snake)
      }
      expect(snakes.count).toBe(SNAKE_COUNT)
      expect(createdSnakes.every((snake) => snakes.contains(snake))).toBeTruthy()
    })

    test("should not contain unknown snake", () => {
      const SNAKE_COUNT = 10
      const snakes = new SnakesRegistry(field)
      for (let i = 0; i < SNAKE_COUNT; ++i) {
        snakes.createSnake(1, 1, SnakeDirection.SNAKE_UP)
      }

      const unknownSnake = new Snake(field, 1, 2, SnakeDirection.SNAKE_DOWN)
      expect(snakes.contains(unknownSnake)).toBeFalsy()
    })
  })

  describe("When killing snakes", () => {
    const SNAKE_COUNT = 10
    let snakes: SnakesRegistry
    let createdSnakes: Snake[]

    beforeEach(() => {
      snakes = new SnakesRegistry(field)
      createdSnakes = []
      for (let i = 0; i < SNAKE_COUNT; ++i) {
        const snake = snakes.createSnake(1, 1, SnakeDirection.SNAKE_UP)
        createdSnakes.push(snake)
      }
    })

    test("do nothing with registry when killing unknown snake", () => {
      const unknownSnake = new Snake(field, 1, 2, SnakeDirection.SNAKE_DOWN)

      snakes.killSnake(unknownSnake)

      expect(snakes.count).toBe(SNAKE_COUNT)
      expect(createdSnakes.every((snake) => snakes.contains(snake))).toBeTruthy()
    })

    test("killed snake should be removed from registry", () => {
      const snake = createdSnakes[0]

      snakes.killSnake(snake)

      expect(snakes.count).toBe(SNAKE_COUNT - 1)
      expect(snakes.contains(snake)).toBeFalsy()
    })
  })
})
