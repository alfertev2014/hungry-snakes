import { type GameConfig } from "../../config"
import { type FwComponent } from "../fw"
import { queryChild, queryTemplate } from "../utils"

import "./style.css"

export interface NewGameFormProps {
  initConfig: GameConfig
  onSubmit: (config: GameConfig) => void
}

const NewGameForm: FwComponent<NewGameFormProps> = ({ initConfig, onSubmit }) => {
  const template = queryTemplate("NewGameForm")
  const content = template.content.cloneNode(true) as DocumentFragment

  const config = { ...initConfig }

  const inputWidth = queryChild<HTMLInputElement>(content, '[name="width"]')
  inputWidth.valueAsNumber = config.field.width
  function handleWidthChange(this: HTMLInputElement, ev: Event): void {
    config.field.width = this.valueAsNumber
  }
  inputWidth.addEventListener("change", handleWidthChange)

  const inputHeight = queryChild<HTMLInputElement>(content, '[name="height"]')
  inputHeight.valueAsNumber = config.field.height
  function handleHeightChange(this: HTMLInputElement, ev: Event): void {
    config.field.height = this.valueAsNumber
  }
  inputHeight.addEventListener("change", handleHeightChange)

  const inputFood = queryChild<HTMLInputElement>(content, '[name="foodCount"]')
  inputFood.valueAsNumber = config.cellGeneration?.foodCount ?? 0
  function handleFoodChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, foodCount: this.valueAsNumber }
  }
  inputFood.addEventListener("change", handleFoodChange)

  const inputBrick = queryChild<HTMLInputElement>(content, '[name="brickCount"]')
  inputBrick.valueAsNumber = config.cellGeneration?.brickCount ?? 0
  function handleBrickChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, brickCount: this.valueAsNumber }
  }
  inputBrick.addEventListener("change", handleBrickChange)

  const inputPoison = queryChild<HTMLInputElement>(content, '[name="poisonCount"]')
  inputPoison.valueAsNumber = config.cellGeneration?.poisonCount ?? 0
  function handlePoisonChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, poisonCount: this.valueAsNumber }
  }
  inputPoison.addEventListener("change", handlePoisonChange)

  const inputBot = queryChild<HTMLInputElement>(content, '[name="botCount"]')
  inputBot.valueAsNumber = config.botGeneration?.count ?? 0
  function handleBotChange(this: HTMLInputElement, ev: Event): void {
    config.botGeneration = { ...config.botGeneration, count: this.valueAsNumber }
  }
  inputBot.addEventListener("change", handleBotChange)

  const form = queryChild<HTMLFormElement>(content, ".form")
  function handleSubmit(this: HTMLFormElement, ev: SubmitEvent): void {
    ev.preventDefault()
    if (this.checkValidity()) {
      onSubmit({ ...config })
    }
  }
  form.addEventListener("submit", handleSubmit)

  return {
    fragment: content,
    dispose: () => {
      inputWidth.removeEventListener("change", handleWidthChange)
      inputHeight.removeEventListener("change", handleHeightChange)
      inputFood.removeEventListener("change", handleFoodChange)
      inputBrick.removeEventListener("change", handleBrickChange)
      inputPoison.removeEventListener("change", handlePoisonChange)
      inputBot.removeEventListener("change", handleBotChange)

      form.removeEventListener("submit", handleSubmit)
    },
  }
}

export default NewGameForm
