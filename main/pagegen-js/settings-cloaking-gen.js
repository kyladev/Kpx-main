create_section(false, false, "Tab Cloak", "Changes the appearance of your tab", "", "sections-container", 0, "cloak-section-items");
add_select_body(document.getElementById("cloak-section-items"), "cloakselect", "cloakset");
add_select_option(document.getElementById("cloakselect"), "Google Search", "Google Search");
add_select_option(document.getElementById("cloakselect"), "Gmail", "Gmail");
add_select_option(document.getElementById("cloakselect"), "Google Docs", "Google Docs");
add_select_option(document.getElementById("cloakselect"), "Google Slides", "Google Slides");
add_select_option(document.getElementById("cloakselect"), "PowerPoint", "PowerPoint");
add_select_option(document.getElementById("cloakselect"), "Google Drive", "Google Drive");
add_select_option(document.getElementById("cloakselect"), "OneDrive", "OneDrive");
add_select_option(document.getElementById("cloakselect"), "Wikipedia", "Wikipedia");
add_select_option(document.getElementById("cloakselect"), "YouTube", "YouTube");
add_select_option(document.getElementById("cloakselect"), "Clever", "Clever");
add_select_option(document.getElementById("cloakselect"), "Desmos", "Desmos");
add_select_option(document.getElementById("cloakselect"), "Outlook", "Outlook");
add_select_option(document.getElementById("cloakselect"), "Google Homepage", "Google Homepage");
add_select_option(document.getElementById("cloakselect"), "Word", "Word");
document.getElementById("cloakset").addEventListener("click", function () {
    settitle();
});

create_section(false, false, "Clear local storage", "", "", "sections-container", 0, "clear-storage-container");
add_button(document.getElementById("clear-storage-container"), "clear-storage-button");
document.getElementById("clear-storage-button").innerText = "Clear";
document.getElementById("clear-storage-button").addEventListener("click", function () {
    clear_cookies();
});

create_section(false, false, "Custom favicon", "Changes the favicon (the small image) of the tab.", "", "sections-container", 0, "favicon-input-container");
const faviconInput = document.createElement("input");
faviconInput.id = "faviconchooser";
faviconInput.type = "file";
faviconInput.accept = "image/*";
document.getElementById("favicon-input-container").appendChild(faviconInput);

create_section(false, false, "Custom tab name", "Enter your own tab name to appear.", "", "sections-container", 0, "tabname-input-container");
add_input(document.getElementById("tabname-input-container"), "titlechooser", "text", "filetitleconfirm");
document.getElementById("filetitleconfirm").addEventListener("click", function () {
    settitlecustom();
});

create_section(false, false, "about:blank tab", "Opens this site in an 'about:blank' tab.", "", "sections-container", 0, "blankopener-container");
add_button(document.getElementById("blankopener-container"), "blankopener");
document.getElementById("blankopener").innerText = "Open";
document.getElementById("blankopener").addEventListener("click", function () {
    blankpage();
});

create_section(false, false, "Datalink tab", "Provides a datalink to paste into the URL to access this site.", "", "sections-container", 0, "datalink-container");
add_button(document.getElementById("datalink-container"), "datalinkbutton");
document.getElementById("datalinkbutton").innerText = "Generate";
document.getElementById("datalinkbutton").addEventListener("click", function () {
    makefinallink();
});

// create_section(false, false, "Open in file", "Appears offline with full functionality, open the file in your browser.", "", "sections-container", 0, "fileopen-container");
// const filelink = document.createElement("a");
// const filebutton = document.createElement("button");
// filelink.href = "/main/files/pages/misc/iframe-download.html";
// filelink.download = "kpx-file";
// filebutton.innerText = "Download";
// filelink.appendChild(filebutton);
// document.getElementById("fileopen-container").appendChild(filelink);

create_section(false, false, "Panic site", "The site to redirect to when your panic key is", "", "sections-container", 0, "panicsite-container");
add_input(document.getElementById("panicsite-container"), "cpanicselector", "text", "panicconfirm");
document.getElementById("panicconfirm").addEventListener("click", function () {
    setpanicsite();
});

create_section(false, false, "Panic key", "[PLACEHOLDER]", "keyText", "sections-container", 0, "panickey-container");
document.getElementById("keyText").innerHTML = "Current Key: <kbd id='currentkey'>`</kbd> (Note: reload the page for changes to take effect)";
add_button(document.getElementById("panickey-container"), "keysetter");
document.getElementById("keysetter").addEventListener("click", function () {
    listenforkey();
});

if (localStorage.getItem("panickey") === null) {
    localStorage.setAttribute("panickey", "Esc");
}
document.getElementById("currentkey").innerText = localStorage.getItem('panickey');