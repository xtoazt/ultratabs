const { span, iframe, button, img } = van.tags;

var tabs = [];
var selectedTab = null;

// Controls
const pageBack = document.getElementById('page-back');
const pageForward = document.getElementById('page-forward');
const pageRefresh = document.getElementById('page-refresh');

// URL Bar
const urlForm = document.getElementById('url-form');
const urlInput = document.getElementById('url-input');

// New Tab Button
const newTabButton = document.getElementById('new-tab');

// Tab List
const tabList = document.getElementById('tab-list');

// Tab View
const tabView = document.getElementById('tab-view');

// Event Listeners
pageBack.onclick = () => {
    selectedTab.view.contentWindow.history.back()
}

pageForward.onclick = () => {
    selectedTab.view.contentWindow.history.forward()
}

pageRefresh.onclick = () => {
    selectedTab.view.contentWindow.location.reload()

}

newTabButton.onclick = () => {
    addTab('example.com')
}


urlForm.onsubmit = async (e) => {
    e.preventDefault()
    selectedTab.view.src = await getUV(urlInput.value)
}

function focusTab(tab) {
    if (selectedTab) {
        selectedTab.view.style.display = 'none'
        tabList.children[tabs.indexOf(selectedTab)].classList.remove('selectedTab')
    }
    selectedTab = tab
    tab.view.style.display = 'block'

    // Update URL bar
    urlInput.value = tab.url
    tabList.children[tabs.indexOf(tab)].classList.add('selectedTab')
}

function getFavicon(url) {
    return 'https://s2.googleusercontent.com/s2/favicons?sz=64&domain_url=' + encodeURIComponent(url)
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
        title: 'Loading...',
        url: link,
        icon: null,
        view: iframe({ class: 'tab-frame', src: url, sandbox: 'allow-scripts allow-forms allow-same-origin' })
    }
    tab.view.onload = (e) => {
        let parts = e.target.contentWindow.location.pathname.slice(1).split('/')
        let targetUrl = decodeURIComponent(__uv$config.decodeUrl(parts[parts.length - 1]))

        tab.title = tab.view.contentWindow.document.title
        console.log(tab.title)
        tabList.children[tabs.indexOf(tab)].children[1].textContent = tab.title
        tabList.children[tabs.indexOf(tab)].children[0].src = getFavicon(targetUrl)

        // Update URL bar
        urlInput.value = targetUrl
    }


    tabs.push(tab)

    let closeIcon = document.createElement('ion-icon')
    closeIcon.name = 'close'
    closeIcon.className = 'close-icon'

    tabList.appendChild(button(
        {
            onclick: (e) => {
                if (e.target.className == 'close' || e.target.className == 'close-icon') return
                focusTab(tab)
            }, class: 'tab-item hover-focus1'
        },
        img({ src: getFavicon(tab.url) }),
        span(tab.title),
        button({
            onclick: () => {
                tabList.removeChild(tabList.children[tabs.indexOf(tab)])
                tabView.removeChild(tab.view)
                tabs.splice(tabs.indexOf(tab), 1)
                if (tab == selectedTab) {
                    selectedTab = null
                    if (tabs.length) focusTab(tabs[tabs.length - 1])
                    else addTab('google.com')
                }
            }, class: 'close'
        }, closeIcon)
    ))
    tabView.appendChild(tab.view)
    focusTab(tab)
    // }
}

addTab('example.com')