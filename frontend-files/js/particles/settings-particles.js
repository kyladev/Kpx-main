let d;
let c;
let s;
let n;
let straight;
let link_b;
let op_b;
let s_b;
let b_b;
let m_b;

function setparticleoptions() {
    if (!localStorage.getItem("p-movement")) {
        straight = false;
    }
    else if (localStorage.getItem("p-movement") === "true") {
        straight = true;
    }
    else {
        straight = false;
    }
    if (!localStorage.getItem("p-link")) {
        link_b = false;
    }
    else if (localStorage.getItem("p-link") === "true") {
        link_b = true;
    }
    else {
        link_b = false;
    }
    if (!localStorage.getItem("p-opacity-r")) {
        op_b = false;
    }
    else if (localStorage.getItem("p-opacity-r") === "true") {
        op_b = true;
    }
    else {
        op_b = false;
    }
    if (!localStorage.getItem("p-size-r")) {
        s_b = true;
    }
    else if (localStorage.getItem("p-size-r") === "true") {
        s_b = true;
    }
    else {
        s_b = false;
    }
    if (!localStorage.getItem("p-bounce")) {
        b_b = false;
    }
    else if (localStorage.getItem("p-bounce") === "true") {
        b_b = true;
    }
    else {
        b_b = false;
    }
    if (!localStorage.getItem("p-movement")) {
        m_b = false;
    }
    else if (localStorage.getItem("p-movement") === "true") {
        m_b = true;
    }
    else {
        m_b = false;
    }
    if (!localStorage.getItem("p-opacity-m")) {
        m_o = 0.1;
    }
    else {
        m_o = parseFloat(localStorage.getItem("p-opacity-m"));
    }

    particlesJS("particles-js", {
        "particles": {
            "number": {
                "value": parseInt(localStorage.getItem("p-count")),
                "density": {
                    "enable": true,
                    "value_area": 1000
                }
            },
            "color": {
                "value": localStorage.getItem("p-color")
            },
            "shape": {
                "type": localStorage.getItem("p-shape"),
                "stroke": {
                    "width": 0,
                    "color": "#000000"
                },
                "polygon": {
                    "nb_sides": parseInt(localStorage.getItem("p-sidecount"))
                },
                "image": {
                    "src": "img/github.svg",
                    "width": 100,
                    "height": 100
                }
            },
            "opacity": {
                "value": parseFloat(localStorage.getItem("p-opacity")),
                "random": op_b,
                "anim": {
                    "enable": false,
                    "speed": 1,
                    "opacity_min": m_o,
                    "sync": false
                }
            },
            "size": {
                "value": parseInt(localStorage.getItem("p-size")),
                "random": s_b,
                "anim": {
                    "enable": false,
                    "speed": 30,
                    "size_min": 0.1,
                    "sync": false
                }
            },
            "line_linked": {
                "enable": link_b,
                "distance": parseFloat(localStorage.getItem("p-link-d")),
                "color": localStorage.getItem("p-link-c"),
                "opacity": 0.4,
                "width": 1
            },
            "move": {
                "enable": true,
                "speed": parseFloat(localStorage.getItem("p-speed")),
                "direction": localStorage.getItem("p-direction"),
                "random": true,
                "straight": m_b,
                "out_mode": "out",
                "bounce": b_b,
                "attract": {
                    "enable": true,
                    "rotateX": 600,
                    "rotateY": 1200
                }
            }
        },
        "interactivity": {
            "detect_on": "canvas",
            "events": {
                "onhover": {
                    "enable": false,
                    "mode": "repulse"
                },
                "onclick": {
                    "enable": false,
                    "mode": "push"
                },
                "resize": true
            },
            "modes": {
                "grab": {
                    "distance": 400,
                    "line_linked": {
                        "opacity": 1
                    }
                },
                "bubble": {
                    "distance": 400,
                    "size": 40,
                    "duration": 2,
                    "opacity": 8,
                    "speed": 3
                },
                "repulse": {
                    "distance": 125,
                    "duration": 0.4
                },
                "push": {
                    "particles_nb": 6
                },
                "remove": {
                    "particles_nb": 2
                }
            }
        },
        "retina_detect": false
    });
    requestAnimationFrame(update);
}

