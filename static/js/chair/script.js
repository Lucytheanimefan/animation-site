$(document).ready(function() {
    createLines();
    $('audio').on('canplay', function() {
        this.play();
    });
});

var functions = {
    0: function() {
        crackGround(0, 0, 4, 4, 0);
    },
    1: function() {
        crackGround(0, 0, 3, 3, 0);
    },
    2: function() {
        //trigger a click
        var e = new jQuery.Event("click");
        e.pageX = 500;
        e.pageY = 100;
        $('#draw-picker').trigger(e);

    },
    3: function() {

    },
    4: function() {

    },
    7: function() {

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
    if (line == undefined || line.length < 1) {
        return;
    }
    var id = "line" + i;
    var string = line;
    //var string = lineBreak(50, line)
    $("#text").append("<div class='line' id = " + id + ">" + string + "</div>");
    i++;
    $("#" + id).fadeIn(i * 1000, function() {
        lineCallback(i);
        createLines();
        setTimeout(function() {
            console.log("Erase: " + (i - 3));
            $("#line" + (i - 3)).fadeOut(2000);
        }, 3000);
    });

    function lineCallback(index) {
        console.log("linecallback! " + index);
        if (index in functions) {
            functions[index.toString()]();
        }
    }
}



var maxLineLength = 17 //$('canvas').width()/1;
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


function nearestNumDivisibleByX(num, X, lowerOrUpper) {
    return Math.round((parseInt(num / X) + lowerOrUpper) * X)
}

function inBlackZone(x, y) {
    var upperBoundy = nearestNumDivisibleByX(y, 150, 1);
    var lowerBoundy = nearestNumDivisibleByX(y, 150, -1);
    var upperBoundx = nearestNumDivisibleByX(x, 150, 1);
    var lowerBoundx = nearestNumDivisibleByX(x, 150, -1);
    console.log("bounds: [" + lowerBoundx + "," + upperBoundx + "], [" + lowerBoundy + ", " + upperBoundy + "]")
        //if values are odd
    if (upperBoundx / 150 % 2 == 0) {
        return (upperBoundy / 150 % 2 != 0);
    } else {
        return (upperBoundy / 150 % 2 == 0);
    }

}
var colors = { "black": 0, "white": 1 }
var colorMap = ["white", "black"]


function crackGround(x, y, xl, yl, i = 0, lineWidth = 3, strokeColor = "black") {
    var opacity = 100;
    if (i == 0) {
        originalX = x;
        originalY = y;
        originalxl = xl;
        originalyl = yl;
    }

    ctx.lineWidth = lineWidth;
    console.log("y: " + parseInt(y))
        //switch the colors
    console.log("in black zone? " + inBlackZone(x, y))
    inBlackZone(x, y) ? strokeColor = "white" : strokeColor = "black";
    ctx.globalAlpha = opacity;
    ctx.strokeStyle = strokeColor;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(xl, yl);
    ctx.stroke();
    opacity = 0.99 * opacity;

    i++;
    Math.random() < 0.67 ? factor = 1 : factor = -1;
    y = yl
    x = xl
    xl = xl + factor * ((2 * maxLineLength) * Math.random());
    yl = yl + (maxLineLength * Math.random());
    lineWidth = lineWidth * 0.99

    requestID = requestAnimationFrame(function() {
        crackGround(x, y, xl, yl, i, lineWidth);
    });

    if (i == 300 || x > $("canvas").width() || y > $("canvas").height()) {

        cancelAnimationFrame(requestID);
        cubeTimes++;
        if (cubeTimes > 1) {
            console.log("STOP");
        } else {
            crackGround(originalX + 100, originalY, originalxl + 100, originalyl, 0);
        }
    }
}
