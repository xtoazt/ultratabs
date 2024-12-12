const { iframe, span, button, img } = van.tags

tabList = document.querySelector('#tabs')
tabView = document.querySelector('#tab-view')
tabs = []
focused = null

// Page controls
document.querySelector('#refresh').onclick = () => focused.view.contentWindow.location.reload()
document.querySelector('#new-tab').onclick = () => addTab('google.com')
document.querySelector('#page-back').onclick = () => focused.view.contentWindow.history.back()
document.querySelector('#page-forward').onclick = () => focused.view.contentWindow.history.forward()

editURL = document.querySelector('#edit-url')
editURL.onsubmit = (e) => {
    e.preventDefault()
    addTab(editURL.elements[0].value, focused)
    editURL.elements[0].value = ''
}

function focusTab(tab) {
    if (focused) {
        focused.view.style.display = 'none'
        tabList.children[tabs.indexOf(focused)].classList.remove('focused')
    }
    focused = tab
    tab.view.style.display = 'block'

    // Update URL bar
    editURL.elements[0].value = tab.url
    tabList.children[tabs.indexOf(tab)].classList.add('focused')
}

/**
 * @param {string} link 
 */
async function addTab(link, tab = null) {
    let url;
    if (link.startsWith('ut://')) {
        // system tabs
        url = '/system/newtab.html'
    }
    else {
        url = await getUV(link)
    }

    if (tab) {
        tab.view.src = url
        tab.url = link
        tab.view.onload = () => {
            tab.title = tab.view.contentWindow.document.title
            tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title
            tabList.children[tabs.indexOf(tab)].children[0].src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(tab.url)
        }
        focusTab(tab)
        tabList.children[tabs.indexOf(tab)].children[0].src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(tab.url)
    }

    else {
        let tab = {
            title: 'Loading...',
            url: link,
            icon: null,
            view: iframe({ class: 'tab', src: url, sandbox: 'allow-scripts allow-forms allow-same-origin' })
        }
        tab.view.onload = () => {
            tab.title = tab.view.contentWindow.document.title
            console.log(tab.title)
            tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title
            tabList.children[tabs.indexOf(tab)].children[0].src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(tab.url)

        }

        tabs.push(tab)

        tabList.appendChild(button(
            {
                onclick: (e) => {
                    if (e.target.className == 'close') return
                    focusTab(tab)
                }, class: 'tab'
            },
            img({ src: 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(tab.url) }),
            span(tab.title),
            button({
                onclick: () => {
                    tabList.removeChild(tabList.children[tabs.indexOf(tab)])
                    tabView.removeChild(tab.view)
                    tabs.splice(tabs.indexOf(tab), 1)
                    if (tab == focused) {
                        focused = null
                        if (tabs.length) focusTab(tabs[tabs.length - 1])
                        else addTab('google.com')
                    }
                }, class: 'close'
            }, 'x')
        ))
        tabView.appendChild(tab.view)
        focusTab(tab)
    }
}

addTab('google.com')
