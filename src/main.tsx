import "./main.css"
import MainContainer from "./app/ui/MainContainer"
import { createRootPlaceholderAt, fr, placeAtBeginningOf } from "rwrtw"

const appElement = document.getElementById("app") as HTMLDivElement

const root = createRootPlaceholderAt(placeAtBeginningOf(appElement), fr(<MainContainer />))
root.mount?.()

