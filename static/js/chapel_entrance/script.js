var canvas = $("canvas");


var ctx = canvas[0].getContext("2d"),
    width = $(document).width(),
    height = $(document).height(),
    a, b;

canvas.attr("width", width);
canvas.attr("height", height);

//get pixel of where mouse is
$('canvas').mousemove(function(e) {
    var x = e.pageX;
    var y = e.pageY;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    console.log(coord)
});

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var alphaDiff = 0.001
var spread = 500
spawnBlackness(50, 50, 5, 5, 0.01, 0)


function spawnBlackness(x, y, width, height, alpha, i) {
    console.log("width: " + width + "; height: " + height)
    var rand = getRandomInt(-100, 100);
    alpha += alphaDiff;
    parseInt(Math.random() * 2) ? coordRand1 = 1 : coordRand1 = -1;
    parseInt(Math.random() * 2) ? coordRand2 = 1 : coordRand2 = -1;
    var scale = getRandomInt(Math.pow(i, 1 / 3), Math.pow(i, 1 / 3) + 2);
    x += coordRand1 * scale;
    y += coordRand2 * scale;
    i++;
    console.log("i: " + i)
    if (coordRand1 > 0) {
        ctx.beginPath();
        ctx.moveTo(Math.log(x) * coordRand1, x + Math.sqrt(coordRand1));
        ctx.lineTo(x * width, coordRand2 * y + width);
        ctx.lineTo(2 * y, Math.sqrt(y * x));
        ctx.closePath();
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(1000-x, 1000- (x + Math.sqrt(coordRand1)));
        ctx.lineTo(x * width, coordRand2 * y + width);
        ctx.lineTo(2 * y, Math.sqrt(y * x));
        ctx.closePath();
        ctx.stroke();
    }
    ctx.strokeStyle = "rgba(255,255,255," + alpha + ")";
    ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
    requestID = requestAnimationFrame(function() {
        spawnBlackness(x, y, width, height, alpha, i);

    });
    if (i > spread) {
        cancelAnimationFrame(requestID);
    }
}
