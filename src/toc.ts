import { highlightItems, unHighlightItems, updateMaskItems } from './helpers'


const tocContainer = document.getElementById('toc-container')
const parser = new DOMParser()

fetch('/data/xml/chapter1_2.xml')
   .then(res => res.text())
   .then(data => {
      const doc = parser.parseFromString(data, 'text/html')
      const chapters = doc.querySelector('#text-content')

      if (!chapters) {
         console.warn('no chapters have been found.')
         return
      }
      const container = document.querySelector('#text-container')
      // console.log(container)

      container?.appendChild(chapters)
   })

fetch('/data/toc.html')
   .then(res => res.text())
   .then(data => {
      const doc = parser.parseFromString(data, 'text/html')
      const toc = doc.getElementById('toc')
      const headings = Array.from(toc?.children).map(c => {

         // Container has marker + to-heading-x
         let container = document.createElement('div')
         container.classList.add('toc-heading')

         container.addEventListener('click', (e) => {
            // update selected
            // make sure everything else unselected
            Array.from(document.getElementsByClassName('toc-heading'))
               .forEach(h => h.classList.remove('toc-selected'))
            e.currentTarget.classList.add('toc-selected')

            // Open text panel, close toc
            const aside = document
               .querySelector('#maside')
            aside?.classList.remove('show-toc-only')
            aside?.classList.add('hide-toc')


         }, false)

         container.addEventListener('mouseover', (e) => {
            const href = e.currentTarget.lastChild.href.split('#')[1]
            imagingHelper.setView(1.5, 1.5, { x: 0.3, y: 0.45 },)

            if (!(href in SECTIONS)) return

            const { files } = SECTIONS[href]
            console.log('updating SECTIONS with files', files)
            updateMaskItems(files)
            highlightItems('30%')
         })

         container.addEventListener('mouseleave', unHighlightItems)

         let marker = container.appendChild(document.createElement('div'))
         marker.classList.add('toc-marker')

         container.appendChild(c)

         return container
      })
      tocContainer?.append(...headings)
   })

document.querySelector('#header-btn-toc')?.addEventListener('click', (e) => {
   // console.log('toc-btn : ', e.currentTarget)
   const aside = document.querySelector('#maside')
   aside?.classList.remove('hide-toc')
   aside?.classList.remove('hide-aside')
})

document.querySelector('#header-btn-close')?.addEventListener('click', (e) => {
   // console.log('toc-btn : ', e.currentTarget)
   const aside = document.querySelector('#maside')
   aside?.classList.remove('hide-toc')
   aside?.classList.add('hide-aside')
})

document.querySelector('#btn-toggle-text')?.addEventListener('click', (e) => {
   const aside = document.querySelector('#maside')
   aside?.classList.remove('show-toc-only')
   aside?.classList.add('hide-toc')
   aside?.classList.contains('hide-aside')
      ? aside.classList.remove('hide-aside')
      : aside?.classList.add('hide-aside')
})

document.querySelector('#btn-toggle-toc')?.addEventListener('click', (e) => {
   const aside = document.querySelector('#maside')
   aside?.classList.contains('hide-aside')
      ? aside.classList.remove('hide-aside')
      : aside?.classList.add('hide-aside')

   aside?.classList.contains('hide-toc')
      ? aside.classList.remove('hide-toc')
      : aside?.classList.add('show-toc-only')

   aside?.classList.add('show-toc-only')
})

document.querySelector('#btn-highlight')?.addEventListener('click', (e) => {

})

