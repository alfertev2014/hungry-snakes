export type FwDisposeHandler = () => void

export interface FwController {
  readonly fragment: DocumentFragment | Node
  readonly dispose: FwDisposeHandler
}

export type FwComponent<PropsType> = (props: PropsType) => FwController

export class FwParent {
  readonly _controllers: FwController[]
  constructor() {
    this._controllers = []
  }

  createComponent<PropsType>(factory: FwComponent<PropsType>, props: PropsType, rootElement: HTMLElement): void {
    const controller = factory(props)
    this._controllers.push(controller)

    rootElement.replaceChildren(controller.fragment)
  }

  dispose(): void {
    for (const controller of this._controllers) {
      controller.dispose()
    }
    this._controllers.length = 0
  }
}
