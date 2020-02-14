////////////////////////////////////////
// CONNECTION
////////////////////////////////////////
const connection = new Connection(

    "BeatMatchingProject",
    "player",
    "https://resonance404.herokuapp.com/"


);



connection.onConnect(() => {
    console.log("CONNECTED");

});

connection.onDisconnect(() => {
    console.log("DISCONNECTED");
});

connection.onError(err => {
    console.error("CONNECTION ERROR:", err);
});

connection.onOtherConnect((id, type) => {
    console.log(`OTHER CONNECTED: ${id}, ${type}`);
});

connection.onOtherDisconnect((id, type) => {
    console.log(`OTHER DISCONNECTED: ${id}, ${type}`);
});



var sensitivity = 40;

// Position variables
var x1 = 0,
    y1 = 0,
    z1 = 0,
    x2 = 0,
    y2 = 0,
    z2 = 0;

// Listen to motion events and update the position
window.addEventListener('devicemotion', function(e) {
    x1 = e.accelerationIncludingGravity.x;
    y1 = e.accelerationIncludingGravity.y;
    z1 = e.accelerationIncludingGravity.z;
}, false);


var instrumenttype = 1;


window.addEventListener('load', function() {
    //setinstrument();

});

// function setinstrument() {
//     if (instrumenttype) {
//         document.getElementById("instrument-type").innerHTML = "Crash";
//     } else {
//         document.getElementById("instrument-type").innerHTML = "Kick";
//     }
// }

var trigger;

// Periodically check the position and fire
// if the change is greater than the sensitivity
setInterval(function() {
    var change = Math.abs(x1 - x2 + y1 - y2 + z1 - z2);


    if (change > sensitivity && trigger) {
        // var x = document.getElementById("kick-single");
        // x.play();
        trigger = false;
        if (instrumenttype) {
            document.body.style.backgroundColor = "white";
            connection.send("snare-send", change);

        } else {
            document.body.style.backgroundColor = "yellow";
            connection.send("kick-send");
        }
    } else if (change < sensitivity) {
        document.body.style.backgroundColor = "black";
        //connection.send("no-beat");
        trigger = true;

    }
    // Update new position
    x2 = x1;
    y2 = y1;
    z2 = z1;
}, 150);