function getAceTest006(id=0){
    let INS1 = new TestEventInsert(editorA, "\n\n", 0, 0, ++id),
        INS2 = new TestEventInsert(editorA, "trzecia linia i dwie spacje  ", 2, 0, ++id)
        INS3 = new TestEventInsert(editorA, "\n", 2, 29, ++id)

    let adds = getListOfAddTestEvents([
        {editor: editorB, inserts: [INS1, INS2, INS3]},
        {editor: editorC, inserts: [INS2, INS1, INS3]}
    ])

    return new AceTest(
        name = "006: A(dwie nowe linie, ciag znakow ze spacjami na końcu, nowa linia), potem sync",
        testEvents = [INS1, INS2, INS3].concat(adds),
        expected = ["\n\ntrzecia linia i dwie spacje  \n"]
    )
}

function getAceTest007(id=0){
    let INS1 = new TestEventInsert(editorA, "function func(){\n}", 0, 0, ++id)

    let adds1 = getListOfAddTestEvents([
        {editor: editorB, inserts: [INS1]},
        {editor: editorC, inserts: [INS1]}])

    let INS2 =  new TestEventInsert(editorB, "\n\tvar b = Math.sqrt(2)", 0, 16, ++id),
        INS3 =  new TestEventInsert(editorC, "\n\tvar c = 3.14", 0, 16, ++id)

    let adds2 = getListOfAddTestEvents([
        {editor: editorA, inserts: [INS2, INS3]},
        {editor: editorB, inserts: [INS3]},
        {editor: editorC, inserts: [INS2]}
    ])

    return new AceTest(
        name = "007: A robi ciało funkcji, sync, B i C deklarują tam zmienne",
        testEvents = [INS1].concat(adds1).concat([INS2, INS3]).concat(adds2),
        expected = ["function func(){\n\tvar c = 3.14\n\tvar b = Math.sqrt(2)\n}",
                    "function func(){\n\tvar b = Math.sqrt(2)\n\tvar c = 3.14\n}"]
    )
}