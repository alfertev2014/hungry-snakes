import { describe, expect, test, jest } from "@jest/globals"
import { SnakesGame } from "../game"
import { SnakeDirection } from "../snake"
import { CellEnum } from "../cell"

describe("Creating game", () => {
  test("should have specified dimensions", () => {
    const game = new SnakesGame(2, 3)
    expect(game.width).toBe(2)
    expect(game.height).toBe(3)
  })
  test("should have 0 snakes", () => {
    const game = new SnakesGame(3, 3)
    expect(game.snakesCount).toBe(0)
  })

  test("should have 1 snake after creating player snake", () => {
    const game = new SnakesGame(3, 3)
    game.createPlayerSnake(1, 1, SnakeDirection.SNAKE_UP)
    expect(game.snakesCount).toBe(1)
  })
  test("should allow placing cells on the field", () => {
    const game = new SnakesGame(3, 3)
    game.putCell(1, 1, CellEnum.FOOD)
    const cell = game.getCell(1, 1)
    expect(cell).toBe(CellEnum.FOOD)
  })
})

describe("Drawing game", () => {
  test("without output should do nothing", () => {
    const game = new SnakesGame(3, 3)
    expect(game.output).toBeNull()
    game.draw()
  })
  test("with output for empty field", () => {
    const game = new SnakesGame(2, 3)
    const output = {
      clearWithBackground: jest.fn(),
      drawCell: jest.fn(),
      drawSnakeCell: jest.fn(),
    }
    game.output = output
    game.draw()

    expect(output.clearWithBackground).toBeCalledTimes(1)
    expect(output.drawCell).toBeCalledTimes(2 * 3)
    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 2; ++x) {
        const callNumber = x + y * 2
        expect(output.drawCell.mock.calls[callNumber]).toEqual([x, y, CellEnum.EMPTY])
      }
    }
  })

  test("with output for field with non-empty cells and snakes", () => {
    const game = new SnakesGame(2, 2)
    game.putCell(0, 0, CellEnum.FOOD)
    game.putCell(0, 1, CellEnum.BRICK)
    game.putCell(1, 0, CellEnum.POISON)
    game.createPlayerSnake(1, 1, SnakeDirection.SNAKE_UP)
    const output = {
      clearWithBackground: jest.fn(),
      drawCell: jest.fn(),
      drawSnakeCell: jest.fn(),
    }
    game.output = output
    game.draw()

    expect(output.clearWithBackground).toBeCalledTimes(1)
    expect(output.drawCell).toBeCalledTimes(3)
    expect(output.drawCell.mock.calls[0]).toEqual([0, 0, CellEnum.FOOD])
    expect(output.drawCell.mock.calls[1]).toEqual([1, 0, CellEnum.POISON])
    expect(output.drawCell.mock.calls[2]).toEqual([0, 1, CellEnum.BRICK])

    expect(output.drawSnakeCell).toBeCalledTimes(1)
    expect(output.drawSnakeCell.mock.calls[0][1]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[0][2]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[0][3]).toBe(0)
    expect(output.drawSnakeCell.mock.calls[0][4]).toBe(SnakeDirection.SNAKE_UP)
  })

  test("should draw snake from tail to head", () => {
    const game = new SnakesGame(3, 3)
    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        game.putCell(x, y, CellEnum.FOOD)
      }
    }
    game.createPlayerSnake(2, 2, SnakeDirection.SNAKE_LEFT)
    game.onArrowPressed(SnakeDirection.SNAKE_LEFT)
    game.doPlayerStep()
    game.onArrowPressed(SnakeDirection.SNAKE_UP)
    game.onArrowPressed(SnakeDirection.SNAKE_RIGHT)

    const output = {
      clearWithBackground: jest.fn(),
      drawCell: jest.fn(),
      drawSnakeCell: jest.fn(),
    }
    game.output = output
    game.draw()

    expect(output.clearWithBackground).toBeCalledTimes(1)
    expect(output.drawCell).toBeCalledTimes(4)

    expect(output.drawSnakeCell).toBeCalledTimes(5)
    expect(output.drawSnakeCell.mock.calls[0][1]).toBe(2)
    expect(output.drawSnakeCell.mock.calls[0][2]).toBe(2)
    expect(output.drawSnakeCell.mock.calls[0][3]).toBe(4)
    expect(output.drawSnakeCell.mock.calls[0][4]).toBe(SnakeDirection.SNAKE_LEFT)
    expect(output.drawSnakeCell.mock.calls[0][5]).toBeUndefined()

    expect(output.drawSnakeCell.mock.calls[1][1]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[1][2]).toBe(2)
    expect(output.drawSnakeCell.mock.calls[1][3]).toBe(3)
    expect(output.drawSnakeCell.mock.calls[1][4]).toBe(SnakeDirection.SNAKE_LEFT)
    expect(output.drawSnakeCell.mock.calls[1][5]).toBe(SnakeDirection.SNAKE_LEFT)

    expect(output.drawSnakeCell.mock.calls[2][1]).toBe(0)
    expect(output.drawSnakeCell.mock.calls[2][2]).toBe(2)
    expect(output.drawSnakeCell.mock.calls[2][3]).toBe(2)
    expect(output.drawSnakeCell.mock.calls[2][4]).toBe(SnakeDirection.SNAKE_UP)
    expect(output.drawSnakeCell.mock.calls[2][5]).toBe(SnakeDirection.SNAKE_LEFT)

    expect(output.drawSnakeCell.mock.calls[3][1]).toBe(0)
    expect(output.drawSnakeCell.mock.calls[3][2]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[3][3]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[3][4]).toBe(SnakeDirection.SNAKE_RIGHT)
    expect(output.drawSnakeCell.mock.calls[3][5]).toBe(SnakeDirection.SNAKE_UP)

    expect(output.drawSnakeCell.mock.calls[4][1]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[4][2]).toBe(1)
    expect(output.drawSnakeCell.mock.calls[4][3]).toBe(0)
    expect(output.drawSnakeCell.mock.calls[4][4]).toBe(SnakeDirection.SNAKE_RIGHT)
    expect(output.drawSnakeCell.mock.calls[4][5]).toBe(SnakeDirection.SNAKE_RIGHT)
  })
})
