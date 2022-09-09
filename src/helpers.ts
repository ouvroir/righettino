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
   const observer = new IntersectionObserver(handleIntersection)

   document
      .querySelectorAll('#text-content>*[id]')
      .forEach(elt => {
         observer.observe(elt)
      })
}

const handleIntersection = (entries: IntersectionObserverEntry[]) => {
   entries.map(entry => {
      if (entry.isIntersecting) {
         const targetId = entry.target.id
         console.log('intersecting', targetId)

         if (!(targetId in SECTIONS)) {
            console.warn(entry.target.id, 'not in SECTIONS')
            return
         }

         const { files, zoom } = SECTIONS[targetId]
         if (!(files && zoom)) {
            console.warn('handleIntersection data problem with', entry.target.id)
            return
         }

         const pos = convertPixelsToRatio(zoom)
         console.log(zoom)
         console.log(pos)
         updateMaskItems(files)
         highlightItems('30%')
         imagingHelper.setView(pos.width, pos.height, { x: pos.x, y: pos.y })

      }
   })
}