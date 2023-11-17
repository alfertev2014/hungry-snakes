import { describe, expect, test, beforeAll } from "@jest/globals"
import { SnakesField } from "../field"
import { CellEnum } from "../cell"

describe("Just created field", () => {
  test("should be with positive dimentions", () => {
    expect(() => {
      // eslint-disable-next-line no-new
      new SnakesField(0, 0)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new SnakesField(0, 42)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new SnakesField(24, 0)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new SnakesField(-1, 66)
    }).toThrow()
    expect(() => {
      // eslint-disable-next-line no-new
      new SnakesField(100500, -2)
    }).toThrow()
  })

  test("should contain only empty cells", () => {
    const field = new SnakesField(2, 2)
    expect(field.getCell(0, 0)).toBe(CellEnum.EMPTY)
    expect(field.getCell(0, 1)).toBe(CellEnum.EMPTY)
    expect(field.getCell(1, 0)).toBe(CellEnum.EMPTY)
    expect(field.getCell(1, 1)).toBe(CellEnum.EMPTY)
  })

  test("should have no snakes yet", () => {
    const field = new SnakesField(2, 2)
    expect(field.snakeCount).toBe(0)
  })
})

describe("Field as cell storage", () => {
  test("should store any value in any cell", () => {
    const field = new SnakesField(2, 3)
    for (let x = 0; x < 2; ++x) {
      for (let y = 0; y < 3; ++y) {
        const value = x * y + CellEnum.SNAKE_LEFT
        expect(field.getCell(x, y)).not.toBe(value)
        field.setCell(x, y, value)
        expect(field.getCell(x, y)).toBe(value)
      }
    }
  })

  describe("should get correct value from adjacent cells", () => {
    let field: SnakesField
    const value = 42

    beforeAll(() => {
      field = new SnakesField(3, 3)
      field.setCell(1, 1, value)
    })

    test("for up case", () => {
      const upValue = field.getAjacentCell(1, 2, CellEnum.SNAKE_UP)
      expect(upValue).toBe(value)
    })

    test("for right case", () => {
      const rightValue = field.getAjacentCell(0, 1, CellEnum.SNAKE_RIGHT)
      expect(rightValue).toBe(value)
    })

    test("for down case", () => {
      const downValue = field.getAjacentCell(1, 0, CellEnum.SNAKE_DOWN)
      expect(downValue).toBe(value)
    })

    test("for left case", () => {
      const leftValue = field.getAjacentCell(2, 1, CellEnum.SNAKE_LEFT)
      expect(leftValue).toBe(value)
    })
  })

  describe("should get brick adjacent cells at boundaries", () => {
    let field: SnakesField
    const boundaryCell = CellEnum.BRICK

    beforeAll(() => {
      field = new SnakesField(3, 3)
    })

    test("for up case", () => {
      for (let x = 0; x < 3; ++x) {
        const upValue = field.getAjacentCell(x, 0, CellEnum.SNAKE_UP)
        expect(upValue).toBe(boundaryCell)
      }
    })

    test("for right case", () => {
      for (let y = 0; y < 3; ++y) {
        const rightValue = field.getAjacentCell(2, y, CellEnum.SNAKE_RIGHT)
        expect(rightValue).toBe(boundaryCell)
      }
    })

    test("for down case", () => {
      for (let x = 0; x < 3; ++x) {
        const downValue = field.getAjacentCell(x, 2, CellEnum.SNAKE_DOWN)
        expect(downValue).toBe(boundaryCell)
      }
    })

    test("for left case", () => {
      for (let y = 0; y < 3; ++y) {
        const leftValue = field.getAjacentCell(0, y, CellEnum.SNAKE_LEFT)
        expect(leftValue).toBe(boundaryCell)
      }
    })
  })
})
