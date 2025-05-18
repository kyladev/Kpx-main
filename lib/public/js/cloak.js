function applycloak() {
    if (localStorage.getItem('panicsite') === null) {
        localStorage.setItem('panicsite', "https://www.google.com");
    }
    if (localStorage.getItem('cloak')) {
        document.title = localStorage.getItem('cloak');
        document.getElementById("ficon").setAttribute("href", localStorage.getItem("ficon"));
        console.log("custon name used");
        return;
    }
    else {
        document.title = "KPROXY";
        document.getElementById("ficon").setAttribute("href", "");
        return;
    }
}