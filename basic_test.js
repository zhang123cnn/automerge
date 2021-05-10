const Automerge = require('./src/automerge')


let doc1 = Automerge.init()
let actor1 = Automerge.getActorId(doc1)
doc1 = Automerge.change(doc1, "init value", doc => {
  doc.set(actor1, [])
})
console.log(JSON.stringify(doc1))

let doc2 = Automerge.init()
let actor2 = Automerge.getActorId(doc2)

doc2 = Automerge.change(doc2, "init value", doc => {
  doc.set(actor1, [])
})
console.log(doc2)

let changes1 = Automerge.getAllChanges(doc1);
let changes2 = Automerge.getAllChanges(doc2);

console.log(changes1)

var jsonStr = JSON.stringify(changes1, function (key, value) {
  if (value instanceof Uint8Array) {
    var replacement = {
      data: Array.apply([], value),
    }
    return replacement;
  }
  return value;
});

console.log(jsonStr)

var decodedJson = JSON.parse(jsonStr, function (key, value) {
  // the reviver function looks for the typed array flag
  if (typeof value === "object" && "data" in value) {
    return new Uint8Array(value.data);
  }

  // if flag not found no conversion is done
  return value;
});

console.log(decodedJson)

doc2 = Automerge.applyChanges(doc2, changes1)[0]
doc1 = Automerge.applyChanges(doc1, changes2)[0]
console.log(doc1)
console.log(doc2)

doc1 = Automerge.change(doc1, 'add member', doc => {
  doc.get(actor1).push("1")
})

console.log(doc1)

doc2 = Automerge.change(doc2, 'add itself', doc => {
  doc.get(actor1).push("2")
})

console.log(doc2)

let changes = Automerge.getAllChanges(doc1);
doc2 = Automerge.applyChanges(doc2, changes)[0]

console.log(doc2);
console.log(doc1);

let changes43 = Automerge.getAllChanges(doc2);
doc1 = Automerge.applyChanges(doc1, changes43)[0]

console.log(doc2);
console.log(doc1);

console.log(Automerge.getChanges(doc1, doc1));