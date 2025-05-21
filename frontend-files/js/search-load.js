document.addEventListener("DOMContentLoaded", function() {
    const params = new URLSearchParams(window.location.search);
    const url_input = document.getElementById("urlInput");
    url_input.value = params.get("q");
    document.getElementById("searchButton").click();
    console.log("clicked button");
});