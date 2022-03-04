import {TokenCommandLine} from "./TokenCommandLine.js"

Hooks.on("init", async () => {
    if (game.modules.has("commander") && game.modules.get("commander").active) {
        Hooks.on("commanderReady", async () => {
            await TokenCommandLine.registerCommanderData()
        })
    } else {
        Hooks.on("renderTokenHUD", async (hud, html) => {
            html = TokenCommandLine.updateHTML(html)
            let tcl = new TokenCommandLine(hud.object)
            let input = html.find("input#tcl-input")
            input.on("input", async (event) => {
                await TokenCommandLine.onChange(event.target.value.trim().toLowerCase())
            })
            input.on("keyup", async (event) => {
                if (event.key === "Enter" || event.keyCode === 13) {
                    await tcl.applyEffect(event.target.value.trim().toLowerCase())
                }
            })
        })
    }
})