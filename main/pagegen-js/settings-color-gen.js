function getCurrentColorVal(varName) {
    if (localStorage.getItem(varName)) {
        return localStorage.getItem(varName);
    } else {
        return getComputedStyle(document.querySelector(':root')).getPropertyValue(varName);
    }
}

//create top level custom colors section
create_section(true, false, "Custom Colors", "", "top-ccolor-text", "sections-container", 0, "top-ccolor-section-items");

//create color sections
create_section(false, true, "Background", `Current: ${getCurrentColorVal('--background')}`, "background-text", "sections-container", 0, "background-section-items");
add_input(document.getElementById("background-section-items"), "backgroundcolor", "hex", "backgroundcolorset");
document.getElementById("backgroundcolorset").addEventListener("click", function () {
    setColor("--background", document.getElementById("backgroundcolor").value);
});
create_section(false, true, "Text", `Current: ${getCurrentColorVal('--text')}`, "text-text", "sections-container", 0, "text-section-items");
add_input(document.getElementById("text-section-items"), "textcolor", "hex", "textcolorset");
document.getElementById("textcolorset").addEventListener("click", function () {
    setColor("--text", document.getElementById("textcolor").value);
});
create_section(false, true, "Box shadows", `Current: ${getCurrentColorVal('--box-shadows')}`, "boxsha-text", "sections-container", 0, "boxsha-section-items");
add_input(document.getElementById("boxsha-section-items"), "boxshacolor", "hex", "boxshacolorset");
document.getElementById("boxshacolorset").addEventListener("click", function () {
    setColor("--box-shadows", document.getElementById("boxshacolor").value);
});
create_section(false, true, "Inputs", `Current: ${getCurrentColorVal('--inputs')}`, "inputs-text", "sections-container", 0, "inputs-section-items");
add_input(document.getElementById("inputs-section-items"), "inputscolor", "hex", "inputscolorset");
document.getElementById("inputscolorset").addEventListener("click", function () {
    setColor("--inputs", document.getElementById("inputscolor").value);
});
create_section(false, true, "Buttons", `Current: ${getCurrentColorVal('--buttons')}`, "buttons-text", "sections-container", 0, "buttons-section-items");
add_input(document.getElementById("buttons-section-items"), "buttonscolor", "hex", "buttonscolorset");
document.getElementById("buttonscolorset").addEventListener("click", function () {
    setColor("--buttons", document.getElementById("buttonscolor").value);
});
create_section(false, true, "Subheadings", `Current: ${getCurrentColorVal('--subheadings')}`, "subheadings-text", "sections-container", 0, "subheadings-section-items");
add_input(document.getElementById("subheadings-section-items"), "subheadingscolor", "hex", "subheadingscolorset");
document.getElementById("subheadingscolorset").addEventListener("click", function () {
    setColor("--subheadings", document.getElementById("subheadingscolor").value);
});
create_section(false, true, "Main layer 1", `Current: ${getCurrentColorVal('--layer-1')}`, "layer-1-text", "sections-container", 0, "layer-1-section-items");
add_input(document.getElementById("layer-1-section-items"), "layer-1color", "hex", "layer-1colorset");
document.getElementById("layer-1colorset").addEventListener("click", function () {
    setColor("--layer-1", document.getElementById("layer-1color").value);
});
create_section(false, true, "Main layer 2", `Current: ${getCurrentColorVal('--layer-2')}`, "layer-2-text", "sections-container", 0, "layer-2-section-items");
add_input(document.getElementById("layer-2-section-items"), "layer-2color", "hex", "layer-2colorset");
document.getElementById("layer-2colorset").addEventListener("click", function () {
    setColor("--layer-2", document.getElementById("layer-2color").value);
});
create_section(false, true, "Button border color", `Current: ${getCurrentColorVal('--button-border')}`, "button-border-text", "sections-container", 0, "button-border-section-items");
add_input(document.getElementById("button-border-section-items"), "button-bordercolor", "hex", "button-bordercolorset");
document.getElementById("button-bordercolorset").addEventListener("click", function () {
    setColor("--button-border", document.getElementById("button-bordercolor").value);
});
create_section(false, true, "Hover highlight border", `Current: ${getCurrentColorVal('--hover-border')}`, "hover-border-text", "sections-container", 0, "hover-border-section-items");
add_input(document.getElementById("hover-border-section-items"), "hover-bordercolor", "hex", "hover-bordercolorset");
document.getElementById("hover-bordercolorset").addEventListener("click", function () {
    setColor("--hover-border", document.getElementById("hover-bordercolor").value);
});
create_section(false, true, "Border color 1", `Current: ${getCurrentColorVal('--border-1')}`, "border-1-text", "sections-container", 0, "border-1-section-items");
add_input(document.getElementById("border-1-section-items"), "border-1color", "hex", "border-1colorset");
document.getElementById("border-1colorset").addEventListener("click", function () {
    setColor("--border-1", document.getElementById("border-1color").value);
});
create_section(false, true, "Border color 2", `Current: ${getCurrentColorVal('--border-2')}`, "border-2-text", "sections-container", 0, "border-2-section-items");
add_input(document.getElementById("border-2-section-items"), "border-2color", "hex", "border-2colorset");
document.getElementById("border-2colorset").addEventListener("click", function () {
    setColor("--border-2", document.getElementById("border-2color").value);
});
create_section(false, true, "Border color 3", `Current: ${getCurrentColorVal('--border-3')}`, "border-3-text", "sections-container", 0, "border-3-section-items");
add_input(document.getElementById("border-3-section-items"), "border-3color", "hex", "border-3colorset");
document.getElementById("border-3colorset").addEventListener("click", function () {
    setColor("--border-3", document.getElementById("border-3color").value);
});
create_section(false, true, "Border color 4", `Current: ${getCurrentColorVal('--border-4')}`, "border-4-text", "sections-container", 0, "border-4-section-items");
add_input(document.getElementById("border-4-section-items"), "border-4color", "hex", "border-4colorset");
document.getElementById("border-4colorset").addEventListener("click", function () {
    setColor("--border-4", document.getElementById("border-4color").value);
});
create_section(false, true, "Small text", `Current: ${getCurrentColorVal('--smalltext-1')}`, "smalltext-1-text", "sections-container", 0, "smalltext-1-section-items");
add_input(document.getElementById("smalltext-1-section-items"), "smalltext-1color", "hex", "smalltext-1colorset");
document.getElementById("smalltext-1colorset").addEventListener("click", function () {
    setColor("--smalltext-1", document.getElementById("smalltext-1color").value);
});
create_section(false, true, "Sections border", `Current: ${getCurrentColorVal('--sections-border')}`, "sections-border-text", "sections-container", 0, "sections-border-section-items");
add_input(document.getElementById("sections-border-section-items"), "sections-bordercolor", "hex", "sections-bordercolorset");
document.getElementById("sections-bordercolorset").addEventListener("click", function () {
    setColor("--sections-border", document.getElementById("sections-bordercolor").value);
});
create_section(false, true, "Section hover highlight", `Current: ${getCurrentColorVal('--sections-hover')}`, "sections-hover-text", "sections-container", 0, "sections-hover-section-items");
add_input(document.getElementById("sections-hover-section-items"), "sections-hovercolor", "hex", "sections-hovercolorset");
document.getElementById("sections-hovercolorset").addEventListener("click", function () {
    setColor("--sections-hover", document.getElementById("sections-hovercolor").value);
});
create_section(false, true, "Hover highlight 1", `Current: ${getCurrentColorVal('--hover-1')}`, "hover-1-text", "sections-container", 0, "hover-1-section-items");
add_input(document.getElementById("hover-1-section-items"), "hover-1color", "hex", "hover-1colorset");
document.getElementById("hover-1colorset").addEventListener("click", function () {
    setColor("--hover-1", document.getElementById("hover-1color").value);
});
create_section(false, true, "Hover highlight 2", `Current: ${getCurrentColorVal('--hover-2')}`, "hover-2-text", "sections-container", 0, "hover-2-section-items");
add_input(document.getElementById("hover-2-section-items"), "hover-2color", "hex", "hover-2colorset");
document.getElementById("hover-2colorset").addEventListener("click", function () {
    setColor("--hover-2", document.getElementById("hover-2color").value);
});
create_section(false, true, "Popup color", `Current: ${getCurrentColorVal('--popups')}`, "popups-text", "sections-container", 0, "popups-section-items");
add_input(document.getElementById("popups-section-items"), "popupscolor", "hex", "popupscolorset");
document.getElementById("popupscolorset").addEventListener("click", function () {
    setColor("--popups", document.getElementById("popupscolor").value);
});
create_section(false, true, "Popup buttons", `Current: ${getCurrentColorVal('--popups-button')}`, "popups-button-text", "sections-container", 0, "popups-button-section-items");
add_input(document.getElementById("popups-button-section-items"), "popups-buttoncolor", "hex", "popups-buttoncolorset");
document.getElementById("popups-buttoncolorset").addEventListener("click", function () {
    setColor("--popups", document.getElementById("popups-buttoncolor").value);
});
create_section(false, true, "Popup layer 1", `Current: ${getCurrentColorVal('--popups-layer-1')}`, "popups-layer-1-text", "sections-container", 0, "popups-layer-1-section-items");
add_input(document.getElementById("popups-layer-1-section-items"), "popups-layer-1color", "hex", "popups-layer-1colorset");
document.getElementById("popups-layer-1colorset").addEventListener("click", function () {
    setColor("--popups-layer-1", document.getElementById("popups-layer-1color").value);
});
create_section(false, true, "Navbar background", `Current: ${getCurrentColorVal('--nav-background')}`, "nav-background-text", "sections-container", 0, "nav-background-section-items");
add_input(document.getElementById("nav-background-section-items"), "nav-backgroundcolor", "hex", "nav-backgroundcolorset");
document.getElementById("nav-backgroundcolorset").addEventListener("click", function () {
    setColor("--nav-background", document.getElementById("nav-backgroundcolor").value);
});
create_section(false, true, "Navbar border", `Current: ${getCurrentColorVal('--nav-border')}`, "nav-border-text", "sections-container", 0, "nav-border-section-items");
add_input(document.getElementById("nav-border-section-items"), "nav-bordercolor", "hex", "nav-bordercolorset");
document.getElementById("nav-bordercolorset").addEventListener("click", function () {
    setColor("--nav-border", document.getElementById("nav-bordercolor").value);
});
create_section(false, true, "Navbar hover highlight", `Current: ${getCurrentColorVal('--nav-hover')}`, "nav-hover-text", "sections-container", 0, "nav-hover-section-items");
add_input(document.getElementById("nav-hover-section-items"), "nav-hovercolor", "hex", "nav-hovercolorset");
document.getElementById("nav-hovercolorset").addEventListener("click", function () {
    setColor("--nav-hover", document.getElementById("nav-hovercolor").value);
});
create_section(false, true, "Search page background", `Current: ${getCurrentColorVal('--search-background')}`, "search-background-text", "sections-container", 0, "search-background-section-items");
add_input(document.getElementById("search-background-section-items"), "search-backgroundcolor", "hex", "search-backgroundcolorset");
document.getElementById("search-backgroundcolorset").addEventListener("click", function () {
    setColor("--search-background", document.getElementById("search-backgroundcolor").value);
});
create_section(false, true, "Search page inputs", `Current: ${getCurrentColorVal('--search-input')}`, "search-input-text", "sections-container", 0, "search-input-section-items");
add_input(document.getElementById("search-input-section-items"), "search-inputcolor", "hex", "search-inputcolorset");
document.getElementById("search-inputcolorset").addEventListener("click", function () {
    setColor("--search-input", document.getElementById("search-inputcolor").value);
});
create_section(false, true, "Search page buttons 1", `Current: ${getCurrentColorVal('--search-button-1')}`, "search-button-1", "sections-container", 0, "search-button-1-section-items");
add_input(document.getElementById("search-button-1-section-items"), "search-button-1color", "hex", "search-button-1colorset");
document.getElementById("search-button-1colorset").addEventListener("click", function () {
    setColor("--search-button-1", document.getElementById("search-button-1color").value);
});
create_section(false, true, "Search page buttons 2", `Current: ${getCurrentColorVal('--search-button-2')}`, "search-button-2", "sections-container", 0, "search-button-2-section-items");
add_input(document.getElementById("search-button-2-section-items"), "search-button-2color", "hex", "search-button-2colorset");
document.getElementById("search-button-2colorset").addEventListener("click", function () {
    setColor("--search-button-2", document.getElementById("search-button-2color").value);
});
create_section(false, true, "Search page active tab", `Current: ${getCurrentColorVal('--search-tab-active')}`, "search-tab-active", "sections-container", 0, "search-tab-active-section-items");
add_input(document.getElementById("search-tab-active-section-items"), "search-tab-activecolor", "hex", "search-tab-activecolorset");
document.getElementById("search-tab-activecolorset").addEventListener("click", function () {
    setColor("--search-tab-active", document.getElementById("search-tab-activecolor").value);
});