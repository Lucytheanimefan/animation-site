var penguinWalkIsPaused = false;
var screenWidth = Math.round($(window).width());
//animation sprite images penguins
container = $("#container");
container.append("<canvas class='penguinCanvas'id='penguins'></canvas>");
container.after("<canvas class='penguinCanvas' id='lineDesign'></canvas>");
canvas = document.getElementById("penguins");
lineCanvas = document.getElementById("lineDesign");
lineContext = lineCanvas.getContext("2d");
var penguinHeight = 237;
var penguinWidth = 400;
canvas.width = penguinWidth;
canvas.height = penguinHeight;
ctx = canvas.getContext("2d");
var penguins = new Image();
penguins.src = "/static/img/game/penguins.png";

var noBrickHeight = $(document).height() - penguinHeight;
var penguinWalk;
var brickSequence = [{ "name": "brickwall", "class": "brick", "x": 0 },
    { "name": "AoTWall", "class": "brick", "x": 1400 },
    { "name": "piano", "class": "piano", "x": 2300 },
    { "name": "door", "class": "brick", "x": 3000 },
    { "name": "lolipop1", "class": "lolipop" },
    { "name": "lolipop2", "class": "lolipop" }
];
var numBricks = brickSequence.length;
var background_xpos = 0;
var main_xpos = 0;
var background_speed = 1;
var penguin_speed = 0.5;

var mostRecentBrick = null;
var numBricksPassed = -1;


//line design
var beginX = 0;

$(document).ready(function() {
    create2DWorld();
    //create3DWorld();
})


function create2DWorld() {
    setTimeout(function() {
        penguinWalkIsPaused = true;
    }, 100);
    mouseDown2DWorld();
    updateBricks(0);
}

function finishedTravelingAcrossElement(element, penguin_x_pos) {
    var width = $(element).width();
    var position = $(element).position();
    var max_x_pos = position.left + width;
    return (penguin_x_pos > max_x_pos);
}

