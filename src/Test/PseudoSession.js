class PseudoSession {
    constructor(sessionId) {
        this.sessionId = sessionId
        this.doc = new Document()
        this.alg = new Algorithm(this.doc, this.sessionId)
        this.remoteCmdBuffer = []
    }

    insert(str, pos) {
        let addCommandData = this.alg.insert(str, pos)
        logCmd("INSERT", this, [str, pos])
        return addCommandData;
    }

    remove(fromPos, toPos) {
        let delCommandData = this.alg.remove(fromPos, toPos)
        logCmd("REMOVE", this, [fromPos, toPos])
        return delCommandData
    }

    add(str, strId) {
        this.alg.add(str, strId)
        logCmd("ADD", this, [str, strId])
    }

    del(ids) {
        this.alg.del(ids)
        logCmd("DEL", this, ids)
    }

    addFromCmd(cmd){
        this.add(cmd.str, cmd.id)
    }

    delFromCmd(cmd){
        this.del(cmd.ids)
    }
    executeBufferedCmd(cmdIndex) {
        if (cmdIndex < this.remoteCmdBuffer.length) {
            let cmd = this.remoteCmdBuffer.pop(cmdIndex)
            cmd.type == "add" ? this.addFromCmd(cmd) : this.delFromCmd(cmd)
        }
    }

    addRemoteCmdToBuffer(remoteCmd) {
        this.remoteCmdBuffer.push(remoteCmd)
    }

    isRemovePossible() {
        return !this.doc.isEmpty()
    }

    isRemoteCmdBufferEmpty() {
        return this.remoteCmdBuffer.length == 0
    }

    isEqual(otherSession){
        return this.sessionId == otherSession.sessionId
    }
}