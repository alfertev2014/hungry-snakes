import { type GameConfig } from "../../config"
import { FwParent, type FwComponent } from "../fw"
import { queryChild, queryTemplate } from "../utils"

import "./style.css"

export interface NewGameFormProps {
  initConfig: GameConfig
  onSubmit: (config: GameConfig) => void
}

const NewGameForm: FwComponent<NewGameFormProps> = ({ initConfig, onSubmit }) => {
  const template = queryTemplate("NewGameForm")
  const content = template.content.cloneNode(true) as DocumentFragment
  const root: FwParent = new FwParent()

  const config = { ...initConfig }

  const inputWidth = queryChild<HTMLInputElement>(content, '[name="width"]')
  inputWidth.valueAsNumber = config.field.width
  root.createEventHandler(inputWidth, "change", function handleWidthChange(this: HTMLInputElement, ev: Event): void {
    config.field.width = this.valueAsNumber
  })

  const inputHeight = queryChild<HTMLInputElement>(content, '[name="height"]')
  inputHeight.valueAsNumber = config.field.height
  root.createEventHandler(inputHeight, "change", function handleHeightChange(this: HTMLInputElement, ev: Event): void {
    config.field.height = this.valueAsNumber
  })

  const inputFood = queryChild<HTMLInputElement>(content, '[name="foodCount"]')
  inputFood.valueAsNumber = config.cellGeneration?.foodCount ?? 0
  root.createEventHandler(inputFood, "change", function handleFoodChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, foodCount: this.valueAsNumber }
  })

  const inputBrick = queryChild<HTMLInputElement>(content, '[name="brickCount"]')
  inputBrick.valueAsNumber = config.cellGeneration?.brickCount ?? 0
  root.createEventHandler(inputBrick, "change", function handleBrickChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, brickCount: this.valueAsNumber }
  })

  const inputPoison = queryChild<HTMLInputElement>(content, '[name="poisonCount"]')
  inputPoison.valueAsNumber = config.cellGeneration?.poisonCount ?? 0
  root.createEventHandler(inputPoison, "change", function handlePoisonChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, poisonCount: this.valueAsNumber }
  })

  const inputBot = queryChild<HTMLInputElement>(content, '[name="botCount"]')
  inputBot.valueAsNumber = config.botGeneration?.count ?? 0
  root.createEventHandler(inputBot, "change", function handleBotChange(this: HTMLInputElement, ev: Event): void {
    config.botGeneration = { ...config.botGeneration, count: this.valueAsNumber }
  })

  const form = queryChild<HTMLFormElement>(content, ".form")
  root.createEventHandler(form, "submit", function handleSubmit(this: HTMLFormElement, ev: SubmitEvent): void {
    ev.preventDefault()
    if (this.checkValidity()) {
      onSubmit({ ...config })
    }
  })

  return {
    fragment: content,
    dispose: () => {
      root.dispose()
    },
  }
}

export default NewGameForm
