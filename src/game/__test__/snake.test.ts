import { describe, expect, test, beforeEach } from "@jest/globals"
import { GameField } from "../field"
import { Snake, SnakeStatus } from "../snake"
import { DIRECTIONS } from "./const"
import { CellEnum } from "../cell"
import { Direction } from "../direction"

describe("Snakes", () => {
  let field: GameField

  beforeEach(() => {
    field = new GameField(3, 3)
  })

  describe("Created snake", () => {
    test("should have length equal to 1", () => {
      const snake = new Snake(field, 1, 1, Direction.UP)
      expect(snake.length).toBe(1)
    })

    test("should have status NEW", () => {
      const snake = new Snake(field, 1, 1, Direction.UP)
      expect(snake.status).toBe(SnakeStatus.NEW)
    })

    test("should have head and tail cell at the same coords", () => {
      const snake = new Snake(field, 2, 1, Direction.UP)
      expect(snake.headX).toBe(snake.tailX)
      expect(snake.headY).toBe(snake.tailY)
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(1)
    })

    test("should be in field dimentions", () => {
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, -1, 2, Direction.UP)
      }).toThrow()
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, 0, -2, Direction.UP)
      }).toThrow()
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, 3, 2, Direction.UP)
      }).toThrow()
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, 2, 3, Direction.UP)
      }).toThrow()
    })

    test("places snake link UP onto field", () => {
      const snake = new Snake(field, 2, 1, Direction.UP)
      const cell = field.getCell(2, 1)
      expect(cell).toBe(snake.UP)
    })
    test("places snake link RIGHT onto field", () => {
      const snake = new Snake(field, 1, 1, Direction.RIGHT)
      const cell = field.getCell(1, 1)
      expect(cell).toBe(snake.RIGHT)
    })
    test("places snake link DOWN onto field", () => {
      const snake = new Snake(field, 1, 1, Direction.DOWN)
      const cell = field.getCell(1, 1)
      expect(cell).toBe(snake.DOWN)
    })
    test("places snake link LEFT onto field", () => {
      const snake = new Snake(field, 0, 0, Direction.LEFT)
      const cell = field.getCell(0, 0)
      expect(cell).toBe(snake.LEFT)
    })

    test("should not be allowed in place of already existing snakes", () => {
      const snake = new Snake(field, 1, 1, Direction.DOWN)
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, 1, 1, Direction.UP)
      }).toThrow()
      snake.doHeadStep()
      expect(() => {
        // eslint-disable-next-line no-new
        new Snake(field, 1, 2, Direction.UP)
      }).toThrow()
    })
  })

  describe("Doing head step", () => {
    test("should increment snake length 1", () => {
      const snake = new Snake(field, 2, 1, Direction.UP)
      snake.doHeadStep()
      expect(snake.length).toBe(2)
    })
    test("should increment snake length 1 every time", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()
      expect(snake.length).toBe(3)
    })
    test("out of field boundary UP should do nothing", () => {
      const snake = new Snake(field, 1, 0, Direction.UP)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
    })
    test("out of field boundary RIGHT should do nothing", () => {
      const snake = new Snake(field, 2, 0, Direction.RIGHT)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(0)
    })
    test("out of field boundary DOWN should do nothing", () => {
      const snake = new Snake(field, 1, 2, Direction.DOWN)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(2)
    })
    test("out of field boundary LEFT should do nothing", () => {
      const snake = new Snake(field, 0, 2, Direction.LEFT)
      snake.doHeadStep()
      expect(snake.length).toBe(1)
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(2)
    })
    test("to direction UP should move head", () => {
      const snake = new Snake(field, 1, 1, Direction.UP)
      snake.doHeadStep()
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
    })
    test("to direction RIGHT should move head", () => {
      const snake = new Snake(field, 1, 1, Direction.RIGHT)
      snake.doHeadStep()
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(1)
    })
    test("to direction DOWN should move head", () => {
      const snake = new Snake(field, 1, 1, Direction.DOWN)
      snake.doHeadStep()
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(2)
    })
    test("to direction LEFT should move head", () => {
      const snake = new Snake(field, 1, 1, Direction.LEFT)
      snake.doHeadStep()
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(1)
    })
    test("set new head cell to the snake link UP onto field", () => {
      const snake = new Snake(field, 2, 1, Direction.UP)
      snake.doHeadStep()
      const cell = field.getCell(2, 0)
      expect(cell).toBe(snake.UP)
    })
    test("set new head cell to the snake link RIGHT onto field", () => {
      const snake = new Snake(field, 1, 1, Direction.RIGHT)
      snake.doHeadStep()
      const cell = field.getCell(2, 1)
      expect(cell).toBe(snake.RIGHT)
    })
    test("set new head cell to the snake link DOWN onto field", () => {
      const snake = new Snake(field, 1, 1, Direction.DOWN)
      snake.doHeadStep()
      const cell = field.getCell(1, 2)
      expect(cell).toBe(snake.DOWN)
    })
    test("set new head cell to the snake link LEFT onto field", () => {
      const snake = new Snake(field, 1, 1, Direction.LEFT)
      snake.doHeadStep()
      const cell = field.getCell(0, 1)
      expect(cell).toBe(snake.LEFT)
    })
    test("should do nothing when snake is dead", () => {
      const snake = new Snake(field, 1, 1, Direction.LEFT)
      snake.doTailStep()
      expect(snake.length).toBe(0)

      snake.doHeadStep()
      expect(snake.length).toBe(0)
      expect(snake.status).toBe(SnakeStatus.DIED)
      expect(snake.headX).toBe(snake.tailX)
      expect(snake.headY).toBe(snake.tailY)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(1)
    })
    test("should not be allowed right thru the snake cell", () => {
      const snake1 = new Snake(field, 1, 1, Direction.LEFT)
      const snake2 = new Snake(field, 1, 2, Direction.UP)
      expect(() => {
        snake2.doHeadStep()
      }).toThrow()
    })
    test("should do nothing when trying to step to boundary", () => {
      const snake = new Snake(field, 1, 0, Direction.UP)
      snake.doHeadStep()

      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
      expect(snake.length).toBe(1)
    })
  })
  describe("Changing direction", () => {
    test("when length is 1 should change snake direction and snake link", () => {
      const snake = new Snake(field, 1, 1, Direction.LEFT)
      for (const direction of DIRECTIONS) {
        snake.changeDirection(direction)
        expect(snake.direction).toBe(direction)
        expect(field.getCell(snake.headX, snake.headY)).toBe(snake.getSnakeCell(direction))
      }
    })
    test("when length > 1 should not change to opposite of previous direction", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.LEFT)
      expect(snake.direction).toBe(Direction.RIGHT)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.RIGHT)
    })
    test("when length > 1 should not change to opposite of previous direction after turning to the left hand side", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.UP)
      snake.changeDirection(Direction.LEFT)
      expect(snake.direction).toBe(Direction.UP)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.UP)
    })
    test("when length > 1 should not change to opposite of previous direction after turning to the right hand side", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.changeDirection(Direction.LEFT)
      expect(snake.direction).toBe(Direction.DOWN)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.DOWN)
    })
    test("should be allowed for opposite direction when head is turning to the left hand side", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.changeDirection(Direction.UP)
      expect(snake.direction).toBe(Direction.UP)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.UP)
    })
    test("should be allowed for opposite direction when head is turning to the right hand side", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.UP)
      snake.changeDirection(Direction.DOWN)
      expect(snake.direction).toBe(Direction.DOWN)
      expect(field.getCell(snake.headX, snake.headY)).toBe(snake.DOWN)
    })
  })
  describe("Doing tail step", () => {
    test("when length == 2 should decrement length", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()

      snake.doTailStep()
      expect(snake.length).toBe(1)
    })
    test("when length > 2 should decrement length", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()

      snake.doTailStep()
      expect(snake.length).toBe(2)

      snake.doTailStep()
      expect(snake.length).toBe(1)
    })
    test("when length == 1 should kill the snake", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doTailStep()
      expect(snake.length).toBe(0)
      expect(snake.status).toBe(SnakeStatus.DIED)
    })
    test("tail should be moved to tail cell direction", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()

      snake.doTailStep()
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(1)
    })
    test("previous tail cell should become empty", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()

      const tailX = snake.tailX
      const tailY = snake.tailY
      snake.doTailStep()
      expect(field.getCell(tailX, tailY)).toBe(CellEnum.EMPTY)
    })
    test("new tail cell should be still the snake's cell", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.doHeadStep()

      snake.doTailStep()
      snake.doTailStep()
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(1)
      const tailCell = field.getCell(snake.tailX, snake.tailY)
      expect(tailCell).toBe(snake.DOWN)
    })
    test("should do nothing if snake is dead", () => {
      const snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doTailStep()
      expect(snake.length).toBe(0)
      expect(snake.status).toBe(SnakeStatus.DIED)

      snake.doTailStep()
      expect(snake.length).toBe(0)
      expect(snake.status).toBe(SnakeStatus.DIED)
      expect(snake.headX).toBe(snake.tailX)
      expect(snake.headY).toBe(snake.tailY)
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(1)
    })
  })
  describe("Dropping food at tail", () => {
    test("should behave as tail step with dropping food cell", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)

      snake.dropFood()
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(0)
      const tailCell = field.getCell(snake.tailX, snake.tailY)
      expect(tailCell).toBe(snake.DOWN)
      const foodCell = field.getCell(0, 0)
      expect(foodCell).toBe(CellEnum.FOOD)
      expect(snake.length).toBe(1)
    })
  })
})

