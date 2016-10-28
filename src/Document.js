class Base {
    constructor(main, session, clock) {
        this.main = main
        this.session = session
        this.clock = clock
        this.minUsedOffset = MAX_OFFSET + 1
        this.maxUsedOffset = MIN_OFFSET - 1
    }

    get fullBase() {
        return this.main.concat([this.session], [this.clock])
    }

    get copy(){
        return new Base(this.main.slice(), this.session, this.clock) 
    }

    isEqual(otherBase) {
        if (this.session !== otherBase.session || this.clock !== otherBase.clock || this.main.length !== otherBase.main.length)
            return false
        for (let i = 0; i < this.main.length; ++i)
            if (this.main[i] != otherBase.main[i])
                return false

        return true
    }
}

class CharId {
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

    get copy(){ //TODO replace with some to/from simple array parsing
        return new CharId(this.base.copy, this.offset)
    }

    isEqual(otherChar) {
        return this.base.isEqual(otherChar.base)
            && this.offset === otherChar.offset
    }

    isBigger(otherChar) {
        let thisId = this.fullId, otherId = otherChar.fullId
        for (let i = 0; i < Math.min(thisId.length, otherId.length); ++i)
            if (thisId[i] !== otherId[i])
                return thisId[i] > otherId[i]
        return thisId.length > otherId.length
    }
}

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

const DOC_BEG = new Char(null, new CharId(new Base([MIN_BASE_EL], 0, 0), MIN_OFFSET))
const DOC_END = new Char(null, new CharId(new Base([MAX_BASE_EL], 0, 0), MAX_OFFSET))
// From the beginning document contains two chars: DOC_BEG and DOC_END, they're not actual text chars and are only used to represent start and end of the document

class Document {
    constructor() {
        this.chars = [DOC_BEG, DOC_END]
        this.bases = []
    }

    insertWithExistingBase(str, pos, base, firstOffset){
        let offset = firstOffset
        for (let i = 0; i < str.length; ++i, ++offset, ++pos) {
            let newId = new CharId(base, offset)
            let newChar = new Char(str[i], newId)
            this.chars.splice(pos, 0, newChar)
        }
    }

    insertWithNewBase(str, pos, newBase, firstOffset = MIN_OFFSET){
        this.addBase(newBase)
        this.insertWithExistingBase(str, pos, newBase, firstOffset)
    }

    canBeAppended(str, pos, session) {
        let char = this.chars[pos - 1]
        return session === char.id.base.session
            && char.id.base.maxUsedOffset == char.id.offset
            && char.id.offset + str.length < MAX_BASE_EL
    }

    canBePrepended(str, pos, session) {
        let char = this.chars[pos]
        return session === char.id.base.session
            && char.id.base.minUsedOffset == char.id.offset
            && char.id.offset - str.length > MIN_BASE_EL
    }

    delChar(pos){
        this.chars.splice(pos, 1)
    }

    delChars(fromPos, toPos) {
        for (let pos = toPos; pos >= fromPos; --pos)
            this.delChar(pos)
    }

    delCharsWithIds(ids) { //TODO optimize, maybe with dichotomic search
                           //TODO what if id was deleted before del request received?
        for(let i=this.chars.length-2; i>0; --i){
            for(let j=ids.length-1; j>=0; --j){
                if(this.chars[i].id.isEqual(ids[j])){
                    this.delChar(i)
                    ids.pop()
                    if(ids.length === 0)
                        return
                    break
                }
            }
        }
    }

    addBase(base) {
        this.bases.push(base)
    }

    getSameBase(base){
        for(let i=0; i<this.bases.length; ++i)
            if(base.isEqual(this.bases[i]))
                return base
        return null
    }

    getCharAtPos(pos) {
        return this.chars[pos]
    }

    getCharIds(fromPos, toPos) {
        let ids = []
        for (let i = fromPos; i <= toPos; ++i)
            ids.push(this.chars[i].id)
        return ids;
    }

    getFirstPosWithBiggerIdThan(id) {
        for (let pos = 1; pos < this.chars.length; ++pos)
            if (this.chars[pos].id.isBigger(id))
                return pos
        return null
    }

    getLastPosWithLowerIdThan(id) {
        let pos = 0
        for (let newPos = 1; newPos < this.chars.length; ++newPos)
            if (id.isBigger(this.chars[pos].id))
                pos = newPos
        return pos
    }

    get text() {
        let text = ""
        for (let i = 0; i < this.chars.length; ++i)
            text += this.chars[i].value
        return text
    }

    get textTest() {
        let text = ""
        for (let i = 0; i < this.chars.length; ++i) {
            text += (i == 0 || i == this.chars.length - 1 ? "" : this.chars[i].value)
            if (i + 1 < this.chars.length && !(this.chars[i].id.base.isEqual(this.chars[i + 1].id.base)))
                text += "|"
        }
        return text
    }
}