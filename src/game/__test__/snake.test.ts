import { xdescribe, expect, test, beforeAll } from "@jest/globals"
import { SnakesField } from "../field"

xdescribe("Created snake", () => {
  let field: SnakesField

  beforeAll(() => {
    field = new SnakesField(3, 3)
  })

  test("should has length equal to 1", () => {

  })
})