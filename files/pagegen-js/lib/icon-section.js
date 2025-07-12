function create_section(link, imgsrc, text) {
    const sectiondiv = document.createElement("div");
    const content = document.createElement("a");
    const img = document.createElement("img");
    const desc = document.createElement("p");

    sectiondiv.classList.add("siteicon-container")
    img.classList.add("siteicon");
    desc.classList.add("sitename");
    content.href = link;
    img.src = imgsrc;
    desc.innerText = text;

    content.appendChild(img);
    content.appendChild(desc);
    sectiondiv.appendChild(content);
    document.getElementsByClassName("siteicons-grid")[0].appendChild(sectiondiv);
}