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
        } else {
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
            name       : "tae",
            description: "Token Active Effect",
            schema     : "tae $effect",
            args       : [{
                name       : 'effect',
                type       : 'string',
                suggestions: () => {
                    let conditions = this.getConditions()
                    let filtered = Object.keys(conditions).filter(key => key.includes(value))
                    filtered.sort((a, b) => a.indexOf(value) - b.indexOf(value))
                    return Object.values(filtered).map((f => {
                        return {displayName: conditions[f].label}
                    })) // get this somehow, needs to be an array of objects with {displayName: string}
                },
            }],
            handler    : async ({effect}) => {
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
        let conditions = {}

        if (game.system.id === "dnd5e") {
            let dnd5eConditions = {
                "dead"       : {id: "dead", label: "Dead", icon: "icons/svg/skull.svg"},
                "unconscious": {id: "unconscious", label: "Unconscious", icon: "icons/svg/unconscious.svg"},
                "sleep"      : {id: "sleep", label: "Asleep", icon: "icons/svg/sleep.svg"},
                "stun"       : {id: "stun", label: "Stunned", icon: "icons/svg/daze.svg"},
                "prone"      : {id: "prone", label: "Prone", icon: "icons/svg/falling.svg"},
                "restrain"   : {id: "restrain", label: "Restrained", icon: "icons/svg/net.svg"},
                "paralysis"  : {id: "paralysis", label: "Paralyzed", icon: "icons/svg/paralysis.svg"},
                "fly"        : {id: "fly", label: "Flying", icon: "icons/svg/wing.svg"},
                "blind"      : {id: "blind", label: "Blind", icon: "icons/svg/blind.svg"},
                "deaf"       : {id: "deaf", label: "Deaf", icon: "icons/svg/deaf.svg"},
                "silence"    : {id: "silence", label: "Silenced", icon: "icons/svg/silenced.svg"},
                "fear"       : {id: "fear", label: "Frightened", icon: "icons/svg/terror.svg"},
                "burning"    : {id: "burning", label: "Burning", icon: "icons/svg/fire.svg"},
                "frozen"     : {id: "frozen", label: "Frozen", icon: "icons/svg/frozen.svg"},
                "shock"      : {id: "shock", label: "Shocked", icon: "icons/svg/lightning.svg"},
                "corrode"    : {id: "corrode", label: "Corroding", icon: "icons/svg/acid.svg"},
                "bleeding"   : {id: "bleeding", label: "Bleeding", icon: "icons/svg/blood.svg"},
                "disease"    : {id: "disease", label: "Diseased", icon: "icons/svg/biohazard.svg"},
                "poison"     : {id: "poison", label: "Poisoned", icon: "icons/svg/poison.svg"},
                "radiation"  : {id: "radiation", label: "Radioactive", icon: "icons/svg/radiation.svg"},
                "regen"      : {id: "regen", label: "Regenerating", icon: "icons/svg/regen.svg"},
                "degen"      : {id: "degen", label: "Degenerating", icon: "icons/svg/degen.svg"},
                "upgrade"    : {id: "upgrade", label: "Empowered", icon: "icons/svg/upgrade.svg"},
                "downgrade"  : {id: "downgrade", label: "Weakened", icon: "icons/svg/downgrade.svg"},
                "target"     : {id: "target", label: "Targeted", icon: "icons/svg/target.svg"},
                "eye"        : {id: "eye", label: "Marked", icon: "icons/svg/eye.svg"},
                "curse"      : {id: "curse", label: "Cursed", icon: "icons/svg/sun.svg"},
                "bless"      : {id: "bless", label: "Blessed", icon: "icons/svg/angel.svg"},
                "fireShield" : {id: "fireShield", label: "Fire Shield", icon: "icons/svg/fire-shield.svg"},
                "coldShield" : {id: "coldShield", label: "Ice Shield", icon: "icons/svg/ice-shield.svg"},
                "magicShield": {id: "magicShield", label: "Magic Shield", icon: "icons/svg/mage-shield.svg"},
                "holyShield" : {id: "holyShield", label: "Holy Shield", icon: "icons/svg/holy-shield.svg"}
            }
            conditions = {...conditions, ...dnd5eConditions}
        }

        return conditions
    }
}