import './style.css'
import OpenSeadragon from 'openseadragon'
import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'


console.log('Using OpenseaDragon version', OpenSeadragon.version.versionStr)

const tileSource = {
  type: 'image',
  url: './View.png',
}

const viewer = OpenSeadragon({
  id: 'contentDiv',
  toolbar: 'toolbar',
  prefixUrl:
    'https://cdn.jsdelivr.net/npm/openseadragon/build/openseadragon/images/',
  tileSources: {
    type: 'image',
    url: '/View.png',
  },
  minZoomLevel: 0.5,
})

const viewport = viewer.viewport


// ---------------------------
//      Dealing with plugins
// ---------------------------

const onViewerClick = (event: any) => {
  console.log(viewport.windowToViewportCoordinates(event.position))
  event.preventDefaultAction = true

  // if toc is open : close it 
  console.log('closing toc')
  const aside = document.querySelector('#maside')
  aside?.classList.add('hide-toc')
}
const onViewerDblClick = (event: any) => {
  viewport.zoomTo(
    viewport.getZoom() + 1,
    viewport.windowToViewportCoordinates(event.position),
    false
  );
}

const hEl = viewer.HTMLelements()

new OpenSeadragonViewerInputHook({
  viewer: viewer,
  hooks: [
    { tracker: 'viewer', handler: 'clickHandler', hookHandler: onViewerClick },
    { tracker: 'viewer', handler: 'dblClickHandler', hookHandler: onViewerDblClick },
  ]
});

const itemOnClick = (e) => {
  console.log('clicked', e)
  console.log('clicked', e.target.id)

  const position = viewport.windowToViewportCoordinates(
    new OpenSeadragon.Point(e.clientX, e.clientY)
  )

  console.log(position)

  viewer.viewport.zoomTo(
    viewer.viewport.getZoom() + 3,
    position,
    false
  );
}

const itemOnHover = (e) => {
  const itemsBg = document.getElementById('items-bg')
  itemsBg?.classList.add('highlight')
  document.body.classList.add('highlight')

  files.forEach((f) => {
    if (f === e.target.id) return
    const item = document.getElementById(f)
    item.style.fillOpacity = '30%'
  })
}
const itemOnLeave = (e) => {
  const itemsBg = document.getElementById('items-bg')
  itemsBg?.classList.remove('highlight')
  document.body.classList.remove('highlight')

  files.forEach((f) => {
    const item = document.getElementById(f)
    item.style.fillOpacity = '100%'
  })
}

const goTo = (e) => {
  // get x, y position of cursor on viewport
}


const files = ['test.svg']
const parser = new DOMParser()
const ns = 'http://www.w3.org/2000/svg'

const itemsContainer = document.createElementNS(ns, 'svg')
itemsContainer.classList.add('osd-items-container')
itemsContainer.setAttribute('id', 'items-container')
itemsContainer.setAttribute('viewBox', '0 0 9645 7181')


const itemsBg = document.createElementNS(ns, 'rect')
itemsBg.classList.add('items-bg')
itemsBg.id = 'items-bg'
itemsBg.style.width = '200vw'
itemsBg.style.height = '200vh'
itemsContainer.appendChild(itemsBg)


files.forEach((f, i) => {
  fetch('/data/svg/' + f)
    .then((res) => res.text())
    .then((data) => {
      const svg = parser.parseFromString(data, 'image/svg+xml')
      const path = Array.from(svg.getElementsByTagName('path'))[0]

      path.addEventListener('click', itemOnClick)
      path.addEventListener('mouseover', itemOnHover)
      path.addEventListener('mouseleave', itemOnLeave)

      itemsContainer.appendChild(path)

    })
})


hEl.addElement({
  id: 'hEl',
  element: itemsContainer,
  x: 3,
  y: -3,
  width: 9645,
  height: 7181,
})

setTimeout(() => {
  const container = document.getElementById('maside')
  container.classList.add('show')
}, 3000)


document.getElementById('toc-btn')?.addEventListener('click', (e) => {
  console.log(e)
})


console.log(window)
console.log('done setting up the app')