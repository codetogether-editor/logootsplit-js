class Char {
    constructor(value, id) {
        this.value = value
        this.id = id
    }

    isEqual(otherChar) {
        return this.value === otherChar.value
            && this.id.isEqual(otherChar.id)
    }
}