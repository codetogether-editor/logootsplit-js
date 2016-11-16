QUnit.module( "CharId.fullBase" );

QUnit.test( "should return correct full id", function( assert ) {
    let charId = new CharId(new Base([1], 2, 3), 4)
    assert.deepEqual(charId.fullId, [1, 2, 3, 4]);

    charId = new CharId(new Base([1, 2, 3, 4], 5, 6), 7)
    assert.deepEqual(charId.fullId, [1, 2, 3, 4, 5, 6, 7]);
});
