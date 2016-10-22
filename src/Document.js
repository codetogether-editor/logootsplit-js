/// <reference path="js/Const.js" />
/// <reference path="js/Document.js" />
/// <reference path="js/Tools.js" />

class Document {
    constructor() {
        this.chars = []
        this.bases = []
    }

    insertStringWithNewBase(str, pos, base) {
        this.bases.push(base)
        let firstChar = new Char(str[0], base, ALPH_BEG)
        this.insertCharAtPos(firstChar, pos)

        let restOfStr = str.substring(1)
        if(restOfStr.length > 0)
            this.insertStringAppended(restOfStr, pos + 1)
    }

    insertStringAppended(str, pos) {
        for (let i = 0; i < str.length; ++i) {
            this.insertCharAppended(str[i], pos)
            ++pos
        }
    }

    insertStringPrepended(str, pos) {
        for (let i = str.length; i > 0; --i)
            this.insertCharPrepended(str[i], pos)
    }

    insertCharAtPos(charObject, pos) {
        if(pos > this.chars.length) //TODO check if < ===> <  was correct
            this.chars.push(charObject)
        else
            this.chars.splice(pos, 0, charObject)
    }

    insertCharAppended(charValue, pos) {
        let charObj = new Char(charValue,this.chars[pos - 1].baseRef, getShiftedOffset(this.chars[pos - 1].offset,1))
        this.insertCharAtPos(charObj, pos)
    }

    insertCharPrepended(charValue, pos) {
        let charObj = new Char(charValue, this.chars[pos].baseRef, getShiftedOffset(this.chars[pos].offset, -1))
        this.insertCharAtPos(charObj, pos)
    }

    areThereCharsWithSameBaseAndLowerOffset(charPos) {
        for (let i = 1; charPos - i > 0; --i)
            if (this.chars[charPos].baseRef === this.chars[charPos - i].baseRef)
                return true;
        return false
    }

    areThereCharsWithSameBaseAndHigherOffset(charPos) {
        for (let i = 1; charPos + i < this.chars.length; ++i)
            if (this.chars[charPos].baseRef === this.chars[charPos + i].baseRef)
                return true
        return false
    }

    getInsertLocation(insertPos) {
        if (this.chars.length === 0)
            return insertLocation.EMPTY_DOC
        if (insertPos >= this.chars.length) //TODO check if can be >
            return insertLocation.DOC_END
        if (insertPos > 0)
            return insertLocation.DOC_MIDDLE
        else
            return insertLocation.DOC_BEG
    }

    get text() {
        let str = ""
        for (let i = 0; i < this.chars.length; ++i)
            str += this.chars[i].value
        return str
    }

    getCharAtPos(pos) {
        return this.chars[pos]
    }

    get firstChar(){
        return this.chars[0]
    }

    get lastChar(){
        return this.chars[this.chars.length-1]
    }

    get charsNum(){
        return this.chars.length
    }
}

class Char {
    constructor(value, baseRef, offset) {
        this.value = value
        this.baseRef = baseRef
        this.offset = offset
    }

    get id() {
        return this.baseRef.value + this.offset
    }

    get sessionId() {
        return "xDD" //TODO
    }
}

class Base {
    constructor(value) {
        this.value = value
    }
}

