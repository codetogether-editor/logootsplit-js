class AceTestPerformer {
    constructor(testNum = null) {
        this.LOOGOT_LOGS = false
        this.currentEvent = 0
        this.testNum = testNum

        this.tests = []
        this.containers = [
            { session: new Session(editorA, 1), addBuffer: [], delBuffer: [] },
            { session: new Session(editorB, 2), addBuffer: [], delBuffer: [] },
            { session: new Session(editorC, 3), addBuffer: [], delBuffer: [] },
        ]
        this.loadTests()
    }

    performAllTests() {
        let passedTestsCounter = 0
        for (let i = 0; i < this.tests.length; ++i) {
            this.resetWorkspace()
            if (this.performTest(i))
                passedTestsCounter++
        }

        console.log(passedTestsCounter + " / " + this.tests.length + " PASSED")
    }

    performTest(testNum) {
        let test = this.tests[testNum]
        console.log(">> " + test.name)
        for (let event of test.testEvents)
            this.performTestEvent(event)
        return this.showTestResult(test)
    }

    performTestEvent(testEvent) {
        if (testEvent.type == "testEventInsert")
            this.performInsertEvent(testEvent)
        else
            this.performAddEvent(testEvent)
    }

    performNextEvent() {
        this.testNum = parseInt(document.getElementById("testNum").value)
        if(this.testNum > this.tests.length-1)
            this.testNum = this.tests.length-1

        let events = this.tests[this.testNum].testEvents
        if (this.currentEvent < events.length) {
            this.performTestEvent(events[this.currentEvent])
            this.currentEvent++
        }
    }

    performInsertEvent(testEventInsert) {
        this.addInRealDoc(testEventInsert.editor, testEventInsert.string, testEventInsert.line, testEventInsert.column)

        let container = this.getContainerFromEvent(testEventInsert)
        let docChanger = container.session.docChanger
        let addCmd = docChanger.performInsertAndGetAddCmd(
            testEventInsert.string, testEventInsert.line, testEventInsert.column)

        for (let con of this.containers)
            if (testEventInsert.editor !== con.session.editor)
                con.addBuffer.push({ cmd: addCmd, creatorInsertEvent: testEventInsert })
    }

    getContainerFromEvent(testEvent) {
        for (let con of this.containers)
            if (con.session.editor === testEvent.editor)
                return con
    }

    performAddEvent(testEventAdd) {
        if(this.LOOGOT_LOGS) console.log(this.showDetailedSessionStates())
        
        let container = this.getContainerFromEvent(testEventAdd)
        for (let addPair of container.addBuffer)
            if (addPair.creatorInsertEvent === testEventAdd.testEventInsert) {
                let docChanger = container.session.docChanger
                let addCmd = addPair.cmd
                let editor = container.session.editor
                let changes = docChanger.addAndGetChanges(addCmd.str, addCmd.id)
                this.makeChangesInRealDoc(changes, editor)
                break;
            }
    }

    makeChangesInRealDoc(changes, editor) {
        for (let change of changes) {
            if (change.type == "add")
                this.addInRealDoc(editor, change.string, change.position.line, change.position.column)
        }
    }

    addInRealDoc(editor, str, line, col) {
        let realDoc = editor.getSession().getDocument()
        realDoc.insert({ row: line, column: col }, str)
    }



    resetWorkspace() {
        let editors = [editorA, editorB, editorC]
        for (let i = 0; i < this.containers.length; ++i) {
            this.containers[i].session = new Session(editors[i], i + 1)
            this.containers[i].addBuffer = []
            this.containers[i].delBuffer = []
            editors[i].selectAll()
            editors[i].removeLines()
        }
        this.currentEvent = 0
    }

    showTestResult(test) {
        let ok = true
        let expected = test.expected
        for (let ed of [editorA, editorB, editorC]) {
            let actual = ed.getSession().getDocument().getAllLines().join("\n")
            if (expected.indexOf(actual) < 0) {
                console.log("FAIL expected: ", expected, " actual: ", actual)
                ok = false
            }
        }
        if (ok)
            console.log("OK")
        return ok;
    }

    //LOOGOT DOC TESTING--------------------

    getSessionStr(session) {
        return "S" + session.sessionId + ":";
    }

    showSessionStates() {
        for (let c of this.containers)
            this.showSessionState(c.session)
        console.log("---------------------------------------------------------------")
    }

    showDetailedSessionStates() {
        for (let c of this.containers)
            this.showDetailedSessionState(c.session)
        console.log("---------------------------------------------------------------")
    }

    showSessionState(session) {
        let maxPos = session.doc.chars.length - 1
        console.log(
            "----- ",
            this.getSessionStr(session),
            session.doc.textTest
        )
    }

    showDetailedSessionState(session) {
        console.log(this.getSessionStr(session))
        for (let i = 0; i < session.doc.chars.length; ++i)
            console.log("----- " + this.getCharStateStr(session.doc.chars[i]))
    }

    getCharStateStr(char) {
        return char.value + ":  " + char.id.fullId.toString()
    }

    areAllLoogotDocumentsSame() {
        for (let c1 of this.containers)
            for (let c2 of this.containers)
                if (c1.session.doc.textTest != c2.session.doc.textTest)
                    return false
        return true
    }

    //TEST LOADER
    loadTests() {
        this.tests.push(getAceTest000())
        this.tests.push(getAceTest001())
        this.tests.push(getAceTest002())
        this.tests.push(getAceTest003())
        this.tests.push(getAceTest004())
        this.tests.push(getAceTest005())
        this.tests.push(getAceTest006())
        this.tests.push(getAceTest007())
    }
}