let tabcount = 0;

function addiframe(first) {
    const params = new URLSearchParams(window.location.search);
    let iframe = document.createElement("iframe");
    const container = document.getElementById("frame-container");
    const tabId = "iframe-" + Date.now();
    if (first === true) {
        // The first iframe is immediately the active one
        iframe.id = "uv-frame";
        iframe.style.display = 'block';
        const initialUrl = params.get("q") || "";
        // tab.dataset.url = initialUrl;
        if (initialUrl !== "") {
            // tab.history.push(initialUrl);
            iframe.src = __uv$config.prefix + __uv$config.encodeUrl(initialUrl);
        } else {
            iframe.src = "/main/files/pages/emptytab.html";
        }
    } else {
        // All other iframes start as inactive
        iframe.id = tabId;
        iframe.classList.add('inactive-frame');
        iframe.style.display = 'none';
        iframe.src = "/main/files/pages/emptytab.html";
    }
    container.appendChild(iframe);
}

function getrealurl() {
    const searchUrl = "https://duckduckgo.com/";
    const params = new URLSearchParams(window.location.search);
    if (params.get("q")) {
        document.getElementById("uv-address").value = atob(params.get("q"));
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

// function addtab(first, url = '') {
//     // Create tab element
//     let tab = document.createElement("div");
//     let close = document.createElement("div");
//     let span = document.createElement("span");
//     const params = new URLSearchParams(window.location.search);

//     if (first === true) {
//         tab.classList.add("tabactive");
//     } else {
//         tab.classList.add("tabs");
//     }

//     close.classList.add("closebutton");
//     span.classList.add("tabtitle");

//     span.innerText = "New Tab";
//     close.innerText = "x";

//     close.onclick = function (e) {
//         e.stopPropagation();
//         closetab(this);
//     };

//     tab.onclick = function (el) {
//         changetab(el.currentTarget);
//     };

//     //initialize tab history and dataset
//     tab.history = [];
//     tab.dataset.url = '';

//     //create a new iframe for this tab
//     let iframe = document.createElement("iframe");
//     const container = document.getElementById("frame-container");
//     const tabId = "iframe-" + Date.now();

//     //the tab identifier is its data attribute
//     tab.dataset.iframeId = tabId;

//     if (first === true) {
//         //the first iframe is immediately the active one
//         iframe.id = "uv-frame";
//         iframe.style.display = 'block';
//         let initialUrl = getrealurl();
//         tab.dataset.url = initialUrl;
//         if (initialUrl !== "") {
//             tab.history.push(initialUrl);
//             iframe.src = __uv$config.prefix + __uv$config.encodeUrl(initialUrl);
//             document.getElementById('uv-address').value = initialUrl;
//         } else {
//             iframe.src = "/main/files/pages/emptytab.html";
//             document.getElementById('uv-address').value = '';
//         }
//     } else {
//         //all other iframes start as inactive
//         iframe.id = tabId;
//         iframe.classList.add('inactive-frame');
//         iframe.style.display = 'none';
//         iframe.src = "/main/files/pages/emptytab.html";
//     }

//     //append elements
//     tab.appendChild(span);
//     tab.appendChild(close);
//     document.getElementById("browsertabs").appendChild(tab);
//     container.appendChild(iframe);

//     //if not the first tab, call changetab to make it active
//     if (!first) {
//         changetab(tab);
//     }

//     tabcount++;

//     document.getElementById("uv-frame").addEventListener("load", () => {
//         const frame = document.getElementById("uv-frame");

//         if (!frame.src.includes("/uv/service/")) {
//             console.log("Not a UV URL, skipping history update.");
//             return;
//         }

//         const encodedPath = frame.src.split("/uv/service/")[1];
//         const decodedUrl = __uv$config.decodeUrl(encodedPath);

//         console.log("Iframe source changed to:", decodedUrl);
//         document.getElementById("uv-address").value = decodedUrl;

//         const activeTab = document.querySelector(".tabactive");

//         if (activeTab) {
//             activeTab.dataset.url = decodedUrl;

//             if (!activeTab.history) {
//                 activeTab.history = [];
//             }

//             const last = activeTab.history[activeTab.history.length - 1];
//             if (last !== decodedUrl) {
//                 activeTab.history.push(decodedUrl);
//             }
//         }

//         const title = frame.contentDocument.title;
//         const span = activeTab.querySelector("span");
//         span.innerText = title;
//     });
// }
function addtab(first, url = '') {
    // Create tab element
    let tab = document.createElement("div");
    let close = document.createElement("div");
    let span = document.createElement("span");
    let favicon = document.createElement("img"); // favicon holder
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
    favicon.src = "/favicon.ico"; // fallback favicon

    close.onclick = function (e) {
        e.stopPropagation();
        closetab(this);
    };

    tab.onclick = function (el) {
        changetab(el.currentTarget);
    };

    //initialize tab history and dataset
    tab.history = [];
    tab.dataset.url = '';

    //create a new iframe for this tab
    let iframe = document.createElement("iframe");
    const container = document.getElementById("frame-container");
    const tabId = "iframe-" + Date.now();

    //the tab identifier is its data attribute
    tab.dataset.iframeId = tabId;

    if (first === true) {
        iframe.id = "uv-frame";
        iframe.style.display = 'block';
        let initialUrl = getrealurl();
        if (initialUrl === 'no-valid-url-query-is-blank') {
            iframe.src = "/main/files/pages/emptytab.html";
            document.getElementById('uv-address').value = '';
        } else {
            tab.dataset.url = initialUrl;
            if (initialUrl !== "") {
                tab.history.push(initialUrl);
                iframe.src = __uv$config.prefix + __uv$config.encodeUrl(initialUrl);
                document.getElementById('uv-address').value = initialUrl;
            } else {
                iframe.src = "/main/files/pages/emptytab.html";
                document.getElementById('uv-address').value = '';
            }
        }
    } else {
        iframe.id = tabId;
        iframe.classList.add('inactive-frame');
        iframe.style.display = 'none';
        iframe.src = "/main/files/pages/emptytab.html";
    }

    //append elements (favicon -> span -> close)
    tab.appendChild(favicon);
    tab.appendChild(span);
    tab.appendChild(close);
    document.getElementById("browsertabs").appendChild(tab);
    container.appendChild(iframe);

    //if not the first tab, call changetab to make it active
    if (!first) {
        changetab(tab);
    }

    tabcount++;

    // handle updates on iframe load
    document.getElementById("uv-frame").addEventListener("load", () => {
        const frame = document.getElementById("uv-frame");

        if (!frame.src.includes("/uv/service/")) {
            console.log("Not a UV URL, skipping history update.");
            return;
        }

        const encodedPath = frame.src.split("/uv/service/")[1];
        const decodedUrl = __uv$config.decodeUrl(encodedPath);

        console.log("Iframe source changed to:", decodedUrl);
        document.getElementById("uv-address").value = decodedUrl;

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

        // try to fetch favicon from the document
        let iconEl = frame.contentDocument.querySelector("link[rel*='icon']");
        let faviconUrl = iconEl ? iconEl.href : "/favicon.ico";
        // faviconUrl = __uv$config.prefix + __uv$config.encodeUrl(faviconUrl);
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
        // Can't close the last tab
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
    // Find the currently active tab and iframe
    const currentactiveTab = document.querySelector(".tabactive");
    const currentactiveIframe = document.getElementById("uv-frame");

    if (currentactiveTab && currentactiveIframe) {
        // Set the old iframe's ID back to its unique identifier
        currentactiveIframe.id = currentactiveTab.dataset.iframeId;
        // Add the inactive class
        currentactiveIframe.classList.add('inactive-frame');
        // Hide the old iframe
        currentactiveIframe.style.display = 'none';

        // Update the old tab's class
        currentactiveTab.classList.remove("tabactive");
        currentactiveTab.classList.add("tabs");
    }

    // Update the new tab's class
    currentTarget.classList.remove("tabs");
    currentTarget.classList.add("tabactive");

    // Get the new iframe and update its properties
    const newIframeId = currentTarget.dataset.iframeId;
    const newIframe = document.getElementById(newIframeId);
    if (newIframe) {
        newIframe.id = "uv-frame";
        newIframe.classList.remove('inactive-frame');
        newIframe.style.display = 'block';
    }

    // Update the search bar value
    const url = currentTarget.dataset.url;
    const searchbar = document.getElementById("uv-address");
    searchbar.value = url;

    // Add URL to history if it's different from the last
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
        document.getElementById("uv-address").value = newUrl;
        document.getElementById("searchButton").click();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchButton").addEventListener("click", function () {
        const activeTab = document.querySelector(".tabactive");
        const searchbar = document.getElementById("uv-address");
        const newUrl = searchbar.value.trim();

        if (!activeTab) return;

        // The active iframe is always 'uv-frame'
        const iframe = document.getElementById("uv-frame");

        // Only update if the URL is non-empty
        if (newUrl) {
            activeTab.dataset.url = newUrl;
            if (!activeTab.history) activeTab.history = [];
            const last = activeTab.history[activeTab.history.length - 1];
            if (last !== newUrl) {
                activeTab.history.push(newUrl);
            }

            if (iframe) {
                iframe.src = __uv$config.prefix + __uv$config.encodeUrl(newUrl);
            }
        } else {
            activeTab.dataset.url = "";
            if (!activeTab.history) activeTab.history = [];
            activeTab.history.push("");

            if (iframe) {
                iframe.src = "/main/files/pages/emptytab.html";
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
