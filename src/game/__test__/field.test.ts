import { describe, expect, test, beforeAll } from "@jest/globals"
import { GameField } from "../field"
import { CellEnum } from "../cell"
import { NON_SNAKE_CELL_TYPES, DIRECTIONS } from "./const"
import { Snake } from "../snake"
import { Direction } from "../direction"

describe("Just created field", () => {
  test("should be with positive dimentions", () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new GameField(0, 0)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new GameField(0, 42)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new GameField(24, 0)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new GameField(-1, 66)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new GameField(100500, -2)
    }).toThrow()
  })

  test("should contain only empty cells", () => {
    const field = new GameField(2, 2)
    expect(field.getCell(0, 0)).toBe(CellEnum.EMPTY)
    expect(field.getCell(0, 1)).toBe(CellEnum.EMPTY)
    expect(field.getCell(1, 0)).toBe(CellEnum.EMPTY)
    expect(field.getCell(1, 1)).toBe(CellEnum.EMPTY)
  })
})

describe("Field as cell storage", () => {
  test("should store any value in any cell", () => {
    const field = new GameField(2, 3)
    const snake = new Snake(field, 1, 1, Direction.DOWN)
    for (let x = 0; x < 2; ++x) {
      for (let y = 0; y < 3; ++y) {
        for (const direction of DIRECTIONS) {
          const value = snake.getSnakeCell(direction)
          expect(field.getCell(x, y)).not.toBe(value)
          field.setCell(x, y, value)
          expect(field.getCell(x, y)).toBe(value)
        }
        for (const value of NON_SNAKE_CELL_TYPES) {
          expect(field.getCell(x, y)).not.toBe(value)
          field.setCell(x, y, value)
          expect(field.getCell(x, y)).toBe(value)
        }
      }
    }
  })

  describe("should get brick adjacent cells at boundaries", () => {
    let field: GameField
    const boundaryCell = CellEnum.BRICK

    beforeAll(() => {
      field = new GameField(3, 3)
    })

    test("for up case", () => {
      for (let x = 0; x < 3; ++x) {
        const upValue = field.getCell(x, -1)
        expect(upValue).toBe(boundaryCell)
      }
    })

    test("for right case", () => {
      for (let y = 0; y < 3; ++y) {
        const rightValue = field.getCell(3, y)
        expect(rightValue).toBe(boundaryCell)
      }
    })

    test("for down case", () => {
      for (let x = 0; x < 3; ++x) {
        const downValue = field.getCell(x, 3)
        expect(downValue).toBe(boundaryCell)
      }
    })

    test("for left case", () => {
      for (let y = 0; y < 3; ++y) {
        const leftValue = field.getCell(-1, y)
        expect(leftValue).toBe(boundaryCell)
      }
    })
  })
})
