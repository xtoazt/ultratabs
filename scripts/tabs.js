const { iframe, span, button } = van.tags

tabList = document.querySelector('#tabs')
tabView = document.querySelector('#tab-view')
tabs = []
focused = null

const connection = new BareMux.BareMuxConnection("/baremux/worker.js")

function focusTab(tab) {
    if (focused) {
        focused.view.style.display = 'none'
    }
    focused = tab
    tab.view.style.display = 'block'
}

function search(input, template) {
    try {
        return new URL(input).toString();
    } catch (err) {
        // input was not a valid URL
    }

    try {
        // input is a valid URL when http:// is added to the start:
        // eg: example.com, https://example.com/test?q=param
        const url = new URL(`http://${input}`);
        // only if the hostname has a TLD/subdomain
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
        // input was not valid URL
    }

    return template.replace("%s", encodeURIComponent(input));
}


async function addTab(link) {
    // let viewUrl = url
    // if (url.startsWith('ut://')) {
    //     viewUrl = 'https://example.com/'
    // }
    // else {
    //     try {
    //         await registerSW();
    //     }
    //     catch (err) {
    //         alert("Failed to register service worker.");
    //     }
    //     const surl = search(url, 'https://www.google.com/search?q=%s');

    //     // let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + '150.230.42.190:8000' + "/wisp/";
    //     // let wispUrl ="ws://" + '150.230.42.190' + "/wisp/";
    //     let wispUrl = "wss://wisp.mercurywork.shop/"
    //     // let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
    //     if (await connection.getTransport() !== "/epoxy/index.mjs") {
    //         await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    //     }
    //     // frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
    //     viewUrl = __uv$config.prefix + __uv$config.encodeUrl(surl);
    // }
    // let tab = {
    //     title: 'Tab ' + (tabs.length + 1),
    //     url: url,
    //     view: iframe({ class: 'tab', src: viewUrl })
    // }

    // tabs.push(tab)

    // tabList.appendChild(button(
    //     { onclick: () => focusTab(tab) },
    //     tab.title
    // ))

    // tabView.appendChild(tab.view)
    // focusTab(tab)

    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    let url = search(link, 'https://www.google.com/search?q=%s');

    let wispUrl = "wss://wisp.mercurywork.shop/wisp/"
    if (await connection.getTransport() !== "/epoxy/index.mjs") {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    let viewUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

    let tab = {
        title: 'Tab ' + (tabs.length + 1),
        url: url,
        view: iframe({ class: 'tab', src: viewUrl })
    }

    tabs.push(tab)

    tabList.appendChild(button(
        { onclick: () => focusTab(tab) },
        tab.title
    ))
    tabView.appendChild(tab.view)
    focusTab(tab)

}

addTab('https://google.com/')
// addTab('https://example.com/')
