

class TestEventInsert{
    constructor(editor, string, line, column, id){
        this.type = "testEventInsert"
        this.id = id
        this.editor = editor
        this.string = string
        this.line = line
        this.column = column
    }

    get editorId(){
        if(this.editor == editor1)
            return "A"
        if(this.editor == editor2)
            return "B"
        return "C"
    }

    toStr(){
        return "EDITOR " + this.editorId
        + " INSERT " + this.string
        + " AT POS(" + this.line + ", " + this.col + ")"  
    }
}

class TestEventAdd{
    constructor(editor, testEventInsert){
        this.type = "testEventAdd"
        this.editor = editor
        this.testEventInsert = testEventInsert
    }

    get editorId(){
        if(this.editor == editor1)
            return "A"
        if(this.editor == editor2)
            return "B"
        return "C"
    }

    toStr(){
        return "EDITOR " + this.editorId
        + " ADD " + "**"
    }
}