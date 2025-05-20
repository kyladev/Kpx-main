document.addEventListener("DOMContentLoaded", addnav);


function addnav() {
    //get navbar div
    const navloc = document.getElementById("nav-container");

    //define nav container
    let navcontainer = document.createElement("nav");
    
    //create menu icon and navlinks div
    let menuicon = document.createElement("i");
    let navlinks = document.createElement("ul");

    //define <li> tags inside navlinks
    let navhome_li = document.createElement("li");
    let navsettings_li = document.createElement("li");
    let navapps_li = document.createElement("li");
    let navtools_li = document.createElement("li");
    let navgames_li = document.createElement("li");

    //define <a> tags inside of the <li> tags
    let navhome_a = document.createElement("a");
    let navsettings_a = document.createElement("a");
    let navapps_a = document.createElement("a");
    let navtools_a = document.createElement("a");
    let navgames_a = document.createElement("a");

    //define <i> awesomefont tags inside of <a> tags
    let navhome_i = document.createElement("i");
    let navsettings_i = document.createElement("i");
    let navapps_i = document.createElement("li");
    let navtools_i = document.createElement("li");
    let navgames_i = document.createElement("li");

    //define <p> tags inside of <i> tags
    let navhome_p = document.createElement("p");
    let navsettings_p = document.createElement("p");
    let navapps_p = document.createElement("p");
    let navtools_p = document.createElement("p");
    let navgames_p = document.createElement("p");

    //add classes
    navcontainer.classList.add("navbar");

    menuicon.classList.add("fa-solid");
    menuicon.classList.add("fa-chevron-right");
    menuicon.classList.add("menu-icon");

    navlinks.classList.add("nav-links");

    navhome_i.classList.add("fa-solid");
    navhome_i.classList.add("fa-house");
    navhome_i.classList.add("innericon");
    navhome_p.classList.add("innerlabel");

    navsettings_i.classList.add("fa-solid");
    navsettings_i.classList.add("fa-gear");
    navsettings_i.classList.add("innericon");
    navsettings_p.classList.add("innerlabel");

    navapps_i.classList.add("fa-solid");
    navapps_i.classList.add("fa-table-cells");
    navapps_i.classList.add("innericon");
    navapps_p.classList.add("innerlabel");

    navtools_i.classList.add("fa-solid");
    navtools_i.classList.add("fa-screwdriver-wrench");
    navtools_i.classList.add("innericon");
    navtools_p.classList.add("innerlabel");

    navgames_i.classList.add("fa-solid");
    navgames_i.classList.add("fa-gamepad");
    navgames_i.classList.add("innericon");
    navgames_p.classList.add("innerlabel");

    //add href to <a> tags
    navhome_a.setAttribute("href", "/");
    navsettings_a.setAttribute("href", "/settings");
    navapps_a.setAttribute("href", "/apps");
    navtools_a.setAttribute("href", "/tools");
    navgames_a.setAttribute("href", "/games");

    //add text for <p> tags
    navhome_p.innerText = "Home";
    navsettings_p.innerText = "Settings";
    navapps_p.innerText = "Apps";
    navtools_p.innerText = "Tools";
    navgames_p.innerText = "Games";

    //append to document and each other
    navhome_i.appendChild(navhome_p);
    navsettings_i.appendChild(navsettings_p);
    navapps_i.appendChild(navapps_p);
    navtools_i.appendChild(navtools_p);
    navgames_i.appendChild(navgames_p);

    navhome_a.appendChild(navhome_i);
    navsettings_a.appendChild(navsettings_i);
    navapps_a.appendChild(navapps_i);
    navtools_a.appendChild(navtools_i);
    navgames_a.appendChild(navgames_i);

    navhome_li.appendChild(navhome_a);
    navsettings_li.appendChild(navsettings_a);
    navapps_li.appendChild(navapps_a);
    navtools_li.appendChild(navtools_a);
    navgames_li.appendChild(navgames_a);

    navlinks.appendChild(navhome_li);
    navlinks.appendChild(navsettings_li);
    navlinks.appendChild(navapps_li);
    navlinks.appendChild(navtools_li);
    navlinks.appendChild(navgames_li);

    navcontainer.appendChild(menuicon);
    navcontainer.appendChild(navlinks);

    //append final nav to document
    navloc.appendChild(navcontainer);

    console.log("added navbar 1");

}
