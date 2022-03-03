export class TokenCommandLine {

    /**
     * @type {Token}
     */
    token = null

    /**
     * @param {Token} token
     */
    constructor(token) {
        this.token = token
    }

    /**
     * @returns {string}
     */
    static getHTML() {
        return "<input id='tcl-input' type='text' placeholder='cmd…'><ul></ul>"
    }

    async onChange(value) {
        let conditions = this.getConditions()
        if (conditions.hasOwnProperty(value)) {
            // noinspection JSValidateTypes
            /** @var {TokenDocument} document */
            let document = this.token.document
            await document.toggleActiveEffect(conditions[value])
        }
        else {
            let html = ""
            if (value.length > 0) {
                let filtered = Object.keys(conditions).filter(key => key.includes(value))
                filtered.sort((a, b) => a.indexOf(value) < b.indexOf(value) ? -1 : (a.indexOf(value) > b.indexOf(value) ? 1 : 0))

                let matching = Object.keys(conditions).filter(key => key.includes(value))
                if (matching.length > 0) {
                    matching.forEach(condition => {
                        html += `<li>${condition}</li>`
                    })
                }
            }
            $('#tcl-input').parent().find("ul").html(html)
        }

        return

        var {api, helpers} = game.modules.get('commander')
        api.register({
                         name:        "tae",
                         description: "Token Active Effect",
                         schema:      "tae $effect",
                         args:        [{
                             name:        'effect',
                             type:        'string',
                             suggestions: () => {
                                 let conditions = this.getConditions()
                                 let filtered = Object.keys(conditions).filter(key => key.includes(value))
                                 filtered.sort((a, b) => a.indexOf(value) - b.indexOf(value))
                                 return Object.values(filtered).map((f => {
                                     return {displayName: conditions[f].label}
                                 })) // get this somehow, needs to be an array of objects with {displayName: string}
                             },
                         }],
                         handler:     async ({effect}) => {
                             if (game.canvas.tokens.controlled.length === 0) {
                                 ui.notifications.error('no token selected')
                                 return
                             }
                             let effects = this.getConditions()
                             if (!effects.hasOwnProperty(effect)) {
                                 ui.notifications.error('invalid effect name')
                                 return
                             }
                             const ae = effects[effect]
                             const tokens = game.canvas.tokens.controlled
                             for (let index = 0; index < tokens.length; index += 1) {
                                 await tokens[index].document.toggleActiveEffect({id: ae.id, label: ae.label, icon: ae.icon})
                             }
                         }
                     })
    }

    getConditions() {
        return {
            "prone":      {id: "prone", label: "Prone", icon: "icons/svg/falling.svg"},
            "restrained": {id: "restrained", label: "Restrained", icon: "icons/svg/net.svg"}
        }
    }

}