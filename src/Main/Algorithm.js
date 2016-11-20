class Algorithm {
    constructor(doc, sessionId) {
        this.doc = doc
        this.sessionId = sessionId
        this.clock = 0
        this.idsOfCharsToDeleteLater = []
    }

    insert(str, pos){
        this.insertIntoDocument(str, pos)
        return this.createRemoteAddCommand(str, pos)
    }

    add(str, strId){

        let chars = this.createCharsFromStr(str, strId)
        logFunc("add", [str, strId], [this.idsOfCharsToDeleteLater, chars])

        for(let i = chars.length-1; i>=0; --i){
            for(let j=this.idsOfCharsToDeleteLater.length-1; j>=0; --j){
                if(chars[i].id.isEqual(this.idsOfCharsToDeleteLater[j])){
                    chars.splice(i,1)
                    this.idsOfCharsToDeleteLater.splice(j,1)
                    break;
                }
            }
        }
        this.doc.addChars(chars)
    }

    remove(fromPos, toPos){
        logFunc("remove", [fromPos, toPos])
        let delIds = this.doc.getCharIds(fromPos, toPos)
        let delIdsCopy = delIds.map(function(id){return id.copy})
        this.doc.delChars(fromPos, toPos)
        return this.createRemoteDelCommand(delIds)
    }

    del(ids){ //optimize eg. if consecutive ids then obtain range (pos, pos+length-1)
        logFunc("del", [ids])
        for(let id of ids){
            let pos = this.doc.getPosOfCharWithId(id)
            if(pos != null)
                this.doc.delChar(pos)
            else
                this.idsOfCharsToDeleteLater.push(id)
        }
    }

    createRemoteDelCommand(delIds){
        let remoteDelCommand = new RemoteCommand();
        remoteDelCommand.makeDelCommand(delIds, this.session);
        return remoteDelCommand
    }

    createCharsFromStr(str, strId){
        let base = this.doc.getSameBase(strId.base)
        if(base == null)
            base = strId.base
        
        let chars = []
        let offset = strId.offset
        for(let char of str){
            chars.push(new Char(char, new CharId(base, offset)))
            ++offset
        }
        return chars;
    }

    insertIntoDocument(str, pos){
        if(this.canInsertAppended(str, pos))
            this.doc.insertStrAppended(str, pos)
        else if(this.canInsertPrepended(str, pos))
            this.doc.insertStrPrepended(str, pos)
        else
            this.doc.insertStringWithNewBase(str, pos, this.generateBaseAtPos(pos))
    }

    canInsertAppended(str, pos){
        let charWeAppendTo = this.doc.getCharAtPos(pos - 1)
        return this.isSameSession(charWeAppendTo)
            && this.isHighestOffsetInBase(charWeAppendTo)
            && this.isSpaceInBaseAfter(charWeAppendTo, str.length)
            && this.BETA(str, pos) //todo 
    }

    BETA(str, pos){
        let idNext = this.doc.getIdOfCharAtPos(pos)
        let idInsert = this.doc.getIdOfCharAtPos(pos - 1).copy
        idInsert.offset++
        return this.numberOfInsertableCharaters(idInsert, idNext, str.length) > 0 
    }

    canInsertPrepended(str, pos){
        let charWePrependTo = this.doc.getCharAtPos(pos)
        return this.isSameSession(charWePrependTo)
            && this.isLowestOffsetInBase(charWePrependTo)
            && this.isSpaceInBaseBefore(charWePrependTo, str.length)
    }

    isSameSession(char){
        return char.id.base.sessionId == this.sessionId
    }

    isHighestOffsetInBase(char){
        return char.id.offset == char.id.base.maxUsedOffset
    }

    isLowestOffsetInBase(char){
        return char.id.offset == char.id.base.minUsedOffset
    }

    isSpaceInBaseAfter(char, spaceLength){
        return char.id.offset + spaceLength < MAX_BASE_EL
    }

    isSpaceInBaseBefore(char, spaceLength){
        return char.id.offset - spaceLength > MIN_BASE_EL
    }

    createRemoteAddCommand(str, pos){
        let addId = this.doc.getCharAtPos(pos).id.copy
        let remoteAddCommand = new RemoteCommand();
        remoteAddCommand.makeAddCommand(str, addId, this.sessionId)
        return remoteAddCommand
    }

    generateBaseAtPos(pos){
        let idLow = this.doc.getIdOfCharAtPos(pos - 1).fullId
        let idHigh = this.doc.getIdOfCharAtPos(pos).fullId
        let low = idLow[0]
        let high = idHigh[0]
        let base = new Base([], this.sessionId, ++this.clock)

        for (let i = 1; high - low < 2; ++i) {
            base.main.push(low)
            low = (i < idLow.length ? idLow[i] : MIN_BASE_EL)
            high = (i < idHigh.length ? idHigh[i] : MAX_BASE_EL)
        }
        base.main.push(this.getRandomElementBetween(low + 1, high - 1))
        return base
    }

    numberOfInsertableCharaters(idInsert, idNext, strLength){
        if(idInsert.base.isPrefix(idNext))
            return 0;
        else
            return strLength
    }


    getRandomElementBetween(low, high){
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }

}