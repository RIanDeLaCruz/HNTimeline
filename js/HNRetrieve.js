function HNRetrieve() {
  this.top_news_url = "https://hacker-news.firebaseio.com/v0/newstories"
  this.item_url = "https://hacker-news.firebaseio.com/v0/item/"
}

HNRetrieve.prototype.getTopNews = function() {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest()
    xhr.open("GET", `${this.top_news_url}.json`)
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

HNRetrieve.prototype.createGenerator = function(arr) {
  this.itemGenerator = (function* (arr) {
      for (let i = 0; i < arr.length; i++) {
        yield arr[i]
      }
    }
  )((arr))
  return Promise.resolve(this.itemGenerator)
}

HNRetrieve.prototype.retrieve = function(range) {
  let values = []
  while (values.length != range) {
    values.push(this.itemGenerator.next().value)
  }
  return values
}

HNRetrieve.prototype.getMany = function(ids) {
  let promises = []
  for (let id of ids) {
    promises.push(this.getItem(id))
  }
  return Promise.all(promises)
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
