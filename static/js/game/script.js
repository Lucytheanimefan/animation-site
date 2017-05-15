var penguinWalkIsPaused = false;
var screenWidth = Math.round($(document).width());
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
var brickSequence = ["brickwall", "AoTWall"];
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

function mouseDown2DWorld() {
    $(document).keydown(function(e) {
        penguinWalkIsPaused = false;

        var penguin_x_pos = $("#container").position().left + $("#container").width() - 100; //100 offset of penguin width
        //console.log(penguin_x_pos + "," + screenWidth);

        if (Math.abs(penguin_x_pos - screenWidth) < 600) {
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
                lineCanvas.width = $("body").width() //$("#container").position().left;
                lineCanvas.height = $("body").height() //$("#container").position().top + penguinHeight;
                drawLineDesign(main_xpos);
                //beginX = $("#container").position().left + 100;
                break;
            case 40: // down
                break;

            default:
                return; // exit this handler for other keys
        }
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
    $(document).keyup(function(e) {
        //cancelAnimationFrame(penguinWalk);
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
    //reqID+=1; 
    //drawLine(lineContext, startx, starty, endx, endy, "white", 5);
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
    $(".brick").each(function(i) {
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
    if (brickSequence.length < 1) {
        console.log("3d world!");
        //mostRecentBrick = null;
        if (numBricksPassed >= numBricks) {
            console.log("NEW WORLD");
            remove2Dworld();
            create3DWorld();
        }
    } else {
        var newBrick = brickSequence.shift();
        mostRecentBrick = newBrick;
        $("#main").append("<img class='brick' id = '" + newBrick + "'src='/static/img/game/" + newBrick + ".png'>");
        $("#" + newBrick).css("left", (begin * ($(document).width() - penguinWidth)) + "px") //main_xpos + "px");
    }
}

function remove2Dworld() {
    cancelAnimationFrame(penguinWalk);
    $(document).unbind('keydown');
    $('#main').remove();
    $("body").prepend("<div id='main'></div>");
    $("#main").prepend('<div id="container"></div>');
    $("body").css({ "overflow": "hidden" });
    $("#container").css({ "left": "0px" });
    $("body").css("background-image", "");
    $("body").css("background", "None");
    $("body").css("background-repeat", "no-repeat");
}

function gameLoop() {
    penguinWalk = window.requestAnimationFrame(gameLoop);
    var standingOnBrick = ($("#container").position().left >= ($("#" + mostRecentBrick).position().left) - 200) && (($("#container").position().left + 400) <= ($("#" + mostRecentBrick).position().left + $("#" + mostRecentBrick).width() + 200));

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
