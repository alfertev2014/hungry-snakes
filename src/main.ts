import "./main.css"
import MainContainer from "./app/ui/MainContainer"
import { createRootPlaceholderAt, placeAtBeginningOf } from "rwrtw"

const appElement = document.getElementById("app") as HTMLDivElement

const root = createRootPlaceholderAt(placeAtBeginningOf(appElement), MainContainer())
root.mount?.()

