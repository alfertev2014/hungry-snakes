export type FwDisposeHandler = () => void

export interface FwDisposable {
  readonly dispose: FwDisposeHandler
}

export interface FwController extends FwDisposable {
  readonly fragment: DocumentFragment | Node
}

export type FwComponent<PropsType> = (props: PropsType) => FwController

export class FwParent {
  readonly _controllers: FwDisposable[]
  constructor() {
    this._controllers = []
  }

  createComponent<PropsType>(factory: FwComponent<PropsType>, props: PropsType, rootElement: HTMLElement): void {
    const controller = factory(props)
    this._controllers.push(controller)

    rootElement.replaceChildren(controller.fragment)
  }

  createEventHandler<K extends keyof HTMLElementEventMap, E extends HTMLElement>(element: E, type: K, handler: (this: E, event: HTMLElementEventMap[K]) => any): void
  createEventHandler(element: HTMLElement, type: string, handler: EventListenerOrEventListenerObject): void {
    element.addEventListener(type, handler)
    this._controllers.push({
      dispose() {
        element.removeEventListener(type, handler)
      }
    })
  }

  dispose(): void {
    for (const controller of this._controllers) {
      controller.dispose()
    }
    this._controllers.length = 0
  }
}
