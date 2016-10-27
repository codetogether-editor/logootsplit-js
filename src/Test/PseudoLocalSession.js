class PseudoLocalSession {
    constructor(sessionId, server) {
        this.sessionId = sessionId
        this.doc = new Document()
        this.server = server
        this.alg = new Algorithm(this.doc, this.sessionId)
    }

    insert(str, pos) {
        let addCommandData = this.alg.insert(str, pos)
        this.server.emitAdd(addCommandData)
    }

    add(str, strId) {
        this.alg.add(str, strId)
    }

    remove(fromPos, toPos){
        let delCommandData = this.alg.remove(fromPos, toPos)
        this.server.emitDel(delCommandData)
    }

    del(ids){
        this.alg.del(ids)
    }

    setText(text) {
        document.getElementById(this.sessionId).innerHTML = text;
    }
}