function backgroundcolorset() {
    //default is #202020
    const color = document.getElementById("backgroundcolor").value;
    const csstext = `
    body {
        background-color: ${color} !important;
    }
    input {
        background-color: ${color} !important;
    }
    #faviconchooser {
        background-color: ${color} !important;
    }
    select {
        background-color: ${color} !important;
    }
    button {
        background-color: ${color} !important;
    }
    #searchbar {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("background", csstext);
    update_background_style();
}
function secondarycolorset() {
    //default is #303030
    const color = document.getElementById("secondarycolor").value;
    const csstext = `
    .sections-container {
        background-color: ${color} !important; 
    }
    #buttons-container {
        background-color: ${color} !important;
    }
    .container {
        background-color: ${color} !important;
    }
    #searchbar {
          box-shadow: 0 0 4px ${color} !important;
    }
    #searchbar:focus {
        background-color: ${color} !important;
    }
    .shortcut {
        background: ${color} !important;
    }
    .navbar {
        background-color: ${color} !important;
    }
    #siteicons {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("secondary", csstext);
    update_secondary_style();
}
function tertiarycolorset() {
    //default is #404040
    const color = document.getElementById("backgroundcolor").value;
    const csstext = `
    .shortcut {
        border: ${color} 2px solid !important;
    }
    .subheading {
        color: ${color} !important;
    }
    .navbar {
        border: ${color} 2px solid !important;
    }
    .siteicons-header {
        background-color: ${color} !important;
    }
    .siteicon-container {
        background-color: ${color} !important;
    }
    `;
    localStorage.setItem("tertiary", csstext);
    update_tertiary_style();
}
function textcolorset() {
    const color = document.getElementById("textcolor").value;
    const csstext = `
    
    `;
    localStorage.setItem("text", csstext);
    update_text_style();
}


//working on these functions, they are for the search page
function btextcolorset() {
    let color = document.getElementById("b-textcolor").value;
    localStorage.setItem("b-text", color);
}
function bbackgroundcolorset() {
    let color = document.getElementById("b-backgroundcolor").value;
    csstext = `

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