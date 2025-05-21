let tabcount = 0;
function addtab(first) {
    let tab = document.createElement("div");
    let close = document.createElement("div");
    let span = document.createElement("span");
    const params = new URLSearchParams(window.location.search);
    if (first === true) {
        tab.classList.add("tabactive");
    }
    else {
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

    if (first === true) {
        tab.dataset.url = params.get("q");
        if (tab.dataset.url === '') {
            document.getElementById("iframeWindow").src = "/frontend-files/pages/emptytab.html";
            document.getElementById("iframeWindow").contentDocument.window.reload();
        }
    }
    else {
        tab.dataset.url = ``;
    }

    tab.appendChild(span);
    tab.appendChild(close);

    if (tabcount > 0) {

    }


    const container = document.getElementById("browsertabs");
    if (container) {
        container.appendChild(tab);
    } else {
        console.error("Element with ID 'browsertabs' not found.");
    }

    changetab(tab)
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

        // Get tab to the left (index - 1)
        const newIndex = index - 1 >= 0 ? index - 1 : 0;
        const nextTab = remainingTabs[newIndex];

        if (nextTab.classList = "tabactive") {

        }

        else if (nextTab) {
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
    const searchbar = document.getElementById("urlInput");

    if (!url) {
        document.getElementById("iframeWindow").src = "/frontend-files/pages/emptytab.html";
        searchbar.value = "";
        return;
    }
    else {
        searchbar.value = url;
    }

    document.getElementById("iframeWindow").src = url;

    document.getElementById("searchButton").click();
}
