var youtubecode = "3kaUvGSLMew";
var player;
var timeInterval;
var starAnimationID;
var stop = false;
var decreaseStars = false;
var flicker = false;
var flickerOnce = false;

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
        if (time >= 64 && time < 74) 
        {
            decreaseStars = true;
        } 
        else if (time >= 74 && time <= 75) // when one more light goes out
        {
            decreaseStars = false;
        } 
        else if (time > 75 && time < 76) 
        {
            if (!flickerOnce) {
              flickerOnce = true;
              ctx.globalAlpha = 0;
              // single star
              stars = [{
                  x: canvas.width / 2,
                  y: canvas.height / 2,
                  radius: 10,
                  vx: 0,
                  vy: 0
              }];
            }
        } 
        else if (time >= 76 && time <= 82) 
        {
            flicker = true;
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

var radiusDiff = 0.01;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (decreaseStars) {
        //console.log("Start decreasing stars");
        stars.pop();
    }

    ctx.globalCompositeOperation = "lighter";

    for (var i = 0, x = stars.length; i < x; i++) {
        var s = stars[i];

        ctx.fillStyle = "#fff";
        if (flicker) {
            if (ctx.globalAlpha >= 1) {
                ctx.globalAlpha = 0; 
            }
            if (s.radius >= 7) {
                radiusDiff = -0.01;
            }
            if (s.radius < 0.02) {
                radiusDiff = 0.01;
            }
            ctx.globalAlpha += 0.05;
            s.radius += radiusDiff
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

