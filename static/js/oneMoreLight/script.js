var youtubecode = "3kaUvGSLMew";
var player;
var timeInterval;
var starAnimationID;
var stop = false;
var normalStar = true;
var finale = false;
var decreaseStars = false;
var decreaseStarRate = 5;
var flicker = false;
var flickerOnce = false;
var spiralStars = false;
var circleStars = false;
var shootingStars = false;
var counter = 0;
var maxRadius = 10;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 40, // Frames per second
    x = 1000 //canvas.width; // Number of stars


var radiusDiff = 0.005;
var alphaDiff = 0.12;
var diff = 0.01;
var spiralCoords = spiralCoordinates(720, 10);
var circleCoords = circleCoordinates(canvas.width / 2, 0.75 * canvas.height, 800, canvas.width / 2).concat(circleCoordinates(canvas.width / 3, canvas.height / 3, 800, canvas.width / 3));
var shootingStarCoords1 = generateDiagonalCoordinates({ "start": [0, canvas.height], "end": [canvas.width, 0] });
var shootingStarCoords2 = generateDiagonalCoordinates({ "start": [canvas.width, 0], "end": [0, canvas.height] });



// 72 - who cares
// 74 seconds - when one more light goes our
// // 79 - flickers
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '200',
        width: '300',
        videoId: youtubecode,
        playerVars: { 'autoplay': 1, 'controls': 1 },
        events: {
            onReady: initialize,
            onStateChange: onStateChange
        }
    });
}

function onStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            //console.log("Video ended");
            cancel(true);
            break;
        case YT.PlayerState.PLAYING:
            stop = false;
            //console.log("Video playing");
            updateTimerDisplay();
            break;
        case YT.PlayerState.PAUSED:
            //console.log("Video paused");
            cancel();
            break;
        case YT.PlayerState.BUFFERING:
            //console.log("Video buffering");
            cancel();
            break;
        case YT.PlayerState.CUED:
            //console.log("Video cued");
            break;
        default:
            //console.log("nothing");
    }
}

function initialize() {
    //console.log("Change background");
    $('body').animate({ backgroundColor: 'black' }, 27 * 1000);
    updateTimerDisplay();
}

function cancel(final = false) {
    stop = true;
    clearInterval(timeInterval);
    if (final) {
        cancelAnimationFrame(starAnimationID);
    }
}

// This function is called by initialize()
function updateTimerDisplay() {
    timeInterval = setInterval(function() {
        var time = player.getCurrentTime();
        console.log(time);
        if (time > 27) // after background fades to black, start the stars
        {
            ctx.globalAlpha = 1;
            tick();
        }
        if (time >= 75 && time < 79) {
            normalStar = false;
            decreaseStars = true;
        } else if (time >= 79 && time < 81) {
            decreaseStars = false;
            if (!flickerOnce) {
                flickerOnce = true;
                ctx.globalAlpha = 0;
                // single star
                stars = [];
                replenishStar(canvas.width / 2, canvas.height / 2, 1, 0, 0);
            }
        } else if (time >= 81 && time <= 83) {
            flicker = true;
        } else if (time > 83 && time < 101) {
            flicker = false;
            if (!spiralStars) {
                stars = []; // just empty it once
            }
            spiralStars = true;
        } else if (time > 101 && time <= 109) { // spiral is done
            decreaseStars = true;
            spiralStars = false;
            counter = 0; // reset counter
        } else if (time > 109 && time < 130) { // circle ish sprinkle ish stars
            decreaseStars = false
            circleStars = true;
        } else if (time >= 130 && time <= 151) {
            decreaseStars = true;
            circleCoords = circleCoords.concat(circleCoordinates(canvas.width / 2, 0.85 * canvas.height, 500, canvas.width / 2.2));
            decreaseStarRate = 100;
        } else if (time > 152 && time <= 159) {
            shootingStars = true;
        } else if (time > 161 && time < 164) {


            stars = []
        } else if (time >= 164 && time < 170) {
            decreaseStars = true;
            decreaseStarRate = 70;
        } else if (time > 170 && time < 175) {
            shootingStars = false;
            maxRadius = 5;
            alphaDiff = 0.2;
            spiralCoords = spiralCoordinates(700, 4);
            flicker = true;
        } else if (time >= 180 && time < 200) {
            decreaseStarRate = 50;
            maxRadius = 2;
        } else if (time >= 200 && time < 210) {
            decreaseStarRate = 5;
        } else if (time > 217 && time < 227) {
            flicker = false;
            spiralStars = true;
            finale = true;
            decreaseStars = false;
            circleStars = true;
        } else if (time > 227) {
            flicker = true;
            maxRadius = 5;
            decreaseStarRate = 20;
        } else if (time > 227 && time < 232) {
            maxRadius = 4;
            decreaseStars = true;
            //circleStars = false;
            spiralStars = false;
            decreaseStarRate = 7;
        } else if (time >= 232) {
            maxRadius = 2;
            stars = [];
            replenishStar(canvas.width / 2, canvas.height / 2, 2, 0, 0);
        } else if (time > 244) {
            maxRadius = 1;
            decreaseStarRate = 1;
        }

        //console.log(player.getCurrentTime());
    }, 1500);
}

