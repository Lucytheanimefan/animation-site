var numRingsDrawn = 2;

$(document).ready(function() {
    main();
})

function initCanvas() {
    canvas = document.getElementById('background');
}

function canvasSetup() {
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    ctx = canvas.getContext('2d');
}

function main() {
    initCanvas();
    canvasSetup();
    radius = canvas.width / 6;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    setImage("/static/img/flower/tulip.jpeg");
    animateCircles(radius, 1, 0, function() {
        drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);
        animateFullCircle(radius, centerX, centerY, function() {
            addImage(ctx, 0, true, function() {
                cutUp();
            }); //TEST IMAGE: REPLACE LATER

        });
    });
}

//animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null)
function animateCircles(radius, width = 1, id = 0, callback = null) {
    var delay = 1750;
    animateLines(id, ctx, generateCircleCoordinates(100, radius, centerX, centerY), width, "white");
    width++;
    radius++;
    id++
    circleRequestID = requestAnimationFrame(function() {
        setTimeout(function() {
            animateCircles(radius, width, id, callback);
        }, delay);
    });
    if (width > numRingsDrawn) {
        cancelAnimationFrame(circleRequestID);
        if (callback) {
            setTimeout(function() {
                callback();
            }, delay);
        }
    }
}

function animateFullCircle(rad, cX, cY, callback) {
    drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY); //white

    drawCircle(ctx, canvas, "#000", rad, cX, cY);
    setTimeout(function() {
        //console.log("redraw circle");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);

    }, 700);

    cY += 1;
    filledCircleRequestID = requestAnimationFrame(function() {
        animateFullCircle(rad, cX, cY, callback);
    });

    if (cY > canvas.height / 2 + 2 * radius) {
        cancelAnimationFrame(filledCircleRequestID);
        if (callback) {
            callback();
        }
    }

}

function drawCircle(ctx, canvas, color, radius, x, y, clearRect = false) {
    //console.log("Draw filled circle");
    if (clearRect) {
        ctx.clearRect(-50, -50, canvas.width, canvas.height);
    }
    // draw the circle
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, false);
    ctx.closePath();

    // color in the circle
    ctx.fillStyle = color;
    ctx.fill();
}

function generateCircleCoordinates(steps, radius, centerX, centerY) {
    var coords = [];
    for (var i = 0; i <= steps; i++) {
        var x = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
        var y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
        coords[i] = [x, y];
    }
    return coords;
}
//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
function setImage(imagePath) {
    base_image = new Image();
    base_image.src = imagePath;
}

function addImage(ctx, alpha = 0, animate = true, callback = null) {
    console.log("Added image?");
    ctx.globalAlpha = 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);
    ctx.globalAlpha = alpha;
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(base_image, centerX - radius, centerY - radius, radius * 2, radius * 2);
    ctx.restore();
    if (animate) {
        alpha += 0.01;
        imageRequestId = requestAnimationFrame(function() {
            addImage(ctx, alpha, true, callback);
        });
    } else {
        alpha = 1;
    }

    if (alpha > 1) {
        //ctx.restore();
        cancelAnimationFrame(imageRequestId);
        if (callback) {
            callback();
        }
    }
}
//animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null) 
function cutUp() {
    var rad = radius * .7;
    var coords = generateCircleCoordinates(50, rad + 20, centerX, centerY);
    var particleCoords = generateCircleCoordinates(50, radius, centerX - 20, centerY);
    for (var i = 0; i < coords.length; i++) {
        animateLines(i, ctx, generateCircleCoordinates(100, rad, coords[i][0], coords[i][1]), 1, "white", 0.5, 0);
    }
    setTimeout(function() {
        cropImage(particleCoords, 25, 25);
    }, 1000);

}

function cropImage(coords, width = 50, height = 50, j = 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    addImage(ctx, 1, false);
    var xCrop = getRandomInt(centerX - radius + width, centerX + radius - width);
    var yCrop = getRandomInt(centerY - radius + height, centerY + radius - height);
    var cropRegion = [{ x: xCrop, y: yCrop },
        { x: xCrop + width, y: yCrop + height }
    ];
    var croppedCan = crop(cropRegion[0], cropRegion[1]);
    // Create an image for the new canvas.
    var image = new Image();
    image.src = croppedCan.toDataURL();
    var x = coords[j][0];
    var y = coords[j][1];
    image.onload = function() {
        animateCroppedImage(image, x, y, width, height, j);
    }

    if ((j + 1) >= coords.length) {
        return;
    }
    j += 1;
    cropImage(coords, width, height, j);

}

function animateCroppedImage(image, x, y, width, height, j, i = 0) {
    ctx.drawImage(image, x + width, y + height, width, height);
    var plusOrMinus = Math.random() < 0.5 ? -1 : 1;
    var plusOrMinus1 = Math.random() < 0.5 ? -1 : 1;
    x += plusOrMinus*10;
    y += plusOrMinus1*10;
    i += 1;
    window["crop" + i + j + "id"] = requestAnimationFrame(function() {
        animateCroppedImage(image, x, y, width, height, j);

    });
    if (x <= 0) {
        console.log("Cancel animation frame for cropped image: " + j)
        cancelAnimationFrame(window["crop" + i + j + "id"]);
    }
}

function crop(a, b) {
    // get the image data you want to keep.
    var imageData = ctx.getImageData(a.x, a.y, b.x, b.y);

    // create a new cavnas same as clipped size and a context
    var newCan = document.createElement('canvas');
    newCan.width = b.x - a.x;
    newCan.height = b.y - a.y;
    var newCtx = newCan.getContext('2d');

    // put the clipped image on the new canvas.
    newCtx.putImageData(imageData, 0, 0);

    return newCan;
}

/**
 * [generateDiagonalCoordinates description]
 * @param  {Object} startEnd {"start":[x,y],"end":[x1,y1]}
 * @return {[type]}          [description]
 */
function generateDiagonalCoordinates(startEnd, step = 1) {

    var start = startEnd["start"];
    var end = startEnd["end"];
    var newX = start[0];
    var newY = start[1];
    var coords = [start];
    if (end[0] > start[0]) {
        addX = step;
    } else {
        addX = -step;
    }
    if (end[1] > start[1]) {
        addY = step;
    } else {
        addY = -step;
    }
    while (newX != end[0] && newY != end[1]) {
        newX = newX + addX;
        newY = newY + addY;
        coords.push([newX, newY]);

    }
    console.log(coords);
    return coords;

}
