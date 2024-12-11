const { iframe, span, button, img } = van.tags

tabList = document.querySelector('#tabs')
tabView = document.querySelector('#tab-view')
tabs = []
focused = null

function focusTab(tab) {
    if (focused) {
        focused.view.style.display = 'none'
    }
    focused = tab
    tab.view.style.display = 'block'
}

/**
 * @param {string} link 
 */
async function addTab(link) {
    let url;
    if (link.startsWith('ut://')) {
        // system tabs
        url = '/system/newtab.html'
    }
    else {
        url = await getUV(link)
    }

    let tab = {
        title: 'Tab ' + (tabs.length + 1),
        url: link,
        icon: null,
        view: iframe({ class: 'tab', src: url })
    }
    tab.view.onload = () => {
        tab.title = tab.view.contentWindow.document.title
        console.log(tab.title)
        tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title

    }

    tabs.push(tab)

    tabList.appendChild(button(
        { onclick: () => focusTab(tab), class: 'tab' },
        img({ src: 'https://s2.googleusercontent.com/s2/favicons?domain_url='+encodeURIComponent(link) }),
        span(tab.title)
    ))
    tabView.appendChild(tab.view)
    focusTab(tab)
}

addTab('ut://newtab')
addTab('discord.com')
