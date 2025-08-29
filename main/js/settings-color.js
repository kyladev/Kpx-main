function setColor(varName, val) {
    document.querySelector(':root').style.setProperty(varName, val);
    localStorage.setItem(varName, val);
}