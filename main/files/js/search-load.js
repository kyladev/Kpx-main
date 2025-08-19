// import { Ultraviolet } from "@titaniumnetwork-dev/ultraviolet";
document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const url_input = document.getElementById("uv-address");
    const searchUrl = "https://duckduckgo.com/";
    if (params.get("q")) {
        url_input.value = atob(params.get("q"));
        let url = atob(params.get("q"));
        if (!atob(params.get("q")).includes(".")) {
            url = searchUrl + encodeURIComponent(url);
        } else {
            if (!params.get("q").startsWith("http://") && !params.get("q").startsWith("https://")) { // if no http or https is detected, add https automatically
                url = "https://" + url;
                document.getElementById("uv-address").value = url;
            }
        }
    }

    if (url_input.value === "") {
        console.log("skipping button click (no url)");
        url_input.value = "";
    } else {
        document.getElementById("searchButton").click();
        manual_submit();
        console.log("clicked button");
    }

    document.getElementById("uv-frame").addEventListener("load", () => {
        if (document.getElementById("uv-frame").src.split("/uv/service/")[1] === undefined) {
            console.log("undefined url, skipping decoding");
            return;
        }
        const encodedPath = document.getElementById("uv-frame").src.split("/uv/service/")[1];
        console.log("Iframe source changed to:", encodedPath);
        console.log(__uv$config.decodeUrl(encodedPath));
        document.getElementById("uv-address").value = __uv$config.decodeUrl(encodedPath);
    });
});