// import { Ultraviolet } from "@titaniumnetwork-dev/ultraviolet";
// document.addEventListener("DOMContentLoaded", function () {

// const html = `<!doctypehtml><h1>Search or type a URL above to get started!</h1><style>body{font-family:Verdana;text-align:center;background-color:#000;color:#fff}</style>`;
// const blob = new Blob([html], { type: 'text/html' });
// const blankpage = URL.createObjectURL(blob);

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
} else {
    document.getElementById("uv-address").value = '';
    document.getElementById("uv-frame").src = blankpage;
}

if (url_input.value === "") {
    console.log("skipping button click (no url)");
    url_input.value = "";
} else {
    document.getElementById("searchButton").click();
    manual_submit();
    console.log("clicked button");
}
// });