function update_background_style() {
    if (!localStorage.getItem("background")) {
        return;
    }
    else {
        if (document.getElementById("background-style")) {
            document.getElementById("background-style").textContent = localStorage.getItem("background");
            return;
        }
        else {
            const css_background = document.createElement("style");
            css_background.id = "background-style";
            css_background.textContent = localStorage.getItem("background");
            document.appendChild(css_background);
        }
    }
}
function update_secondary_style() {
    if (!localStorage.getItem("secondary")) {
        return;
    }
    else {
        if (document.getElementById("secondary-style")) {
            document.getElementById("secondary-style").textContent = localStorage.getItem("secondary");
            return;
        }
        else {
            const css_secondary = document.createElement("style");
            css_secondary.id = "secondary-style";
            css_secondary.textContent = localStorage.getItem("secondary");
            document.appendChild(css_secondary);
        }
    }
}
function update_tertiary_style() {
    if (!localStorage.getItem("tertiary")) {
        return;
    }
    else {
        if (document.getElementById("tertiary-style")) {
            document.getElementById("tertiary-style").textContent = localStorage.getItem("tertiary");
            return;
        }
        else {
            const css_tertiary = document.createElement("style");
            css_tertiary.id = "tertiary-style";
            css_tertiary.textContent = localStorage.getItem("tertiary");
            document.appendChild(css_tertiary);
        }
    }
}
function update_text_style() {
    if (!localStorage.getItem("text")) {
        return;
    }
    else {
        if (document.getElementById("text-style")) {
            document.getElementById("text-style").textContent = localStorage.getItem("text");
            return;
        }
        else {
            const css_text = document.createElement("style");
            css_text.id = "text-style";
            css_text.textContent = localStorage.getItem("text");
            document.appendChild(css_text);
        }
    }
}


document.addEventListener("DOMContentLoaded", function () {
    update_background_style();
    update_secondary_style();
    update_tertiary_style();
    update_text_style();
});