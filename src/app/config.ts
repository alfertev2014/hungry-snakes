export type GameConfig = {
  readonly field: {
    readonly width: number
    readonly height: number
  }
  readonly cellGeneration: {
    readonly foodCount?: number
    readonly brickCount?: number
    readonly poisonCount?: number
  }
  readonly botGeneration: {
    readonly count: number
  }
}

export const defaultGameConfig: GameConfig = {
  field: {
    width: 120,
    height: 90,
  },
  cellGeneration: {
    foodCount: 2000,
    brickCount: 50,
    poisonCount: 50,
  },
  botGeneration: {
    count: 20,
  },
}
