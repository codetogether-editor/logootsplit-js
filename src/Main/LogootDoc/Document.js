import Base from './Base';
import CharId from './CharId';
import Char from './Char';

// At the beginning document contains two chars: DOC_BEG and DOC_END, they're not actual
// text chars and are only used to represent start and end of the document

var DOC_BEG = new Char(null, new CharId(new Base([MIN_BASE_EL - 1], MIN_BASE_EL - 1, MIN_BASE_EL - 1), MIN_OFFSET - 1))
var DOC_END = new Char(null, new CharId(new Base([MAX_BASE_EL + 1], MAX_BASE_EL + 1, MAX_BASE_EL + 1), MAX_OFFSET + 1))

export default class Document {
    constructor() {
        this.chars = [DOC_BEG, DOC_END]
        this.bases = []
    }

    insertStrAppended(str, pos) {
        let charWeAppendTo = this.chars[pos - 1];
        let base = charWeAppendTo.id.base
        let firstOffset = charWeAppendTo.id.offset + 1
        this.insertStringWithExistingBase(str, pos, base, firstOffset)
    }

    insertStrPrepended(str, pos) {
        let charWePrependTo = this.chars[pos];
        let base = charWePrependTo.id.base
        let firstOffset = charWePrependTo.id.offset - str.length
        this.insertStringWithExistingBase(str, pos, base, firstOffset)
    }

    insertStringWithExistingBase(str, pos, base, firstOffset = FIRST_ASSIGNED_OFFSET) { //optimize
        this.insertStrAtPos(str, pos, base, firstOffset)
        //this.sortDocumentPart(1, this.chars.length - 1) //VERIFY CHANGE
        this.sortDocumentPart(pos, this.chars.length - 1)
    }

    insertStringWithNewBase(str, pos, base) {
        this.addBase(base)
        this.insertStringWithExistingBase(str, pos, base)
    }

    insertStrAtPos(str, pos, base, firstCharOffset) {
        let offset = firstCharOffset
        for (let char of str) {
            let newId = new CharId(base, offset)
            let newChar = new Char(char, newId)
            this.insertCharAtPos(newChar, pos)
            ++pos
            ++offset
        }
    }

    addCharsAndGetChanges(chars) {
        let changes = []
        if (chars.length == 0)
            return
        let pos0 = this.getPosOfFirstCharWithBiggerId(chars[0].id)
        let prevUsedPos = null
        let changeStr = ""

        for (let i = chars.length - 1; i >= 0; --i) {
            let pos = this.getPosOfFirstCharWithBiggerIdStartingFrom(chars[i].id, pos0)
            if (prevUsedPos === pos || changeStr === "") {
                changeStr = chars[i].value + changeStr
            } else {
                let change = { type: "add", string: changeStr, position: this.getCoordPos(prevUsedPos) }
                changes.push(change)
                changeStr = chars[i].value
            }
            if (i == 0 && changeStr !== "")
                changes.push({ type: "add", string: changeStr, position: this.getCoordPos(pos) })
            this.insertCharAtPos(chars[i], pos)
            prevUsedPos = pos
        }

        return changes
    }

    getCoordPos(pos) {
        let line = 0
        let column = 0
        for (let i = pos - 1; this.chars[i].value != '\n' && i > 0; --i){
            column++
        }
        for (let i = 1; i < pos; ++i)
            if (this.chars[i].value == "\n")
                line++
        return { line: line, column: column }
    }

    sortDocumentPart(sortBeg, sortEnd) {
        for (var pos = sortBeg + 1; pos <= sortEnd; ++pos) {
            var temp = this.chars[pos];
            var prevPos = pos - 1;
            for (; prevPos >= 1 && this.chars[prevPos].id.isBigger(temp.id); --prevPos)
                this.chars[prevPos + 1] = this.chars[prevPos];
            this.chars[prevPos + 1] = temp;
        }
    }

    addBase(base) {
        this.bases.push(base)
    }

    delChars(fromPos, toPos) {
        for (let pos = toPos; pos >= fromPos; --pos)
            this.delChar(pos)
    }

    delChar(pos) {
        this.chars.splice(pos, 1)
    }

    getPosOfCharWithId(id) {
        for (let pos = 0; pos < this.chars.length; ++pos)
            if (this.chars[pos].id.isEqual(id))
                return pos
        return null
    }

    getPosOfFirstCharWithBiggerId(charId) {
        for (let pos = 1; pos < this.chars.length; ++pos)
            if (this.chars[pos].id.isBigger(charId))
                return pos
        return null
    }

    getPosOfFirstCharWithBiggerIdStartingFrom(charId, startPos) {
        for (let pos = startPos; pos < this.chars.length; ++pos)
            if (this.chars[pos].id.isBigger(charId))
                return pos
        return null
    }

    getCharAtPos(pos) {
        return this.chars[pos]
    }

    getIdOfCharAtPos(pos) {
        return this.chars[pos].id
    }

    getCharIds(fromPos, toPos) {
        let ids = []
        for (let i = fromPos; i <= toPos; ++i)
            ids.push(this.chars[i].id)
        return ids;
    }
    getSameBase(base) {
        for (let b of this.bases)
            if (base.isEqual(b))
                return b
        return null
    }

    insertCharAtPos(char, pos) {
        this.chars.splice(pos, 0, char)
    }

    isEmpty() {
        return this.chars.length == 2
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

    getAsLines() {
        let lines = []
        let line = []
        for (let i = 1; i < this.chars.length - 1; ++i) {
            line.push(this.chars[i])
            if (this.chars[i].value == '\n' || i == this.chars.length - 2)
                lines.push(line)
        }
        return lines
    }
}