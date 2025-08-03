//create reload section
create_section(false, false, "Reload Particles", "", "", "sections-container", 0, "reload-section-items");
add_button(document.getElementById("reload-section-items"), "reload-section-button");
document.getElementById("reload-section-button").addEventListener("click", function () {
    reload_current();
    setparticleoptions();
});

//create particle amount section
create_section(false, false, "Particle amount", "Current: 120", "particle-amount-text", "sections-container", 0, "amount-section-items");
add_input(document.getElementById("amount-section-items"), "particle-amount-input", "number", "particle-amount-set");
document.getElementById("particle-amount-set").addEventListener("click", function () {
    particleamountset(false);
});

//create particle color section
create_section(false, false, "Particle color", "Current: #ffffff", "color-text", "sections-container", 0, "color-section-items");
add_input(document.getElementById("color-section-items"), "particle-color-input", "hex", "particle-color-set");
document.getElementById("particle-color-set").addEventListener("click", function () {
    particlecolorset(false);
});

//create particle speed section
create_section(false, false, "Particle speed", "Current: 1.5", "speed-text", "sections-container", 0, "speed-section-items");
add_input(document.getElementById("speed-section-items"), "particle-speed-input", "number", "particle-speed-set");
document.getElementById("particle-speed-set").addEventListener("click", function () {
    particlespeedset(false);
});

//create particle direction section
create_section(false, false, "Particle direction", "Current: bottom", "direction-text", "sections-container", 0, "direction-section-items");
add_select_body(document.getElementById("direction-section-items"), "particle-direction-select", "particle-direction-set");
add_select_option(document.getElementById("particle-direction-select"), "bottom", "Bottom");
add_select_option(document.getElementById("particle-direction-select"), "top", "Top");
add_select_option(document.getElementById("particle-direction-select"), "right", "Right");
add_select_option(document.getElementById("particle-direction-select"), "left", "Left");
add_select_option(document.getElementById("particle-direction-select"), "top-right", "Top-right");
add_select_option(document.getElementById("particle-direction-select"), "top-left", "Top-left");
add_select_option(document.getElementById("particle-direction-select"), "bottom-right", "Bottom-right");
add_select_option(document.getElementById("particle-direction-select"), "bottom-left", "Bottom-left");
document.getElementById("particle-direction-set").addEventListener("click", function () {
    particledirectionset(false);
});

//create particle movement section
create_section(false, false, "Particle movement", "Current: random", "movement-text", "sections-container", 0, "movement-section-items");
add_select_body(document.getElementById("movement-section-items"), "particle-movement-select", "particle-movement-set");
add_select_option(document.getElementById("particle-movement-select"), "random", "Random");
add_select_option(document.getElementById("particle-movement-select"), "straight", "Straight");
document.getElementById("particle-movement-set").addEventListener("click", function () {
    particlemovementset(false);
});

//create particle bounce section
create_section(false, false, "Particle bounce", "Current: false", "bounce-text", "sections-container", 0, "bounce-section-items");
add_select_body(document.getElementById("bounce-section-items"), "particle-bounce-select", "particle-bounce-set");
add_select_option(document.getElementById("particle-bounce-select"), "false", "False");
add_select_option(document.getElementById("particle-bounce-select"), "true", "True");
document.getElementById("particle-bounce-set").addEventListener("click", function () {
    particlebounceset(false);
});

//create particle shape top level section
create_section(true, false, "Particle shape", "", "top-shape-text", "sections-container", 0, "top-shape-section-items");

//create particle shape subsection
create_section(false, true, "Particle shape", "For polygon and star, side count can be set; Current: circle", "shape-text", "sections-container", 0, "shape-section-items");
add_select_body(document.getElementById("shape-section-items"), "particle-shape-select", "particle-shape-set");
add_select_option(document.getElementById("particle-shape-select"), "circle", "Circle");
add_select_option(document.getElementById("particle-shape-select"), "edge", "Edge");
add_select_option(document.getElementById("particle-shape-select"), "triangle", "Triangle");
add_select_option(document.getElementById("particle-shape-select"), "polygon", "Polygon");
add_select_option(document.getElementById("particle-shape-select"), "star", "Star");
document.getElementById("particle-shape-set").addEventListener("click", function () {
    particleshapeset(false);
});

