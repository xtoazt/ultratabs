const connection = new BareMux.BareMuxConnection("/baremux/worker.js")

function search(input, template) {
    try {
        return new URL(input).toString();
    } catch (err) {
        // input was not a valid URL
    }

    try {
        const url = new URL(`http://${input}`);
        if (url.hostname.includes(".")) return url.toString();
    } catch (err) {
        // input was not valid URL
    }

    return template.replace("%s", encodeURIComponent(input));
}

async function getUV(input) {
    try {
        await registerSW();
    } catch (err) {
        error.textContent = "Failed to register service worker.";
        errorCode.textContent = err.toString();
        throw err;
    }

    let url = search(input, 'https://www.google.com/search?q=%s');

    let wispUrl = "wss://wisp.mercurywork.shop/wisp/"
    if (await connection.getTransport() !== "/epoxy/index.mjs") {
        await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
    }

    let viewUrl = __uv$config.prefix + __uv$config.encodeUrl(url);

    return viewUrl;
}