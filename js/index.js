function UIBuilder() {
  this.getCardValues = function(graphData) {
    switch(graphData.hn_data.type) {
      case 'story':
        return {
          "title" : graphData.graph_data.openGraph.title ||
            graphData.graph_data.hybridGraph.title,
          "description" : graphData.graph_data.openGraph.description ||
            graphData.graph_data.hybridGraph.description,
          "url" : graphData.graph_data.openGraph.url ||
            graphData.graph_data.hybridGraph.url,
          "image" : graphData.graph_data.openGraph.image.url ||
            graphData.graph_data.hybridGraph.image
        }
    }
  }
}

UIBuilder.prototype.insertCard = function(graphData) {
  console.log(graphData)
  const {title, description, url, image} = this.getCardValues(graphData)

  let wrapper = document.createElement('div')
  let img = document.createElement('img')
  let link = document.createElement('a')
  let heading = document.createElement('h2')
  let desc = document.createElement('p')

  img.setAttribute('src', image)
  heading.innerHTML = title
  desc.innerHTML = description
  link.appendChild(heading)
  link.appendChild(img)
  link.appendChild(desc)
  link.setAttribute('href',url)

  wrapper.appendChild(link)
  document.querySelector('main').appendChild(wrapper)
}

function OGraph() {
  this.url = "http://opengraph.io/api/1.1/site/"
  this.apiKey = '594cac869df1ad4153efe67a'
}

OGraph.prototype.getOGData = function(source_data) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    let source = JSON.parse(source_data)
    xhr.open("GET", `${this.url}${encodeURIComponent(source.url)}?app_id=${this.apiKey}`)
    xhr.addEventListener('load', function() {
      if (xhr.status == 200) {
        resolve({
          "graph_data": JSON.parse(xhr.responseText),
          "hn_data": source
        })
      }
      if (!xhr.status == 200) reject(xhr.statusText)
    })
    xhr.addEventListener('error', function() {
      reject(Error("Network Error"))
    })
    xhr.send()
  })
}

function HNRetrieve() {
  this.top_news_url = "https://hacker-news.firebaseio.com/v0/newstories"
  this.item_url = "https://hacker-news.firebaseio.com/v0/item/"
  this.top_items = []
  this.itemGenerator = (function* () {
    for (let i = 0; i < top_items.length; i++) {
      yield top_items[i]
    }
  })()
}

HNRetrieve.prototype.getTopNews = function() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", `${this.top_news_url}.json`)
    xhr.addEventListener('load', function() {
      if (xhr.status == 200) {
        resolve(xhr.responseText)
      }
      if (!xhr.status == 200) reject(xhr.statusText)
    })
    xhr.addEventListener('error', function() {
      reject(Error("Network Error"))
    })
    xhr.send()
  })
}

HNRetrieve.prototype.retrieve = function(range) {
  let values = []
  while (values.length != range) {
    values.push(this.itemGenerator.next().value)
  }
  return values
}

HNRetrieve.prototype.getItem = function(item_id) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", `${this.item_url}${item_id}.json`)
    xhr.addEventListener('load', function() {
      if (xhr.status == 200) resolve(xhr.responseText)
      if (!xhr.status == 200) reject(xhr.statusText)
    })
    xhr.addEventListener('error', function() {
      reject(Error("Network Error"))
    })
    xhr.send()
  })
}

var p = new HNRetrieve()
p.getTopNews()
.then(resp => {
  console.log(JSON.parse(resp))
  return p.getItem(JSON.parse(resp)[0])
})
.then(resp => {
  console.log(resp)
  let g = new OGraph()
  return g.getOGData(resp)
})
.then(resp => {
  const uibuilder = new UIBuilder()
  uibuilder.insertCard(resp)
})
.catch(err => {
  console.log(err)
})

let producer = itemGenerator([0,1,2,3,4,5,6])

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
