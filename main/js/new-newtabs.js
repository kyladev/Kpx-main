let tabcount = 0;

const html = `<!doctypehtml><h1>Search or type a URL above to get started!</h1><style>body{font-family:Verdana;text-align:center;background-color:#000;color:#fff}</style>`;
const blob = new Blob([html], { type: 'text/html' });
const blankpage = URL.createObjectURL(blob);

function addiframe(first) {
    const params = new URLSearchParams(window.location.search);
    let iframe = document.createElement("iframe");
    const container = document.getElementById("frame-container");
    const tabId = "iframe-" + Date.now();
    if (first === true) {
        iframe.id = "sj-frame";
        iframe.style.display = 'block';
        const initialUrl = params.get("q") || "";
        if (initialUrl !== "") {
            iframe.src = "/scram/" + encodeURIComponent(initialUrl);
        } else {
            iframe.src = blankpage;
        }
    } else {
        iframe.id = tabId;
        iframe.classList.add('inactive-frame');
        iframe.style.display = 'none';
        iframe.src = blankpage;
    }
    container.appendChild(iframe);
}

function getrealurl() {
    const searchUrl = "https://duckduckgo.com/";
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
        document.getElementById("sj-address").value = atob(params.get("q"));
        let initialUrl = atob(params.get("q"));
        console.log(initialUrl);
        if (!atob(params.get("q")).includes(".")) {
            initialUrl = searchUrl + encodeURIComponent(initialUrl);
            return initialUrl;
        } else {
            if (!atob(params.get("q")).startsWith("http://") && !atob(params.get("q")).startsWith("https://")) { // if no http or https is detected, add https automatically
                initialUrl = "https://" + initialUrl;
                return initialUrl;
            }
        }
    } else {
        return 'no-valid-url-query-is-blank';
    }
}

function addtab(first, url = '') {
    let tab = document.createElement("div");
    let close = document.createElement("div");
    let span = document.createElement("span");
    let favicon = document.createElement("img"); //favicon holder
    const params = new URLSearchParams(window.location.search);

    if (first === true) {
        tab.classList.add("tabactive");
    } else {
        tab.classList.add("tabs");
    }

    close.classList.add("closebutton");
    span.classList.add("tabtitle");
    favicon.classList.add("tabfavicon");
    favicon.width = 16;
    favicon.height = 16;

    span.innerText = "New Tab";
    close.innerText = "x";
    favicon.src = "/favicon.ico";

    close.onclick = function (e) {
        e.stopPropagation();
        closetab(this);
    };

    tab.onclick = function (el) {
        changetab(el.currentTarget);
    };

    tab.history = [];
    tab.dataset.url = '';

    let iframe = document.createElement("iframe");
    const container = document.getElementById("frame-container");
    const tabId = "iframe-" + Date.now();

    tab.dataset.iframeId = tabId;

    if (first === true) {
        iframe.id = "sj-frame";
        iframe.style.display = 'block';
        let initialUrl = getrealurl();
        if (initialUrl === 'no-valid-url-query-is-blank') {
            iframe.src = blankpage;
            document.getElementById('sj-address').value = '';
        } else {
            tab.dataset.url = initialUrl;
            if (initialUrl !== "") {
                tab.history.push(initialUrl);
                iframe.src = "/scram/" + encodeURIComponent(initialUrl);
                document.getElementById('sj-address').value = initialUrl;
            } else {
                iframe.src = blankpage;
                document.getElementById('sj-address').value = '';
            }
        }
    } else {
        iframe.id = tabId;
        iframe.classList.add('inactive-frame');
        iframe.style.display = 'none';
        iframe.src = blankpage;
    }

    tab.appendChild(favicon);
    tab.appendChild(span);
    tab.appendChild(close);
    document.getElementById("browsertabs").appendChild(tab);
    container.appendChild(iframe);

    if (!first) {
        changetab(tab);
    }

    tabcount++;

    document.getElementById("sj-frame").addEventListener("load", () => {
        const frame = document.getElementById("sj-frame");

        if (!frame.src.includes("/scram/")) {
            console.log("Not a SJ URL, skipping history update.");
            return;
        }

        const encodedPath = frame.src.split("/scram/")[1];
        const decodedUrl = decodeURIComponent(encodedPath);

        console.log("Iframe source changed to:", decodedUrl);
        document.getElementById("sj-address").value = decodedUrl;

        const activeTab = document.querySelector(".tabactive");

        if (activeTab) {
            activeTab.dataset.url = decodedUrl;

            if (!activeTab.history) {
                activeTab.history = [];
            }

            const last = activeTab.history[activeTab.history.length - 1];
            if (last !== decodedUrl) {
                activeTab.history.push(decodedUrl);
            }
        }

        const title = frame.contentDocument.title || decodedUrl;
        const span = activeTab.querySelector(".tabtitle");
        span.innerText = title;

        let iconEl = frame.contentDocument.querySelector("link[rel*='icon']");
        let faviconUrl = iconEl ? iconEl.href : "/favicon.ico";
        const faviconEl = activeTab.querySelector(".tabfavicon");
        faviconEl.src = faviconUrl;
    });
}


