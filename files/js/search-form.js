async function manual_submit() {

	try {
		await registerSW();
	} catch (err) {
		err.textContent = "Failed to register service worker.";
		throw err;
	}

	const url = search(document.getElementById("uv-address").value, document.getElementById("uv-search-engine").value);

	let frame = document.getElementById("uv-frame");
	frame.style.display = "block";
	let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
	if (await connection.getTransport() !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
	frame.src = __uv$config.prefix + __uv$config.encodeUrl(url);
}
