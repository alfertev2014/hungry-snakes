import "./main.css"
import MainContainer from "./app/ui/MainContainer"

const appElement = document.getElementById("app") as HTMLDivElement

const dispose = MainContainer(appElement)

