var youtubecode = "3kaUvGSLMew";
var player;
var timeInterval;
var starAnimationID;
var stop = false;
var decreaseStars = false;
var flicker = false;
var flickerOnce = false;
var spiralStars = false;

// 72 - who cares
// 74 seconds - when one more light goes our
// // 79 - flickers
function onYouTubePlayerAPIReady() {
    player = new YT.Player('ytplayer', {
        height: '200',
        width: '300',
        videoId: youtubecode,
        playerVars: { 'autoplay': 1, 'controls': 0 },
        events: {
            onReady: initialize,
            onStateChange: onStateChange
        }
    });
}

function onStateChange(event) {
    switch (event.data) {
        case YT.PlayerState.ENDED:
            console.log("Video ended");
            cancel();
            break;
        case YT.PlayerState.PLAYING:
            stop = false;
            console.log("Video playing");
            updateTimerDisplay();
            break;
        case YT.PlayerState.PAUSED:
            console.log("Video paused");
            cancel();
            break;
        case YT.PlayerState.BUFFERING:
            console.log("Video buffering");
            cancel();
            break;
        case YT.PlayerState.CUED:
            console.log("Video cued");
            break;
        default:
            console.log("nothing");
    }
}

function initialize() {
    //console.log("Change background");
    $('body').animate({ backgroundColor: 'black' }, 27 * 1000);
    updateTimerDisplay();
}

function cancel() {
    stop = true;
    console.log("Canceled stuff");
    clearInterval(timeInterval);
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
        if (time >= 72 && time < 79) {
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
        } else if (time > 83 && time < 130) {
            flicker = false;
            if (!spiralStars) {
                stars = []; // just empty it once
            }
            spiralStars = true;
        } else if (time > 130) { // spiral is done
        	decreaseStars = true;
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
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var stars = [], // Array that contains the stars
    FPS = 40, // Frames per second
    x = 1000 //canvas.width; // Number of stars

for (var i = 0; i < x; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random(),
        vx: Math.floor(Math.random() * 10) - 5,
        vy: Math.floor(Math.random() * 10) - 5
    });
}

//console.log("stars: ")
//console.log(stars)

var radiusDiff = 0.005;
var alphaDiff = 0.02;
var diff = 0.01;
var spiralCoords = spiralCoordinates();

var counter = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (decreaseStars) {
        stars.pop();
    }
    if (spiralStars && spiralCoords.length > 1) {
        var vx = 1 //Math.floor(Math.random() * 10) - 5;
        var vy = 1;
        counter += 1;
        if (counter % 30 == 0) {
        	var coordinateSet = spiralCoords.pop();
        	console.log("Replenish spiral star");
            replenishStar(coordinateSet[0], coordinateSet[1], Math.random(), vx, vy);
        }
        //console.log("star spiral length: "+ stars.length);
    }
    ctx.globalCompositeOperation = "lighter";

    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];

        ctx.fillStyle = "#fff";
        if (flicker) {
            if (ctx.globalAlpha >= 1) {
                ctx.globalAlpha = 0;
            }
            if (s.radius >= 10) {
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

function spiralCoordinates() {
    var coords = [];
    for (i = 0; i < 720; i++) {
        angle = 0.1 * i;
        x = 10 * (1 + angle) * Math.cos(angle);
        y = 10 * (1 + angle) * Math.sin(angle);
        coords.push([x, y])
    }
    return coords;
}