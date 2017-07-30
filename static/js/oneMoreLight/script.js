var youtubecode = "3kaUvGSLMew";
var player;
var timeInterval;

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
            clearInterval(timeInterval);
            break;
        case YT.PlayerState.PLAYING:
            console.log("Video playing");
            updateTimerDisplay();
            break;
        case YT.PlayerState.PAUSED:
            console.log("Video paused");
            clearInterval(timeInterval);
            break;
        case YT.PlayerState.BUFFERING:
            console.log("Video buffering");
            clearInterval(timeInterval);
            break;
        case YT.PlayerState.CUED:
            console.log("Video cued");
            break;
        default:
            console.log("nothing");
    }
}

function initialize() {
    console.log("Change background");
    $('body').animate({ backgroundColor: 'black' }, 27*1000);
    updateTimerDisplay();

}

// This function is called by initialize()
function updateTimerDisplay() {
    timeInterval = setInterval(function() {
        // Update current time text display.
        console.log(player.getCurrentTime());
        console.log(formatTime(player.getDuration()));
    }, 1000)

}

function formatTime(time) {
    time = Math.round(time);

    var minutes = Math.floor(time / 60),
        seconds = time - minutes * 60;

    seconds = seconds < 10 ? '0' + seconds : seconds;

    return minutes + ":" + seconds;
}