function mouseDown2DWorld() {
    $(document).keydown(function(e) {
        penguinWalkIsPaused = false;
        var penguin_x_pos = $("#container").position().left + $("#container").width() - 100;
        if (finishedTravelingAcrossElement("#" + mostRecentBrick, penguin_x_pos)) {
            console.log("Call update Bricks");
            updateBricks();
        }

        switch (e.which) {
            /*
            case 37: // left
                if ((background_xpos + background_speed) < 0) {
                    background_xpos += background_speed;
                    main_xpos -= penguin_speed;
                    updatePenguinPositions(false);
                    updateSpeeds();
                }
                break;
                */
            case 38: // up
                //jump
                $("#container").animate({ top: '-=70px' }, 250, function() {
                    $("#container").animate({ top: '+=70px' }, 250);
                });

                break;

            case 39: // right
                background_xpos -= background_speed;
                main_xpos += penguin_speed;
                var offScreen = main_xpos > ($("body").width() - 100);
                if (offScreen) {
                    main_xpos = -200;
                }
                updatePenguinPositions();
                updateSpeeds();
                lineCanvas.width = $("body").width();
                lineCanvas.height = $("body").height();
                break;
            case 40: // down
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    $(document).keyup(function(e) {
        penguinWalkIsPaused = true;
        background_speed = 1;
        penguin_speed = 0.5;
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
}

var reqID = 0;

function drawLineDesign(endIndex) {
    var coordinates = penguinCoordinates();
    if (endIndex > coordinates.length) {
        //create 3d world gate
        endIndex = endIndex % coordinates.length;
    }
    animateLines(reqID, lineContext, coordinates.slice(0, endIndex), 1, "white");
}

function penguinCoordinates() {
    var factor = 5;
    var coordinates = [];
    var i = 0;
    for (var t = -6; t < 6; t += 0.1) {
        var marg = parseInt($("#penguins").css("margin-top"));
        var x = 2.5 * Math.pow(Math.sin(-5 * t), 2) * Math.pow(2, Math.cos(Math.cos(4.28 * 2.3 * t)));
        var y = 2.5 * Math.sin(Math.sin(-5 * t)) * Math.pow(Math.cos(4.28 * 2.3 * t), 2);
        coordinates[i] = [x * factor + main_xpos, y * factor + marg];
        i += 1;
    }
    return coordinates
}

function updatePenguinPositions(right = true) {
    var dir = right ? -1 : 1;
    $(".brickElement").each(function(i) {
        $(this).css("left", $(this).position().left + dir * background_speed);
    })
    $('body').css('background-position', background_xpos + 'px 0');
    $("#container").css("left", main_xpos + "px");
}

function updateSpeeds() {
    if (background_speed < 15) {
        background_speed += 1;
        penguin_speed += 0.5;
    }
}

function updateBricks(begin = 1) {
    //console.log("update Bricks");
    if (brickSequence.length < 1) {
        if (numBricksPassed >= numBricks) {
            console.log("DONE DONE DONE ------- NEW WORLD");
            //no 3d world for now
            //remove2Dworld();
            //create3DWorld();
        }
    } else {
        var newBrick = brickSequence.shift();
        var newBrickName = newBrick["name"];
        var newBrickClass = newBrick["class"];
        mostRecentBrick = newBrickName;
        $("#main").append("<img class='" + newBrickClass + " brickElement' id = '" + newBrickName + "'src='/static/img/game/" + newBrickName + ".png'>");
        $("#" + newBrickName).css("left", (begin * ($(window).width() - penguinWidth) + main_xpos) + "px");
    }
}

function remove2Dworld() {
    cancelAnimationFrame(penguinWalk);
    $(document).unbind('keydown');
    $('#main').remove();
    $("body").prepend("<div id='main'></div>");
    $("#main").prepend('<div id="container3d"></div>');
    $("body").css({ "overflow": "hidden" });
    $("body").css("background-image", "");
    $("body").css("background", "None");
    $("body").css("background-repeat", "no-repeat");
    $("#container3d").css({ "left": "0px" });
}

function gameLoop() {
    penguinWalk = window.requestAnimationFrame(gameLoop);
    var standingOnBrick = ($("#container").position().left >= ($("#" + mostRecentBrick).position().left) - 200) && (($("#container").position().left + 400) <= ($("#" + mostRecentBrick).position().left + $("#" + mostRecentBrick).width() + 200));
    var bottomYCoord = $(window).height() - $("#penguins").position().top - $("#penguins").height();

    var passedBrick = $("#container").position().left >= ($("#" + mostRecentBrick).position().left + $(document).width() - 10);
    if (passedBrick) {
        numBricksPassed += 1;
    }

    if (standingOnBrick) {
        formatPenguin("#" + mostRecentBrick);
    } else {
        formatPenguin();
    }
    if (!penguinWalkIsPaused) {
        penguin.update();
        penguin.render();
    }
}

function formatPenguin(brickID = null) {
    if ($(brickID).height()) {
        var margin_top = Math.round($(document).height() - $(brickID).height() - penguinHeight);
        $("#penguins").css("margin-top", margin_top);
    } else {
        $("#penguins").css("margin-top", noBrickHeight);
    }
}

function sprite(options) {
    var that = {},
        frameIndex = 0,
        tickCount = 0,
        ticksPerFrame = options.ticksPerFrame || 0,
        numberOfFrames = options.numberOfFrames || 1;

    that.context = options.context;
    that.width = options.width;
    that.height = options.height;
    that.image = options.image;

    that.update = function() {
        tickCount += 1;
        if (tickCount > ticksPerFrame) {
            tickCount = 0;
            // If the current frame index is in range
            if (frameIndex < numberOfFrames - 1) {
                // Go to the next frame
                frameIndex += 1;
            } else {
                frameIndex = 0;
            }
        }
    };

    that.render = function() {
        // Clear the canvas
        that.context.clearRect(0, 0, that.width, that.height);
        // Draw the animation
        that.context.drawImage(
            that.image,
            frameIndex * that.width / numberOfFrames,
            0,
            that.width / numberOfFrames,
            that.height,
            0,
            0,
            that.width / numberOfFrames,
            that.height);
    };
    return that;
}

var penguin = sprite({
    context: ctx,
    width: 2400,
    height: 237,
    image: penguins,
    numberOfFrames: 6,
    ticksPerFrame: 6
})

// Load sprite sheet
penguins.addEventListener("load", gameLoop);
