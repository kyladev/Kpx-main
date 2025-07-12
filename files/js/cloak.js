function applycloak() {
    if (!localStorage.getItem('panicsite')) {
        localStorage.setItem('panicsite', "https://www.google.com");
    }
    if (localStorage.getItem('cloak')) {
        document.title = localStorage.getItem('cloak');
        document.getElementById("ficon").setAttribute("href", localStorage.getItem("ficon"));
        console.log("custon name used");
        return;
    }
    else {
        document.title = "Google";
        document.getElementById("ficon").setAttribute("href", "https://www.gstatic.com/images/branding/searchlogo/ico/favicon.ico");
        return;
    }
}
document.addEventListener("DOMContentLoaded", applycloak);