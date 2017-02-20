var canvas = $("canvas");

var spread = 150;
var w = 7
var h = w


var ctx = canvas[0].getContext("2d"),
    width = $(document).width(),
    height = $(document).height(),
    a, b;

canvas.attr("width", width);
canvas.attr("height", height);

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;


$("canvas").click(function(e) {
    console.log("Canvas click: X: " + e.pageX + "  Y: " + e.pageY);
    //ctx.fillStyle = "rgb(0,0,0)";
    //ctx.fillRect(e.pageX, e.pageY, 10, 10);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    //requestAnimationFrame(spawnBlackness);
})


/* //REcursive exampe
// Animate.
function animate(highResTimestamp) {
  requestAnimationFrame(animate);
  // Animate something...
}

// Start the animation.
requestAnimationFrame(animate);
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function spawnBlackness(x, y, width, height, alpha, i) {
    console.log("width: " + width + "; height: " + height)
    var rand = getRandomInt(-100,100);
    //width = Math.sqrt(width + Math.pow(rand,2));
    //height++ //Math.sqrt(height + Math.pow(rand,2));
    alpha += .001;


    //var coordRand = 1;
    parseInt(Math.random() * 2) ?  coordRand1 =1 : coordRand1 = -1;
    parseInt(Math.random() * 2) ?  coordRand2 =1 : coordRand2 = -1;
    var scale = getRandomInt(0,10);

    
    x+=coordRand1*scale;
    y+=coordRand2*scale;
    i++;
    console.log("i: "+i)
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
    requestID = requestAnimationFrame(function() {
        spawnBlackness(x, y, width, height, alpha,i);

    });
    if (i > spread) {
        cancelAnimationFrame(requestID);
    }
}

function getCoordinates(x) {
    //y ( x ) = Ae^(−bx) cos x;
    A = 10;
    b = 5;
    y = A * Math.pow(Math.E, -b * x) * Math.cos(x);
    console.log("Y: " + y)
    return y

}
