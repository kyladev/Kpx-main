let tabcount = 0;

function addtab(first) {
    let tab = document.createElement("div");
    let close = document.createElement("div");
    let span = document.createElement("span");
    const params = new URLSearchParams(window.location.search);

    if (first === true) {
        tab.classList.add("tabactive");
    } else {
        tab.classList.add("tabs");
    }

    close.classList.add("closebutton");
    span.classList.add("tabtitle");

    span.innerText = "New Tab";
    close.innerText = "x";

    close.onclick = function () {
        closetab(this);
    };

    tab.onclick = function (el) {
        changetab(el.currentTarget);
    };

    // Initialize tab history
    tab.history = [];

    if (first === true) {
        const initialUrl = params.get("q") || "";
        tab.dataset.url = initialUrl;
        if (initialUrl !== "") {
            tab.history.push(initialUrl);
        } else {
            document.getElementById("uv-frame").src = "/files/pages/emptytab.html";
            document.getElementById("uv-frame").contentDocument.window?.reload?.();
        }
    } else {
        tab.dataset.url = "";
    }

    tab.appendChild(span);
    tab.appendChild(close);

    const container = document.getElementById("browsertabs");
    if (container) {
        container.appendChild(tab);
    } else {
        console.error("Element with ID 'browsertabs' not found.");
    }

    changetab(tab);
    tabcount++;
}

function closetab(button) {
    const tab = button.parentElement;
    const container = document.getElementById("browsertabs");

    const isActive = tab.classList.contains("tabactive");

    // Get tab number before removal
    const tabs = Array.from(container.children);
    const index = tabs.indexOf(tab);

    if (tabcount <= 1) {
        alert("Can't close the last tab.");
        return;
    }

    tab.remove();
    tabcount--;

    if (isActive) {
        // Get remaining tabs
        const remainingTabs = Array.from(container.children);
        const newIndex = index - 1 >= 0 ? index - 1 : 0;
        const nextTab = remainingTabs[newIndex];

        if (nextTab) {
            changetab(nextTab);
        }
    }
}

function changetab(currentTarget) {
    const currentactive = document.getElementsByClassName("tabactive")[0];

    if (currentactive) {
        currentactive.classList.remove("tabactive");
        currentactive.classList.add("tabs");
    }

    currentTarget.classList.remove("tabs");
    currentTarget.classList.add("tabactive");

    const url = currentTarget.dataset.url;
    const searchbar = document.getElementById("uv-address");

    if (!url) {
        document.getElementById("uv-frame").src = "/files/pages/emptytab.html";
        searchbar.value = "";
        return;
    } else {
        searchbar.value = url;
    }

    // Add URL to history if it's different from the last
    if (!currentTarget.history) currentTarget.history = [];
    const history = currentTarget.history;
    if (history.length === 0 || history[history.length - 1] !== url) {
        history.push(url);
    }

    document.getElementById("uv-address").value = url;

    document.getElementById("searchButton").click();
}

document.getElementById("searchButton").addEventListener("click", function () {
    const activeTab = document.querySelector(".tabactive");
    const searchbar = document.getElementById("uv-address");
    const newUrl = searchbar.value.trim();

    if (!activeTab) return;

    // Only update if the URL is non-empty
    if (newUrl) {
        // Update the tab's dataset
        activeTab.dataset.url = newUrl;

        // Ensure history array exists
        if (!activeTab.history) activeTab.history = [];

        // Avoid duplicate entries
        const last = activeTab.history[activeTab.history.length - 1];
        if (last !== newUrl) {
            activeTab.history.push(newUrl);
        }

        // Load URL in iframe
        //document.getElementById("uv-frame").src = __uv$config.prefix + __uv$config.encodeUrl(newUrl);
    } else {
        // If empty, reset to blank tab
        activeTab.dataset.url = "";
        if (!activeTab.history) activeTab.history = [];
        activeTab.history.push("");

        document.getElementById("uv-frame").src = "/files/pages/emptytab.html";
    }
});

function traverse_history(tab, direction) {
    if (direction === "forward") {

    }
    else if (direction === "back") {
        const history_count = tab.history.length;
        if (history_count < 2) {
            console.log("no previous history, back button ignored.")
            return;
        }
        tab.dataset.url = tab.history[history_count - 2];
        document.getElementById("searchButton").click();
    }
    else {
        console.log("error with tab history");
    }
}