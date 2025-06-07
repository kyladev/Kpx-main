function create_section(href, id, text) {
    const a = document.createElement("a");
    const button = document.createElement("button");

    button.classList.add("settings-button");
    button.innerText = text;
    button.id = id;

    a.href = href;

    a.appendChild(button);
    document.getElementById("buttons-container").appendChild(a);
}