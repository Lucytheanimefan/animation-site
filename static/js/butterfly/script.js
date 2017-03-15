var canvas = $("canvas");
var clickCount = 1;
var spread = 200;
var w = 5;
var h = w;
var alphaDiff = 0.0005
var maxOpacity = 200;
var audio;
var continueBlackness = false;
var continueButterfly = false;

var container1 = document.querySelector('.container1');
var container2 = document.querySelector('.container2');
var butterflyWingspan = 30;
var rotationDamping = 10;
var butterflyPath = {
    'butterfly1': [
        [10, 150],
        [10, 350],
        [50, 370],
        [70, 400],
        [90, 500],
        [400, 50],
        [550, 40],
        [590, 590],
        [650, 700],
        [700, 400],
    ],
    'butterfly2': [
        [150, 10],
        [350, 10],
        [370, 50],
        [400, 70],
        [500, 90],
        [550, 40],
        [600, 600],
        [100, 600],
        [0, 650],
        [300, 550],
        [400, 700]
    ]
};


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

//moveTo(coords, container, path)
$(document).mousedown(function() {
    continueBlackness = false;
    continueButterfly = true;
    butterflyID = setInterval(function() {
        moveTo(butterflyPath["butterfly1"].shift(), container1, "butterfly1");
        moveTo(butterflyPath["butterfly2"].shift(), container2, "butterfly2");
    }, 500)

}).mouseup(function(e) {
    continueBlackness = true;
    continueButterfly = false;
    clearInterval(butterflyID);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
})



function getOpacity(x, y) {
    var p = ctx.getImageData(x, y, 1, 1).data;
    var opac = p[3]; //opacity, 255 if black
    return parseInt(opac);
}



function okToMove(opacity) {
    return (opacity < maxOpacity);
}


x = 0;
y = 0;
var width = $("#background").width();
var height = $("#background").height();
var radius = width / 2;

function findPos(obj) {
    var curleft = 0,
        curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function spawnBlackness(x, y, width, height, alpha, i) {
    //console.log("width: " + width + "; height: " + height)
    var rand = getRandomInt(-100, 100);
    alpha += alphaDiff;
    width += alphaDiff;
    height += alphaDiff;
    parseInt(Math.random() * 2) ? coordRand1 = 1 : coordRand1 = -1;
    parseInt(Math.random() * 2) ? coordRand2 = 1 : coordRand2 = -1;
    var scale = getRandomInt(Math.pow(i, 1 / 3), Math.pow(i, 1 / 3) + 2);
    x += coordRand1 * scale;
    y += coordRand2 * scale;
    i++;
    //console.log("i: " + i)
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
    requestID = requestAnimationFrame(function() {
        spawnBlackness(x, y, width, height, alpha, i);

    });
    if (!continueBlackness) {
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

/**
 * [playMusic description]
 * @param  {[type]} musicfile .mp3 file probably
 * @return {[type]}           [description]
 */
function playMusic(musicfile) {
    audio = new Audio(musicfile);
    audio.play();
}


/*--------butterfly animation---------*/

var lambda =0.5;

function butterflyCurve() {
    coordinates = [];
    for (t = 0; t < 100; t++) {
        var x = Math.sin(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5));
        var y = Math.cos(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5));
        coordinates.push([300*x + 200,300*y + 200]);
    }

    console.log(coordinates);
    butterflyPath['butterfly1'] = coordinates;
    butterflyPath['butterfly2'] = coordinates.reverse();

    console.log(butterflyPath)
}

butterflyCurve();

function moveTo(coords, container, path) {
    console.log(container)
    var currentX = parseInt(container.style.left, 10);
    var currentY = parseInt(container.style.top, 10);
    console.log(currentX + "," + currentY)
    var newX = coords[0] - butterflyWingspan;
    var newY = coords[1];
    var deltaX = newX - currentX;
    var deltaY = newY - currentY;

    var rotateZ = -Math.min(Math.max(deltaX / rotationDamping, -90), 90);
    var rotateX = 90 - Math.min(Math.max(deltaY / rotationDamping, -90), 90);
    var translateZ = newY - 500;

    container.style.left = newX + 'px';
    container.style.top = newY + 'px';
    container.style.transform = 'translateZ(' + translateZ + 'px) rotateX(' + rotateX + 'deg) rotateZ(' + rotateZ + 'deg)';
    /*
    if (continueButterfly) {
       
            moveTo(butterflyPath[path].shift());
      
    } else {
        return;
    }*/

}
