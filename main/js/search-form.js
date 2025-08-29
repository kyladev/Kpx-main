async function manual_submit() {

	try {
		await registerSW();
	} catch (err) {
		err.textContent = "Failed to register service worker.";
		throw err;
	}

	const url = search(document.getElementById("sj-address").value, document.getElementById("sj-search-engine").value);

	let frame = document.getElementById("sj-frame");
	frame.style.display = "block";
	let wispUrl = (location.protocol === "https:" ? "wss" : "ws") + "://" + location.host + "/wisp/";
	if (await connection.getTransport() !== "/epoxy/index.mjs") {
		await connection.setTransport("/epoxy/index.mjs", [{ wisp: wispUrl }]);
	}
	if (url === "") {
		return;
	}

	frame.src = "/scram/" + encodeURIComponent(url);
}
