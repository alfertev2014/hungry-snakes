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

  const form = queryChild<HTMLFormElement>(rootElement, ".form")

  const inputWidth = queryChild<HTMLInputElement>(rootElement, '[name="width"]')
  const inputHeight = queryChild<HTMLInputElement>(rootElement, '[name="height"]')

  inputWidth.valueAsNumber = config.field.width
  inputHeight.valueAsNumber = config.field.height

  function handleWidthChange(this: HTMLInputElement, ev: Event): void {
    config.field.width = this.valueAsNumber
  }
  inputWidth.addEventListener("change", handleWidthChange)

  function handleHeightChange(this: HTMLInputElement, ev: Event): void {
    config.field.height = this.valueAsNumber
  }
  inputHeight.addEventListener("change", handleHeightChange)

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

    form.removeEventListener("submit", handleSubmit)
  }
}

export default NewGameForm
