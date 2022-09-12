export const updateMaskItems = (files: string[]) => {
   document
      .querySelectorAll('#mask > path')
      .forEach(p => p.remove())

   files.forEach(f => {
      let maskItem = ITEMS[f].cloneNode()
      maskItem.id = f
      maskItem.setAttribute('fill', 'black')
      document.querySelector('mask').appendChild(maskItem)
   })
}

export const highlightItems = (fillOpacity: string = '20%') => {
   const itemsBg = document.querySelector('#items-bg')
   itemsBg?.setAttribute('mask', 'url(#mask)')
   itemsBg?.setAttribute('fill-opacity', fillOpacity)
   itemsBg?.setAttribute('fill', 'black')
}

export const unHighlightItems = () => {
   const itemsBg = document.querySelector('#items-bg')
   itemsBg?.classList.remove('highlight')
   itemsBg?.removeAttribute('mask')
   itemsBg?.setAttribute('fill-opacity', '0%')
}

const convertPixelsToRatio = (pixels: number[]) => {
   const imgWidth = 9645
   const imgHeight = 7181

   return {
      width: (pixels[0] / imgWidth) + 1,
      height: (pixels[1] / imgHeight) + 1,
      x: pixels[2] * 10 / imgWidth,
      y: pixels[3] * 10 / imgHeight
   }
}

export const initObserver = () => {
   const observer = new IntersectionObserver(
      handleIntersection,
      {
         rootMargin: '-200px',
         threshold: 0.5
      }
   )

   document
      .querySelectorAll('#text-content>*[id]')
      .forEach(elt => {
         observer.observe(elt)
      })
}

export const goTo = (zoom) => {
   if (!zoom) return
   imagingHelper.setView(zoom[2], zoom[3], { x: zoom[0], y: zoom[1] })
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
   entries.map(entry => {
      if (entry.isIntersecting) {
         const targetId = entry.target.id

         if (!(targetId in SECTIONS)) {
            console.warn(entry.target.id, 'not in SECTIONS')
            return
         }

         const { files, zoom } = SECTIONS[targetId]
         if (files) {
            updateMaskItems(files)
            highlightItems('30%')

            if (zoom) {
               console.log('dealing withc section', targetId, SECTIONS[targetId])
               console.log({
                  'originalZoom': zoom,
                  'setView': [zoom[2], zoom[3], { x: zoom[0], y: zoom[1] }]
               })
               goTo(zoom)
            }
         }
      }
   })
}