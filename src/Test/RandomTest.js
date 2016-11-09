function simulate(){
    server = new PseudoServer()
    s = []
    for(let i=0; i<3; ++i){
        server.createNewSession(i)
        s.push(server.sessions[i])
    }
    //executeCustomCommands()
    executeRandomCommands(10, "mode2");
    sync()

}

function executeCustomCommands(){
    i(s[0],"abc", 1)
    i(s[0],"def", 2)
    i(s[0],"ghi", 4)
    i(s[1],"ABC", 1)
    i(s[1],"DEF", 1)
    i(s[1],"GHI", 5)
}

// insert str at (existing) pos as session
function i(session, str, pos){
    session.insert(str, pos)
    printDocs()
}

//remove chars from (existing) range [fromPos;toPos] as session
function r(session, fromPos, toPos){
    session.remove(fromPos, toPos)
    printDocs()
}

function sync(){
    server.emitAllBufferedCommands()
    console.log('sync');
    printDocs()
    showSyncResult()
}

function showSyncResult(){
    let success = true
    for(let i=0; i<server.sessions.length-1; ++i)
        if(server.sessions[i].doc.textTest != server.sessions[i+1].doc.textTest){
            console.log("FAIL("+(i+1)+","+(i+2)+")")
            success = false;
        }
    if(success)
        console.log("SUCCESS");

}

function compareDocs(s1index, s2index){
    let s1chars = server.sessions[s1index].doc.chars;
    let s2chars = server.sessions[s2index].doc.chars;
    let fail = false;
    let failIndexes = []

    for(let i=1; i<s1chars.length-1; ++i)
        if(!s1chars[i].isEqual(s2chars[i])){
            fail = true;
            failIndexes.push(i)
        }
    if(fail)
        console.log("COMP FAIL AT INDEXES " + failIndexes)
    else
        console.log("COMPARE DOCS SUCCESS")
}

function printDocs(){
    for(let i=0; i<server.sessions.length; ++i){
        console.log(server.sessions[i].sessionId, server.sessions[i].doc.textTest)
    }
}

function printIds(){
    for(let i=0; i<server.sessions.length; ++i){
        let session = server.sessions[i]
        let idString = session.sessionId + " "
        for(let i=1; i<session.doc.chars.length-1; ++i){
            idString += "("
            let fullId = session.doc.chars[i].id.fullId
            let currId = ""
            for(let j=0; j<fullId.length; ++j)
                currId += fullId[j] + ", "
            idString += (currId + ")  " )
        }
        console.log(idString)
    }
}

function executeRandomCommands(cmdCount, mode = "mode1"){
    if(mode == "mode1")
        for(let i=0; i<cmdCount; ++i){
            let currSession = getRandomSession()
            generateRandomValidCommand(currSession)
        }
    else
        for(let j=0; j<server.sessions.length; ++j)
            for(let i=0; i<cmdCount; ++i)
                generateRandomValidCommand(server.sessions[j])

}

function generateRandomValidCommand(session){
    generateRandomValidInsertCommand(session)
    /*
    if(generateRandomCommandType() == "insert")
        return generateRandomValidInsertCommand(session)
    else
        return generateRandomValidRemoveCommand(session)*/
}

function generateRandomValidInsertCommand(session){
    let str = getRandomStr()
    let pos = getRandomPos(session)
    session.insert(str, pos)
    console.log("S" + session.sessionId + " INSERTED " + str + " AT POS " + pos)
    printDocs()
}

function getRandomCommandType(session){
    if(session.doc.chars.length < 3 || getRandomInt(0,1) === 0)
        return "insert"
    else
        return "remove"
}

function getRandomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomStr(strLen = 3){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < strLen; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function getRandomPos(session){
    return getRandomInt(1, session.doc.chars.length - 1)
}

function getRandomSession(){
    return s[getRandomInt(0, s.length - 1)]
}