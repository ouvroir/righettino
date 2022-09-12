import './style.css'
import OpenSeadragon from 'openseadragon'
import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'
import OpenSeadragonImagingHelper from '@openseadragon-imaging/openseadragon-imaginghelper';
import { updateMaskItems, highlightItems, unHighlightItems } from './helpers'


// ---------------------------
//    Openseadragon stuff
// ---------------------------

globalThis.viewer = OpenSeadragon({
   id: 'contentDiv',
   toolbar: 'invisible',
   prefixUrl:
      'https://cdn.jsdelivr.net/npm/openseadragon/build/openseadragon/images/',
   tileSources: {
      type: 'image',
      url: '/View.png',
   },
   minZoomLevel: 0.5,
})

globalThis.viewport = viewer.viewport

const onViewerClick = (e: any) => {
   // console.log(viewport.windowToViewportCoordinates(e.position))
   e.preventDefaultAction = true

   // if toc is open : close it 
   // console.log('closing toc')
   const aside = document.querySelector('#maside')
   aside?.classList.add('hide-toc')
   aside?.classList.add('hide-aside')
   aside?.classList.remove('show-toc-only')
}

const onViewerDblClick = (e: any) => {
   viewport.zoomTo(
      viewport.getZoom() + 1,
      viewport.windowToViewportCoordinates(e.position),
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

let pos = {
   "width": 0.38689692315201507,
   "height": 0.391419924806446,
   "origin": {
      "x": 0.22505649748813322,
      "y": -0.03935929596317832
   },
   "center": {
      "x": 0.41850495906414076,
      "y": 0.1563506664400447
   },
   "zoomfactor": 0.2899544329634835
}

globalThis.imagingHelper = new OpenSeadragonImagingHelper({ viewer: viewer });
imagingHelper.addHandler('image-view-changed', (e) => {
   // e.viewportWidth == width of viewer viewport in logical coordinates relative to image native size
   // e.viewportHeight == height of viewer viewport in logical coordinates relative to image native size
   // e.viewportOrigin == OpenSeadragon.Point, top-left of the viewer viewport in logical coordinates relative to image
   // e.viewportCenter == OpenSeadragon.Point, center of the viewer viewport in logical coordinates relative to image
   // e.zoomFactor == current zoom factor

   // console.log({
   //    width: e.viewportWidth,
   //    height: e.viewportHeight,
   //    origin: e.viewportOrigin,
   //    center: e.viewportCenter,
   //    zoomfactor: e.zoomFactor
   // })
});
// ---------------------------
//    Dealing with items
// ---------------------------

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
   updateMaskItems([e.currentTarget.id])
   highlightItems()
}


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


globalThis.ITEMS = {}
globalThis.SECTIONS = {}

const initApp = (): void => {
   // TODO : files must be read from documents?
   const parser = new DOMParser()
   const files = ['faith.svg', 'blazon.svg', 'charity.svg', 'hope.svg']

   // Create dict items
   files.forEach(f => {
      fetch('/data/svg/' + f)
         .then((res) => res.text())
         .then((data) => {
            console.log(f)
            const svg = parser.parseFromString(data, 'image/svg+xml')
            const path = Array.from(svg.getElementsByTagName('path'))[0]

            path.classList.add('mask-item')
            path.setAttribute('fill', 'none')
            path.addEventListener('onclick', itemOnClick)
            path.addEventListener('mouseover', itemOnHover)
            path.addEventListener('mouseleave', unHighlightItems)
            itemsContainer.appendChild(path)

            ITEMS[f] = path
         })
   })
   // Create section dict (section_name -> files/zoom)
   fetch('/data/xml/chapter1_2.xml')
      .then(res => res.text())
      .then(data => {
         const doc = parser.parseFromString(data, 'application/xml')
         doc.querySelectorAll('*[files], *[zoom]').forEach(e => {
            SECTIONS[e.id] = {
               files: e.getAttribute('files')?.split(','),
               zoom: e.getAttribute('zoom')?.split(',').map(s => parseFloat(s))
            }
         })
      })

   console.log('Sections', SECTIONS)
}

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

initApp()
console.log('Done setting up the app')
console.log('Using OpenseaDragon version', OpenSeadragon.version.versionStr)
document.querySelector('#maside')?.classList.add('show-toc-only')
document.querySelector('#maside')?.classList.remove('hide-toc')
document.querySelector('#maside')?.classList.remove('hide-aside')
