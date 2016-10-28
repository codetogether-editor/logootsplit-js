class PseudoServer {
    constructor() {
        this.buffering = true
        this.sessions = []
        this.nextSessionId = 0
        this.remoteAddBuffer = []
        this.remoteDelBuffer = []
    }

    createNewSession(sessionId) {
        this.sessions.push(new PseudoLocalSession(++this.nextSessionId, this))
    }

    emitAdd(addData) {
        if (this.buffering == false) {
            for (let i = 0; i < this.sessions.length; ++i)
                if (this.sessions[i].sessionId !== addData.session)
                    this.sessions[i].add(addData.str, addData.id)
        }
        else
            this.remoteAddBuffer.push(addData)
    }

    emitDel(delData) {
        if (this.buffering == false) {
            for (let i = 0; i < this.sessions.length; ++i)
                if (this.sessions[i].sessionId !== delData.session)
                    this.sessions[i].del(delData.ids)
        } else
            this.remoteDelBuffer.push(delData)
    }

    emitRemoteBufferCommandsInRandomOrder() {
        this.buffering = false
        while (this.remoteAddBuffer.length > 0 || this.remoteDelBuffer.length > 0) {
            let buffer, min, max, randomIndex, cmd

            if(this.remoteDelBuffer.length == 0 || (Math.floor(Math.random() * 2) == 0 &&       this.remoteAddBuffer.length > 0)){
                buffer = this.remoteAddBuffer
                min = 0, max = buffer.length - 1
                randomIndex = Math.floor(Math.random() * (max - min + 1)) + min
                cmd = buffer.splice(randomIndex, 1)[0]
                this.emitAdd(cmd) 
            }
            else{
                buffer = this.remoteDelBuffer
                min = 0, max = buffer.length - 1
                randomIndex = Math.floor(Math.random() * (max - min + 1)) + min
                cmd = buffer.splice(randomIndex, 1)[0]
                this.emitDel(cmd) 
            }

        }
        this.buffering = true
    }
}