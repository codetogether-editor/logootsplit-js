class addCommandData{
    constructor(str, id, session){
        this.str = str
        this.id = id
        this.session = session
    }
}

class delCommandData{
    constructor(ids, session){
        this.ids = ids
        this.session = session
    }
}

class Algorithm {
    constructor(doc, session) {
        this.doc = doc
        this.session = session
        this.clock = 0
    }

    insert(str, pos) { //TODO optimize, inserting and getting addId could be done in one step
        if (this.doc.canBeAppended(str, pos, this.session))
            this.doc.insertAppended(str, pos)
        else if (this.doc.canBePrepended(str, pos, this.session))
            this.doc.insertPrepended(str, pos)
        else {
            let char1 = this.doc.getCharAtPos(pos - 1)
            let char2 = this.doc.getCharAtPos(pos)
            ++this.clock
            let newBase = this.generateBaseBetweenIds(char1.id.fullId, char2.id.fullId)
            this.doc.insertNew(str, pos, newBase)
        }

        let addId = this.doc.getCharAtPos(pos).id.copy
        return new addCommandData(str, addId, this.session)
    }

    remove(fromPos, toPos){
        let delIds = this.doc.getCharIds(fromPos, toPos)
        this.doc.delChars(fromPos, toPos)

        delIds = delIds.map(function(id){return id.copy})
        return new delCommandData(delIds, this.session)
    }

    add(str, strId){
        let insertPos = this.doc.getFirstPosWithBiggerIdThan(strId)
        if(this.doc.canBeAppended(str, insertPos, strId.base.session))
            this.doc.insertAppended(str, insertPos)
        else if(this.doc.canBePrepended(str, insertPos, strId.base.session))
            this.doc.insertPrepended(str, insertPos)
        else
            this.doc.insertNew(str, insertPos, strId.base)
    }

    del(ids){
        this.doc.delCharsWithIds(ids)
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