import { describe, expect, test, jest } from "@jest/globals"
import { SnakesGame } from "../game"
import { CellEnum } from "../cell"
import { Direction } from "../direction"

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
  test("should have no player snake", () => {
    const game = new SnakesGame(3, 3)
    expect(game.isPlayerAlive).toBeFalsy()
  })
  test("should have 1 snake after creating player snake", () => {
    const game = new SnakesGame(3, 3)
    game.createPlayerSnake(1, 1, Direction.UP)
    expect(game.snakesCount).toBe(1)
    expect(game.isPlayerAlive).toBeTruthy()
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
    game.createPlayerSnake(1, 1, Direction.UP)
    const output = {
      clearWithBackground: jest.fn(),
      drawCell: jest.fn(),
      drawSnakeCell: jest.fn(),
    }
    game.output = output
    game.draw()

    expect(output.clearWithBackground).toBeCalledTimes(1)
    expect(output.drawCell).toBeCalledTimes(3)
    expect(output.drawCell).toHaveBeenNthCalledWith(1, 0, 0, CellEnum.FOOD)
    expect(output.drawCell).toHaveBeenNthCalledWith(2, 1, 0, CellEnum.POISON)
    expect(output.drawCell).toHaveBeenNthCalledWith(3, 0, 1, CellEnum.BRICK)

    expect(output.drawSnakeCell).toBeCalledTimes(1)
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(1, null, 1, 1, 0, Direction.UP, undefined)
  })

  test("should draw snake from tail to head", () => {
    const game = new SnakesGame(3, 3)
    for (let y = 0; y < 3; ++y) {
      for (let x = 0; x < 3; ++x) {
        game.putCell(x, y, CellEnum.FOOD)
      }
    }
    game.createPlayerSnake(2, 2, Direction.LEFT)
    game.onArrowPressed(Direction.LEFT)
    game.doPlayerStep()
    game.onArrowPressed(Direction.UP)
    game.onArrowPressed(Direction.RIGHT)

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
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(1, null, 2, 2, 4, Direction.LEFT, undefined)
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(2, null, 1, 2, 3, Direction.LEFT, Direction.LEFT)
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(3, null, 0, 2, 2, Direction.UP, Direction.LEFT)
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(4, null, 0, 1, 1, Direction.RIGHT, Direction.UP)
    expect(output.drawSnakeCell).toHaveBeenNthCalledWith(5, null, 1, 1, 0, Direction.RIGHT, Direction.RIGHT)
  })
})

describe("Ticking game", () => {
  test("should not change game if no snakes on field", () => {
    const game = new SnakesGame(2, 2)
    game.putCell(0, 0, CellEnum.FOOD)
    game.putCell(0, 1, CellEnum.BRICK)
    game.putCell(1, 0, CellEnum.POISON)

    game.tick()

    expect(game.getCell(0, 0)).toBe(CellEnum.FOOD)
    expect(game.getCell(0, 1)).toBe(CellEnum.BRICK)
    expect(game.getCell(1, 0)).toBe(CellEnum.POISON)
    expect(game.getCell(1, 1)).toBe(CellEnum.EMPTY)

    expect(game.snakesCount).toBe(0)
    expect(game.isPlayerAlive).toBeFalsy()
  })
  test("should do player snake step to its direction", () => {
    const game = new SnakesGame(2, 2)
    game.createPlayerSnake(0, 0, Direction.RIGHT)

    game.tick()

    expect(game.getCell(1, 0)).toBe(game.playerSnake?.RIGHT)
    expect(game.getCell(0, 0)).toBe(CellEnum.EMPTY)
  })
})
