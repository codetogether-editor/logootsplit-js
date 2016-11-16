class Algorithm {
    constructor(doc, session) {
        this.doc = doc
        this.session = session
        this.clock = 0
        this.idsOfCharsToDeleteLater = []
    }

    insert(str, pos) { //TODO optimize, inserting and getting addId could be done in one step
        let char1 = this.doc.getCharAtPos(pos - 1)
        let char2 = this.doc.getCharAtPos(pos)

        //bazy przechowuja max-min offset, jak to zsynchronizowac, 

        if (this.doc.canBeAppended(str, pos, this.session))
            this.doc.insertWithExistingBase(str, pos, char1.id.base, char1.id.offset + 1)
        else if (this.doc.canBePrepended(str, pos, this.session))
            this.doc.insertWithExistingBase(str, pos, char2.id.base, char2.id.offset - str.length)
        else {
            ++this.clock
            let newBase = this.generateBaseBetweenIds(char1.id.fullId, char2.id.fullId)
            this.doc.insertWithNewBase(str, pos, newBase)
        }

        let addId = this.doc.getCharAtPos(pos).id.copy
        let remoteAddCommand = new RemoteCommand();
        remoteAddCommand.makeAddCommand(str, addId, this.session)
        return remoteAddCommand
    }

    remove(fromPos, toPos){
        let delIds = this.doc.getCharIds(fromPos, toPos)
        this.doc.delChars(fromPos, toPos)

        delIds = delIds.map(function(id){return id.copy})
        let remoteDelCommand = new RemoteCommand();
        remoteDelCommand.makeDelCommand(delIds, this.session);
        return remoteDelCommand
    }

    add(str, strId){
        let insertPos = this.doc.getFirstPosWithBiggerIdThan(strId)
        let base = this.doc.getSameBase(strId.base)

        if(base !== null)
            this.doc.insertWithExistingBase(str, insertPos, base, strId.offset)
        else
            this.doc.insertWithNewBase(str, insertPos, strId.base, strId.offset)

        // if del request of str was recieved before add request of this str
        // then ids of this string chars are stored in idsOfCharsToDeleteLater
        // we have to check if now we can delete them

        if(this.idsOfCharsToDeleteLater.length > 0){
            this.idsOfCharsToDeleteLater = this.doc.delCharsWithIdsAndReturnNonExistentIds(
                this.idsOfCharsToDeleteLater, insertPos, insertPos + str.length - 1)
        }
    }

    del(ids){
        let nonExistingIds = this.doc.delCharsWithIdsAndReturnNonExistentIds(ids)
        if(nonExistingIds.length > 0)
            this.idsOfCharsToDeleteLater = this.idsOfCharsToDeleteLater.concat(nonExistingIds) 
    }

    generateBaseBetweenIds(idLow, idHigh) {
        let base = new Base([], this.session, this.clock)
        let low = idLow[0]
        let high = idHigh[0]

        for (let i = 1; high - low < 2; ++i) {
            base.main.push(low)
            low = (i < idLow.length ? idLow[i] : MIN_BASE_EL)
            high = (i < idHigh.length ? idHigh[i] : MAX_BASE_EL)
        }
        base.main.push(this.getRandomElementBetween(low, high))
        return base
    }

    getRandomElementBetween(low, high){
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }
}