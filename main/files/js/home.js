document.onkeydown = function (evt) {
  evt = evt || window.event;
  if (evt.key == 27) {
    window.location.replace(localStorage.getItem('panicsite'));
  }
};
function addlinkstoui(userurl, userimage, usercustomname) {
  const location = document.getElementById("quicklinks-inner");
  const alink = document.createElement("a");
  alink.innerHTML = "<img src=" + userimage + " class='logo'><p>" + usercustomname + "</p>"
  alink.setAttribute("class", "shortcut");
  alink.setAttribute("href", userurl);
  location.appendChild(alink);
}

function addsite() {
  let customurl = prompt("Enter the url of the site:");
  if (!customurl) {
    alert("Invalid");
    return;
  }
  let customimage = prompt("Enter an image url for the site:");
  if (!customimage) {
    alert("Invalid");
    return;
  }
  let customname = prompt("Enter a name for the site:");
  if (!customname) {
    alert("Invalid");
    return;
  }
  let newlink = {
    url: customurl,
    image: customimage,
    name: customname
  };
  let savedlinks = JSON.parse(localStorage.getItem('customurls')) || [];
  savedlinks.push(newlink);
  localStorage.setItem('customurls', JSON.stringify(savedlinks));
  add_shortcut(customurl, customimage, customname);
}
function searchkey(event) {
  if (event.key == "Enter") {
    search();
  }
}
function search() {
  let searchvalue = document.getElementById("searchbar").value;
  window.location.href = "/s?q=" + searchvalue;
}


let overlay = document.getElementById("overlay");