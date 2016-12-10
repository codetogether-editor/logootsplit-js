import Base from './LogootDoc/Base';
import CharId from './LogootDoc/CharId';
import Char from './LogootDoc/Char';
import Document from './LogootDoc/Document';
import RemoteCommand from './RemoteCommand';
import Algorithm from './Algorithm';

export default class DocumentChanger{
    constructor(algorithm, editor){
        this.algorithm = algorithm
        this.editor = editor
        this.doc = algorithm.doc
        this.sessionId = algorithm.sessionId
        this.lines = this.doc.getAsLines()
    }

    performInsertAndGetAddCmd(str, line, column){
        let pos = this.convertToAbsolutePos(line, column)
        let addCmd = this.algorithm.insert(str, pos)
        return addCmd
    }

    addAndGetChanges(str, strId){
        let changes = this.algorithm.add(str, strId)
        //for(let c of changes)
        //    console.log(c.type, c.string, c.position.line, c.position.column)
        return changes
    }

    convertToAbsolutePos(line, column){
        let pos = 0
        let realDoc = this.editor.getSession().getDocument()

        if(line > 0)
            for(let i=0; i<line; ++i)
                pos += realDoc.getLine(i).length

        return pos + line + column + 1
    }
    
}