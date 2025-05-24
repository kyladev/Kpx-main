function return_default_storage(key) {
    if (key === "p-amount") {
        return 120;
    }
    else if (key === "p-color") {
        return "#ffffff";
    }
    else if (key === "p-sidecount") {
        return 3;
    }
    else if (key === "p-opacity") {
        return 0.4419296542689612;
    }
    else if (key === "p-opacity-r") {
        return false;
    }
    else if (key === "p-opacity-m") {
        return 0.1;
    }
    else if (key === "p-size") {
        return 3;
    }
    else if (key === "p-size-r") {
        return true;
    }
    else if (key === "p-link") {
        return false;
    }
    else if (key === "p-link-d") {
        return 150;
    }
    else if (key === "p-link-c") {
        return "#ffffff";
    }
    else if (key === "p-speed") {
        return 1.5;
    }
    else if (key === "p-direction") {
        return "bottom";
    }
    else if (key === "p-movement") {
        return "random";
    }
    else if (key === "p-bounce") {
        return false;
    }
}
function choose_optionload_particles(key) {
    if (!localStorage.getItem(key)) {
        return return_default_storage(key);
    }
    else {
        return localStorage.getItem(key);
    }
}
function reload_current() {
    document.getElementById("particle-amount-text").textContent = "Current: " + choose_optionload_particles("p-amount");
    document.getElementById("color-text").textContent = "Current: " + choose_optionload_particles("p-color");
    document.getElementById("speed-text").textContent = "Current: " + choose_optionload_particles("p-speed");
    document.getElementById("direction-text").textContent = "Current: " + choose_optionload_particles("p-direction");
    document.getElementById("movement-text").textContent = "Current: " + choose_optionload_particles("p-movement");
    document.getElementById("bounce-text").textContent = "Current: " + choose_optionload_particles("p-bounce");
    document.getElementById("shape-text").textContent = "For polygon and star, side count can be set; Current: " + choose_optionload_particles("p-shape");
    document.getElementById("sidecount-text").textContent = "Current: " + choose_optionload_particles("p-sidecount");
    document.getElementById("size-text").textContent = "Current: " + choose_optionload_particles("p-size");
    document.getElementById("random-text").textContent = "Current: " + choose_optionload_particles("p-size-r");
    document.getElementById("link-text").textContent = "Current: " + choose_optionload_particles("p-link");
    document.getElementById("linkd-text").textContent = "Current: " + choose_optionload_particles("p-link-d");
    document.getElementById("linkc-text").textContent = "Current: " + choose_optionload_particles("p-link-c");
    document.getElementById("opac-text").textContent = "Current: " + choose_optionload_particles("p-opacity");
    document.getElementById("randomp-text").textContent = "Current: " + choose_optionload_particles("p-opacity-m") + ", " + choose_optionload_particles("p-opacity-r");
}
function add_listeners() {
    document.getElementById("particle-amount-set").addEventListener("click", reload_current);
    document.getElementById("particle-color-set").addEventListener("click", reload_current);
    document.getElementById("particle-speed-set").addEventListener("click", reload_current);
    document.getElementById("particle-direction-set").addEventListener("click", reload_current);
    document.getElementById("particle-movement-set").addEventListener("click", reload_current);
    document.getElementById("particle-bounce-set").addEventListener("click", reload_current);
    document.getElementById("particle-shape-set").addEventListener("click", reload_current);
    document.getElementById("particle-sidecount-set").addEventListener("click", reload_current);
    document.getElementById("particle-size-set").addEventListener("click", reload_current);
    document.getElementById("particle-size-random-set").addEventListener("click", reload_current);
    document.getElementById("particle-link-set").addEventListener("click", reload_current);
    document.getElementById("particle-link-distance-set").addEventListener("click", reload_current);
    document.getElementById("particle-link-color-set").addEventListener("click", reload_current);
    document.getElementById("particle-opacity-set").addEventListener("click", reload_current);
    document.getElementById("particle-opacity-random-set").addEventListener("click", reload_current);
}