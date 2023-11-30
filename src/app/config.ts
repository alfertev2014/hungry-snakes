export interface GameConfig {
  field: {
    width: number
    height: number
  }
  cellGeneration?: {
    foodCount?: number
    brickCount?: number
    poisonCount?: number
  }
  botGeneration?: {
    count: number
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
