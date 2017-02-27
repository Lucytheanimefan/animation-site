var canvas = $("canvas");

var spread = 200;
var w = 5
var h = w
var alphaDiff = 0.0005
var maxOpacity = 200;
var audio;

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
    //play music
    //playMusic();
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    spawnBlackness(e.pageX, e.pageY, w, h, 0, 0);
    //requestAnimationFrame(spawnBlackness);
})

function getOpacity(x, y) {
    var p = ctx.getImageData(x, y, 1, 1).data;
    var opac = p[3]; //opacity, 255 if black
    return parseInt(opac);
}

//get pixel of where mouse is
/*
$('canvas').mousemove(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x=" + x + ", y=" + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    var opac = p[3]; //opacity, 255 if black
    console.log(p)
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2]));
    
    console.log(coord + "<br>" + hex);
});
*/

function okToMove(opacity) {
    return (opacity < maxOpacity);
}


x = 0;
y = 0;
var width = $("#background").width();
var height = $("#background").height();
var radius = width / 2;

var moveLeft, moveRight, moveUp, moveDown;

function getNewPosition() {
    //get random position
    var width = $("#background").width();
    var height = $("#background").height();

    console.log(width + "," + height)

    parseInt(Math.random() * 2) ? coordRand = 1 : coordRand = -1;
    parseInt(Math.random() * 2) ? coordRand1 = 1 : coordRand1 = -1;

    //var new_y = coordRand * (y + Math.floor(Math.random() * 5));
    //var new_x = coordRand * (x + Math.floor(Math.random() * 5));
    var pos = $("#butterfly_container").position();
    console.log(pos);
    if (pos.left > width - 500 || moveLeft) {
        console.log("moveLeft")
        x--
        moveLeft = true;
        moveRight = false;
        moveUp = false;
        moveDown = false;
    }
    if (pos.left < 0 || moveRight) {
        console.log("moveRight")
        x++
        moveRight = true;
        moveLeft = false;
        moveUp = false;
        moveDown = false;
    }
    if (pos.top > height || moveUp) {
        console.log("moveUp")
        y--;
        moveUp = true;
        moveRight = false;
        moveLeft = false;
        moveDown = false;
    }
    if (pos.top < 0 || moveDown) {
        console.log("moveDown")
        y++;
        moveDown = true;
        moveRight = false;
        moveUp = false;
        moveLeft = false;
    }
    if (!(moveDown || moveRight || moveUp || moveLeft)) {
        x++;
        y++;
    }



    //return [x++, y++]
    return [x, y]

}

function butterflyMove(opacity = null) {
    var new_pos = getNewPosition();
    var speed = 5 //calcSpeed([old_pos.top, old_pos.left], new_pos);
        //console.log(new_pos)
    $("#butterfly_container").animate({
        top: new_pos[1], //new_pos[0],
        left: new_pos[0] //new_pos[1]
    }, speed, function() {
        butterflyMove();
    })

}

$(document).ready(function() {
    butterflyMove();
})

function calcSpeed(prev, next) {

    var x = Math.abs(prev[1] - next[1]);
    var y = Math.abs(prev[0] - next[0]);

    var greatest = x > y ? x : y;

    var speedModifier = 0.1;

    var speed = Math.ceil(greatest / speedModifier);

    return speed;

}

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
    ctx.fillRect(x, y, width, height);
    ctx.fillStyle = "rgba(0,0,0," + alpha + ")";
    requestID = requestAnimationFrame(function() {
        spawnBlackness(x, y, width, height, alpha, i);

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

/**
 * [playMusic description]
 * @param  {[type]} musicfile .mp3 file probably
 * @return {[type]}           [description]
 */
function playMusic(musicfile) {
    audio = new Audio(musicfile);
    audio.play();
}
