class Char {
    constructor(value, charId) {
        this.value = value
        this.id = charId
    }

    isEqual(otherChar) {
        return this.value === otherChar.value
            && this.id.isEqual(otherChar.id)
    }
}