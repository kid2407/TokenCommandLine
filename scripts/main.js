import {TokenCommandLine} from "./TokenCommandLine.js"

Hooks.on("renderTokenHUD", async (hud, html) => {
    const tcl = new TokenCommandLine(hud.object)
    const bar1 = html.find("div.col.middle .attribute.bar1")
    bar1.append(TokenCommandLine.getHTML())
    const input = bar1.find("input#tcl-input")
    input.on("input", async () => {
        await tcl.onChange(input.val().trim().toLowerCase())
    })
})