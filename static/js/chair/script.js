$(document).ready(function() {
    createLines();
});

var functions = {
    0: function() {
        crackGrounds();
    },
    1: function() {
        console.log("1");
    },
    2: function() {
        console.log("2");
    }
}


var canvas = $("#background");
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

function createLines() {
    len = passage.length;
    for (var i = 0; i < len; i++) {
        var id = "line" + i;
        $("#text").append("<div class='line' id = " + id + ">" + passage[i] + "</div>");
        $("#" + id).fadeIn(i * 1500, lineCallback(i));

    }

    function lineCallback(index) {
        console.log("linecallback! " + index);
        functions[index.toString()]();
    }
}



var maxLineLength = 10;
var done = 500;
var cubeTimes = 0;

function crackGrounds() {
    w = parseInt(width / 150);
    h = parseInt($("#background").height() / 150);
    //console.log(height)
    //console.log("width, height: " + w + "," + h)
    for (var i = 0; i < w; i++) {
        for (var j = 0; j < h; j++) {
            //console.log(150 * i + "," + 150 * j)
            crackGround(i * 150, j * 150, i * 150 + 1, j * 150 + 1, 0);

        }

    }
}


function crackGround(x, y, xl, yl, i) {
    if (i == 0) {
        originalX = x;
        originalY = y;
        originalxl = xl;
        originalyl = yl;
    }
    ctx.beginPath();
    ctx.lineWidth = Math.pow(20 - i, 1 / 3);
    Math.random() < 0.9 ? ctx.strokeStyle = "black" : ctx.strokeStyle = "grey";
    //ctx.strokeStyle = "darkred";
    ctx.moveTo(x, y);
    ctx.lineTo(xl, yl);
    ctx.stroke();

    i++;
    Math.random() < 0.75 ? factor = 1 : factor = -1;
    y = yl
    x = xl
    xl = xl + factor * (maxLineLength * Math.random());
    yl = yl + (maxLineLength * Math.random());

    requestID = requestAnimationFrame(function() {
        crackGround(x, y, xl, yl, i);
    });
    if (i == 50) {
        cancelAnimationFrame(requestID);
        cubeTimes++;
        if (cubeTimes > 5) {
            console.log("STOP");
        } else {
            crackGround(originalX + 1, originalY, originalxl, originalyl, 0);
        }
    }
}
