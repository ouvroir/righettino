import OpenSeadragon from 'openseadragon'
import OpenSeadragonViewerInputHook from '@openseadragon-imaging/openseadragon-viewerinputhook'
import OpenSeadragonImagingHelper from '@openseadragon-imaging/openseadragon-imaginghelper';
import { updateMaskItems, highlightItems, unHighlightItems, goTo } from './helpers'


console.log('BASE_URL', import.meta.env.BASE_URL)

// ---------------------------
//    Openseadragon stuff
// ---------------------------

const onlineTile = {
   type: 'image',
   url: 'https://oncs.bib.umontreal.ca/ouvroir/righettino/png/View.png',
   crossOriginPolicy: 'Anonymous',
   ajaxWithCredentials: false
}

const localTile = {
   type: 'image',
   url: '../../external/View.png'
}

globalThis.viewer = OpenSeadragon({
   id: 'contentDiv',
   //@ts-ignore
   toolbar: 'invisible',
   prefixUrl:
      'https://cdn.jsdelivr.net/npm/openseadragon/build/openseadragon/images/',
   tileSources: import.meta.env.PROD ? onlineTile : localTile,
   minZoomLevel: 0.5,
})

viewer.addHandler('tile-loaded', () => {
   const div = document.querySelector('#loading-container') as HTMLElement
   if (div) {
      div.style.visibility = 'hidden'
   }
   else {
      console.warn('cannot hide loading div')
   }
})

globalThis.viewport = viewer.viewport

const onViewerClick = (e: any) => {
   // console.log(viewport.windowToViewportCoordinates(e.position))
   e.preventDefaultAction = true

   globalThis.keepHighlight = false

   if (!document.querySelector('#btn-highlight')?.classList.contains('activated'))
      unHighlightItems()

   // if toc is open : close it 
   // console.log('closing toc')
   const aside = document.querySelector('#maside')
   aside?.classList.add('hide-toc')
   aside?.classList.add('hide-aside')
}

const onViewerDblClick = (e: any) => {
   viewport.zoomTo(
      viewport.getZoom() + 1,
      viewport.windowToViewportCoordinates(e.position),
      false
   );
}

//@ts-ignore
const hEl = viewer.HTMLelements()

new OpenSeadragonViewerInputHook({
   viewer: viewer,
   hooks: [
      { tracker: 'viewer', handler: 'clickHandler', hookHandler: onViewerClick },
      { tracker: 'viewer', handler: 'dblClickHandler', hookHandler: onViewerDblClick },
   ]
});

globalThis.imagingHelper = new OpenSeadragonImagingHelper({ viewer: viewer });
imagingHelper.addHandler('image-view-changed', (e: any) => {
   // e.viewportWidth == width of viewer viewport in logical coordinates relative to image native size
   // e.viewportHeight == height of viewer viewport in logical coordinates relative to image native size
   // e.viewportOrigin == OpenSeadragon.Point, top-left of the viewer viewport in logical coordinates relative to image
   // e.viewportCenter == OpenSeadragon.Point, center of the viewer viewport in logical coordinates relative to image
   // e.zoomFactor == current zoom factor

   capture = {
      width: e.viewportWidth,
      height: e.viewportHeight,
      origin: e.viewportOrigin,
      center: e.viewportCenter,
      zoomfactor: e.zoomFactor
   }
});

var capture: any = null
// ---------------------------
//    Dealing with items
// ---------------------------

const itemOnClick = (e: any) => {
   document.querySelector('#maside')?.classList.remove('hide-aside')
   document.querySelector('#maside')?.classList.remove('show-toc-only')
   document.querySelector('#maside')?.classList.add('hide-toc')

   const sectionId = e.currentTarget.getAttribute('action')
   window.location.href = '#' + sectionId
   e.preventDefault()
   e.stopPropagation()

   const { files, zoom } = SECTIONS[sectionId]
   if (files && zoom) {
      updateMaskItems(files)
      highlightItems()
      goTo(zoom)
   }

   globalThis.keepHighlight = true
}

