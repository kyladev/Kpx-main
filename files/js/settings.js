function settitle() {
    var titleval = document.getElementById("cloakselect").value;
    alert("Setting cloak to " + titleval);
    switch (titleval) {
        case "Google Search":
            document.getElementById("ficon").setAttribute("href", "https://www.google.com/favicon.ico");
            document.title = "calculator - Google Search";
            localStorage.setItem('cloak', "calculator - Google Search");
            localStorage.setItem('ficon', "https://www.google.com/favicon.ico");
            break;
        case "Gmail":
            document.getElementById("ficon").setAttribute("href", "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico");
            document.title = "Inbox (12) - randomemail@gmail.com - Gmail";
            localStorage.setItem('cloak', "Inbox (12) - randomemail@gmail.com - Gmail");
            localStorage.setItem('ficon', "https://ssl.gstatic.com/ui/v1/icons/mail/rfr/gmail.ico");
            break;
        case "Google Doc":
            document.getElementById("ficon").setAttribute("href", "https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico");
            document.title = "Untitled Document - Google Documents";
            localStorage.setItem('cloak', "Untitled Document - Google Documents");
            localStorage.setItem('ficon', "https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico");
            break;
        case "Google Slides":
            document.getElementById("ficon").setAttribute("href", "https://workspace.google.com/static/favicon.ico?cache=4926369");
            document.title = "Untitled presentation - Google Slides";
            localStorage.setItem('cloak', "Untitled presentation - Google Slides");
            localStorage.setItem('ficon', "https://workspace.google.com/static/favicon.ico?cache=4926369");
            break;
        case "PowerPoint":
            document.getElementById("ficon").setAttribute("href", "https://res-1.cdn.office.net/officeonline/pods/s/h25FD28BFF140E152_resources/1033/FavIcon_Ppt.ico");
            document.title = "Presentation.pptx";
            localStorage.setItem('cloak', "Presentation.pptx");
            localStorage.setItem('ficon', "https://res-1.cdn.office.net/officeonline/pods/s/h25FD28BFF140E152_resources/1033/FavIcon_Ppt.ico");
            break;
        case "Google Drive":
            document.getElementById("ficon").setAttribute("href", "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
            document.title = "Home - Google Drive";
            localStorage.setItem('cloak', "Google Drive");
            localStorage.setItem('ficon', "https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png");
            break;
        case "OneDrive":
            document.getElementById("ficon").setAttribute("href", "https://onedrive.live.com/favicon.ico");
            document.title = "OneDrive";
            localStorage.setItem('cloak', "OneDrive");
            localStorage.setItem('ficon', "https://onedrive.live.com/favicon.ico");
            break;
        case "Wikipedia":
            document.getElementById("ficon").setAttribute("href", "https://en.wikipedia.org/favicon.ico");
            document.title = "Wikipedia";
            localStorage.setItem('cloak', "Wikipedia");
            localStorage.setItem('ficon', "https://en.wikipedia.org/favicon.ico");
            break;
        case "YouTube":
            document.getElementById("ficon").setAttribute("href", "https://www.youtube.com/s/desktop/eb72fb02/img/favicon.ico");
            document.title = "YouTube";
            localStorage.setItem('cloak', "YouTube");
            localStorage.setItem('ficon', "https://www.youtube.com/s/desktop/eb72fb02/img/favicon.ico");
            break;
        case "Clever":
            document.getElementById("ficon").setAttribute("href", "https://www.clever.com/favicon.ico");
            document.title = "Clever";
            localStorage.setItem('cloak', "Clever");
            localStorage.setItem('ficon', "https://www.clever.com/favicon.ico");
            break;
        case "Desmos":
            document.getElementById("ficon").setAttribute("href", "https://www.desmos.com/favicon.ico");
            document.title = "Desmos | Graphing Calculator";
            localStorage.setItem('cloak', "Desmos | Graphing Calculator");
            localStorage.setItem('ficon', "https://www.desmos.com/favicon.ico");
            break;
        case "Outlook":
            document.getElementById("ficon").setAttribute("href", "https://outlook.office365.com/favicon.ico");
            document.title = "Outlook";
            localStorage.setItem('cloak', "Outlook");
            localStorage.setItem('ficon', "https://outlook.office365.com/favicon.ico");
            break;
        case "Google Homepage":
            document.getElementById("ficon").setAttribute("href", "https://www.google.com/favicon.ico");
            document.title = "Google";
            localStorage.setItem('cloak', "Google");
            localStorage.setItem('ficon', "https://www.google.com/favicon.ico");
            break;
        case "Word":
            document.getElementById("ficon").setAttribute("href", "https://res.cdn.office.net/files/fabric-cdn-prod_20240610.001/assets/brand-icons/product/svg/word_16x1.svg");
            document.title = "Document.docx";
            localStorage.setItem('cloak', "Document.docx");
            localStorage.setItem('ficon', "https://res.cdn.office.net/files/fabric-cdn-prod_20240610.001/assets/brand-icons/product/svg/word_16x1.svg");
            break;
    }
}

document.getElementById("faviconchooser").addEventListener("change", function () {
    const file = this.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
            link = document.createElement("link");
            link.rel = "icon";
            document.head.appendChild(link);
        }
        localStorage.setItem("ficon", e.target.result);
        link.href = e.target.result;
    };

    reader.readAsDataURL(file); // Convert file to base64 URL
});

