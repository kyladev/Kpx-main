//create navbar section top level
create_section(true, false, "Navbar", "", "top-navabr-text", "sections-container", 0, "top-navbar-section-items");

//create appview navbar select section
create_section(false, true, "Show Navbar in App & Tool View", "", "appnav-text", "sections-container", 0, "appview-navbar-section-items");
add_select_body(document.getElementById("appview-navbar-section-items"), "appview-navbar-select", "appview-navbar-set");
add_select_option(document.getElementById("appview-navbar-select"), "true", "Visible");
add_select_option(document.getElementById("appview-navbar-select"), "false", "Hidden");
document.getElementById("appview-navbar-set").addEventListener("click", function () {
    toggle_app_nav();
});

//create toolview navbar select section
create_section(false, true, "Show Navbar in Game View", "", "gamenav-text", "sections-container", 0, "gameview-navbar-section-items");
add_select_body(document.getElementById("gameview-navbar-section-items"), "gameview-navbar-select", "gameview-navbar-set");
add_select_option(document.getElementById("gameview-navbar-select"), "true", "Visible");
add_select_option(document.getElementById("gameview-navbar-select"), "false", "Hidden");
document.getElementById("gameview-navbar-set").addEventListener("click", function () {
    toggle_game_nav();
});