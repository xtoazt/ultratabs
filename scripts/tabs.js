const { iframe, span, button, img } = van.tags

tabList = document.querySelector('#tabs')
tabView = document.querySelector('#tab-view')
tabs = []
focused = null

// Page controls
document.querySelector('#refresh').onclick = () => focused.view.contentWindow.location.reload()
document.querySelector('#new-tab').onclick = () => addTab('ut://newtab')
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
    }
    focused = tab
    tab.view.style.display = 'block'

    // Update URL bar
    editURL.elements[0].value = tab.url
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
            console.log(tab.title)
            tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title
        }
        focusTab(tab)
        tabList.children[tabs.indexOf(tab)].children[0].src = 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(link)
        
    }
    else {
        let tab = {
            title: 'Tab ' + (tabs.length + 1),
            url: link,
            icon: null,
            view: iframe({ class: 'tab', src: url, sandbox: 'allow-scripts allow-forms allow-same-origin' })
        }
        tab.view.onload = () => {
            tab.title = tab.view.contentWindow.document.title
            console.log(tab.title)
            tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title
        }

        tabs.push(tab)

        tabList.appendChild(button(
            { onclick: () => focusTab(tab), class: 'tab' },
            img({ src: 'https://s2.googleusercontent.com/s2/favicons?domain_url=' + encodeURIComponent(link) }),
            span(tab.title)
        ))
        tabView.appendChild(tab.view)
        focusTab(tab)
    }
}

addTab('ut://newtab')
addTab('discord.com')
