import { computed, source, TemplateContent } from "rwrtw"
import { type GameConfig } from "../../config"

import "./style.css"

export interface NewGameFormProps {
  initConfig: GameConfig
  onSubmit: (config: GameConfig) => void
}

const NewGameForm = ({ initConfig, onSubmit }: NewGameFormProps): TemplateContent => {
  const config = source<GameConfig>(initConfig)

  return (
    <div class="new-game-form">
      <form class="form" on:submit={function handleSubmit(this: HTMLFormElement, ev: Event): void {
        ev.preventDefault()
        if (this.checkValidity()) {
          onSubmit({ ...config.current() })
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
              p:valueAsNumber={computed(() => config.current().field.width ?? 120)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  field: {
                    ...c.field,
                    width: this.valueAsNumber
                  }
                }))
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
              p:valueAsNumber={computed(() => config.current().field.height ?? 90)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  field: {
                    ...c.field,
                    height: this.valueAsNumber
                  }
                }))
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
              p:valueAsNumber={computed(() => config.current().cellGeneration.foodCount ?? 2000)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  cellGeneration: {
                    ...c.cellGeneration,
                    foodCount: this.valueAsNumber
                  }
                }))
              }}
              min="0"
              required
            />
          </div>
          <div class="input-number">
            <label for="new-game-form-brickCount">Количество кирпичей</label>
            <input type="number" name="brickCount" id="new-game-form-brickCount" value="50" min="0" />
            <input
              type="number"
              name="brickCount"
              id="new-game-form-brickCount"
              p:valueAsNumber={computed(() => config.current().cellGeneration.brickCount ?? 50)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  cellGeneration: {
                    ...c.cellGeneration,
                    brickCount: this.valueAsNumber
                  }
                }))
              }}
              min="0"
              required
            />
          </div>
          <div class="input-number">
            <label for="new-game-form-poisonCount">Количество яда</label>
            <input type="number" name="poisonCount" id="new-game-form-poisonCount" value="50" min="0" />
            <input
              type="number"
              name="poisonCount"
              id="new-game-form-poisonCount"
              p:valueAsNumber={computed(() => config.current().cellGeneration.poisonCount ?? 50)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  cellGeneration: {
                    ...c.cellGeneration,
                    poisonCount: this.valueAsNumber
                  }
                }))
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
            <input type="number" name="botCount" id="new-game-form-botCount" value="20" min="0" />
            <input
              type="number"
              name="botCount"
              id="new-game-form-botCount"
              p:valueAsNumber={computed(() => config.current().botGeneration.count ?? 20)}
              on:change={function (this: HTMLInputElement): void {
                config.update(c => ({
                  ...c,
                  botGeneration: {
                    ...c.botGeneration,
                    count: this.valueAsNumber
                  }
                }))
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
