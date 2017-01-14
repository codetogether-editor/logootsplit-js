import Base from './LogootDoc/Base';
import CharId from './LogootDoc/CharId';
import Char from './LogootDoc/Char';
import Document from './LogootDoc/Document';
import RemoteCommand from './RemoteCommand';

export default class Algorithm {
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

    remove(fromPos, toPos){
        let delIds = this.doc.getCharIds(fromPos, toPos)
        let delIdsCopy = delIds.map(function(id){return id.copy})
        this.doc.delChars(fromPos, toPos)
        return this.createRemoteDelCommand(delIdsCopy)
    }

    add(str, strId){
        let chars = this.createCharsFromStr(str, strId)
        for(let i = chars.length-1; i>=0; --i){
            for(let j=this.idsOfCharsToDeleteLater.length-1; j>=0; --j){
                if(chars[i].id.isEqual(this.idsOfCharsToDeleteLater[j])){
                    chars.splice(i,1)
                    this.idsOfCharsToDeleteLater.splice(j,1)
                    break;
                }
            }
        }
        let changes = this.doc.addCharsAndGetChanges(chars)
        return changes;
    }

    del(ids){
        let pos0 = 1
        let delPos = []
        
        for(let id of ids){
            let pos = this.doc.getPosOfCharWithIdStartingFrom(id, pos0)
            if(pos != null){
                delPos.push(pos)
                pos0 = pos
            }
            else
                this.idsOfCharsToDeleteLater.push(id)
        }

        let changes = []
        let prevUsedPos = null
        let delPosRange = {start: null, end:null}
        for(let i=delPos.length-1; i>=0; --i){
            let pos = delPos[i]
            if(prevUsedPos === pos + 1 || delPosRange.start == null)
                delPosRange = this.extendRange(delPosRange, pos)
            else{
                let change = {type: "del", from: delPosRange.start - 1, to: delPosRange.end - 1}
                changes.push(change)
                delPosRange = {start: pos, end: pos}
            }
            if(i==0 && delPosRange.start != null){
                let change = {type: "del", from: delPosRange.start-1, to: delPosRange.end-1}
                changes.push(change)
            }
            prevUsedPos = pos;
        }

        for(let i = delPos.length - 1; i >= 0; --i)
            this.doc.delChar(delPos[i])     
        
        return changes
    }

    extendRange(range, pos){
        return range.start == null ? {start: pos, end: pos} : {start: pos, end: range.end} 
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
            && this.isNotGoingToOverlapAfterApp(str, pos)
    }

    isNotGoingToOverlapAfterApp(str, pos){
        let prevCharId = this.doc.getIdOfCharAtPos(pos-1)
        let nextCharId = this.doc.getIdOfCharAtPos(pos)
        let lastIdOfAppStr = prevCharId.copy
        lastIdOfAppStr.offset += str.length
        return !lastIdOfAppStr.isBigger(nextCharId)
    }

    canInsertPrepended(str, pos){
        let charWePrependTo = this.doc.getCharAtPos(pos)
        return this.isSameSession(charWePrependTo)
            && this.isLowestOffsetInBase(charWePrependTo)
            && this.isSpaceInBaseBefore(charWePrependTo, str.length)
            && this.isNotGoingToOverlapAfterPrep(str, pos)
    }
    
    isNotGoingToOverlapAfterPrep(str, pos){
        let prevCharId = this.doc.getIdOfCharAtPos(pos-1)
        let nextCharId = this.doc.getIdOfCharAtPos(pos)
        let firstIdOfPrepStr = nextCharId.copy
        firstIdOfPrepStr.offset -= str.length
        return !prevCharId.isBigger(firstIdOfPrepStr)
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

    getRandomElementBetween(low, high){
        return Math.floor(Math.random() * (high - low + 1)) + low;
    }

}