class Base {
    constructor(main, sessionId, clock) {
        this.main = main
        this.sessionId = sessionId
        this.clock = clock
        this.minUsedOffset = MAX_OFFSET + 1
        this.maxUsedOffset = MIN_OFFSET - 1
    }

    get fullBase() {
        return this.main.concat([this.sessionId], [this.clock])
    }

    get copy(){
        return new Base(this.main.slice(), this.sessionId, this.clock) 
    }

    isEqual(otherBase) {
        if (this.sessionId !== otherBase.sessionId || this.clock !== otherBase.clock || this.main.length !== otherBase.main.length)
            return false
        for (let i = 0; i < this.main.length; ++i)
            if (this.main[i] != otherBase.main[i])
                return false

        return true
    }

    isPrefix(charId){
        let thisId = this.fullBase
        let otherId = charId.fullId
        if(thisId.length > otherId.length)
            return false
        for(let i=0; i<thisId.length; ++i)
            if(thisId[i] != otherId[i])
                return false
        return true;
    }
}