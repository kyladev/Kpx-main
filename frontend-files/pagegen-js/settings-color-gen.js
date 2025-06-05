//create top level custom colors section
create_section(true, false, "Custom Colors", "", "top-ccolor-text", "sections-container", 0, "top-ccolor-section-items");

//create background color section
create_section(false, true, "Background Color", "Current: #202020", "background-text", "sections-container", 0, "background-section-items");
add_input(document.getElementById("background-section-items"), "backgroundcolor", "hex", "backgroundcolorset");
document.getElementById("backgroundcolorset").addEventListener("click", function () {
    backgroundcolorset();
});

//create secondary color section
create_section(false, true, "Secondary Color", "Current: [placeholder]", "secondary-text", "sections-container", 0, "secondary-section-items");
add_input(document.getElementById("secondary-section-items"), "secondarycolor", "hex", "secondarycolorset");
document.getElementById("secondarycolorset").addEventListener("click", function () {
    secondarycolorset();
});

//create tertiary color section
create_section(false, true, "Tertiary Color", "Current: [placeholder]", "tertiary-text", "sections-container", 0, "tertiary-section-items");
add_input(document.getElementById("tertiary-section-items"), "tertiarycolor", "hex", "tertiarycolorset");
document.getElementById("tertiarycolorset").addEventListener("click", function () {
    tertiarycolorset();
});

//create text color section
create_section(false, true, "Text Color", "Current: #ffffff", "textcolor-text", "sections-container", 0, "textcolor-section-items");
add_input(document.getElementById("textcolor-section-items"), "textcolorcolor", "hex", "textcolorset");
document.getElementById("textcolorset").addEventListener("click", function () {
    textcolorset();
});