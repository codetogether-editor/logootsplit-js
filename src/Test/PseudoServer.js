class RemoteCommandBuffer{
    constructor(session, firstRemoteCmd){
        this.session = session;
        this.commands = []
        this.commands.push(firstRemoteCmd);
    }
}

class PseudoServer {
    constructor() {
        this.buffering = true
        this.sessions = []
        this.nextSessionId = 0
        this.remoteAddBuffer = []
        this.remoteDelBuffer = []
        this.remoteCommandBuffers = []
    }

    createNewSession(sessionId) {
        this.sessions.push(new PseudoLocalSession(++this.nextSessionId, this))
    }

    emitRemoteCommand(command, senderSession){
        if(this.buffering == false){
            for (let i = 0; i < this.sessions.length; ++i)
                if (this.sessions[i].sessionId !== command.session){
                    if(command.type = "add")
                        this.sessions[i].add(command.str, command.id)
                    else
                        this.sessions[i].del(command.ids)
                }
        } else {
            for(let i=0; i<this.remoteCommandBuffers.length; ++i)
                if(this.remoteCommandBuffers[i].session === senderSession){
                    this.remoteCommandBuffers[i].commands.push(command)
                    return
                }
            this.remoteCommandBuffers.push(new RemoteCommandBuffer(senderSession, command))
        }
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

    emitAllBufferedCommands(){
        this.buffering = false;
        for(let i=0; i<this.remoteCommandBuffers.length; ++i){
            for(let j=0; j<this.remoteCommandBuffers[i].commands.length; ++j)
                this.emitRemoteCommand(this.remoteCommandBuffers[i].commands[j])
        }
        this.buffering = false;
    }
}