function handleunload() {
    evt.preventDefault();
    evt.returnValue = "are you sure you want to leave?";
    return evt.returnValue;
}

function handlecheckbox() {
    let box = document.getElementById("anticlosebox");
    if (box.checked) {
        localStorage.setItem("isanticlose", true);
        window.addEventListener("beforeunload", handleunload);
    }
    else {
        localStorage.setItem("isanticlose", false);
        window.removeEventListener("beforeunload", handleunload);
    }
}

function settitlecustom() {
    if (document.getElementById("titlechooser").value != "") {
        document.title = document.getElementById("titlechooser").value;
        localStorage.setItem('cloak', document.getElementById("titlechooser").value);
    }
    else {
        alert("No title entered");
    }
}
function setpanicsite() {
    if (document.getElementById("cpanicselector").value != "") {
        localStorage.setItem('panicsite', document.getElementById("cpanicselector").value);
    }
    else {
        localStorage.setItem('panicsite', document.getElementById("panicselector").value);
    }
}

let listening = false;

function listenforkey() {
    document.onkeydown = function (evt) {
        localStorage.setItem('panickey', evt.key);
        document.getElementById("currentkey").innerText = evt.key;
        document.onkeydown = null;
    }
    DelayNode(5000);
    document.location.reload();
}

function dataclear() {
    localStorage.clear();
    sessionStorage.clear();

    alert("Cookies successfully deleted!");
}

function blankpage() {
    win1 = window.open();
    win1.document.body.style.margin = '0';
    win1.document.body.style.height = '100%';
    let iframe = win1.document.createElement('iframe');
    iframe.style.border = 'none';
    iframe.style.height = '100%';
    iframe.style.width = '100%';
    iframe.style.margin = '0';
    iframe.src = window.location.href;
    iframe.addEventListener('load', () => {
        const iframeDoc = iframe.contentDocument;
        const script = iframeDoc.createElement("script");
        script.textContent = 'let sessionTimeout = 1;let loginDuration = new Date();loginDuration.setTime(loginDuration.getTime() + (sessionTimeout * 60 * 60 * 1000));document.cookie = "Session=Valid; expires=" + loginDuration.toGMTString() + ";'
        iframeDoc.documentElement.appendChild(script);
    });
    win1.document.body.appendChild(iframe);
}

function createdatalink(htmlContent) {
    const encodedHtml = encodeURIComponent(htmlContent);
    const dataUrl = `data:text/html;charset=utf-8,${encodedHtml}`;
    return dataUrl;
}
function makefinallink() {
    link = window.location;

    let txt = `
    <!DOCTYPE html>
    <html>
        <body style="margin:0px;height:100%;width:100%;">
            <iframe src="${link}" style="height:100%;width:100%;margin:0px;border:none;">
        </body>
    </html>
    `;
    document.getElementById("datalinkcontainer").value = createdatalink(txt);
    document.getElementById("datalinkpopup").style.visibility = "visible";
    document.getElementById("exitbutton").addEventListener("click", function () {
        document.getElementById("datalinkpopup").style.visibility = "hidden";
    });
}

function copytext() {
    let copyText = document.getElementById("datalinkcontainer");

    copyText.select();
    copyText.setSelectionRange(0, 99999);

    navigator.clipboard.writeText(copyText.value);
}

console.log(document.body.getHTML);

