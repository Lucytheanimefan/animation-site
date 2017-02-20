var pos = [
    { x: 300, y: 100, mx: 0, my: 0 },
    { x: 10, y: 100, mx: 0, my: 0 },
    { x: 80, y: 200, mx: 10, my: 100 },
    { x: 300, y: 100, mx: 80, my: 200 }
];

var width = 10;
var height = 10;
var ticks = 0;
var MAX = 4;
var s = 0;

(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame =
            window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

function renderLine() {
    if (slow()) {
        ctx.moveTo(pos[ticks].mx, pos[ticks].my, 0, 0);
        ctx.lineTo(pos[ticks].x, pos[ticks].y);
        ctx.stroke();
        ticks = (ticks > MAX) ? 0 : ticks + 1;
    }

}

function slow() {
    var rend = false
    if (s > 30) {
        s = 0;
        rend = true;
    } else {
        s += 1;
    }
    return rend;
}


function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    renderLine();
}

//Setting up canvas
var c = document.getElementById("myCanvas");
var ctx = c.getContext("2d");
gameLoop();
