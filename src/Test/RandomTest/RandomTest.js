var NUM_OF_TESTS = 1
var NUM_OF_SESSIONS = 3
var MIN_NUM_OF_COMMANDS = 4
var USE_REAL_SENTENCES = false
var TESTED_CMD_TYPES = ["INSERT"]

var TEST_UNTIL_FAIL = false
var STOP_ON_FAIL = true

var CHARSET1 = "abcdefghijklmnopqrstuvwxyz";
var CHARSET2 = "ab\n";
var RANDOM_STR_VALID_CHARS = CHARSET2

var MAX_RANDOM_STR_LEN = 3
var MAX_REMOVE_LENGTH = 10

var CUSTOM_TEST = false

var CLEAR_CONSOLE_AFTER_SUCCESS = false
    
var sessions = []
var testNum = 0
var successes = 0

function start(numOfTests){
    if(CUSTOM_TEST)
        startCustomTests();
    else
        TEST_UNTIL_FAIL ? startRandomTestingUntilFail() : startRandomTesting(numOfTests);
}

function startRandomTesting(numOfTests = NUM_OF_TESTS) {

    for (let i = 0; i < numOfTests; ++i){
        let currentSuccesses = successes
        startRandomTest()
        if(successes == currentSuccesses && STOP_ON_FAIL)
            return;
    }
}

function startRandomTestingUntilFail(){
    while(1){
        let currentSuccesses = successes
        startRandomTest()
        if(successes == currentSuccesses)
            return;
    }
}

function startRandomTest() {
    resetEverything()
    console.log("TEST ", ++testNum)
    executeRandomCmds()
    if(areAllDocumentsSame()){
        ++successes
        if(CLEAR_CONSOLE_AFTER_SUCCESS)
            console.clear()
    }
    else
        console.log("FAIL")

    showResults()
}

function resetEverything() {
    sessions = []
    for (let i = 1; i <= NUM_OF_SESSIONS; ++i)
        sessions.push(new PseudoSession(i))
}

function executeRandomCmds() {
    executeMinNumOfRandomCmds()
    executeBufferedCmds()
}

function executeMinNumOfRandomCmds() {
    let session, possibleCmds;
    for (let i = 0; i < MIN_NUM_OF_COMMANDS; ++i) {
        session = getRandomItem(sessions)
        possibleCmds = getPossibleCmds(session)
        executeRandomCmd(session, possibleCmds)
    }
}

function getPossibleCmds(session){
    let possibleCmds = ["INSERT"]
    if(session.isRemovePossible() && TESTED_CMD_TYPES.includes("REMOVE"))
        possibleCmds.push("REMOVE")
    if(!session.isRemoteCmdBufferEmpty() && TESTED_CMD_TYPES.includes("BUFFERED"))
        possibleCmds.push("BUFFERED")
    return possibleCmds
}


function executeBufferedCmds(){
    for(let session of sessions)
        while(!session.isRemoteCmdBufferEmpty())
            executeRandomCmd(session, ["BUFFERED"])
}


function resetEverything() {
    sessions = []
    for (let i = 1; i <= NUM_OF_SESSIONS; ++i)
        sessions.push(new PseudoSession(i))
}

function executeRandomCmd(session, possibleCmds){
    let cmdType = getRandomItem(possibleCmds)
    if(cmdType == "INSERT")
        executeRandomInsertCmd(session)
    else if(cmdType == "REMOVE")
        executeRandomRemoveCmd(session)
    else
        executeRandomBufferedCmd(session)
}

function executeRandomInsertCmd(session) {
    let str = USE_REAL_SENTENCES ? getRandomSentence() : getRandomStr()
    let pos = getRandomInsPos(session)
    let returnedAddCmd = session.insert(str, pos)
    addToSessionBuffersRemoteCmdGeneratedBySession(returnedAddCmd, session);
}

function executeRandomRemoveCmd(session) {
    let pos1 = getRandomRemovePos(session)
    let pos2 = getRandomRemovePos(session)
    let fromPos = Math.min(pos1, pos2)
    let toPos = Math.max(pos1, pos2)

    if(fromPos - toPos > MAX_REMOVE_LENGTH - 1)
        toPos = fromPos + MAX_REMOVE_LENGTH - 1
    
    let returnedDelCmd = session.remove(fromPos, toPos)
    addToSessionBuffersRemoteCmdGeneratedBySession(returnedDelCmd, session);
}

function addToSessionBuffersRemoteCmdGeneratedBySession(cmd, sessionWhichGeneratedCmd){
    for(let sess of sessions)
        if(sess != sessionWhichGeneratedCmd)
            sess.addRemoteCmdToBuffer(cmd)
}

function executeRandomBufferedCmd(session) {
    let cmds = session.remoteCmdBuffer
    for(let i=0; i<cmds.length; ++i)
        session.executeBufferedCmd(getRandomIndex(cmds))
}

function areAllDocumentsSame() {
    for(let session1 of sessions)
        for(let session2 of sessions)
            if(session1.doc.textTest != session2.doc.textTest)
                return false
    return true
}

function getRandomStr(){
    var text = "";
    var length = getRandomInt(1, MAX_RANDOM_STR_LEN)
    for( var i=0; i < length; i++ )
        text += getRandomChar()
    return text;
}

function getRandomChar(){
    return RANDOM_STR_VALID_CHARS.charAt(Math.floor(Math.random() * RANDOM_STR_VALID_CHARS.length));
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomInsPos(session){
    return getRandomInt(1, session.doc.chars.length - 1)
}

function getRandomRemovePos(session){
    return getRandomInt(1, session.doc.chars.length - 2)
}

function getRandomIndex(array){
    let len = array.length
    return len > 0 ? getRandomInt(0, len - 1) : null
}

function getRandomItem(array){
    let randIndex = getRandomIndex(array)
    return randIndex != null ? array[randIndex] : null
}

function getRandomSentence(){
    return this.getRandomItem(RANDOM_SENTENCES)
}

function showResults(){
    if(TEST_UNTIL_FAIL)
        logResults(testNum - 1, testNum)
    else
        logResults(successes, NUM_OF_TESTS)

}