function backgroundcolorset() {
    let css = document.createElement("style");
    let color = document.getElementById("backgroundcolor").value;
    css.textContent = `
        body {
         background-color: ${color} !important;
        }
         .fa-solid:hover {
            color: ${color} !important;
        }
        #cloakselect {
            background-color: ${color} !important;
        }
        .botselect {
            background-color: ${color} !important;
        }
        #panicselector {
            background-color: ${color} !important;
        }
        #cookieclear {
            background-color: ${color} !important;
        }
        .setbutton {
            background-color: ${color} !important;
        }
        #faviconchooser {
            background-color: ${color} !important;
        }
        .titlechooser {
            background-color: ${color} !important;
        }
        #cpanicselector {
            background-color: ${color} !important;
        }
        #filetitleconfirm {
            background-color: ${color} !important;
        }
        #urlInput {
            background-color: ${color} !important;
        }
        #searchbar {
            background-color: ${color} !important;
        }
        .colorinput {
            background-color: ${color} !important;
        }
        `;
    localStorage.setItem("background", css.textContent);
    document.head.appendChild(css.cloneNode(true));
}
function secondarycolorset() {
    let css = document.createElement("style");
    let color = document.getElementById("secondarycolor").value;
    css.textContent = `
        .nav {
            background-color: ${color} !important;
        }
        #searchbar:focus {
            outline: 4px ${color} !important;
            border: 2px solid ${color} !important;
            box-shadow: 0 0 8px ${color} !important;
        }
        #searchbar {
            border: 2px solid ${color} !important;
        } 
        .shortcut {
            background: ${color} !important;
        }
        .shortcut:hover {
        background-color: ${color} !important;
        }
        .doccontainer {
            background-color: ${color} !important;
        }
        .sections {
            background-color: ${color} !important;
        }
        `;
    localStorage.setItem("secondary", css.textContent);
    document.head.appendChild(css.cloneNode(true));
}
function tertiarycolorset() {
    let css = document.createElement("style");
    let color = document.getElementById("backgroundcolor").value;
    css.textContent = `
    .navbar { 
        background-color: ${color} !important;
    }
    .shortcut:hover {
        background-color: ${color} !important;
    }
    .titlechooser {
        border: 0px solid ${color} !important;
    }
    .titlechooser:focus {
        outline:4px ${color} !important;
        border:0px solid ${color} !important;
    }
    .colorinput {
        border: 0px solid ${color} !important;
    }
    .colorinput:focus {
        outline:4px ${color} !important;
        border:0px solid ${color} !important;
    }
    `;
    localStorage.setItem("tertiary", css.textContent);
    document.head.appendChild(css.cloneNode(true));
}
function textcolorset() {
    let css = document.createElement("style");
    let color = document.getElementById("textcolor").value;
    css.textContent = `
    .menu-icon {
        color: ${color} !important;
    }
    body {
        color: ${color} !important;
    }
    .menu-icon {
        color: ${color} !important;
    }
    .fa-solid {
        color:${color} !important;
    }
    .siteicon:hover {
        box-shadow: 0 0 0 4px ${color} !important;
    }
    .gameicon:hover {
        box-shadow: 0 0 0 4px ${color} !important;
    }
    .gamewindow {
        color: ${color} !important;
    }
    #webname {
        color: ${color} !important;
    }
    #searchbar {
        color: ${color} !important;
    }
    #shortc {
        color: ${color} !important;
    }
    .shortcut {
        color: ${color} !important;
    }
    #urlInput {
        color: ${color} !important;
    }
    .slider:before {
        background-color: ${color} !important;
    }
    .slider {
        background-color: ${color} !important;
    }
    #cloakselect {
        order-color: ${color} !important;
        color: ${color} !important;
    }
    #cloakselect:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    .botselect {
        order-color: ${color} !important;
        color: ${color} !important;
    }
    .botselect:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    #panicselector {
        border-color: ${color} !important;
        color: ${color} !important;
    }
    panicselector:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
        }
    #cookieclear {
        color:${color} !important;
    }
    .setbutton {
        color: ${color} !important;
    }
    .setbutton:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    #faviconchooser {
        color: ${color} !important;
    }
    .titlechooser {
        color: ${color} !important;
    }
    .titlechooser:focus {
        box-shadow: 0 0 8px ${color} !important;
    }
    .colorinput:focus {
        box-shadow: 0 0 8px ${color} !important;
    }
    #cpanicselector {
        color: ${color} !important;
    }
    #cpanicselector:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    #filetitleconfirm {
        color: ${color} !important;
    }
    #filetitleconfirm:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    .colorinput:hover {
        box-shadow: 0 0 8px ${color} !important;
    }
    .colorinput {
        color: ${color} !important;
    }
    a:link {
        color: ${color} !important;
        }

    a:visited {
        color: ${color} !important;
    }
    .nav-links a {
        color: ${color} !important;
    }
    `;
    localStorage.setItem("text", css.textContent);
    document.head.appendChild(css.cloneNode(true));
}
function btextcolorset() {
    let color = document.getElementById("b-textcolor").value;
    localStorage.setItem("b-text", color);
}
function bbackgroundcolorset() {
    let color = document.getElementById("b-backgroundcolor").value;
    csstext = `
    body {
        background-color: ${color} !important;
    }
    #addtab {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-background", color);
}
function bsecondarycolorset() {
    let color = document.getElementById("b-secondarycolor").value;
    csstext = `
    #searchbox {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-secondary", color);
}
function btertiarycolorset() {
    let color = document.getElementById("b-tertiarycolor").value;
    csstext = `
    #urlInput {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-tertiary", color);
}
function bquartarycolorset() {
    let color = document.getElementById("b-quartarycolor").value;
    csstext = `
    .tabactive, .tabs {
        background-color: ${color} !important;
    }
    #addtab:hover {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-quartary", color);
}
function bquinarycolorset() {
    let color = document.getElementById("b-quinarycolor").value;
    csstext = `
    .tabactive {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-quinary", color);
}
function bsenarycolorset() {
    let color = document.getElementById("b-senarycolor").value;
    csstext = `
    .tabs:hover {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("b-senary", color);
}