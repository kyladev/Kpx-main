function toggle_app_nav() {
    localStorage.setItem("show-app-nav", document.getElementById("appview-navbar-select").value);
}
function toggle_game_nav() {
    localStorage.setItem("show-game-nav", document.getElementById("gameview-navbar-select").value);
}

toggle_app_nav();
toggle_game_nav();