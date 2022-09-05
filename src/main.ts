import './style.css'
import OpenSeadragon from 'openseadragon'
import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'


console.log('Using OpenseaDragon version', OpenSeadragon.version.versionStr)

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
//    Dealing with plugins
// ---------------------------

const onViewerClick = (event: any) => {
  // console.log(viewport.windowToViewportCoordinates(event.position))
  event.preventDefaultAction = true

  // if toc is open : close it 
  // console.log('closing toc')
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

const itemOnClick = (e: any) => {
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
  itemsBg?.setAttribute('mask', 'url(#mask)')
  itemsBg?.setAttribute('fill-opacity', '50%')
  itemsBg?.setAttribute('fill', 'black')

  // document.body.classList.add('highlight')
}

const itemOnLeave = (e) => {
  const itemsBg = document.getElementById('items-bg')
  itemsBg?.classList.remove('highlight')
  itemsBg?.removeAttribute('mask')
  itemsBg?.setAttribute('fill-opacity', '0%')

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

const mask = document.createElementNS(ns, 'mask')
mask.id = 'mask'
itemsContainer.appendChild(mask)

const maskBg = document.createElementNS(ns, 'rect')
maskBg.id = 'mask-bg'
maskBg.style.width = '10000vw'
maskBg.style.height = '10000vh'
maskBg.style.x = '-1000vh'
maskBg.style.y = '-1000vh'
maskBg.setAttribute('fill', 'white')

mask.appendChild(maskBg)

const itemsBg = maskBg.cloneNode(true)
itemsBg.id = 'items-bg'
itemsBg.setAttribute('fill-opacity', '0%')
itemsContainer.appendChild(itemsBg)


files.forEach((f) => {
  fetch('/data/svg/' + f)
    .then((res) => res.text())
    .then((data) => {
      const svg = parser.parseFromString(data, 'image/svg+xml')
      const path = Array.from(svg.getElementsByTagName('path'))[0]
      path.setAttribute('fill', 'black')
      mask.appendChild(path)

      let pathClone = path.cloneNode(true)
      pathClone.setAttribute('fill', 'none')

      pathClone.addEventListener('onclick', itemOnClick)
      pathClone.addEventListener('mouseover', itemOnHover)
      pathClone.addEventListener('mouseleave', itemOnLeave)

      itemsContainer.appendChild(pathClone)
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