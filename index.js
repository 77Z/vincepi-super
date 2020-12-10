var Hidstream = require('node-hid-stream').Hidstream;
var hidstream = new Hidstream({ vendorId: 121, productId: 6 });

var superPressed = false;

hidstream.on("data", function(data) {
    //console.log(data); // Raw buffer from HDI device.

    //Super Button
    if (data[6] == 1) {
        superPressed = true;
    } else { superPressed = false; }
});

var loop = setInterval(function() {
    if (superPressed) {
        superButton();
    }
}, 100);

function superButton() {
    clearInterval(loop);

    console.log("Launching Dashboard...");

    process.exit(0);
}