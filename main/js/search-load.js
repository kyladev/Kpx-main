const params = new URLSearchParams(window.location.search);
const url_input = document.getElementById("uv-address");
const searchUrl = "https://duckduckgo.com/";
if (params.get("q")) {
    url_input.value = atob(params.get("q"));
    let url = atob(params.get("q"));
    if (!atob(params.get("q")).includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!params.get("q").startsWith("http://") && !params.get("q").startsWith("https://")) {
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