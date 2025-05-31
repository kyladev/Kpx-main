let site = localStorage.getItem('panicsite');
let key = localStorage.getItem('panickey');

if (!site) {
    site = "https://www.google.com/";
}
if (!key) {
    key = "!";
}

document.addEventListener("keypress", function (evt) {
    if (evt.key === key) {
        window.location.href = site;
    }
});