function particleamountset(f) {
    if (!document.getElementById("particle-amount-input") || !document.getElementById("particle-amount-input").value) {
        n = 120;
    }
    else {
        n = document.getElementById("particle-amount-input").value;
    }
    localStorage.setItem(
        "p-count",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle count");
    }
}
function particlecolorset(f) {
    if (!document.getElementById("particle-color-input") || !document.getElementById("particle-color-input").value) {
        c = "#ffffff";
    }
    else {
        c = document.getElementById("particle-color-input").value;
    }

    localStorage.setItem(
        "p-color",
        c
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle color");
    }
}
function particlespeedset(f) {
    if (!document.getElementById("particle-speed-input") || !document.getElementById("particle-speed-input").value) {
        n = 1.5;
    }
    else {
        n = document.getElementById("particle-speed-input").value;
    }
    localStorage.setItem(
        "p-speed",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle speed");
    }
}
function particledirectionset(f) {
    if (!document.getElementById("particle-direction-select") || !document.getElementById("particle-direction-select").value) {
        d = "bottom";
    }
    else {
        d = document.getElementById("particle-direction-select").value;
    }
    localStorage.setItem(
        "p-direction",
        d
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle direction");
    }
}
function particlemovementset(f) {
    if (!document.getElementById("particle-direction-select") || !document.getElementById("particle-direction-select").value) {
        d = "random";
    }
    else {
        d = document.getElementById("particle-direction-select").value;
    }
    if (d === "straight") {
        localStorage.setItem(
            "p-movement",
            true
        );
    }
    else {
        localStorage.setItem(
            "p-movement",
            false
        );
    }
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle movement");
    }
}
function particlebounceset(f) {
    if (!document.getElementById("particle-bounce-select") || !document.getElementById("particle-bounce-select").value) {
        d = "random";
    }
    else {
        d = document.getElementById("particle-bounce-select").value;
    }
    if (d === "random") {
        localStorage.setItem(
            "p-bounce",
            true
        );
    }
    else {
        localStorage.setItem(
            "p-bounce",
            false
        );
    }
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle movement");
    }
}
function particleshapeset(f) {
    if (!document.getElementById("particle-shape-select") || !document.getElementById("particle-shape-select").value) {
        s = "circle";
    }
    else {
        s = document.getElementById("particle-shape-select").value;
    }
    localStorage.setItem(
        "p-shape",
        s
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle shape");
    }
}
function particlesidecountset(f) {
    if (!document.getElementById("particle-sidecount-input") || !document.getElementById("particle-sidecount-input").value) {
        n = 3;
    }
    else {
        n = document.getElementById("particle-sidecount-input").value;
    }
    localStorage.setItem(
        "p-sidecount",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle side count");
    }
}
function particlesizeset(f) {
    if (!document.getElementById("particle-size-input") || !document.getElementById("particle-size-input").value) {
        n = 3;
    }
    else {
        n = document.getElementById("particle-size-input").value;
    }
    localStorage.setItem(
        "p-size",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle size");
    }
}
function particlesizerandomset(f) {
    if (!document.getElementById("particle-size-random-select") || !document.getElementById("particle-size-random-select").value) {
        s = "true";
    }
    else {
        s = document.getElementById("particle-size-random-select").value;
    }
    if (s === "true") {
        localStorage.setItem(
            "p-size-r",
            true
        );
    }
    else {
        localStorage.setItem(
            "p-size-r",
            false
        )
    }
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle size (random)");
    }
}
function particlelinkedset(f) {
    if (!document.getElementById("particle-link-select") || !document.getElementById("particle-link-select").value) {
        s = "false";
    }
    else {
        s = document.getElementById("particle-link-select").value;
    }
    if (s === "true") {
        localStorage.setItem(
            "p-link",
            true
        );
    }
    else {
        localStorage.setItem(
            "p-link",
            false
        );
    }
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle link");
    }
}
function particlelinkeddistset(f) {
    if (!document.getElementById("particle-link-distance-input") || !document.getElementById("particle-link-distance-input").value) {
        n = 150;
    }
    else {
        n = document.getElementById("particle-link-distance-input").value;
    }
    localStorage.setItem(
        "p-link-d",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle link distance");
    }
}
function particlelinkedcolorset(f) {
    if (!document.getElementById("particle-link-color-input") || !document.getElementById("particle-link-color-input").value) {
        c = "#ffffff";
    }
    else {
        c = document.getElementById("particle-link-color-input").value;
    }
    localStorage.setItem(
        "p-link-c",
        c
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle link color");
    }
}
function particleopacityset(f) {
    if (!document.getElementById("particle-opacity-input") || !document.getElementById("particle-opacity-input").value) {
        n = 0.4419296542689612;
    }
    else {
        n = document.getElementById("particle-opacity-input").value;
    }
    localStorage.setItem(
        "p-opacity",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle opacity");
    }
}
function particleopacityrandomset(f) {
    if (!document.getElementById("particle-opacity-min-input") || !document.getElementById("particle-opacity-min-input").value) {
        n = 0.1;
    }
    else {
        n = document.getElementById("particle-opacity-min-input").value;
    }
    if (!document.getElementById("particle-opacity-random-select") || !document.getElementById("particle-opacity-random-select").value) {
        s = "true"
    }
    else {
        s = document.getElementById("particle-opacity-random-select").value;
    }
    if (s === "true") {
        localStorage.setItem(
            "p-opacity-r",
            true
        );
    }
    else {
        localStorage.setItem(
            "p-opacity-r",
            false
        )
    }
    localStorage.setItem(
        "p-opacity-m",
        n
    );
    if (f === true) {
        return;
    }
    else {
        setparticleoptions();
        console.log("recorded custom particle opacity (random)");
    }
}

particleamountset(true);
particlecolorset(true);
particlespeedset(true);
particledirectionset(true);
particleshapeset(true);
particlesidecountset(true);
particlesizeset(true);
particlesizerandomset(true);
particlelinkedset(true);
particlelinkeddistset(true);
particlelinkedcolorset(true);
particleopacityset(true);
particleopacityrandomset(true);
