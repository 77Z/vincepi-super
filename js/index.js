var row = 0;
var col = 1;

var powerCol = 0;

var licenceRow = 0;

var licencesInitialized = false;
var globalLicences = [];

var licence = {
    hoverButton: function() {
        document.getElementById("licence-btn").classList.add("licences-button-selected");
        document.getElementById("licence-tip").classList.add("displayFlex");
    },
    unhoverButton: function() {
        document.getElementById("licence-btn").classList.remove("licences-button-selected");
        document.getElementById("licence-tip").classList.remove("displayFlex");
    }
};

/* document.addEventListener("keydown", (e) => {
    if (e.preventDefault()) { return; }
    var key = e.key || e.keyCode;
    if (key == "a") {
        licence.hoverButton();
    }
    if (key == "s") {
        licence.unhoverButton();
    }

    if (key == "ArrowUp") { moveUp(); }
    if (key == "ArrowDown") { moveDown(); }
    if (key == "ArrowLeft") { moveLeft(); }
    if (key == "ArrowRight") { moveRight(); }
}); */
window.onload = function() {
    window.addEventListener("gamepadconnected", (event) => {
        console.log("A gamepad connected:");
        console.log(event.gamepad);
        document.getElementById("snackbar").classList.remove("snackbar-show");
        window.requestAnimationFrame(frame);
    });
    
    window.addEventListener("gamepaddisconnected", (event) => {
        console.log("A gamepad disconnected:");
        console.log(event.gamepad);
        document.getElementById("snackbar").classList.add("snackbar-show");
        window.cancelAnimationFrame(frame);
    });
}

var canMoveHorizontal = true;
var canMoveVertical   = true;
var canClick          = true;
var canBack           = true;
var canSuper          = true;

function frame() {

    if (document.hasFocus()) {
        var gamepad = navigator.getGamepads()[0];

        if (gamepad.axes[0] !== 1 && gamepad.axes[0] !== -1) {
            canMoveHorizontal = true;
        }

        if (canMoveHorizontal) {
            if (gamepad.axes[0] === -1) {
                moveLeft();
                canMoveHorizontal = false;
            } else if (gamepad.axes[0] === 1) {
                moveRight();
                canMoveHorizontal = false;
            }
        }

        if (gamepad.axes[1] !== 1 && gamepad.axes[1] !== -1) {
            canMoveVertical = true;
        }

        if (canMoveVertical) {
            if (gamepad.axes[1] === -1) {
                moveUp();
                canMoveVertical = false;
            } else if (gamepad.axes[1] === 1) {
                moveDown();
                canMoveVertical = false;
            }
        }

        if (!gamepad.buttons[3].pressed) {
            canClick = true;
        }

        if (gamepad.buttons[3].pressed && canClick) {
            clickEvent();
            canClick = false;
        }

        if (!gamepad.buttons[4].pressed) {
            canSuper = true;
        }

        if (gamepad.buttons[4].pressed && canSuper) {
            superButton();
            canSuper = false;
        }

        if (!gamepad.buttons[1].pressed) {
            canBack = true;
        }

        if (gamepad.buttons[1].pressed && canBack) {
            backButton();
            canBack = false;
        }
    }
    window.requestAnimationFrame(frame);
}
/* 
    Possible Values: `main`, `licence`, `power`, `library`
*/
var currentScreen = "main";

function superButton() {
    toast("The Super Button is disabled on the home menu");
}

function toast(message) {
    document.getElementById("toast").classList.add("toast-show");
    document.getElementById("toast").innerText = message;
    setTimeout(function() {
        document.getElementById("toast").classList.remove("toast-show");
    }, 4000);
}

function backButton() {
    document.getElementById("licences-tab").style.display = "none";
    document.getElementById("power-tab").style.display    = "none";
    document.getElementById("library-tab").style.display  = "none";
    document.getElementById("back-blur").style.display    = "none";
    currentScreen = "main";
}

var licenceAmount = 0;

function clickEvent() {
    if (currentScreen == "main") {
        if (row === 1) {
            //Show Licences
            document.getElementById("licences-tab").style.display = "block";
            document.getElementById("back-blur").style.display = "block";

            if(!licencesInitialized) {
                licencesInitialized = true;
                console.log("Loading Licences");

                var licences = require("../js/licences");
                globalLicences = licences;
                for (var i = 0; i < licences.length; i++) {
                    var licenceOption = document.createElement("li");
                    licenceOption.innerText = licences[i].productTitle;
                    if (i === 0) { licenceOption.classList.add("selected-licence"); }
                    licenceOption.id = "licence" + i;
                    document.getElementById("licence-list").appendChild(licenceOption);

                    if (i > licenceAmount) { licenceAmount = i; }
                }
            }

            currentScreen = "licence";
        } else if (row === 0 && col === 2) {
            //Show Power Options
            document.getElementById("power-tab").style.display = "block";
            document.getElementById("back-blur").style.display = "block";
            currentScreen = "power";
        } else if (row === 0 && col == 1) {
            //Show Library
            document.getElementById("library-tab").style.display = "block";
            document.getElementById("back-blur").style.display = "block";
            currentScreen = "library";
        } else if (row === 0 && col == 0) {
            //Show Settings
        }
    } else if (currentScreen == "power") {
        if (powerCol == 2) {
            //Check for update
            updateSystem();
        }
    }
}

