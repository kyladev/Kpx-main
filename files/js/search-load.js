document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const url_input = document.getElementById("uv-address");
    url_input.value = params.get("q");
    let url = params.get("q");
    const searchUrl = "https://duckduckgo.com/";
    if (!params.get("q").includes(".")) {
        url = searchUrl + encodeURIComponent(url);
    } else {
        if (!params.get("q").startsWith("http://") && !params.get("q").startsWith("https://")) { // if no http or https is detected, add https automatically
            url = "https://" + url;
            document.getElementById("uv-address").value = url;
        }
    }
    console.log("clicked button");
    document.getElementById("searchButton").click();
    manual_submit();
});