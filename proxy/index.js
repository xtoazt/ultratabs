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

async function openFrame(link) {
	try {
		await registerSW();
	} catch (err) {
		error.textContent = "Failed to register service worker.";
		errorCode.textContent = err.toString();
		throw err;
	}

	// const url = search(address.value, searchEngine.value);
	// const url = address.value;
	const url = search(link, 'https://www.google.com/search?q=%s');

	// let frame = document.getElementById("uv-frame");
	// frame.style.display = "block";
	let win = window.open('', "_blank");

	// let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + '150.230.42.190:8000' + "/wisp/";
	// let wispUrl ="ws://" + '150.230.42.190' + "/wisp/";
	let wispUrl = "wss://wisp.mercurywork.shop/"
	// let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
	if (await connection.getTransport() !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
	// frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
	win.location = __uv$config.prefix + __uv$config.encodeUrl(url);
}