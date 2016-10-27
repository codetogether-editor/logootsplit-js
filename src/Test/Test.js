function simulate(){
    server = new PseudoServer()
    server.createNewSession(1)
    server.createNewSession(2)

    u1 = server.sessions[0]
    u2 = server.sessions[1]

    i(u1, "kot", 1)
    i(u1, "ek", 4)
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

function printDocs(){
    for(let i=0; i<server.sessions.length; ++i){
        console.log(server.sessions[i].sessionId, server.sessions[i].doc.textTest)
    }
}