function moveUp() {
    if (currentScreen == "main") {
        row = 0;
        document.getElementById("library-button").classList.add("button-selected");
        updatePos();
    } else if (currentScreen == "licence") {
        if (licenceRow !== 0) {
            licenceRow--;
            updatePos();
        }
    }
}
function moveDown() {
    if (currentScreen == "main") {
        row = 1;
        updatePos();
        document.getElementById("settings-button").classList.remove("button-selected");
        document.getElementById("library-button").classList.remove("button-selected");
        document.getElementById("power-options-button").classList.remove("button-selected");
    } else if (currentScreen == "licence") {
        if (licenceRow !== licenceAmount) {
            licenceRow++;
            updatePos();
        }
    }
}

function moveRight() {
    if (currentScreen == "main") {
        row = 0;
        if (col !== 2) {
            col++;
        }
        updatePos();
    } else if (currentScreen == "power") {
        if (powerCol !== 2) {
            powerCol++;
        }
        updatePos();
    }
}

function moveLeft() {
    if (currentScreen == "main") {
        row = 0;
        if (col !== 0) {
            col--;
        }
        updatePos();
    } else if (currentScreen == "power") {
        if (powerCol !== 0) {
            powerCol--;
        }
        updatePos();
    }
}

function updatePos() {
    if (currentScreen == "main") {
        if (row == 1) {
            licence.hoverButton();
        } else { licence.unhoverButton(); }
    
        if (col == 0) {
            document.getElementById("settings-button").classList.remove("button-selected");
            document.getElementById("library-button").classList.remove("button-selected");
            document.getElementById("power-options-button").classList.remove("button-selected");
    
            document.getElementById("settings-button").classList.add("button-selected");
        }
    
        if (col == 1) {
            document.getElementById("settings-button").classList.remove("button-selected");
            document.getElementById("library-button").classList.remove("button-selected");
            document.getElementById("power-options-button").classList.remove("button-selected");
    
            document.getElementById("library-button").classList.add("button-selected");
        }
    
        if (col == 2) {
            document.getElementById("settings-button").classList.remove("button-selected");
            document.getElementById("library-button").classList.remove("button-selected");
            document.getElementById("power-options-button").classList.remove("button-selected");
    
            document.getElementById("power-options-button").classList.add("button-selected");
        }
    } else if (currentScreen == "power") {
        if (powerCol == 0) {

            document.getElementById("power-button-shutdown").classList.remove("power-button-selected");
            document.getElementById("power-button-reboot").classList.remove("power-button-selected");
            document.getElementById("power-button-update").classList.remove("power-button-selected");

            document.getElementById("power-button-shutdown").classList.add("power-button-selected");
        }
        if (powerCol == 1) {

            document.getElementById("power-button-shutdown").classList.remove("power-button-selected");
            document.getElementById("power-button-reboot").classList.remove("power-button-selected");
            document.getElementById("power-button-update").classList.remove("power-button-selected");

            document.getElementById("power-button-reboot").classList.add("power-button-selected");
        }
        if (powerCol == 2) {

            document.getElementById("power-button-shutdown").classList.remove("power-button-selected");
            document.getElementById("power-button-reboot").classList.remove("power-button-selected");
            document.getElementById("power-button-update").classList.remove("power-button-selected");

            document.getElementById("power-button-update").classList.add("power-button-selected");
        }
    } else if (currentScreen == "licence") {
        for (var i = 0; i < licenceAmount; i++) {
            document.getElementById("licence" + i).classList.remove("selected-licence");
        }
        document.getElementById("licence" + licenceRow).classList.add("selected-licence");
        document.getElementById("licence-display").innerHTML = `<h1>${globalLicences[licenceRow].productTitle} By ${globalLicences[licenceRow].publisher}<br>${globalLicences[licenceRow].licenceType}</h1><br><br>${globalLicences[licenceRow].licence}`;
    }
}

function updateSystem() {
    if (navigator.onLine) {
        //Start Update
        backButton();
        toast("Checking for updates...");
    } else {
        backButton();
        toast("You need internet to update!");
    }
}
