$(document).ready(function() {
    createLines();
});

var functions = {
    0: function() {
        crackGrounds();
    },
    1: function() {
        crackGrounds();
    },
    2: function() {
        crackGrounds();
    },
    3: function() {
        spiderLily($("canvas").width() / 2, $("canvas").height() / 2, 0, 0);
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

var i = 0;

function createLines() {
    var line = passage.shift()
    var id = "line" + i;
    var string = lineBreak(50, line)
    $("#text").append("<div class='line' id = " + id + ">" + string + "</div>");
    i++;
    $("#" + id).fadeIn(i * 1500, function() {
        lineCallback(i);
        createLines();
    });

    /*
        len = passage.length;
        for (var i = 0; i < len; i++) {
            var id = "line" + i;
            var string = lineBreak(50, passage[i])
            $("#text").append("<div class='line' id = " + id + ">" + string + "</div>");
            $("#" + id).fadeIn(i * 1500, lineCallback(i));

        }
        */

    function lineCallback(index) {
        console.log("linecallback! " + index);
        if (index in functions) {
            functions[index.toString()]();
        }
    }
}



var maxLineLength = 10;
var done = 500;
var cubeTimes = 0;

function crackGrounds() {
    console.log("crackGrounds")
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

function spiderLily(x, y, opacity = 0, i = 0) {
    ctx.beginPath();
    ctx.moveTo(x, y);

    x1 = 0.5 * x;
    y1 = .2 * y;
    x2 = -0.5 * x;
    y2 = .3 * y;
    xe = .7 * x;
    ye = .7 * y;

    ctx.bezierCurveTo(x1, y1, x2, y2, xe, ye);
    ctx.closePath();
    ctx.globalAlpha = opacity
    opacity = opacity++;
    ctx.stroke();

    x1 = 0.5 * x;
    y1 = .2 * y;
    x2 = -0.5 * x;
    y2 = .3 * y;
    xe = .7 * x;
    ye = .7 * y;
    i++;
    requestID = requestAnimationFrame(function() {
        spiderLily(xe, ye, opacity, i);
    });

    if (i > 50) {

        cancelAnimationFrame(requestID);
    }

}

function crackGround(x, y, xl, yl, i) {
    var opacity = 100;
    if (i == 0) {
        originalX = x;
        originalY = y;
        originalxl = xl;
        originalyl = yl;
    }
    ctx.beginPath();
    ctx.lineWidth = Math.pow(20 - i, 1 / 3);
    //Math.random() < 0.9 ? ctx.strokeStyle = "black" : ctx.strokeStyle = "darkred";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = "black";
    ctx.moveTo(x, y);
    ctx.lineTo(xl, yl);
    ctx.stroke();
    opacity = 0.99 * opacity;

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
        if (cubeTimes > 20) {
            console.log("STOP");
        } else {
            crackGround(originalX + 1, originalY, originalxl, originalyl, 0);
        }
    }
}