const itemOnMouseOver = (e: Event) => {
   console.log('hovering with keepHighlight at', keepHighlight)
   if (keepHighlight)
      return

   if (e.currentTarget) {
      let target = e.currentTarget as HTMLElement
      updateMaskItems([target.id])
      highlightItems()
   }

   keepHighlight = false
}

const itemOnMouseLeave = () => {
   if (keepHighlight)
      return
   else {
      unHighlightItems()
   }
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
//@ts-ignore
maskBg.style.x = '-1000vh'
//@ts-ignore
maskBg.style.y = '-1000vh'
maskBg.setAttribute('fill', 'white')

mask.appendChild(maskBg)

const itemsBg = maskBg.cloneNode(true) as HTMLElement
itemsBg.id = 'items-bg'
itemsBg.setAttribute('fill-opacity', '0%')
itemsContainer.appendChild(itemsBg)


globalThis.ITEMS = {}
globalThis.SECTIONS = {}
globalThis.keepHighlight = false

const itemSection: { [name: string]: string } = {
   'faith.svg': 'chapter1',
   'blazon.svg': 'chapter1',
   'charity.svg': 'chapter1',
   'hope.svg': 'chapter1',
   'mathematiques.svg': 'sciences',
   'metaphysic.svg': 'sciences',
   'naturalphilosophy.svg': 'sciences',
   'divinetheology.svg': 'sciences'
}

const initApp = (): void => {
   // TODO : files must be read from documents?

   const parser = new DOMParser()
   const files = [
      'faith.svg', 'blazon.svg', 'charity.svg', 'hope.svg',
      'mathematiques.svg', 'metaphysic.svg', 'naturalphilosophy.svg',
      'divinetheology.svg'
   ]

   // Create dict items
   files.forEach(f => {
      // const base = import.meta.env.PROD ? 'righettino/public' : ''
      fetch('../data/svg/' + f)
         .then((res) => res.text())
         .then((data) => {
            console.log(f)
            const svg = parser.parseFromString(data, 'image/svg+xml')
            const path = Array.from(svg.getElementsByTagName('path'))[0]

            path.classList.add('mask-item')
            path.setAttribute('fill', 'none')
            path.setAttribute('action', itemSection[f])
            path.addEventListener('click', itemOnClick)
            path.addEventListener('mouseover', itemOnMouseOver)
            path.addEventListener('mouseleave', itemOnMouseLeave)
            itemsContainer.appendChild(path)

            ITEMS[f] = path
         })

   })
   console.log('ITEMS', ITEMS)
}

hEl.addElement({
   id: 'hEl',
   element: itemsContainer,
   x: 3,
   y: -3,
   width: 9645,
   height: 7181,
})

document
   .getElementById('toc-btn')
   ?.addEventListener('click', (e) => {
      console.log(e)
   })

document.getElementById('header-btn-close')?.addEventListener('click', () => {
   const aside = document.querySelector('#maside')
   aside?.classList.remove('show')
   aside?.classList.add('hide-aside')
   aside?.classList.add('hide-toc')
})

initApp()
console.log('Done setting up the app')
console.log('Using OpenseaDragon version', OpenSeadragon.version.versionStr)
// document.querySelector('#maside')?.classList.add('show-toc-only')
// document.querySelector('#maside')?.classList.remove('hide-toc')
// document.querySelector('#maside')?.classList.remove('hide-aside')

document
   .querySelector('#btn-highlight')
   ?.addEventListener('click', (e: Event) => {
      let target = e.currentTarget as HTMLElement

      if (globalThis.keepHighlight) {
         unHighlightItems()
         globalThis.keepHighlight = false

         if (target)
            target.classList.remove('activated')
      } else {
         updateMaskItems(Object.keys(ITEMS))
         highlightItems('30%')
         globalThis.keepHighlight = true
         if (target)
            target.classList.add('activated')
      }
   })

document
   .querySelector('#btn-leave')
   ?.addEventListener('click', () => {
      window.location.href = '/'
   })


document.querySelector('#btn-toggle-capture')?.addEventListener('click', (e: Event) => {
   console.log(capture)
   console.log('other data for capture')
   console.log({
      width: globalThis.viewport,
      height: globalThis.viewport.height,
      center: globalThis.viewport.center
   })
   e.stopImmediatePropagation()
})