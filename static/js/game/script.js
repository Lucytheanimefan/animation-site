var penguinWalkIsPaused = false;
var screenWidth = Math.round($(document).width());
//animation sprite images penguins
container = $("#container");
container.append("<canvas id='penguins'></canvas>");
canvas = document.getElementById("penguins");
var penguinHeight = 237;
canvas.width = 400;
canvas.height = penguinHeight;
ctx = canvas.getContext("2d");
var penguins = new Image();
penguins.src = "/static/img/game/penguins.png";


var penguinWalk;

var brickSequence = ["brickwall", "AoTWall"];

$(document).ready(function() {
    //create3DWorld();
    //create2DWorld();
    mouseDown2DWorld();
    updateBricks();
})

var background_xpos = 0;
var main_xpos = 0;
var speed = 1;

function mouseDown2DWorld() {
    $(document).keydown(function(e) {
        penguinWalkIsPaused = false;

        var penguin_x_pos = $("#container").position().left + $("#container").width() - 100; //100 offset of penguin width
        //console.log(penguin_x_pos + "," + screenWidth);
        if (Math.abs(penguin_x_pos - screenWidth) < 15) {
            updateBricks();
        }
        switch (e.which) {
            case 37: // left
                if ((background_xpos + speed) < 0) {
                    background_xpos += speed;
                    main_xpos -= speed;
                    $('body').css('background-position', background_xpos + 'px 0');
                    $(".brick").css('left',background_xpos+"px");
                    $("#container").css("left", main_xpos + "px");
                    if (speed < 15) {
                        speed += 1;
                    }
                }
            case 38: // up
                break;

            case 39: // right
                console.log("Speed: " + speed);
                background_xpos -= speed;
                main_xpos += speed;
                $("#container").css("left", main_xpos + "px");
                $(".brick").css('left',background_xpos+"px");
                $('body').css('background-position', background_xpos + 'px 0');
                if (speed < 15) {
                    speed += 1;
                }
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
        speed = 1;
        e.preventDefault(); // prevent the default action (scroll / move caret)
    });
}

function updateBricks() {
    //$(".brick").remove();
    //$("#container").css("left", 0 + "px");
    //$('body').css('background-position', background_xpos + 'px 0');
    //background_xpos = 0;
    //add bricks
    if (brickSequence.length < 1) {
        console.log("no more bricks")
    } else {

        var newBrick = brickSequence.shift();
        $("#main").append("<img class='brick' id = '" + newBrick + "'src='/static/img/game/" + newBrick + ".png'>");
    }
}

function gameLoop() {
    penguinWalk = window.requestAnimationFrame(gameLoop);
    formatPenguin(".brick");
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
        $("#penguins").css("margin-top", Math.round($(document).height() - penguinHeight));
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
//coinImage.src = "images/coin-sprite-animation.png";
