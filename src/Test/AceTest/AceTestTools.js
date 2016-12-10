function stringPermutator(arrayOfStrings){
    let permArray = permutator(arrayOfStrings)
    return permArray.map(function(x){return x.join("")})
}

function permutator(inputArr) {
  var results = [];

  function permute(arr, memo) {
    var cur, memo = memo || [];

    for (var i = 0; i < arr.length; i++) {
      cur = arr.splice(i, 1);
      if (arr.length === 0) {
        results.push(memo.concat(cur));
      }
      permute(arr.slice(), memo.concat(cur));
      arr.splice(i, 0, cur[0]);
    }

    return results;
  }

  return permute(inputArr);
}


// f([editorA, INS1, ..., INSn], [editorB, INS1,...INSm])
// -> [TestEventAdd(editorA, INS1), ... TestEventAdd(editorB, INSm)]
function getListOfAddTestEvents(editorAndInsertEvents){
    list = []
    for(let entry of editorAndInsertEvents){
        for(let i=0; i<entry.inserts.length;++i)
            list.push(new TestEventAdd(entry.editor, entry.inserts[i]))
    }
    return list
}