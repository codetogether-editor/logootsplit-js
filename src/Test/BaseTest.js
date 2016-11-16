QUnit.module( "Base.fullBase" );

QUnit.test( "should return correct full base when main part of base have length 1", function( assert ) {
    let base = new Base([1], 1, 1); 
    assert.deepEqual(base.fullBase, [1, 1, 1], "Passed!" );
});

QUnit.test( "should return correct full base when main part of base have length more than 1", function( assert ) {
    let base = new Base([1, 2, 3, 4], 5, 6); 
    assert.deepEqual(base.fullBase, [1, 2, 3, 4, 5, 6], "Passed!" );
});

QUnit.module( "Base.copy" );

QUnit.test( "should return copy of base 1|1|1", function( assert ) {
    let base = new Base([1], 1, 1); 
    assert.deepEqual(base.copy.fullBase, base.fullBase);
});

QUnit.test( "should return copy of base 1234|5|6", function( assert ) {
    let base = new Base([1, 2, 3, 4], 5, 6); 
    assert.deepEqual(base.copy.fullBase, base.fullBase);
});

QUnit.module( "Base.isEqual" );

QUnit.test( "bases with different main part should not be equal", function( assert ) {
    let base1 = new Base([1], 2, 3), base2 = new Base([2], 2, 3);
    assert.ok(false == base1.isEqual(base2));
    
    base1 = new Base([1, 2], 2, 3), base2 = new Base([1], 2, 3);
    assert.ok(false == base1.isEqual(base2));
});

QUnit.test( "bases with different session part should not be equal", function( assert ) {
    let base1 = new Base([1], 1, 1), base2 = new Base([1], 2, 1);
    assert.ok(false == base1.isEqual(base2));
});

QUnit.test( "bases with different clock part should not be equal", function( assert ) {
    let base1 = new Base([1], 1, 1), base2 = new Base([1], 1, 2);
    assert.ok(false == base1.isEqual(base2));
});

QUnit.test( "bases with same main, session and clock should be equal", function( assert ) {
    let base1 = new Base([1, 2, 3], 4, 5), base2 = new Base([1, 2, 3], 4, 5);
    assert.ok(true == base1.isEqual(base2));
});



/*


    describe('isEqual', function() {
        let base1 = new Base([1,2,3], 1, 1)
            base2 = new Base([1], 2, 3) 
        it('should not be equal when different main, session and clock', function() {
            assert.Equal(false, base1.isEqual(base2))
        })
        
        let base2 = new Base([1,2,3,4,5], 6, 7) 
        it('should return correct copy of base 1 2 3 4 5 6 7', function() {
            assert.deepEqual(base2.copy.fullBase, [1, 2, 3, 4, 5, 6, 7])
        })
    })


})
*/