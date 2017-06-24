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

OGraph.prototype.getMany = function(data) {
  let promises = []
  for (let datum of data) promises.push(this.getOGData(datum))
  return Promise.all(promises)
}
