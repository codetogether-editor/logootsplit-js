function getAceTest000(id=0){
    let INS1 = new TestEventInsert(editorA, "one", 0, 0, ++id),
        add1 = new TestEventAdd(editorB, INS1),
        add2 = new TestEventAdd(editorC, INS1)

    let INS2 = new TestEventInsert(editorB, "two", 0, 0, ++id),
        add3 = new TestEventAdd(editorA, INS2),
        add4 = new TestEventAdd(editorC, INS2)

    let INS3 = new TestEventInsert(editorA, "three", 0, 0, ++id),
        add5 = new TestEventAdd(editorB, INS3),
        add6 = new TestEventAdd(editorC, INS3)

    return new AceTest(
        name = "000: A robi insert potem sync, powtarzamy dla B i C",
        testEvents = [INS1, add1, add2, INS2, add3, add4, INS3, add5, add6],
        expected = ["threetwoone"]
    )
}

function getAceTest001(id=0){
    let INS1 = new TestEventInsert(editorA, "one", 0, 0, ++id),
        INS2 = new TestEventInsert(editorB, "two", 0, 0, ++id),
        INS3 = new TestEventInsert(editorC, "three", 0, 0, ++id)

    let adds = getListOfAddTestEvents([
        {editor: editorA, inserts: [INS2, INS3]},
        {editor: editorB, inserts: [INS1, INS3]},
        {editor: editorC, inserts: [INS1, INS2]}
    ])

    return new AceTest(
        name = "001: każdy edytor robi jeden insert, potem sync",
        testEvents = [INS1, INS2, INS3].concat(adds),
        expected = stringPermutator(["one", "two", "three"])
    )
}

function getAceTest002(id=0){
    let INS1 = new TestEventInsert(editorA, "one", 0, 0, ++id),
        INS2 = new TestEventInsert(editorA, "two", 0, 3, ++id),
        INS3 = new TestEventInsert(editorA, "middle", 0, 3, ++id)

    let adds = getListOfAddTestEvents([
        {editor: editorB, inserts: [INS1, INS2, INS3]},
        {editor: editorC, inserts: [INS1, INS2, INS3]},
    ])

    return new AceTest(
        name = "002: edytor A robi trzy inserty, potem sync",
        testEvents = [INS1, INS2, INS3].concat(adds),
        expected = ["onemiddletwo"]
    )
}

function getAceTest003(id=0){

    let INS1 = new TestEventInsert(editorA, "outer", 0, 0, ++id),
        INS2 = new TestEventInsert(editorA, "INNER", 0, 2, ++id)

    let adds = getListOfAddTestEvents([
        {editor: editorB, inserts: [INS2, INS1]},
        {editor: editorC, inserts: [INS2, INS1]},
    ])

    return new AceTest(
        "003: edytor A robi insert, potem kolejny wewnątrz, B i C robią sync w odwrotnej kolejności ",
        testEvents = [INS1, INS2].concat(adds),
        expected = ["ouINNERter"]
    )
}

function getAceTest004(id=0){

    let INS1 = new TestEventInsert(editorA, "zzz", 0, 0, ++id), //zzz
        INS2 = new TestEventInsert(editorA, "xx", 0, 1, ++id),  //zxxzz
        INS3 = new TestEventInsert(editorA, "yy", 0, 4, ++id),  //zxxzyyz
        INS4 = new TestEventInsert(editorA, "w", 0, 2, ++id),   //zxwxzyyz
        INS5 = new TestEventInsert(editorA, "v", 0, 6, ++id)    //zxwxzyvyz

    let adds = getListOfAddTestEvents([
        {editor: editorB, inserts: [INS5, INS4, INS3, INS2, INS1]},
        {editor: editorC, inserts: [INS3, INS1, INS5, INS2, INS4]}
    ])


    let expected = ["zxwxzyvyz"]

    return new AceTest(
        "004: edytor A robi kilkukrotny insert wewnątrz, B i C robią sync w innych kolejnościach",
        [INS1, INS2, INS3, INS4, INS5].concat(adds),
        expected
    )
}

function getAceTest005(id=0){
    let INS1 = new TestEventInsert(editorA, "ac", 0, 0, ++id),
        INS2 = new TestEventInsert(editorA, "B", 0, 1, ++id),
        INS3 = new TestEventInsert(editorB, "dehi", 0, 0, ++id),
        INS4 = new TestEventInsert(editorB, "FG", 0, 2, ++id),
        INS5 = new TestEventInsert(editorC, "jklpqr", 0, 0, ++id),
        INS6 = new TestEventInsert(editorC, "MNO", 0, 3, ++id)

    let adds = getListOfAddTestEvents([
        {editor: editorA, inserts: [INS5, INS3, INS4, INS6]},
        {editor: editorB, inserts: [INS6, INS2, INS1, INS5]},
        {editor: editorC, inserts: [INS1, INS4, INS3, INS2]}
    ])

    return new AceTest(
        name = "005: każdy edytor dodaje słowo i słowo wewnątrz, potem sync w różnych kolejnościach",
        testEvents = [INS1, INS2, INS3, INS4, INS5, INS6].concat(adds),
        expected = stringPermutator(["aBc", "deFGhi", "jklMNOpqr"])
    )
}