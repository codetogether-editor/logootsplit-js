const ALPHABET = "_abcdefghijklmnopqrstuvwxyz" // identifier is a sequence of ALPHABET elements

const ALPH_BEG_POS = 1                         // elements [ALPH_BEG, ALPH_END] can be used on each id position
const ALPH_END_POS = ALPHABET.length - 1
const ALPH_BEG = ALPHABET[ALPH_BEG_POS]
const ALPH_END = ALPHABET[ALPH_END_POS]

const ALPH_BLANK_POS = 0                        // element BLANK is used when generating new base between existing ids  
const ALPH_BLANK = ALPHABET[ALPH_BLANK_POS]     // it can't be placed at the end of the identifier
                                                // we assume that for each X,Y in [ALPH_BEG, ALPH_END]:  X < X_Y < XX
                                         
const ID_MIN = ALPHABET[ALPH_BEG_POS]           // used to generate first id base in document
const ID_MAX = ALPHABET[ALPH_END_POS]

const insertLocation = {
    EMPTY_DOC: 0,
    DOC_BEG: 1,
    DOC_MIDDLE: 2,
    DOC_END: 3
}

const DOC_FIRST_POS = 0


// TODO optimize ALPPHABET related operations