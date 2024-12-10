const { iframe, span, button } = van.tags

window.onerror = function (message, source, lineno, colno, error) {
    alert(message);
}
// console.log
window.console.log = function (message) {
    alert(message);
}


tabList = document.querySelector('#tabs')
tabView = document.querySelector('#tab-view')
// console.log(tabList)
tabs = []
focused = null

function showTab(tab) {
    if (focused) {
        focused.view.style.display = 'none'
    }
    focused = tab
    tab.view.style.display = 'block'
}

function addTab(url) {
    let viewUrl = url
    if (url.startsWith('ut://')) {
        url = 'https://example.com/'
    }

    let tab = {
        title: 'Tab ' + (tabs.length + 1),
        url: url,
        view: iframe({ class: 'tab', src: viewUrl })
    }

    tabs.push(tab)

    tabList.appendChild(button(
        { onclick: () => showTab(tab) },
        tab.title
    ))
    tabView.appendChild(tab.view)
    showTab(tab)
}

addTab('https://cloudflare.com/')
addTab('https://example.com/')
