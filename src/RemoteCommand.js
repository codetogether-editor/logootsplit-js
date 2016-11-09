class RemoteCommand{
    constructor(){}

    makeAddCommand(str, id, session){
        this.type = "add"
        this.str = str
        this.id = id
        this.session = session
    }

    makeDelCommand(ids, session){
        this.type = "del"
        this.ids = ids
        this.session = session
    }
}