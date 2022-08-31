const tocContainer = document.getElementById('toc-container')
const parser = new DOMParser()
const currentFile = ''

fetch('/data/xml/chapter1.xml')
    .then(res => res.text())
    .then(data => {
        const doc = parser.parseFromString(data, 'text/html')
        const chapters = doc.querySelector('#text-content')

        if (!chapters) {
            console.warn('no elements with id="chapters" have been found.')
            return
        }
        const container = document.querySelector('#text-container')
        console.log(container)
        container?.append(chapters)
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
                console.log(e.currentTarget)
                Array.from(document.getElementsByClassName('toc-heading'))
                    .forEach(h => h.classList.remove('toc-selected'))

                e.currentTarget.classList.add('toc-selected')
            }, false)

            let marker = container.appendChild(document.createElement('div'))
            marker.classList.add('toc-marker')

            container.appendChild(c)

            return container
        })
        tocContainer?.append(...headings)
    })

document.querySelector('#header-btn-toc')?.addEventListener('click', (e) => {
    console.log('toc-btn : ', e.currentTarget)
    const aside = document.querySelector('#maside')
    aside?.classList.remove('hide-toc')
    aside?.classList.remove('hide-aside')
})



