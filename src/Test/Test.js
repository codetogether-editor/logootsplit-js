function simulate(){
    server = new PseudoServer()
    server.createNewSession(1)
    server.createNewSession(2)

    u1 = server.sessions[0]
    u2 = server.sessions[1]

    i(u1, "fir", 1)
    i(u1, "st", 4)  
    i(u2, "sec", 1) 
    i(u2, "ond", 4)
    sync()

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
    server.emitRemoteBufferCommandsInRandomOrder()
    printDocs()
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