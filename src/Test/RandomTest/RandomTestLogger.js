var ALL_LOGS = false

var SHOW_CMD_LOGS = ALL_LOGS || true
var SHOW_FUNC_LOGS = ALL_LOGS || false

var SHOW_SESSION_STATES_AFTER_EACH_LOG = true
var DETAILED_SESSION_STATES = false

function logFunc(funcName, args, additionalInfo){
    if(SHOW_FUNC_LOGS)
        if(additionalInfo == null)
            console.log(funcName, ":  ", args)
        else
            console.log(funcName, ":  ", args, " | ", additionalInfo)
}

function logCmd(cmdType, session, args){
    if(!SHOW_CMD_LOGS)
        return

    if(cmdType == "INSERT")
        logInsert(session, args[0], args[1])
    else if(cmdType == "REMOVE")
        logRemove(session, args[0], args[1])
    else if(cmdType == "ADD")
        logAdd(session, args[0], args[1])
    else if(cmdType == "DEL")
        logDel(session, args)


    if(SHOW_SESSION_STATES_AFTER_EACH_LOG)
        if(DETAILED_SESSION_STATES)
            showDetailedSessionStates()
        else
            showSessionStates()
}

function logInsert(session, str, pos) {
    console.log(
        getSessionStr(session),
        " INSERT ",
        str,
        " AT POS ",
        pos
    )
}

function logRemove(session, fromPos, toPos){
    console.log(
        getSessionStr(session),
        " REMOVE RANGE",
        fromPos,
        " - ",
        toPos
    )
}

function logAdd(session, str, strId){
    console.log(
        getSessionStr(session),
        " ADD STR ",
        str,
        " WITH ID ",
        strId
    )
}

function logDel(session, ids){
    console.log(
        getSessionStr(session),
        "DEL IDS ",
        ids
    )
}

function logResults(passedTests, allTests){
    let str = passedTests + "/" + allTests + " passed" 
    console.log(str)

    document.getElementById("result").innerHTML = str
}

function getSessionStr(session) {
    return "S" + session.sessionId + ":";
}

function showSessionStates(){
    for(let session of sessions)
        showSessionState(session)
    console.log("---------------------------------------------------------------")
}

function showDetailedSessionStates(){
    for(let session of sessions)
        showDetailedSessionState(session)
    console.log("---------------------------------------------------------------")
}

function showSessionState(session){
    let maxPos = session.doc.chars.length - 1
    console.log(
        "----- ",
        getSessionStr(session),
        session.doc.textTest
    )
}

function showDetailedSessionState(session){
    console.log(getSessionStr(session))
    for(let i=0; i < session.doc.chars.length; ++i)
        console.log("----- " + getCharStateStr(session.doc.chars[i]))
}

function getCharStateStr(char){
    return char.value + ":  " + char.id.fullId.toString()
}