describe("Snake doing step", () => {
  let field: GameField
  let snake: Snake

  describe("whed field is empty", () => {
    beforeEach(() => {
      field = new GameField(3, 3)
      snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.changeDirection(Direction.RIGHT)
    })

    test("snake length should not change", () => {
      expect(snake.length).toBe(3)

      snake.doStep()

      expect(snake.length).toBe(3)
    })

    test("head and tail should move to its direction", () => {
      snake.doStep()
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(2)
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(1)

      snake.changeDirection(Direction.UP)
      snake.doStep()
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(1)
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(2)
    })
  })

  describe("when snake eats food", () => {
    beforeEach(() => {
      field = new GameField(3, 3)
      snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.changeDirection(Direction.RIGHT)
      field.setCell(2, 2, CellEnum.FOOD)
    })

    test("it should grow", () => {
      expect(snake.length).toBe(3)

      snake.doStep()

      expect(snake.length).toBe(4)
    })
    test("head should move but not tail", () => {
      snake.doStep()
      expect(snake.headX).toBe(2)
      expect(snake.headY).toBe(2)
      expect(snake.tailX).toBe(0)
      expect(snake.tailY).toBe(1)
    })
  })

  describe("when snake hits field boundary", () => {
    beforeEach(() => {
      field = new GameField(3, 3)
      snake = new Snake(field, 0, 1, Direction.RIGHT)
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
    })
    test("snake length should not change", () => {
      expect(snake.length).toBe(3)

      snake.doStep()

      expect(snake.length).toBe(3)
    })
    test("it should not move", () => {
      snake.doStep()
      expect(snake.direction).toBe(Direction.DOWN)
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(2)
      expect(snake.tailX).toBe(0)
      expect(snake.tailY).toBe(1)
    })
  })

  describe("when snake bite itself", () => {
    beforeEach(() => {
      field = new GameField(3, 3)
    })
    test("when bite to tail cell should behave as regular step", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.changeDirection(Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.changeDirection(Direction.LEFT)
      snake.doHeadStep()
      snake.doHeadStep()
      snake.changeDirection(Direction.UP)
      expect(snake.length).toBe(6)

      snake.doStep()
      expect(snake.length).toBe(6)
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(0)
      expect(snake.tailX).toBe(1)
      expect(snake.tailY).toBe(0)
    })
    test("when cutting snake the tail should become food", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.changeDirection(Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.changeDirection(Direction.LEFT)
      snake.doHeadStep()
      snake.doHeadStep()
      snake.changeDirection(Direction.UP)
      expect(snake.length).toBe(6)

      snake.cut(1, 0)
      expect(snake.headX).toBe(0)
      expect(snake.headY).toBe(1)
      expect(snake.tailX).toBe(2)
      expect(snake.tailY).toBe(0)
      expect(snake.length).toBe(4)
    })
    test("when bite to body should cut itself and tail should become food", () => {
      const snake = new Snake(field, 0, 0, Direction.RIGHT)
      snake.changeDirection(Direction.RIGHT)
      snake.doHeadStep()
      snake.doHeadStep()
      snake.changeDirection(Direction.DOWN)
      snake.doHeadStep()
      snake.changeDirection(Direction.LEFT)
      snake.doHeadStep()
      snake.changeDirection(Direction.UP)
      expect(snake.length).toBe(5)

      snake.doStep()
      expect(snake.headX).toBe(1)
      expect(snake.headY).toBe(0)
      expect(snake.tailX).toBe(2)
      expect(snake.tailY).toBe(0)
      expect(field.getCell(0, 0)).toBe(CellEnum.FOOD)
      expect(snake.length).toBe(4)
    })
  })
})
