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
  const bg = document.getElementById('items-container-bg')
  bg.style.fillOpacity = '50%'

  files.forEach((f) => {
    if (f === e.target.id) return
    const item = document.getElementById(f)
    item.style.fillOpacity = '30%'
  })
}
const itemOnLeave = (e) => {
  const bg = document.getElementById('items-container-bg')
  bg.style.fillOpacity = '0'

  files.forEach((f) => {
    const item = document.getElementById(f)
    item.style.fillOpacity = '100%'
  })
}

const goTo = (e) => {
  // get x, y position of cursor on viewport
}


const files = ['charity_proto.svg', 'faith_proto.svg', 'hope_proto.svg']
const parser = new DOMParser()
const ns = 'http://www.w3.org/2000/svg'

const itemsContainer = document.createElementNS(ns, 'svg')
itemsContainer.classList.add('osd-items-container')
itemsContainer.setAttribute('id', 'items-container')
itemsContainer.setAttribute('viewBox', '0 0 579 431')

const backRect = itemsContainer.appendChild(
  document.createElementNS(ns, 'rect')
)
backRect.setAttribute('id', 'items-container-bg')
backRect.classList.add('osd-canvas-bg')
backRect.style.x = '-1000px'
backRect.style.y = '-1000px'

const defs = itemsContainer.appendChild(document.createElementNS(ns, 'defs'))

files.forEach((f, i) => {
  fetch('/data/svg/' + f)
    .then((res) => res.text())
    .then((data) => {
      console.log(data)
      const svg = parser.parseFromString(data, 'image/svg+xml')
      console.log(svg)
      const pattern = svg.getElementById('pattern0')
      const image = Array.from(svg.getElementsByTagName('image'))[0]
      const rect = Array.from(svg.getElementsByTagName('rect'))[0]

      let id = 'pattern' + i
      pattern.setAttribute('id', id)
      rect.setAttribute('fill', `url(#${id})`)

      rect.setAttribute('id', f)
      rect.addEventListener('click', itemOnClick)
      rect.addEventListener('mouseover', itemOnHover)
      rect.addEventListener('mouseleave', itemOnLeave)

      itemsContainer.insertBefore(rect, defs)
      defs.appendChild(pattern)
      defs.appendChild(image)
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

document.getElementById('header-btn-close')?.addEventListener('click', (e) => {
  const aside = document.querySelector('#maside')
  aside?.classList.remove('show')
  aside?.classList.add('hide-aside')
  aside?.classList.add('hide-toc')
})


console.log(window)
console.log('done setting up the app')