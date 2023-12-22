export const queryTemplate = (id: string): HTMLTemplateElement => {
  const template = document.getElementById(id) as HTMLTemplateElement | null
  if (template == null) {
    throw new Error(`Cannot find template id=${id}`)
  }
  return template
}

export const queryChild = <T extends HTMLElement>(parent: ParentNode, selector: string): T => {
  const element = parent.querySelector(selector)
  if (element == null) {
    throw new Error(`Cannot query selector by '${selector}' of parent`)
  }
  return element as T
}
