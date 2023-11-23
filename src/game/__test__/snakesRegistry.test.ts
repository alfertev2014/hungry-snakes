import { describe, expect, test, beforeEach } from "@jest/globals"
import { type SnakeControl, SnakesRegistry } from "../snakesRegistry"
import { GameField } from "../field"
import { Direction } from "../direction"

describe("Snakes registry", () => {
  let field: GameField
  let snakes: SnakesRegistry

  beforeEach(() => {
    field = new GameField(2, 3)
    snakes = new SnakesRegistry(field)
  })

  test("should be empty when created", () => {
    expect(snakes.count).toBe(0)
  })

  describe("When creating snakes", () => {
    test("should have size 1 when snake is created", () => {
      snakes.createSnake(1, 1, Direction.UP)
      expect(snakes.count).toBe(1)
    })

    test("Just created snake should be in registry", () => {
      const snake = snakes.createSnake(1, 1, Direction.UP)
      expect(snakes.contains(snake)).toBeTruthy()
    })

    test("sould contain all created snakes", () => {
      const SNAKE_COUNT = 6
      const createdSnakes: SnakeControl[] = []
      for (let y = 0; y < 3; ++y) {
        for (let x = 0; x < 2; ++x) {
          const snake = snakes.createSnake(x, y, Direction.UP)
          createdSnakes.push(snake)
        }
      }
      expect(snakes.count).toBe(SNAKE_COUNT)
      expect(createdSnakes.every((snake) => snakes.contains(snake))).toBeTruthy()
    })
  })

  describe("When killing snakes", () => {
    const SNAKE_COUNT = 4

    test("killed snake should be removed from registry", () => {
      const createdSnakes: SnakeControl[] = []
      for (let y = 0; y < 2; ++y) {
        for (let x = 0; x < 2; ++x) {
          const snake = snakes.createSnake(x, y, Direction.UP)
          createdSnakes.push(snake)
        }
      }
      const snake = createdSnakes[0]

      snakes.killSnake(snake)

      expect(snakes.count).toBe(SNAKE_COUNT - 1)
      expect(snakes.contains(snake)).toBeFalsy()
    })
  })

  describe("When ticking", () => {
    test("should do step for every alive snake", () => {
      const snake1 = snakes.createSnake(0, 0, Direction.RIGHT)
      const snake2 = snakes.createSnake(0, 1, Direction.RIGHT)
      snakes.tick()

      expect(snake1.headX).toBe(1)
      expect(snake1.headY).toBe(0)

      expect(snake2.headX).toBe(1)
      expect(snake2.headY).toBe(1)
    })
    test("should do nothing with dead snakes", () => {
      const snake1 = snakes.createSnake(0, 0, Direction.DOWN)
      const snake2 = snakes.createSnake(0, 1, Direction.RIGHT)
      snake1.doPlayerStep()
      expect(snake1.headX).toBe(0)
      expect(snake1.headY).toBe(1)
      
      snakes.tick()
      
      expect(snake2.length).toBe(0)

      expect(snake2.headX).toBe(0)
      expect(snake2.headY).toBe(1)
    })
  })
})
