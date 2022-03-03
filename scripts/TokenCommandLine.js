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
                let matching = Object.keys(conditions).filter(key => key.startsWith(value) || key.includes(value))
                if (matching.length > 0) {
                    matching.forEach(condition => {
                        html += `<li>${condition}</li>`
                    })
                }
            }
            $('#tcl-input').parent().find("ul").html(html)
        }
    }

    getConditions() {
        return {
            "prone":      {id: "prone", label: "Prone", icon: "icons/svg/falling.svg"},
            "restrained": {id: "restrained", label: "Restrained", icon: "icons/svg/net.svg"}
        }
    }

}