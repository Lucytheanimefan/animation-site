var canvas = $("canvas");
var clickCount = 1;
var timeElapsed = 0;
var w = 5;
var h = w;
var alphaDiff = 0.0005
var maxOpacity = 200;
var darkonplaying = true;
var darkonpause = false;
var audioDarkLoop = new Audio("/static/sound/DarkLoop3.mp3"); //black spreading
//infinite loop
audioDarkLoop.loop = true;

var audioEnding = new Audio("/static/sound/ending.mp3");
var audioIntro = new Audio("/static/sound/Intro.mp3");
audioIntro.addEventListener('ended', function() {
    beginButterflyScene();
});
var audioButterfly = new Audio("/static/sound/butterfly.mp3"); //main theme
audioButterfly.addEventListener('ended', function() {
    audioEnding.play();
    endingSequence();
});



var continueBlackness = false;
var continueButterfly = false;
var typingSpeed = 54;

var container1 = document.querySelector('.container1');
var container2 = document.querySelector('.container2');
var butterflyWingspan = 30;
var rotationDamping = 10;
var butterflyPath = {
    'butterfly1': [],
    'butterfly2': []
};

function beginButterflyScene() {
    $(".headline").remove();
    $(".container").fadeIn(500);
    $("#background").fadeIn(500);
    mouseUpMouseDownFunctionality();
}

function autoType(elementClass, typingSpeed) {
    var thhis = $(elementClass);
    thhis.css({
        "position": "relative",
        "display": "inline-block"
    });
    thhis.prepend('<div class="cursor" style="right: initial; left:0;"></div>');
    thhis = thhis.find(".text-js");
    var text = thhis.text().trim().split('');
    amntOfChars = text.length;
    var newString = "";
    thhis.text("|");
    setTimeout(function() {
        thhis.css("opacity", 1);
        thhis.prev().removeAttr("style");
        thhis.text("");
        for (var i = 0; i < amntOfChars; i++) {
            (function(i, char) {
                setTimeout(function() {
                    newString += char;
                    thhis.text(newString);
                }, i * typingSpeed);
            })(i + 1, text[i]);
        }
    }, 1500);
}

$(document).ready(function() {
    butterflyCurve();
    hourGlassCurve();
    flowerCurve();
    polyLineCurve();
    circleCurve();
    localStorage.setItem("butterflyPaths", JSON.stringify(butterflyPath));

    audioIntro.play();
    $(".container").css("display", 'none');
    $("#background").css("display", 'none');
    autoType(".type-js", typingSpeed);
    var timeToWait1 = amntOfChars * typingSpeed;
    setTimeout(function() {
        autoType(".type-js2", typingSpeed);
    }, timeToWait1);

    //beginButterflyScene(); //for testing
});


var ctx = canvas[0].getContext("2d"),
    width = $(document).width(),
    height = $(document).height(),
    a, b;

canvas.attr("width", width);
canvas.attr("height", height);

//audio1.onended=function(){
function endingSequence() {
    $(document).unbind("mousedown");
    $(document).unbind("mouseup");
    lostCurve();
    clearInterval(butterflyID);
    ctx.fillStyle = "black";
    continueBlackness = true;
    spawnBlackness(500, 500, w, h, 0.1, 0, 16);
    spawnBlackness(100, 100, w, h, 0.1, 0, 16);
    spawnBlackness(100, 400, w, h, 0.1, 0, 16);
    spawnBlackness(100, 800, w, h, 0.1, 0, 16);
    spawnBlackness(400, 100, w, h, 0.1, 0, 16);
    spawnBlackness(400, 400, w, h, 0.1, 0, 16);
    spawnBlackness(400, 700, w, h, 0.1, 0, 16);
    spawnBlackness(800, 700, w, h, 0.1, 0, 16);
    spawnBlackness(800, 400, w, h, 0.1, 0, 16);
    spawnBlackness(800, 100, w, h, 0.1, 0, 16);

    moveTo([450, 400], container2, "butterfly2");
    clearInterval(butterflyID);
    butterflyPath["butterfly2"] = [];
    butterflyID = setInterval(function() {
        if (butterflyPath["butterfly2"].length <= 1) {
            clearInterval(butterflyID);
        }
        moveTo(butterflyPath["butterfly2"].shift(), container2, "butterfly2");
    }, 500);
    setTimeout(function() {
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        $(document).css("background-color", "black");
        continueBlackness = false;
    }, 8000);
    $(".container1").remove();
    $(".container2").css('z-index', 99);
    $(".wing2").css('background', 'radial-gradient(ellipse at center, rgba(50, 50, 50, 0.9) 10%, rgba(255, 255, 255, 0.9) 100%)');
    $('head').append('<style>.wing2:after{background:radial-gradient(ellipse at center, rgba(50, 50, 50, 0.9) 10%, rgba(255, 255, 255, 0.9) 100%) !important;}</style>');
}

var requestAnimationFrame = window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame;

var totalSongLength = 169;