function formatTime(time) {
    time = Math.round(time);
    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    return minutes + ":" + seconds;
}

/* -------------- stars ------------------ */
/*
for (var i = 0; i < x; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random(),
        vx: Math.floor(Math.random() * 10) - 5,
        vy: Math.floor(Math.random() * 10) - 5
    });
}
*/

//console.log("stars: ")
//console.log(stars)


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    if (normalStar) {
        counter += 1;
        if (counter % 40 == 0) {
            replenishRandomStar();
        }
    }

    if (decreaseStars) {
        counter += 1;
        if (counter % decreaseStarRate == 0) {
            stars.pop();
        }
    }
    if (spiralStars && spiralCoords.length > 1) {
        var vx = 1 //Math.floor(Math.random() * 10) - 5;
        var vy = 1;
        if (finale) {
            vx = Math.random();
            vy = -1; //Math.random();
        }
        counter += 1;
        if (counter % 30 == 0) {
            var coordinateSet = spiralCoords.pop();
            //console.log("Replenish spiral star");
            replenishStar(coordinateSet[0], coordinateSet[1], Math.random(), vx, vy);
        }
        //console.log("star spiral length: "+ stars.length);
    }

    if (circleStars && circleCoords.length > 1) {
        counter += 1
        vx = 2;
        vy = 2;
        if (counter % 40 == 0) {
            var coordinateSet = circleCoords.pop();
            replenishStar(coordinateSet[0], coordinateSet[1], Math.random(), vx * Math.random(), vy * Math.random());
        }
    }

    if (shootingStars && (shootingStarCoords1.length > 1 || shootingStarCoords2.length > 1)) {
        counter += 1
        vx = 2;
        vy = 2;
        if (counter % 20 == 0 && shootingStarCoords1.length > 1) {
            var coordinateSet1 = shootingStarCoords1.pop();
            replenishStar(coordinateSet1[0], coordinateSet1[1], Math.random(), vx * Math.random(), vy * Math.random());
        }
        if (counter % 20 == 0 && shootingStarCoords2.length > 1) {
            var coordinateSet2 = shootingStarCoords2.pop();
            replenishStar(coordinateSet2[0], coordinateSet2[1], Math.random(), vx * Math.random(), vy * Math.random());
        }
    }


    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];

        ctx.fillStyle = "#fff";
        if (flicker) {
            if (ctx.globalAlpha >= 0.9) {
                ctx.globalAlpha = 0;
            }
            if (s.radius >= maxRadius) {
                radiusDiff = -1 * diff / 2;
            }
            if (s.radius < 0.02) {
                radiusDiff = diff / 2;
            }
            ctx.globalAlpha += alphaDiff;
            s.radius += radiusDiff;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

// Update star locations

function update() {
    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];

        s.x += s.vx / FPS;
        s.y += s.vy / FPS;

        if (s.x < 0 || s.x > canvas.width) s.x = -s.x;
        if (s.y < 0 || s.y > canvas.height) s.y = -s.y;
    }
}

// Update and draw

function tick() {
    //console.log("tick");
    if (!stop) {
        draw();
        update();
    }
    starAnimationID = requestAnimationFrame(tick);
}

function replenishStars(numStars) {
    for (var i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random(),
            vx: Math.floor(Math.random() * 10) - 5,
            vy: Math.floor(Math.random() * 10) - 5
        });
    }
}

function replenishStar(x, y, radius, vx, vy) {
    stars.push({
        x: x,
        y: y,
        radius: radius,
        vx: vx,
        vy: vy
    });
}

function replenishRandomStar() {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random(),
        vx: Math.floor(Math.random() * 10) - 5,
        vy: Math.floor(Math.random() * 10) - 5
    });
}

function spiralCoordinates(max, factor) {
    var coords = [];
    for (i = 0; i < max; i++) {
        angle = 0.1 * i;
        x = factor * (1 + angle) * Math.cos(angle);
        y = factor * (1 + angle) * Math.sin(angle);
        coords.push([x, y])
    }
    return coords;
}

function circleCoordinates(centerX, centerY, steps, radius) {
    var coords = [];
    for (var i = 0; i < steps; i++) {
        x = (centerX + radius * Math.cos(2 * Math.PI * i / steps));
        y = (centerY + radius * Math.sin(2 * Math.PI * i / steps));
        coords.push([x, y]);
    }
    return coords;
}