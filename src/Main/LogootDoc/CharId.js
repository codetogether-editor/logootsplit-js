export default class CharId {
    constructor(base, offset) {
        this.base = base
        this.offset = offset
        if (this.offset > base.maxUsedOffset)
            base.maxUsedOffset = this.offset
        if (this.offset < base.minUsedOffset)
            base.minUsedOffset = offset
    }

    get fullId() {
        return this.base.fullBase.concat(this.offset)
    }

    get copy(){
        return new CharId(this.base.copy, this.offset)
    }

    isEqual(otherChar) {
        return this.base.isEqual(otherChar.base)
            && this.offset === otherChar.offset
    }

    isBigger(otherCharId) {
        let thisId = this.fullId, otherId = otherCharId.fullId
        for (let i = 0; i < Math.min(thisId.length, otherId.length); ++i)
            if (thisId[i] !== otherId[i])
                return thisId[i] > otherId[i]
        return thisId.length > otherId.length
    }
}