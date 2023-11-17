import { CellEnum, type SnakeDirection } from "../game/cell"
import { type FieldTheme, type FillStyle, type SnakeStyle } from "./theme"

export const defaultTheme: FieldTheme = {
  background: "black",
  food: "gray",
  brick: "brown",
  poison: "purple",
}

export class Viewport {
  readonly canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  theme: FieldTheme
  constructor(canvas: HTMLCanvasElement, theme: FieldTheme = defaultTheme) {
    this.canvas = canvas
    this.theme = theme

    const ctx = this.canvas.getContext("2d")
    if (ctx == null) {
      throw new Error("Failed to get 2d context from canvas")
    }
    this.ctx = ctx
    this.ctx.fillStyle = this.theme.background
  }

  get width(): number {
    return this.canvas.width
  }

  get height(): number {
    return this.canvas.height
  }

  drawCellRect(x: number, y: number, fillStyle: FillStyle): void {}

  drawCell(x: number, y: number, cell: number): void {
    let cellColor: FillStyle = this.theme.background
    switch (cell) {
      case CellEnum.FOOD:
        cellColor = this.theme.food
        break
      case CellEnum.BRICK:
        cellColor = this.theme.brick
        break
      case CellEnum.POISON:
        cellColor = this.theme.poison
        break
    }
    this.drawCellRect(x, y, cellColor)
  }

  drawSnakeCell(x: number, y: number, cell: SnakeDirection, snakeStyle: SnakeStyle): void {}
}
