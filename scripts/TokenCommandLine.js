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
     * @param {jQuery} html
     * @returns {jQuery}
     */
    static updateHTML(html) {
        const bar1 = html.find("div.col.middle .attribute.bar1")
        bar1.append("<input id='tcl-input' type='text' placeholder='cmd…'><ul id='tcl-suggestions'></ul>")

        return html
    }

    /**
     * @param {string} value
     * @returns {Promise<void>}
     */
    static async onChange(value) {
        let conditions = TokenCommandLine.getConditions()
        let html = ""
        if (value.length > 0) {
            let matching = Object.values(conditions).filter(condition => condition.id.toLowerCase().includes(value) || condition.label.toLowerCase().includes(value))
            matching.sort((a, b) => a.label.indexOf(value) - b.label.indexOf(value))
            if (matching.length > 0) {
                matching.forEach(condition => {
                    html += `<li data-value="${condition.id}">${condition.label.replaceAll(value, `<strong>${value}</strong>`).replaceAll(value.toUpperCase(), `<strong>${value.toUpperCase()}</strong>`)}</li>`
                })
            }
        }
        $('#tcl-suggestions').html(html)
    }

    async applyEffect(value) {
        const conditions = TokenCommandLine.getConditions()
        const suggestions = $("#tcl-suggestions > li")
        // noinspection JSValidateTypes
        /** @var {TokenDocument} document */
        let document = this.token.document
        if (conditions.hasOwnProperty(value)) {
            await document.toggleActiveEffect(conditions[value])
        } else if (suggestions.length === 1) {
            let value = suggestions.data("value")
            await document.toggleActiveEffect(conditions[value])
        } else if (suggestions.length > 1) {
            ui.notifications.warn("More than one possible effect!")
        } else {
            ui.notifications.error("Invalid command!")
        }
    }

    static async registerCommanderData() {
        let {api, helpers} = game.modules.get('commander')
        api.register({
            name       : "tae",
            description: "Token Active Effect",
            schema     : "tae $effect",
            args       : [{
                name       : 'effect',
                type       : 'string',
                suggestions: () => {
                    let conditions = TokenCommandLine.getConditions()
                    // let matching = Object.values(conditions).filter(condition => condition.id.toLowerCase().includes(value) || condition.label.toLowerCase().includes(value))
                    // matching.sort((a, b) => a.label.indexOf(value) - b.label.indexOf(value))
                    return Object.values(conditions).map((f => {
                        return {displayName: f.label}
                    }))
                },
            }],
            handler    : async ({effect}) => {
                if (game.canvas.tokens.controlled.length === 0) {
                    ui.notifications.error('no token selected')
                    return
                }
                let effects = TokenCommandLine.getConditions()
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

    static getConditions() {
        let conditions = {}

        switch (game.system.id) {
            case "dnd5e":
                CONFIG.statusEffects.forEach(v => {
                    v.label = game.i18n.localize(v.label)
                    conditions[v.id] = v
                })
                break
            // case "pf2e" :
            //     conditions = {
            //         "blinded"    : {id: "blinded", label: "Blinded", icon: "systems/pf2e/icons/conditions-2/blinded.webp"},
            //         "broken"     : {id: "broken", label: "Broken", icon: "systems/pf2e/icons/conditions-2/broken.webp"},
            //         "clumsy"     : {id: "clumsy", label: "Clumsy", icon: "systems/pf2e/icons/conditions-2/clumsy.webp"},
            //         "concealed"  : {id: "concealed", label: "Concealed", icon: "systems/pf2e/icons/conditions-2/concealed.webp"},
            //         "confused"   : {id: "confused", label: "Confused", icon: "systems/pf2e/icons/conditions-2/confused.webp"},
            //         "controlled" : {id: "controlled", label: "Controlled", icon: "systems/pf2e/icons/conditions-2/controlled.webp"},
            //         "dazzled"    : {id: "dazzled", label: "Dazzled", icon: "systems/pf2e/icons/conditions-2/dazzled.webp"},
            //         "deafened"   : {id: "deafened", label: "Deafened", icon: "systems/pf2e/icons/conditions-2/deafened.webp"},
            //         "doomed"     : {id: "doomed", label: "Doomed", icon: "systems/pf2e/icons/conditions-2/doomed.webp"},
            //         "drained"    : {id: "drained", label: "Drained", icon: "systems/pf2e/icons/conditions-2/drained.webp"},
            //         "dying"      : {id: "dying", label: "Dying", icon: "systems/pf2e/icons/conditions-2/dying.webp"},
            //         "encumbered" : {id: "encumbered", label: "Encumbered", icon: "systems/pf2e/icons/conditions-2/encumbered.webp"},
            //         "enfeebled"  : {id: "enfeebled", label: "Enfeebled", icon: "systems/pf2e/icons/conditions-2/enfeebled.webp"},
            //         "fascinated" : {id: "fascinated", label: "Fascinated", icon: "systems/pf2e/icons/conditions-2/fascinated.webp"},
            //         "fatigued"   : {id: "fatigued", label: "Fatigued", icon: "systems/pf2e/icons/conditions-2/fatigued.webp"},
            //         "flat-footed": {id: "flat-footed", label: "Flat-Footed", icon: "systems/pf2e/icons/conditions-2/flat-footed.webp"},
            //         "fleeing"    : {id: "fleeing", label: "Fleeing", icon: "systems/pf2e/icons/conditions-2/fleeing.webp"},
            //         "frightened" : {id: "frightened", label: "Frightened", icon: "systems/pf2e/icons/conditions-2/frightened.webp"},
            //         "grabbed"    : {id: "grabbed", label: "Grabbed", icon: "systems/pf2e/icons/conditions-2/grabbed.webp"},
            //         "immobilized": {id: "immobilized", label: "Immobilized", icon: "systems/pf2e/icons/conditions-2/immobilized.webp"},
            //         "invisible"  : {id: "invisible", label: "Invisible", icon: "systems/pf2e/icons/conditions-2/invisible.webp"},
            //         "paralyzed"  : {id: "paralyzed", label: "Paralyzed", icon: "systems/pf2e/icons/conditions-2/paralyzed.webp"},
            //         "Persistent" : {id: "Persistent", label: "Damage", icon: "systems/pf2e/icons/conditions-2/persistent-damage.webp persistent-damage"},
            //         "petrified"  : {id: "petrified", label: "Petrified", icon: "systems/pf2e/icons/conditions-2/petrified.webp"},
            //         "prone"      : {id: "prone", label: "Prone", icon: "systems/pf2e/icons/conditions-2/prone.webp"},
            //         "quickened"  : {id: "quickened", label: "Quickened", icon: "systems/pf2e/icons/conditions-2/quickened.webp"},
            //         "restrained" : {id: "restrained", label: "Restrained", icon: "systems/pf2e/icons/conditions-2/restrained.webp"},
            //         "sickened"   : {id: "sickened", label: "Sickened", icon: "systems/pf2e/icons/conditions-2/sickened.webp"},
            //         "slowed"     : {id: "slowed", label: "Slowed", icon: "systems/pf2e/icons/conditions-2/slowed.webp"},
            //         "stunned"    : {id: "stunned", label: "Stunned", icon: "systems/pf2e/icons/conditions-2/stunned.webp"},
            //         "stupefied"  : {id: "stupefied", label: "Stupefied", icon: "systems/pf2e/icons/conditions-2/stupefied.webp"},
            //         "unconscious": {id: "unconscious", label: "Unconscious", icon: "systems/pf2e/icons/conditions-2/unconscious.webp"},
            //         "wounded"    : {id: "wounded", label: "Wounded", icon: "systems/pf2e/icons/conditions-2/wounded.webp"},
            //         "dead"       : {id: "dead", label: "Dead", icon: "icons/svg/skull.svg"}
            //     }
            //     break
        }

        return conditions
    }
}