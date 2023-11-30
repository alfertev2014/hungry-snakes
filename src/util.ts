export const random = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min) + min)
}

export const cssRGBA = (r: number, g: number, b: number, a?: number): string => `rgba(${r} ${g} ${b} ${a ?? ""})`

export const cssHSLA = (h: number, s: number, l: number, a?: number): string => `hsla(${h} ${s}% ${l}% ${a ?? ""})`

export const randomRGB = (): string => cssRGBA(random(0, 256), random(0, 256), random(0, 256))

export const randomHUE = (): string => cssHSLA(random(0, 360), 100, 50)
