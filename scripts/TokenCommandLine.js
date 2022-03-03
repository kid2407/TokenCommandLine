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

        switch (game.system.id) {
            case "dnd5e":
                conditions = {
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
                break
            case "pf2e" :
                conditions = {
                    "blinded"    : {id: "blinded", label: "Blinded", icon: "systems/pf2e/icons/conditions-2/blinded.webp"},
                    "broken"     : {id: "broken", label: "Broken", icon: "systems/pf2e/icons/conditions-2/broken.webp"},
                    "clumsy"     : {id: "clumsy", label: "Clumsy", icon: "systems/pf2e/icons/conditions-2/clumsy.webp"},
                    "concealed"  : {id: "concealed", label: "Concealed", icon: "systems/pf2e/icons/conditions-2/concealed.webp"},
                    "confused"   : {id: "confused", label: "Confused", icon: "systems/pf2e/icons/conditions-2/confused.webp"},
                    "controlled" : {id: "controlled", label: "Controlled", icon: "systems/pf2e/icons/conditions-2/controlled.webp"},
                    "dazzled"    : {id: "dazzled", label: "Dazzled", icon: "systems/pf2e/icons/conditions-2/dazzled.webp"},
                    "deafened"   : {id: "deafened", label: "Deafened", icon: "systems/pf2e/icons/conditions-2/deafened.webp"},
                    "doomed"     : {id: "doomed", label: "Doomed", icon: "systems/pf2e/icons/conditions-2/doomed.webp"},
                    "drained"    : {id: "drained", label: "Drained", icon: "systems/pf2e/icons/conditions-2/drained.webp"},
                    "dying"      : {id: "dying", label: "Dying", icon: "systems/pf2e/icons/conditions-2/dying.webp"},
                    "encumbered" : {id: "encumbered", label: "Encumbered", icon: "systems/pf2e/icons/conditions-2/encumbered.webp"},
                    "enfeebled"  : {id: "enfeebled", label: "Enfeebled", icon: "systems/pf2e/icons/conditions-2/enfeebled.webp"},
                    "fascinated" : {id: "fascinated", label: "Fascinated", icon: "systems/pf2e/icons/conditions-2/fascinated.webp"},
                    "fatigued"   : {id: "fatigued", label: "Fatigued", icon: "systems/pf2e/icons/conditions-2/fatigued.webp"},
                    "flat-footed": {id: "flat-footed", label: "Flat-Footed", icon: "systems/pf2e/icons/conditions-2/flat-footed.webp"},
                    "fleeing"    : {id: "fleeing", label: "Fleeing", icon: "systems/pf2e/icons/conditions-2/fleeing.webp"},
                    "frightened" : {id: "frightened", label: "Frightened", icon: "systems/pf2e/icons/conditions-2/frightened.webp"},
                    "grabbed"    : {id: "grabbed", label: "Grabbed", icon: "systems/pf2e/icons/conditions-2/grabbed.webp"},
                    "immobilized": {id: "immobilized", label: "Immobilized", icon: "systems/pf2e/icons/conditions-2/immobilized.webp"},
                    "invisible"  : {id: "invisible", label: "Invisible", icon: "systems/pf2e/icons/conditions-2/invisible.webp"},
                    "paralyzed"  : {id: "paralyzed", label: "Paralyzed", icon: "systems/pf2e/icons/conditions-2/paralyzed.webp"},
                    "Persistent" : {id: "Persistent", label: "Damage", icon: "systems/pf2e/icons/conditions-2/persistent-damage.webp persistent-damage"},
                    "petrified"  : {id: "petrified", label: "Petrified", icon: "systems/pf2e/icons/conditions-2/petrified.webp"},
                    "prone"      : {id: "prone", label: "Prone", icon: "systems/pf2e/icons/conditions-2/prone.webp"},
                    "quickened"  : {id: "quickened", label: "Quickened", icon: "systems/pf2e/icons/conditions-2/quickened.webp"},
                    "restrained" : {id: "restrained", label: "Restrained", icon: "systems/pf2e/icons/conditions-2/restrained.webp"},
                    "sickened"   : {id: "sickened", label: "Sickened", icon: "systems/pf2e/icons/conditions-2/sickened.webp"},
                    "slowed"     : {id: "slowed", label: "Slowed", icon: "systems/pf2e/icons/conditions-2/slowed.webp"},
                    "stunned"    : {id: "stunned", label: "Stunned", icon: "systems/pf2e/icons/conditions-2/stunned.webp"},
                    "stupefied"  : {id: "stupefied", label: "Stupefied", icon: "systems/pf2e/icons/conditions-2/stupefied.webp"},
                    "unconscious": {id: "unconscious", label: "Unconscious", icon: "systems/pf2e/icons/conditions-2/unconscious.webp"},
                    "wounded"    : {id: "wounded", label: "Wounded", icon: "systems/pf2e/icons/conditions-2/wounded.webp"},
                    "dead"       : {id: "dead", label: "Dead", icon: "icons/svg/skull.svg"}
                }
                break
        }

        return conditions
    }
}