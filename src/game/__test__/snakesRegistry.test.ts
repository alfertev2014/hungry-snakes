import { xdescribe, expect, test, beforeAll } from "@jest/globals"
import { SnakesRegistry } from "../snakesRegistry"

xdescribe("Snakes registry", () => {

  test('should be empty when created', () => {
    const snakes = new SnakesRegistry()
    expect(snakes.count).toBe(0)
  })

  xdescribe("New snake", () => {
    test("should obtain unique id", () => {
      const snakes = new SnakesRegistry()
    })
  })
})