import { computed, source, TemplateContent } from "rwrtw"
import { type GameConfig } from "../../config"

import "./style.css"

export interface NewGameFormProps {
  initConfig: GameConfig
  onSubmit: (config: GameConfig) => void
}

const NewGameForm = ({ initConfig, onSubmit }: NewGameFormProps): TemplateContent => {
  const config = {
    field: {
      width: source<number>(initConfig.field.width ?? 120),
      height: source<number>(initConfig.field.height ?? 90),
    },
    cellGeneration: {
      foodCount: source<number>(initConfig.cellGeneration.foodCount ?? 2000),
      brickCount: source<number>(initConfig.cellGeneration.brickCount ?? 50),
      poisonCount: source<number>(initConfig.cellGeneration.poisonCount ?? 50),
    },
    botGeneration: {
      count: source<number>(initConfig.cellGeneration.poisonCount ?? 50),
    }
  }

  return (
    <div class="new-game-form">
      <form class="form" on:submit={function handleSubmit(this: HTMLFormElement, ev: Event): void {
        ev.preventDefault()
        if (this.checkValidity()) {
          onSubmit({
            field: {
              width: config.field.width.current(),
              height: config.field.height.current(),
            },
            cellGeneration: {
              foodCount: config.cellGeneration.foodCount.current(),
              brickCount: config.cellGeneration.brickCount.current(),
              poisonCount: config.cellGeneration.poisonCount.current(),
            },
            botGeneration: {
              count: config.cellGeneration.poisonCount.current(),
            }
          })
        }
      }}>
        <fieldset class="form-group">
          <legend class="form-group-caption">Параметры поля</legend>
          <div class="input-number">
            <label for="new-game-form-width">Ширина</label>
            <input
              type="number"
              name="width"
              id="new-game-form-width"
              p:valueAsNumber={config.field.width}
              on:change={function (this: HTMLInputElement): void {
                config.field.width.change(this.valueAsNumber)
              }}
              min="3"
              max="2048"
              required
            />
          </div>
          <div class="input-number">
            <label for="new-game-form-height">Высота</label>
            <input
              type="number"
              name="height"
              id="new-game-form-height"
              p:valueAsNumber={config.field.height}
              on:change={function (this: HTMLInputElement): void {
                config.field.height.change(this.valueAsNumber)
              }}
              min="3"
              max="2048"
              required
            />
          </div>
        </fieldset>
        <div class="h-separator"></div>
        <fieldset class="form-group">
          <legend class="form-group-caption">Генерация предметов</legend>
          <div class="input-number">
            <label for="new-game-form-foodCount">Количество еды</label>
            <input
              type="number"
              name="foodCount"
              id="new-game-form-foodCount"
              p:valueAsNumber={config.cellGeneration.foodCount}
              on:change={function (this: HTMLInputElement): void {
                config.cellGeneration.foodCount.change(this.valueAsNumber)
              }}
              min="0"
              required
            />
          </div>
          <div class="input-number">
            <label for="new-game-form-brickCount">Количество кирпичей</label>
            <input
              type="number"
              name="brickCount"
              id="new-game-form-brickCount"
              p:valueAsNumber={config.cellGeneration.brickCount}
              on:change={function (this: HTMLInputElement): void {
                config.cellGeneration.brickCount.change(this.valueAsNumber)
              }}
              min="0"
              required
            />
          </div>
          <div class="input-number">
            <label for="new-game-form-poisonCount">Количество яда</label>
            <input
              type="number"
              name="poisonCount"
              id="new-game-form-poisonCount"
              p:valueAsNumber={config.cellGeneration.poisonCount}
              on:change={function (this: HTMLInputElement): void {
                config.cellGeneration.poisonCount.change(this.valueAsNumber)
              }}
              min="0"
              required
            />
          </div>
        </fieldset>
        <div class="h-separator"></div>
        <fieldset class="form-group">
          <legend class="form-group-caption">Генерация ботов</legend>
          <div class="input-number">
            <label for="new-game-form-botCount">Количество ботов</label>
            <input
              type="number"
              name="botCount"
              id="new-game-form-botCount"
              p:valueAsNumber={config.botGeneration.count}
              on:change={function (this: HTMLInputElement): void {
                config.botGeneration.count.change(this.valueAsNumber)
              }}
              min="0"
              required
            />
          </div>
        </fieldset>
        <div class="h-separator"></div>
        <div class="form-actions-group">
          <button type="reset" class="action-button form-reset-button">
            Сбросить параметры
          </button>
          <button type="submit" class="action-button primary">
            Начать игру
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewGameForm
