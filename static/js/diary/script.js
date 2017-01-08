var noteBookText = ["エル・ローライト" /*L*/ , "夜 神 月 ライト" /*Light*/ ]

generatePages(20, function() {
    $("#flipbook").turn({
        width: 1000,
        height: 600,
        autoCenter: true
    });
    initDrawText();
})



function generatePages(numPages, callback) {
    console.log("Generate pages");
    for (var i = 0; i < numPages; i++) {
        $("#flipbook").append('<div class="hard"><span class="pgNum"></span><canvas class = "canvasPage" id="flipPg' + i + '"></canvas>' + '</div>');
    }
    callback();
}


/*--------writing out text effect------*/
var oldText;
var y = 0;

function initDrawText() {
    //createCanvasOnCurrentPage();
    initCanvasVariables();

    oldText = txt;
    ctx.font = "15px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    ctx.lineWidth = 0.25;
    //ctx.lineJoin = "round";
    ctx.globalAlpha = 1 / 3;
    ctx.strokeStyle = ctx.fillStyle = "black";
}

function initCanvasVariables() {
    //createCanvasOnCurrentPage();
    ctx = document.querySelector(".canvasPage").getContext("2d"),
        dashLen = 220,
        dashOffset = dashLen,
        speed = 5,
        txt = noteBookText.pop(),
        x = 0,
        i = 0;
}

function createCanvasOnCurrentPage() {
    $("#flipPg" + $("#flipbook").turn("page")).append("<canvas width='470'></canvas>")
}

var lineHeight = 10;
var lineWidth = 60;
var y = 90;
var firstPgCount = 0; //not being used

(function loop() {
    /*
    if ($("#flipbook").turn("page")==1 && firstPgCount==0){
        ctx = document.querySelector("#coverPage").getContext("2d");
        txt = "Death Note";
        firstPgCount++;
    }
    */
    console.log("variables: txt: " + txt + ", x: " + x + ", y: " + y);
    //console.log("Current page: " + $("#flipbook").turn("page"));
    ctx.clearRect(x, 0, lineWidth /*width*/ , lineHeight /*height*/ );
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, y); // stroke letter

    if (dashOffset > 0) { requestAnimationFrame(loop); } // animate
    else {
        //console.log("CUrrent letter: " + txt[i]);
        //console.log("Last letter: " + txt[txt.length - 1])
        ctx.fillText(txt[i], x, y); // fill final letter
        dashOffset = dashLen; // prep next char
        x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
        ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
        ctx.rotate(Math.random() * 0.005); // random rotation
        if (i < txt.length) requestAnimationFrame(loop);
        if (txt[i] == txt[txt.length]) {
            if (noteBookText.length <= 0) {
                stop();
            } else {
                console.log("AT LAST LETTER")
                y = y + 50;
                initCanvasVariables();
                loop();
            }
        }

    }

})();

function stop() {
    //console.log("STOP")

}
