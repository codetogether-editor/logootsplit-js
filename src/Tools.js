function getShiftedOffset(offset, shift) { //if not possible then returns first or last ALPHABET el
    let shiftedOffsetPos = ALPHABET.indexOf(offset) + shift
    if (shiftedOffsetPos < ALPH_BEG_POS)
        return ALPH_BLANK
    if (shiftedOffsetPos > ALPH_END)
        return ALPH_END
    else
        return ALPHABET[shiftedOffsetPos]
}

function getOffsetDifference(offHigh, offLow) {
    return ALPHABET.indexOf(offHigh) - ALPHABET.indexOf(offLow)
}

function getRandomNonBlankAlphabetElementBetween(min, max) {
    let minPos = ALPHABET.indexOf(getShiftedOffset(min, 1))
    let maxPos = ALPHABET.indexOf(getShiftedOffset(max, -1))
    let pos = Math.floor(Math.random() * (maxPos - minPos + 1)) + minPos;
    return ALPHABET[pos]
}