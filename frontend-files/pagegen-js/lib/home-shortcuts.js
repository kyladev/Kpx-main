function add_shortcut(link, imglink, name) {
    const container = document.createElement("div");
    const linkcontainer = document.createElement("a");
    const img = document.createElement("img");
    const txt = document.createElement("p");

    container.classList.add("quicklinks-inner");
    linkcontainer.classList.add("shortcut");
    img.classList.add("logo");

    linkcontainer.href = link;
    img.src = imglink;
    txt.innerText = name;

    linkcontainer.appendChild(img);
    linkcontainer.appendChild(txt);
    container.appendChild(linkcontainer);

    document.getElementById("quicklinks").appendChild(container);
}
function add_shortcut_add_button() {
    const linkcontainer = document.createElement("a");
    const plussign = document.createElement("p");
    const txt = document.createElement("p");
    
    linkcontainer.classList.add("shortcut");
    plussign.classList.add("plus");
    plussign.innerText = "+";
    txt.innerText = "Add Website";

    linkcontainer.appendChild(plussign);
    linkcontainer.appendChild(txt);

    linkcontainer.addEventListener("click", function () {
        addsite();
    });

    document.getElementById("quicklinks").appendChild(linkcontainer);
}