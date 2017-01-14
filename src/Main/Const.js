window.MIN_BASE_EL = 0
//const MAX_BASE_EL = Math.pow(2, 53) - 1
window.MAX_BASE_EL = 10000000
window.MIN_OFFSET = MIN_BASE_EL + 1
window.MAX_OFFSET = MAX_BASE_EL
window.FIRST_ASSIGNED_OFFSET = Math.floor(MAX_OFFSET/2)

// Char ID is represented by array of numbers, each of them in range [MIN_BASE_EL;MAX_BASE_EL]
// Last element of char ID is called offset, others are called base
// MIN_BASE_EL cannot be used as offset
// When new base is generated, first char assigned to this base get offset FIRST_ASSIGNED_OFFSET, this value decide how much chars we can append and prepend to first char
