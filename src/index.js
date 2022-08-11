var tileSource = {
  type: 'image',
  url: '../public/View.png',
}

var viewer = OpenSeadragon({
  id: 'contentDiv',
  prefixUrl:
    'https://cdn.jsdelivr.net/npm/openseadragon/build/openseadragon/images/',
  tileSources: [
    {
      tileSource: tileSource,
    },
  ],
})

var hEl = viewer.HTMLelements()

fetch('../public/faith.svg')
  .then((res) => res.text())
  .then((data) => {
    // console.log(data)
    const parser = new DOMParser()
    const svg = parser.parseFromString(data, 'image/svg+xml').activeElement

    svg.addEventListener('click', (e) => {
      console.log('clicked!')
    })

    hEl.addElement({
      id: 'uuid123',
      element: svg,
      x: 0,
      y: 0,
      width: 9645,
      height: 7181,
    })
  })
