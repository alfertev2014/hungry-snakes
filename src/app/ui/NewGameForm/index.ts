import { insertNodeAt, type PlaceholderComponent } from "rwrtw"
import { type GameConfig } from "../../config"
import { queryChild, queryTemplate } from "../utils"

import "./style.css"

export interface NewGameFormProps {
  initConfig: GameConfig
  onSubmit: (config: GameConfig) => void
}

const NewGameForm = ({ initConfig, onSubmit }: NewGameFormProps): PlaceholderComponent => (place, context) => {
  const template = queryTemplate("NewGameForm")
  const content = (template.content.cloneNode(true) as DocumentFragment).firstElementChild as HTMLElement

  if (content == null) {
    throw new Error("NewGameForm content not found")
  }

  const config = { ...initConfig }

  const inputWidth = queryChild<HTMLInputElement>(content, '[name="width"]')
  inputWidth.valueAsNumber = config.field.width
  inputWidth.addEventListener("change", function handleWidthChange(this: HTMLInputElement, ev: Event): void {
    config.field.width = this.valueAsNumber
  })

  const inputHeight = queryChild<HTMLInputElement>(content, '[name="height"]')
  inputHeight.valueAsNumber = config.field.height
  inputHeight.addEventListener("change", function handleHeightChange(this: HTMLInputElement, ev: Event): void {
    config.field.height = this.valueAsNumber
  })

  const inputFood = queryChild<HTMLInputElement>(content, '[name="foodCount"]')
  inputFood.valueAsNumber = config.cellGeneration?.foodCount ?? 0
  inputFood.addEventListener("change", function handleFoodChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, foodCount: this.valueAsNumber }
  })

  const inputBrick = queryChild<HTMLInputElement>(content, '[name="brickCount"]')
  inputBrick.valueAsNumber = config.cellGeneration?.brickCount ?? 0
  inputBrick.addEventListener("change", function handleBrickChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, brickCount: this.valueAsNumber }
  })

  const inputPoison = queryChild<HTMLInputElement>(content, '[name="poisonCount"]')
  inputPoison.valueAsNumber = config.cellGeneration?.poisonCount ?? 0
  inputPoison.addEventListener("change", function handlePoisonChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, poisonCount: this.valueAsNumber }
  })

  const inputBot = queryChild<HTMLInputElement>(content, '[name="botCount"]')
  inputBot.valueAsNumber = config.botGeneration?.count ?? 0
  inputBot.addEventListener("change", function handleBotChange(this: HTMLInputElement, ev: Event): void {
    config.botGeneration = { ...config.botGeneration, count: this.valueAsNumber }
  })

  const form = queryChild<HTMLFormElement>(content, ".form")
  form.addEventListener("submit", function handleSubmit(this: HTMLFormElement, ev: SubmitEvent): void {
    ev.preventDefault()
    if (this.checkValidity()) {
      onSubmit({ ...config })
    }
  })

  return insertNodeAt(place, content)
}

export default NewGameForm
