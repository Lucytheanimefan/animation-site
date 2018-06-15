$(document).ready(function() {
    setTimeout(function() {
        createLines();
    }, 6500);

    //var audio = new Audio('/static/sound/Tokyo_Ghoul_unravel_tv.mp3');
    //audio.play();
    /*
    soundManager.url = '/path/to/swf-files/';

    soundManager.onready(function() {
        soundManager.createSound({
            id: 'unravel',
            url: '/static/sound/Tokyo_Ghoul_unravel_tv.mp3'
        });
        soundManager.play('unravel');
    });
    */
});

var functions = {
    0: function() {
        crackGround(0, 0, 4, 4, 0);
    },
    1: function() {
        crackGround(0, 0, 3, 3, 0);
    },
    2: function() {


    },
    3: function() {

    },
    4: function() {
        setTimeout(function() {
            breakGlass(500, 100);
        }, 300);

    },
    8: function() {
        setTimeout(function() {
            breakGlass(600, 450);
        }, 1500);

    },
    14: function() {
        for (var i = 0; i < 10; i++) {
            crackGround(0, 0, i, i, 0);
            setTimeout(function() {
                breakGlass(i * 50, i * 70);
            }, i*50);

        }

    },
    15: function() {
        breakGlass(900, 700);
    },
    16: function() {
        clearAll();
    },
    17: function() {
        credits();
    }
}

function clearAll() {
    //remove!!
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    $(".wrapper").fadeOut(8000);
    $("#background").fadeOut(8000);
}

function breakGlass(x, y) {
    //trigger a click
    var e = new jQuery.Event("click");
    e.pageX = x;
    e.pageY = y;
    $('#draw-picker').trigger(e);
}

function credits() {
    $("#main").append("<h1>Song: Unravel by Ling Tosite Sigure. Tokyo Ghoul opening 1.</h1>");
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
    $("#" + id).fadeIn(i * 500, function() {
        lineCallback(i);
        createLines();
        /*
        setTimeout(function() {
            console.log("Erase: " + (i - 4));
            $("#line" + (i - 4)).fadeOut(5000);
        }, 5000);
        */
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


function crackGround(x, y, xl, yl, i = 0, lineWidth = 1, strokeColor = "black") {
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
