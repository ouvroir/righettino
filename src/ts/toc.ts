import {
   highlightItems,
   unHighlightItems,
   updateMaskItems,
   initObserver,
   goTo
} from './helpers'

const tocContainer = document.getElementById('toc-container')
const parser = new DOMParser()


const tocTitleOnClick = (e: Event) => {
   let target = e.currentTarget as HTMLElement

   if (!target) {
      console.warn('cannote add event listener to toc container')
      return
   }

   // make sure everything else unselected
   Array.from(document.getElementsByClassName('toc-heading'))
      .forEach(h => h.classList.remove('toc-selected'))

   // update selected
   target.classList.add('toc-selected')

   // Open text panel, close toc
   const aside = document
      .querySelector('#maside')
   aside?.classList.remove('show-toc-only')
   aside?.classList.remove('hide-text')
   aside?.classList.add('hide-toc')

   // Go to indicated zoom
   const { files, zoom } = SECTIONS[target.id]
   if (files && zoom) {
      goTo(zoom)
      updateMaskItems(files)
      highlightItems('30%')
   }
   else {
      console.warn('files and/or zoom not in SECTIONS for id', target.id)
      return
   }
}

const tocTitleOnOver = (e: Event) => {
   globalThis.keepHighlight = false
   let node = e.currentTarget as Node
   if (!node || !node.lastChild) return

   let target = node as HTMLElement
   let href = target.getAttribute('href')
   if (!href) return
   href = href.split('#')[1]

   imagingHelper.setView(1.5, 1.5, { x: 0.3, y: 0.45 },)

   if (!(href in SECTIONS)) return

   const { files } = SECTIONS[href]
   if (!files) return
   updateMaskItems(files)
   highlightItems('30%')
}

fetch('../data/xml/chapter1_2.html')
   .then(res => res.text())
   .then(data => {
      const doc = parser.parseFromString(data, 'text/html')
      const chapters = doc.querySelector('#text-content') as HTMLElement
      if (!chapters) {
         console.warn('no chapters have been found.')
         return
      }

      // Create section dict (section_name -> files/zoom)
      doc.querySelectorAll('*[files], *[zoom]').forEach(e => {
         const files = e.getAttribute('files')?.split(',')
         const zoom = e.getAttribute('zoom')?.split(',').map(s => parseFloat(s))
         SECTIONS[e.id] = { files, zoom }
      })

      const container = document.querySelector('#text-container')
      container?.appendChild(chapters)
      // console.log(container)

      initObserver()
   })

fetch('../data/toc.html')
   .then(res => res.text())
   .then(data => {
      const doc = parser.parseFromString(data, 'text/html')
      const toc = doc.getElementById('toc')

      if (!toc) return

      const headings = Array.from(toc?.children).map(c => {

         // Container has marker + to-heading-x
         let container = document.createElement('div')
         container.classList.add('toc-heading')

         container.addEventListener('click', tocTitleOnClick, false)
         container.addEventListener('mouseover', tocTitleOnOver)
         container.addEventListener('mouseleave', unHighlightItems)

         let marker = container.appendChild(document.createElement('div'))
         marker.classList.add('toc-marker')

         container.appendChild(c)
         return container
      })
      tocContainer?.append(...headings)
   })

document.querySelector('#header-btn-toc')?.addEventListener('click', () => {
   // console.log('toc-btn : ', e.currentTarget)
   const aside = document.querySelector('#maside')
   aside?.classList.remove('hide-toc')
   aside?.classList.remove('hide-aside')
})

document.querySelector('#header-btn-close')?.addEventListener('click', () => {
   // console.log('toc-btn : ', e.currentTarget)
   const aside = document.querySelector('#maside')
   aside?.classList.remove('hide-toc')
   aside?.classList.add('hide-aside')
})

document.querySelector('#btn-toggle-text')?.addEventListener('click', () => {
   const aside = document.querySelector('#maside')
   aside?.classList.remove('show-toc-only')
   aside?.classList.add('hide-toc')
   aside?.classList.contains('hide-aside')
      ? aside.classList.remove('hide-aside')
      : aside?.classList.add('hide-aside')
})

document.querySelector('#btn-toggle-toc')?.addEventListener('click', () => {
   const aside = document.querySelector('#maside')
   aside?.classList.contains('hide-aside')
      ? aside.classList.remove('hide-aside')
      : aside?.classList.add('hide-aside')

   aside?.classList.contains('hide-toc')
      ? aside.classList.remove('hide-toc')
      : aside?.classList.add('show-toc-only')

   aside?.classList.add('show-toc-only')
})

document.querySelector('#btn-highlight')?.addEventListener('click', () => { })

