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