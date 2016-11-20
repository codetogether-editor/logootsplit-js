class RemoteCommand{
    constructor(){}

    makeAddCommand(str, id, sessionId){
        this.type = "add"
        this.str = str
        this.id = id
        this.sessionId = sessionId
    }

    makeDelCommand(ids, sessionId){
        this.type = "del"
        this.ids = ids
        this.sessionId = sessionId
    }
}