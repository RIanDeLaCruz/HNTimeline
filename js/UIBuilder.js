function UIBuilder() {
  this.getCardValues = function(graphData) {
    if (Object.keys(graphData.graph_data).indexOf('error') < 0) {
      return {
        "title" : graphData.graph_data.openGraph.title ||
          graphData.graph_data.hybridGraph.title,
        "description" : graphData.graph_data.openGraph.description ||
          graphData.graph_data.hybridGraph.description,
        "url" : graphData.graph_data.openGraph.url ||
          graphData.graph_data.hybridGraph.url,
        "image" : graphData.graph_data.hybridGraph.image ||
          graphData.graph_data.openGraph.image.url
      }
    } else {
      return {
        "title": graphData.hn_data.title,
        "description":"",
        "url": graphData.hn_data.url,
        "image":""
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
