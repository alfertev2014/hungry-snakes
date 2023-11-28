import { type SnakeStyle } from "../game/output"

export type FillStyle = string

export interface FieldTheme {
  background: FillStyle
  food: FillStyle
  brick: FillStyle
  poison: FillStyle
}

export interface DrawingSnakeStyle extends SnakeStyle {
  color: FillStyle
  headColor?: FillStyle
}
