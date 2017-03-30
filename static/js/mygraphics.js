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

function lineBreak(numChars, line) {
    var toRet = "";
    for (var i = 0; i < line.length; i++) {
        toRet = toRet + line.charAt(i).toString();
        if (i % numChars == 0) {
            if (line.charAt(i + 1) == ' ') {
                toRet = toRet + "<br>";
            }
            /*else{
                            toRet = toRet + "-<br>";
                        }*/
        }
    }
    return toRet;
}


function drawLine(ctx, startx, starty, endx, endy, color = "black", width = 10) {
    // Stroked triangle
    ctx.beginPath();
    ctx.moveTo(startx, starty);
    ctx.lineTo(endx, endy);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
}

function animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null) {
    setLine(context, i, coordinates, width, color, opacity);
    i += 1;

    if (i > (coordinates.length-1)) {
        //console.log("greater than")
        if (callback) {
            //console.log("Callback!")
            callback();
        }
        cancelAnimationFrame(window["requestID"+reqID]);
        console.log("Cancel animateLInes")

    } else {
        window["requestID"+reqID] = requestAnimationFrame(function() {
            animateLines(reqID, context, coordinates, width, color, opacity, i, callback);
        });
    }
}

function setLine(context, i, coords, width, color, opacity) {
    context.lineWidth = width;
    context.strokeStyle = color;
    context.globalAlpha = opacity;
    context.beginPath();
    if (i == 0) {
        context.moveTo(coords[i][0], coords[i][1]);
        context.lineTo(coords[i + 1][0], coords[i + 1][1]);
    } else {
        context.moveTo(coords[i - 1][0], coords[i - 1][1]);
        context.lineTo(coords[i][0], coords[i][1]);
    }
    context.closePath();
    context.stroke();
}

function generateCoordinates(start, end, step = 1, horizontal, extraCoord) {
    var coords = []
    for (var i = start; i < end; i += step) {
        if (horizontal) {
            coords.push([i, extraCoord]);
        } else {
            coords.push([extraCoord, i]);
        }
    }
    return coords;
}
