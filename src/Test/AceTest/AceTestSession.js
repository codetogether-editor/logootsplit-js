class Session{
    constructor(editor, sessionId, startDoc = null){
        this.editor = editor
        this.sessionId = sessionId
        this.doc = new Document()
        this.alg = new Algorithm(this.doc, this.sessionId)
        this.docChanger = new DocumentChanger(this.alg, this.editor)
    }
}