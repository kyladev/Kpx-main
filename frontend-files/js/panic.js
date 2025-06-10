let site;
let key;

if (!localStorage.getItem('panicsite')) {
    site = "https://www.google.com/";
    localStorage.setItem('panicsite', "https://www.google.com/");
}
else {
    site = localStorage.getItem('panicsite');
}
if (!localStorage.getItem('panickey')) {
    key = "`";
    localStorage.setItem('panickey', "`");
}
else {
    key = localStorage.getItem('panickey');
}

document.addEventListener("keypress", function (evt) {
    if (evt.key === key) {
        window.location.href = site;
    }
});