function addnav2() {
    //create elements
    const navTable = document.createElement("ul");

    const li1 = document.createElement("li");
    const li2 = document.createElement("li");
    const li3 = document.createElement("li");
    const li4 = document.createElement("li");
    const li5 = document.createElement("li");
    const li6 = document.createElement("li");
    const li7 = document.createElement("li");

    const hr1 = document.createElement("hr");
    const hr2 = document.createElement("hr");

    const navbutton = document.createElement("button");

    const navspan1 = document.createElement("span");
    const navspan2 = document.createElement("span");
    const navspan3 = document.createElement("span");
    const navspan4 = document.createElement("span");
    const navspan5 = document.createElement("span");
    const navspan6 = document.createElement("span");
    const navspan7 = document.createElement("span");
    const navspan8 = document.createElement("span");
    const navspan9 = document.createElement("span");
    const navspan10 = document.createElement("span");
    const navspan11 = document.createElement("span");
    const navspan12 = document.createElement("span");
    const navspan13 = document.createElement("span");

    const nava1 = document.createElement("a");
    const nava2 = document.createElement("a");
    const nava3 = document.createElement("a");
    const nava4 = document.createElement("a");
    const nava5 = document.createElement("a");
    const nava6 = document.createElement("a");

    //add attributes
    navTable.id = "sidenav";

    navbutton.id = "toggleBtn";

    navspan1.classList.add("material-symbols-outlined");
    navspan1.innerText = "menu";

    li2.classList.add("iconitem");
    li3.classList.add("iconitem");
    li4.classList.add("iconitem");
    li5.classList.add("iconitem");
    li6.classList.add("iconitem");
    li7.classList.add("iconitem");

    nava1.classList.add("nav-a");
    nava2.classList.add("nav-a");
    nava3.classList.add("nav-a");
    nava4.classList.add("nav-a");
    nava5.classList.add("nav-a");
    nava6.classList.add("nav-a");

    navspan2.classList.add("material-symbols-outlined");
    navspan4.classList.add("material-symbols-outlined");
    navspan6.classList.add("material-symbols-outlined");
    navspan8.classList.add("material-symbols-outlined");
    navspan10.classList.add("material-symbols-outlined");
    navspan12.classList.add("material-symbols-outlined");

    navspan3.classList.add("label");
    navspan5.classList.add("label");
    navspan7.classList.add("label");
    navspan9.classList.add("label");
    navspan11.classList.add("label");
    navspan13.classList.add("label");

    navspan3.style.fontSize = "medium";
    navspan5.style.fontSize = "medium";
    navspan7.style.fontSize = "medium";
    navspan9.style.fontSize = "medium";
    navspan11.style.fontSize = "medium";
    navspan13.style.fontSize = "medium";


    //STUFF THAT WILL PROBABLY CHANGE LATER
    //set href
    nava1.href = "/";
    nava2.href = "/a";
    nava3.href = "/g";
    nava4.href = "/s";
    nava5.href = "/st";
    nava6.href = "/i";

    //set icon names
    navspan2.innerText = "home";
    navspan4.innerText = "view_comfy_alt";
    navspan6.innerText = "gamepad";
    navspan8.innerText = "language";
    navspan10.innerText = "settings";
    navspan12.innerText = "info";

    //set icon descriptions
    navspan3.innerText = "Home";
    navspan5.innerText = "Apps";
    navspan7.innerText = "Games";
    navspan9.innerText = "Search";
    navspan11.innerText = "Settings";
    navspan13.innerText = "Info";


    //construction
    nava1.appendChild(navspan2);
    nava1.appendChild(navspan3);

    nava2.appendChild(navspan4);
    nava2.appendChild(navspan5);

    nava3.appendChild(navspan6);
    nava3.appendChild(navspan7);

    nava4.appendChild(navspan8);
    nava4.appendChild(navspan9);

    nava5.appendChild(navspan10);
    nava5.appendChild(navspan11);

    nava6.appendChild(navspan12);
    nava6.appendChild(navspan13);

    navbutton.appendChild(navspan1);

    li1.appendChild(navbutton);

    li2.appendChild(nava1);
    li3.appendChild(nava2);
    li4.appendChild(nava3);
    li5.appendChild(nava4);
    li6.appendChild(nava5);
    li7.appendChild(nava6);

    navTable.appendChild(li1);
    navTable.appendChild(li2);
    navTable.appendChild(li3);
    navTable.appendChild(li4);
    navTable.appendChild(li5);
    navTable.appendChild(hr1);

    navTable.appendChild(li6);
    navTable.appendChild(hr2);

    navTable.appendChild(li7);

    document.getElementById("nav-container").appendChild(navTable);

    console.log("navbar 2 generated");

    const sidenav = document.getElementById("sidenav");
    const toggleBtn = document.getElementById("toggleBtn");

    toggleBtn.addEventListener("click", () => {
        sidenav.classList.toggle("expanded");
    });
}