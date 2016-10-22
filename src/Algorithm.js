/// <reference path="js/Const.js" />
/// <reference path="js/Document.js" />
/// <reference path="js/Tools.js" />

class Algorithm {
    constructor(doc, sessionId) {
        this.doc = doc
        this.sessionId = sessionId 
    }

    insert(str, pos) { //TODO verify pos values //TODO handle veyr long string > maxoffset
        let insLocation = this.doc.getInsertLocation(pos)

        if(insLocation === insertLocation.DOC_MIDDLE)
            this.insertInTheMiddle(str, pos)
        else if(insLocation === insertLocation.DOC_END)
            this.insertAtTheEnd(str)
        else if(insLocation === insertLocation.DOC_BEG)
            this.insertAtTheBegin(str)
        else
            this.insertFirstString(str)
    }

    insertFirstString(str) {
        this.insertWithNewBase(str, 0, ID_MIN, ID_MAX)
    }

    insertAtTheBegin(str) {
        if (this.canBePrepended(str, DOC_FIRST_POS))
            this.doc.insertStringPrepended(str, DOC_FIRST_POS)
        else
            this.insertWithNewBase(str, DOC_FIRST_POS, ID_MIN, this.doc.firstChar.id)
    }

    insertInTheMiddle(str, pos) {
        if(this.canBeAppended(str, pos))
            this.doc.insertStringAppended(str, pos)
        else if (this.canBePrepended(str, pos))
            this.doc.insertStringPrepended(str, pos)
        else
            this.insertWithNewBase(str, pos, this.doc.getCharAtPos(pos - 1).id, this.doc.getCharAtPos(pos).id)
    }

    insertAtTheEnd(str) {
        if (this.canBeAppended(str, this.doc.charsNum))
            this.doc.insertStringAppended(str, this.doc.charsNum)
        else
            this.insertWithNewBase(str, this.doc.charsNum, this.doc.lastChar.id, ID_MAX)
    }

    insertWithNewBase(str, pos, idMin, idMax) {
        let base = this.generateBaseBetweenIds(idMin, idMax)
        this.doc.insertStringWithNewBase(str, pos, base)
    }

    generateBaseBetweenIds(idLow, idHigh) {
        let newBase = ""
        let low = idLow[0]
        let high = idHigh[0]

        for (let i = 1; getOffsetDifference(high, low) < 2; ++i) {
            newBase += low
            low = (i < idLow.length ? idLow[i] : ALPH_BLANK)
            high = (i < idHigh.length ? idHigh[i] : ALPH_END)
        }
        newBase += getRandomNonBlankAlphabetElementBetween(low, high)
        return new Base(newBase) //TODO separator sessionId clock
    }

    canBePrepended(str, pos) {
        let anchorChar = this.doc.getCharAtPos(pos)
        return this.isSameSession(this.sessionId, anchorChar.sessionId)
            && this.isFirstInBase(pos)
            && this.isEnoughSpaceBefore(str, pos)
    }

    canBeAppended(str, pos) {
        let anchorChar = this.doc.getCharAtPos(pos - 1)
        return this.isSameSession(this.sessionId, anchorChar.sessionId)
            && this.isLastInBase(pos - 1)
            && this.isEnoughSpaceAfter(str, pos - 1)
    }

    isSameSession(sessionId1, sessionId2) {
        return true //TODO
        //return sessionId1 === sessionId2
    }

    isFirstInBase(pos) {
        return ! this.doc.areThereCharsWithSameBaseAndLowerOffset(pos)
    }

    isLastInBase(pos){
        return ! this.doc.areThereCharsWithSameBaseAndHigherOffset(pos)
    }

    isEnoughSpaceBefore(str, pos) {
        let anchorPointOffset = this.doc.getCharAtPos(pos).offset
        return getOffsetDifference(anchorPointOffset, ALPH_BEG) > str.length //TODO not >= ?
    }

    isEnoughSpaceAfter(str, pos) {
        let anchorPointOffset = this.doc.getCharAtPos(pos).offset
        return getOffsetDifference(ALPH_END, anchorPointOffset) > str.length //TODO not >= ?
    }


}