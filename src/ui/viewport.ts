import { CellEnum } from "../game/cell"
import { type SnakeStyle, type DrawingOutput } from "../game/output"
import { type SnakeDirection } from "../game/snake"
import { type DrawingSnakeStyle, type FieldTheme, type FillStyle } from "./theme"

export const defaultTheme: FieldTheme = {
  background: "black",
  food: "gray",
  brick: "brown",
  poison: "purple",
}

export const defaultSnakeStyle: DrawingSnakeStyle = {
  color: "green"
}

export class Viewport implements DrawingOutput {
  readonly _canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  theme: FieldTheme
  readonly gameWidth: number
  readonly gameHeight: number
  constructor(canvas: HTMLCanvasElement, gameWidth: number, gameHeight: number, theme: FieldTheme = defaultTheme) {
    this._canvas = canvas
    this.gameWidth = gameWidth
    this.gameHeight = gameHeight
    this.theme = theme

    const ctx = this._canvas.getContext("2d")
    if (ctx == null) {
      throw new Error("Failed to get 2d context from canvas")
    }
    this.ctx = ctx
    this.ctx.fillStyle = this.theme.background
  }
  
  get width(): number {
    return this._canvas.width
  }

  get height(): number {
    return this._canvas.height
  }
  
  clearWithBackground(): void {

    this.ctx.fillStyle = this.theme.background
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  drawCellRect(x: number, y: number, fillStyle: FillStyle): void {
    const w = this.width / this.gameWidth;
    const h = this.height / this.gameHeight;
    const screenX = x * w;
    const screenY = y * h;

    this.ctx.fillStyle = fillStyle
    this.ctx.fillRect(screenX, screenY, w, h);
  }

  drawCell(x: number, y: number, cell: CellEnum): void {
    if (cell === CellEnum.EMPTY) {
      return
    }
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

  drawSnakeCell(
    style: SnakeStyle | null,
    x: number,
    y: number,
    cellNumber: number,
    direction: SnakeDirection,
    nextDirection?: SnakeDirection,
  ): void {
    const snakeStyle: DrawingSnakeStyle = style as DrawingSnakeStyle ?? defaultSnakeStyle
    this.drawCellRect(x, y, snakeStyle.color)
  }
}
