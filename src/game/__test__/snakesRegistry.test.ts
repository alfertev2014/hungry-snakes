import { describe, expect, test, beforeEach } from "@jest/globals"
import { SnakesRegistry } from "../snakesRegistry"
import { GameField } from "../field"
import { Snake } from "../snake"
import { Direction } from "../direction"

describe("Snakes registry", () => {
  let field: GameField

  beforeEach(() => {
    field = new GameField(2, 3)
  })

  test("should be empty when created", () => {
    const snakes = new SnakesRegistry(field)
    expect(snakes.count).toBe(0)
  })

  describe("When creating snakes", () => {
    test("should have size 1 when snake is created", () => {
      const snakes = new SnakesRegistry(field)
      snakes.createSnake(1, 1, Direction.UP)
      expect(snakes.count).toBe(1)
    })

    test("Just created snake should be in registry", () => {
      const snakes = new SnakesRegistry(field)
      const snake = snakes.createSnake(1, 1, Direction.UP)
      expect(snakes.contains(snake)).toBeTruthy()
    })

    test("sould contain all created snakes", () => {
      const SNAKE_COUNT = 6
      const snakes = new SnakesRegistry(field)
      const createdSnakes: Snake[] = []
      for (let y = 0; y < 3; ++y) {
        for (let x = 0; x < 2; ++x) {
          const snake = snakes.createSnake(x, y, Direction.UP)
          createdSnakes.push(snake)
        }
      }
      expect(snakes.count).toBe(SNAKE_COUNT)
      expect(createdSnakes.every((snake) => snakes.contains(snake))).toBeTruthy()
    })

    test("should not contain unknown snake", () => {
      const snakes = new SnakesRegistry(field)
      for (let y = 0; y < 2; ++y) {
        for (let x = 0; x < 2; ++x) {
          snakes.createSnake(x, y, Direction.UP)
        }
      }

      const unknownSnake = new Snake(field, 1, 2, Direction.DOWN)
      expect(snakes.contains(unknownSnake)).toBeFalsy()
    })
  })

  describe("When killing snakes", () => {
    const SNAKE_COUNT = 4
    let snakes: SnakesRegistry
    let createdSnakes: Snake[]

    beforeEach(() => {
      snakes = new SnakesRegistry(field)
      createdSnakes = []
      for (let y = 0; y < 2; ++y) {
        for (let x = 0; x < 2; ++x) {
          const snake = snakes.createSnake(x, y, Direction.UP)
          createdSnakes.push(snake)
        }
      }
    })

    test("do nothing with registry when killing unknown snake", () => {
      const unknownSnake = new Snake(field, 1, 2, Direction.DOWN)

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
