function create_section(topdesc, lowdesc, desctext1, desctext2, desc2id, locationclass, classindex, itemid) {
    const sectiondiv = document.createElement("div");
    const descdiv = document.createElement("div");
    if (topdesc === true) {
        const desc = document.createElement("h2");
        desc.innerText = desctext1;
        descdiv.classList.add("settingdesc");
        descdiv.appendChild(desc);
        sectiondiv.appendChild(descdiv);
        document.getElementsByClassName(locationclass)[classindex].appendChild(sectiondiv);
        return;
    }
    const itemsdiv = document.createElement("div");
    const desc = document.createElement("h3");
    const lowerdesc = document.createElement("p");

    desc.innerText = desctext1;
    lowerdesc.innerText = desctext2;

    if (lowdesc === true) {
        desc.classList.add("smalldesc");
    }

    lowerdesc.classList.add("smalldesc");
    itemsdiv.classList.add("right-items");
    descdiv.classList.add("settingdesc")
    lowerdesc.id = desc2id;
    itemsdiv.id = itemid;

    descdiv.appendChild(desc);
    descdiv.appendChild(lowerdesc);
    sectiondiv.appendChild(descdiv);
    sectiondiv.appendChild(itemsdiv);

    sectiondiv.classList.add("sections");

    document.getElementsByClassName(locationclass)[classindex].appendChild(sectiondiv);
}

function add_input(div, id, type, b_id) {
    const input = document.createElement("input");
    input.id = id;
    if (type === "number") {
        input.placeholder = "Enter a number...";
        input.type = "number";
    }
    if (type === "hex") {
        input.placeholder = "Enter a hex code...";
        input.type = "text";
    }
    div.appendChild(input);
    add_button(div, b_id);
}

//select body adds just select div, use option function to add options
function add_select_body(div, id, b_id) {
    const select = document.createElement("select");
    select.id = id;
    div.appendChild(select);
    add_button(div, b_id);
}
function add_select_option(select, val, text) {
    const option = document.createElement("option");
    option.value = val;
    option.innerText = text;
    select.appendChild(option);
}

//use at end of all content adding functions
function add_button(div, buttonid) {
    const button = document.createElement("button");
    button.innerText = "Set option";
    button.id = buttonid;
    div.appendChild(button);
}