function mouseUpMouseDownFunctionality() {
    $(document).mousedown(function() {
        audioButterfly.play();
        startTime = new Date();
        if (!audioDarkLoop.paused) { //hack to avoid Promise Error
            audioDarkLoop.pause();
        }
        continueBlackness = false;
        continueButterfly = true;
        butterflyID = setInterval(function() {
            if (butterflyPath["butterfly1"].length <= 1 || butterflyPath["butterfly2"].length <= 1) {
                flowerCurve();
                polyLineCurve();
                circleCurve();
            }
            moveTo(butterflyPath["butterfly1"].shift(), container1, "butterfly1");
            moveTo(butterflyPath["butterfly2"].shift(), container2, "butterfly2");
        }, 500);

    }).mouseup(function(e) {
        audioButterfly.pause();
        endTime = new Date();
        timeDiff = endTime - startTime;
        timeDiff /= 1000;
        timeElapsed = timeElapsed + Math.round(timeDiff % 60);
        console.log(timeElapsed);
        var spread = Math.round(16 * totalSongLength / timeElapsed);
        console.log("spread: " + spread);
        //hack to avoid Promise Error
        setTimeout(function() {
            if (audioDarkLoop.paused) {
                audioDarkLoop.play();
            }
        }, 150);

        continueBlackness = true;
        continueButterfly = false;
        clearInterval(butterflyID);
        spawnBlackness(e.pageX, e.pageY, w, h, 0.1, 0, spread);
        spawnBlackness(e.pageX, e.pageY, w, h, 0.1, 0, spread);
        spawnBlackness(e.pageX, e.pageY, w, h, 0.1, 0, spread);
        spawnBlackness(e.pageX, e.pageY, w, h, 0.1, 0, spread);
        spawnBlackness(e.pageX, e.pageY, w, h, 0.1, 0, spread);
    })
}


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

function spawnBlackness(x, y, width, height, alpha, i, spread = 10) {
    //console.log("width: " + width + "; height: " + height)
    var rand = getRandomInt(-100, 100);
    //alpha += alphaDiff;
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
        spawnBlackness(x, y, width, height, alpha, i, spread);
        if (i % spread == 0) {
            spawnBlackness(x, y, width, height, alpha, i, spread);
        }

    });
    if (!continueBlackness) {
        cancelAnimationFrame(requestID);
    }
}

/*--------butterfly animation---------*/

var lambda = 0.5;

function butterflyCurve() {
    var coordinates = [];
    for (t = 0; t < 70; t++) {
        var x = Math.sin(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5));
        var y = Math.cos(t) * (Math.pow(Math.E, Math.cos(t)) - 2 * Math.cos(lambda * t) - Math.pow(Math.sin(t / 12), 5));
        var coordinates = [300 * x + 300, 300 * y + 200];
        if (t % 2 == 0) {
            butterflyPath['butterfly1'].push(coordinates);
        } else {
            butterflyPath['butterfly2'].push(coordinates);
        }
    }

}

//hanging out?
function flowerCurve() {
    var k = 8;
    for (var theta = 0; theta < 30; theta++) {
        var coordinates = [];
        var x = Math.cos(k * theta);
        var y = Math.cos(k * theta);
        var x1 = Math.cos(k * (theta + 1));
        var y1 = Math.cos(k * (theta + 1));
        butterflyPath['butterfly1'].push([300 * x + 400, 400 * y + 400]);
        butterflyPath['butterfly2'].push([300 * x1 + 400, 400 * y1 + 400])
    }

}


function polyLineCurve() {
    for (var x = 0; x < 30; x++) {
        var y = 700 * Math.sin(x) + 300;
        var x1 = x + 1;
        var y1 = 700 * Math.sin(x1) + 300;
        butterflyPath['butterfly1'].push([20 * (x + 5), y]);
        butterflyPath['butterfly2'].push([20 * x1 + 200, y1]);
    }
}

function circleCurve() {
    for (var t = 0; t < 14; t += 0.7) {
        var x = Math.cos(t);
        var y = Math.sin(t);
        var x1 = Math.cos(t + 0.1);
        var y1 = Math.sin(t + 0.1);
        butterflyPath['butterfly1'].push([300 * x + 350, 300 * y + 330]);
        butterflyPath['butterfly2'].push([300 * x1 + 380, 300 * y1 + 430]);
    }

}

function hourGlassCurve() {
    for (var t = -50; t < 50; t++) {
        var x = 2 * Math.cos(3 * t);
        var y = 3 * Math.sin(t);
        var x1 = 2 * Math.cos(3 * (-1 * t));
        var y1 = 3 * Math.sin(-1 * t);
        butterflyPath['butterfly1'].push([300 * x + 400, 200 * y + 300]);
        butterflyPath['butterfly2'].push([300 * x1 + 400, 200 * y1 + 300]);
    }
}

function lostCurve() {
    butterflyPath['butterfly2'].push([450, 400]);
    butterflyPath['butterfly2'].push([100, 100]);
    butterflyPath['butterfly2'].push([800, 100]);
    butterflyPath['butterfly2'].push([100, 800]);
    butterflyPath['butterfly2'].push([800, 800]);
    butterflyPath['butterfly2'].push([450, 400]);

}

function moveTo(coords, container, path) {
    var currentX = parseInt(container.style.left, 10);
    var currentY = parseInt(container.style.top, 10);
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

}
