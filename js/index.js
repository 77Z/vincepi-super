var row = 0;

var licence = {
    showMenu: function() {},
    hoverButton: function() {
        document.getElementById("licence-btn").classList.add("licences-button-selected");
        document.getElementById("licence-tip").classList.add("displayFlex");
    },
    unhoverButton: function() {
        document.getElementById("licence-btn").classList.remove("licences-button-selected");
        document.getElementById("licence-tip").classList.remove("displayFlex");
    }
};

document.addEventListener("keydown", (e) => {
    if (e.preventDefault()) { return; }
    var key = e.key || e.keyCode;
    /* if (key == "a") {
        licence.hoverButton();
    }
    if (key == "s") {
        licence.unhoverButton();
    } */

    if (key == "ArrowUp") { moveUp(); }
    if (key == "ArrowDown") { moveDown(); }
});

function moveUp() {
    row = 0;
    updatePos();
}
function moveDown() {
    row = 1;
    updatePos();
}

function updatePos() {
    if (row == 1) {
        licence.hoverButton();
    } else { licence.unhoverButton(); }
}