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

var alphaDiff = 0.0005
var spread = 550
spawnLines(50, 50, 5, 5, 0.01, 0)

//ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
function spawnLines(x, y, width, height, alpha, i, lines = false) {
    console.log("width: " + width + "; height: " + height)
    var rand = getRandomInt(-100, 100);
    alpha += alphaDiff;
    parseInt(Math.random() * 2) ? coordRand1 = 1 : coordRand1 = -1;
    parseInt(Math.random() * 2) ? coordRand2 = 1 : coordRand2 = -1;
    var scale = getRandomInt(Math.pow(i, 1 / 3), Math.pow(i, 1 / 3) + 2);

    if (lines) {
        x += coordRand1 * scale;
        y += coordRand2 * scale;
    } else {
        x += scale; //coordRand1 * scale;
        y += scale; //coordRand2 * scale;
    }
    i++;

    cp1x = 1000 - width
    cp1y = .75 * y
    cp2x = Math.sqrt(x) * width;
    cp2y = 2.4 * y

    //arc
    ctx.beginPath();
    ctx.moveTo(550, 200);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);

    //make these happen later?
    //from the right
    ctx.moveTo(800, 800);
    ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    ctx.stroke();

    //from the left
    ctx.moveTo(100, 800);
    ctx.bezierCurveTo(cp1x + width + 1000, cp1y, cp2x, cp2y, x, y);
    ctx.stroke();

    ctx.strokeStyle = "rgba(255,255,255," + alpha + ")";
    ctx.fillStyle = "rgba(255,255,255," + alpha + ")";
    requestID = requestAnimationFrame(function() {
        spawnLines(x, y, width, height, alpha, i, lines);

    });
    if (i > spread) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        cancelAnimationFrame(requestID);

        //now with the lines
        spawnLines(50, 50, 5, 5, 0.01, 0, true);
    }
}
