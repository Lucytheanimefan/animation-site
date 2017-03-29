$(document).ready(function() {
    main();
})


function main() {
    canvas = document.getElementById('background');
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    ctx = canvas.getContext('2d');
    radius = canvas.width / 6;
    centerX = canvas.width / 2;
    centerY = canvas.height / 2;
    animateCircles(radius, 1, 0, function() {
        drawCircle(ctx, canvas, "#FFF", radius, centerX, centerY);
        animateFullCircle(radius, centerX, centerY, function() {
            addImage(ctx, "/static/img/butterfly/butterfly1.png"); //TEST IMAGE: REPLACE LATER
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
    if (width > 2) {
        console.log("Cancel")
        cancelAnimationFrame(circleRequestID);
        if (callback) {
            console.log("Callback")
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
        console.log("redraw circle");
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
            setTimeout(function() {
                console.log("Animate full circle callback");
                callback();
            }, 1000);
        }
    }

}

function drawCircle(ctx, canvas, color, radius, x, y, clearRect = false) {
    console.log("Draw filled circle");
    if (clearRect) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
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
function addImage(ctx, imagePath) {
    console.log("Added image?");
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();
    //ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true); // you can use any shape
    //ctx.clip();
    base_image = new Image();
    base_image.src = imagePath;
    base_image.onload = function() {
            ctx.drawImage(base_image, centerX - radius, centerY - radius, radius * 2, radius * 2);
            //possibly more efficient to insert image in html first so no need for load
        }
        //ctx.drawImage(base_image, centerX - radius, centerY - radius, radius * 2, radius * 2);
/*
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    ctx.clip();
    ctx.closePath();
    ctx.restore();
    */
}
