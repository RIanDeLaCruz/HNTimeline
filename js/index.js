var p = new HNRetrieve()
p.getTopNews()
.then(resp => {
  return p.createGenerator(JSON.parse(resp))
})
.then(resp => {
  return Promise.resolve(p.retrieve(10))
})
.then(resp => {
  return p.getMany(resp)
})
.then(resp => {
  let g = new OGraph()
  return g.getMany(resp)
})
.then(resp => {
  console.log(resp)
  const uibuilder = new UIBuilder()
  for (let item of resp) uibuilder.insertCard(item)
})

//var p = new HNRetrieve()
//p.getTopNews()
//.then(resp => {
  //return p.getItem(JSON.parse(resp)[0])
//})
//.then(resp => {
  //console.log(resp)
  //let g = new OGraph()
  //return g.getOGData(resp)
//})
//.then(resp => {
  //const uibuilder = new UIBuilder()
  //uibuilder.insertCard(resp)
//})
//.catch(err => {
  //console.log(err)
//})

//let producer = itemGenerator([0,1,2,3,4,5,6])

//let producer = (function* itemGenerator(arr) {
    //for (let i = 0; i < arr.length; i++) {
      //yield arr[i]
    //}
  //}
//)([0,1,2,3,4,5,6])

//function getTwo() {
  //let values = []
  //for (let i = 0; i < 2; i++) {
    //values.push(producer.next().value)
  //}
  //return values
//}

//console.log(getTwo())
//console.log(getTwo())