//create particle shape sidecount subsection
create_section(false, true, "Shape side count", "Current: 3", "sidecount-text", "sections-container", 0, "sidecount-section-items");
add_input(document.getElementById("sidecount-section-items"), "particle-sidecount-input", "number", "particle-sidecount-set");
document.getElementById("particle-sidecount-set").addEventListener("click", function () {
    particlesidecountset(false);
});

//create particle size level section
create_section(true, false, "Particle size", "", "top-size-text", "sections-container", 0, "top-size-section-items");

//create particle size subsection
create_section(false, true, "Particle size", "Current: 3", "size-text", "sections-container", 0, "size-section-items");
add_input(document.getElementById("size-section-items"), "particle-size-input", "number", "particle-size-set");
document.getElementById("particle-size-set").addEventListener("click", function () {
    particlesizeset(false);
});

//create particle size randomness subsection
create_section(false, true, "Randomness", "Current: true", "random-text", "sections-container", 0, "random-section-items");
add_select_body(document.getElementById("random-section-items"), "particle-size-random-select", "particle-size-random-set");
add_select_option(document.getElementById("particle-size-random-select"), "true", "True");
add_select_option(document.getElementById("particle-size-random-select"), "false", "False");
document.getElementById("particle-size-random-set").addEventListener("click", function () {
    particlesizerandomset(false);
});

//create top level particle link section
create_section(true, false, "Linked particles", "", "top-link-text", "sections-container", 0, "top-link-section-items");

//create particle links subsection
create_section(false, true, "Link particles", "Current: false", "link-text", "sections-container", 0, "link-section-items");
add_select_body(document.getElementById("link-section-items"), "particle-link-select", "particle-link-set");
add_select_option(document.getElementById("particle-link-select"), "false", "False");
add_select_option(document.getElementById("particle-link-select"), "True", "True");
document.getElementById("particle-link-set").addEventListener("click", function () {
    particlelinkedset(false);
});

//create particle link distance subsection
create_section(false, true, "Link distance", "Current: 150", "linkd-text", "sections-container", 0, "linkd-section-items");
add_input(document.getElementById("linkd-section-items"), "particle-linkd-input", "number", "particle-linkd-set");
document.getElementById("particle-linkd-set").addEventListener("click", function () {
    particlelinkeddistset(false);
});

//create particle link color subsection
create_section(false, true, "Link color", "Current: #ffffff", "linkc-text", "sections-container", 0, "linkc-section-items");
add_input(document.getElementById("linkc-section-items"), "particle-linkc-input", "hex", "particle-linkc-set");
document.getElementById("particle-linkc-set").addEventListener("click", function () {
    particlelinkedcolorset(false);
});

//create top level opacity section
create_section(true, false, "Particle opacity", "", "top-opac-text", "sections-container", 0, "top-opac-section-items");

//create particle opacity subsection
create_section(false, true, "Particle opacity", "Current: 0.4419296542689612", "opac-text", "sections-container", 0, "opac-section-items");
add_input(document.getElementById("opac-section-items"), "particle-opac-input", "number", "particle-opac-set");
document.getElementById("particle-opac-set").addEventListener("click", function () {
    particleopacityset(false);
});

//create particle opacity randomness subsection
create_section(false, true, "Randomness", "Current: 0.1, false", "randomp-text", "sections-container", 0, "randomp-section-items");
add_input(document.getElementById("randomp-section-items"), "particle-opacity-min-input", "number", "particle-randomp-temp-set");
add_select_body(document.getElementById("randomp-section-items"), "particle-opacity-random-select", "particle-opacity-random-set");
add_select_option(document.getElementById("particle-opacity-random-select"), "false", "False");
add_select_option(document.getElementById("particle-opacity-random-select"), "True", "True");
document.getElementById("particle-opacity-random-set").addEventListener("click", function () {
    particleopacityrandomset(false);
});
document.getElementById("particle-randomp-temp-set").remove();