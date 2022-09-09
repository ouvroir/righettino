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