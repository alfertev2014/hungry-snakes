import { type GameConfig } from "../../config"
import { queryChild, queryTemplate } from "../utils"

import "./style.css"

const NewGameForm = (
  rootElement: HTMLElement,
  initConfig: GameConfig,
  onSubmit: (config: GameConfig) => void,
): (() => void) => {
  const template = queryTemplate("NewGameForm")
  rootElement.appendChild(template.content.cloneNode(true))

  const config = { ...initConfig }

  const inputWidth = queryChild<HTMLInputElement>(rootElement, '[name="width"]')
  inputWidth.valueAsNumber = config.field.width
  function handleWidthChange(this: HTMLInputElement, ev: Event): void {
    config.field.width = this.valueAsNumber
  }
  inputWidth.addEventListener("change", handleWidthChange)

  const inputHeight = queryChild<HTMLInputElement>(rootElement, '[name="height"]')
  inputHeight.valueAsNumber = config.field.height
  function handleHeightChange(this: HTMLInputElement, ev: Event): void {
    config.field.height = this.valueAsNumber
  }
  inputHeight.addEventListener("change", handleHeightChange)

  const inputFood = queryChild<HTMLInputElement>(rootElement, '[name="foodCount"]')
  inputFood.valueAsNumber = config.cellGeneration?.foodCount ?? 0
  function handleFoodChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, foodCount: this.valueAsNumber }
  }
  inputFood.addEventListener("change", handleFoodChange)

  const inputBrick = queryChild<HTMLInputElement>(rootElement, '[name="brickCount"]')
  inputBrick.valueAsNumber = config.cellGeneration?.brickCount ?? 0
  function handleBrickChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, brickCount: this.valueAsNumber }
  }
  inputBrick.addEventListener("change", handleBrickChange)

  const inputPoison = queryChild<HTMLInputElement>(rootElement, '[name="poisonCount"]')
  inputPoison.valueAsNumber = config.cellGeneration?.poisonCount ?? 0
  function handlePoisonChange(this: HTMLInputElement, ev: Event): void {
    config.cellGeneration = { ...config.cellGeneration, poisonCount: this.valueAsNumber }
  }
  inputPoison.addEventListener("change", handlePoisonChange)

  const inputBot = queryChild<HTMLInputElement>(rootElement, '[name="botCount"]')
  inputBot.valueAsNumber = config.botGeneration?.count ?? 0
  function handleBotChange(this: HTMLInputElement, ev: Event): void {
    config.botGeneration = { ...config.botGeneration, count: this.valueAsNumber }
  }
  inputBot.addEventListener("change", handleBotChange)

  const form = queryChild<HTMLFormElement>(rootElement, ".form")
  function handleSubmit(this: HTMLFormElement, ev: SubmitEvent): void {
    ev.preventDefault()
    if (this.checkValidity()) {
      onSubmit({ ...config })
    }
  }
  form.addEventListener("submit", handleSubmit)

  return () => {
    inputWidth.removeEventListener("change", handleWidthChange)
    inputHeight.removeEventListener("change", handleHeightChange)
    inputFood.removeEventListener("change", handleFoodChange)
    inputBrick.removeEventListener("change", handleBrickChange)
    inputPoison.removeEventListener("change", handlePoisonChange)
    inputBot.removeEventListener("change", handleBotChange)

    form.removeEventListener("submit", handleSubmit)
  }
}

export default NewGameForm