function closetab(button) {
    const tab = button.parentElement;
    const container = document.getElementById("browsertabs");
    const iframe = document.getElementById(tab.dataset.iframeId);

    const isActive = tab.classList.contains("tabactive");
    const tabs = Array.from(container.children);
    const index = tabs.indexOf(tab);

    if (tabcount <= 1) {
        return;
    }

    tab.remove();
    if (iframe) {
        iframe.remove();
    }
    tabcount--;

    if (isActive) {
        const remainingTabs = Array.from(container.children);
        const newIndex = index - 1 >= 0 ? index - 1 : 0;
        const nextTab = remainingTabs[newIndex];

        if (nextTab) {
            changetab(nextTab);
        }
    }
}

function changetab(currentTarget) {
    const currentactiveTab = document.querySelector(".tabactive");
    const currentactiveIframe = document.getElementById("sj-frame");

    if (currentactiveTab && currentactiveIframe) {
        currentactiveIframe.id = currentactiveTab.dataset.iframeId;
        currentactiveIframe.classList.add('inactive-frame');
        currentactiveIframe.style.display = 'none';
        currentactiveTab.classList.remove("tabactive");
        currentactiveTab.classList.add("tabs");
    }

    currentTarget.classList.remove("tabs");
    currentTarget.classList.add("tabactive");

    const newIframeId = currentTarget.dataset.iframeId;
    const newIframe = document.getElementById(newIframeId);
    if (newIframe) {
        newIframe.id = "sj-frame";
        newIframe.classList.remove('inactive-frame');
        newIframe.style.display = 'block';
    }

    const url = currentTarget.dataset.url;
    const searchbar = document.getElementById("sj-address");
    searchbar.value = url;

    if (!currentTarget.history) currentTarget.history = [];
    const history = currentTarget.history;
    if (history.length === 0 || history[history.length - 1] !== url) {
        history.push(url);
    }
}

function traverse_history(tab, direction) {
    if (!tab) return;
    if (!tab.history) tab.history = [];

    const history_count = tab.history.length;
    let newUrl = '';

    if (direction === "forward") {
        const currentUrl = tab.dataset.url;
        const currentIndex = tab.history.indexOf(currentUrl);
        if (currentIndex !== -1 && currentIndex < history_count - 1) {
            newUrl = tab.history[currentIndex + 1];
        }
    }
    else if (direction === "back") {
        const currentUrl = tab.dataset.url;
        const currentIndex = tab.history.indexOf(currentUrl);
        if (currentIndex > 0) {
            newUrl = tab.history[currentIndex - 1];
        }
    }
    else {
        console.log("error with tab history");
        return;
    }

    if (newUrl) {
        tab.dataset.url = newUrl;
        document.getElementById("sj-address").value = newUrl;
        document.getElementById("searchButton").click();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchButton").addEventListener("click", function () {
        const activeTab = document.querySelector(".tabactive");
        const searchbar = document.getElementById("sj-address");
        const newUrl = searchbar.value.trim();

        if (!activeTab) return;

        const iframe = document.getElementById("sj-frame");

        if (newUrl) {
            activeTab.dataset.url = newUrl;
            if (!activeTab.history) activeTab.history = [];
            const last = activeTab.history[activeTab.history.length - 1];
            if (last !== newUrl) {
                activeTab.history.push(newUrl);
            }

            if (iframe) {
                iframe.src = "/scram/" + encodeURIComponent(newUrl);
            }
        } else {
            activeTab.dataset.url = "";
            if (!activeTab.history) activeTab.history = [];
            activeTab.history.push("");

            if (iframe) {
                iframe.src = blankpage;
            }
        }
    });
    document.getElementById('backhistory').addEventListener('click', () => {
        const activeTab = document.querySelector(".tabactive");
        if (activeTab) {
            traverse_history(activeTab, 'back');
        }
    });
    document.getElementById('forwardhistory').addEventListener('click', () => {
        const activeTab = document.querySelector(".tabactive");
        if (activeTab) {
            traverse_history(activeTab, 'forward');
        }
    });
});
