var numRingsDrawn = 2;
var theta = generateTheta(0, 360, 1);
console.log(theta);
var k = 7; //number petals
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

function generateTheta(min, max, step) {
    var theta = []
    for (var i = min; i < max; i += step) {
        theta.push(i);
    }

    return theta;
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

//context.arc(x,y,r,sAngle,eAngle,counterclockwise);
//context.drawImage(img,sx,sy,swidth,sheight,x,y,width,height);
function setImage(imagePath) {
    base_image = new Image();
    base_image.src = imagePath;
}

function addImage(ctx, alpha = 0, animate = true, callback = null) {
    //console.log("Added image?");
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
    var particleCoords = generateCircleCoordinates(100, radius, centerX - 20, centerY);
    animateCircularRings(rad, coords);
    setTimeout(function() {
        cropImage(particleCoords, 25, 25);
    }, 1700);

}

function animateCircularRings(rad, coords) {
    for (var i = 0; i < coords.length; i++) {
        animateLines(i, ctx, generateCircleCoordinates(100, rad, coords[i][0], coords[i][1]), 1, "white", 0.5, 0);
    }
}

function cropImage(coords, width = 50, height = 50, j = 0) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    //addImage(ctx, 1, false);
    var xCrop = getRandomInt(centerX - radius + width, centerX + radius - width);
    var yCrop = getRandomInt(centerY - radius + height, centerY + radius - height);
    var cropRegion = [{ x: xCrop, y: yCrop },
        { x: xCrop + width, y: yCrop + height }
    ];
    var croppedCan = crop(cropRegion[0], cropRegion[1]);
    // Create an image for the new canvas.
    var image = new Image();
    image.src = croppedCan.toDataURL();
    if ((j + 1) >= coords.length) {
        return;
    }
    var x = coords[j][0];
    var y = coords[j][1];
    image.onload = function() {
        animateCroppedImage(image, x, y, width/4, height/4, j);
        j += 1;
        cropImage(coords, width, height, j);
    }
    

}

function toDegrees(degree) {
    return degree;
    //return Math.sin(degree * Math.PI / 180.0)
}

function animateCroppedImage(image, x, y, width, height, j, i = 0, radian = 0) {
    ctx.drawImage(image, x + width, y + height, width, height);
    x = 400 * toDegrees(Math.cos(k * radian) * Math.cos(radian)) + centerX;
    y = 400 * toDegrees(Math.cos(k * radian) * Math.sin(radian)) + centerY;
    //console.log("theta: " + theta[i]);
    //console.log(x + "," + y)
    i += 1;
    radian += 0.1;
    window["crop" + j + "id"] = requestAnimationFrame(function() {
        animateCroppedImage(image, x, y, width, height, j, i, radian);

    });
    if (i >= 600) {
        console.log("Cancel animation frame for cropped image: " + "crop" + j + "id");
        cancelAnimationFrame(window["crop" + j + "id"]);
    }
}
