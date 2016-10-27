class PseudoServer {
    constructor() {
        this.TESTMODE = true
        this.sessions = []
        this.nextSessionId = 0
        this.addBuffer = []
    }

    createNewSession(sessionId){
        this.sessions.push(new PseudoLocalSession(++this.nextSessionId, this))
    }

    emitAdd(addData) {
        //if(TESTMODE)
        for(let i=0; i<this.sessions.length; ++i)
            if(this.sessions[i].sessionId !== addData.session)
                this.sessions[i].add(addData.str, addData.id)
    }

    emitDel(delData){
        for(let i=0; i<this.sessions.length; ++i)
            if(this.sessions[i].sessionId !== delData.session)
                this.sessions[i].del(delData.ids)
    }
}