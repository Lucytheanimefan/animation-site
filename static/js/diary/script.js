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
        $("#flipbook").append('<div class="hard"><span class="pgNum">' + i + '</span><canvas id="flipPg'+i+'"></canvas>'
            +'</div>');
    }
    callback();
}


/*--------writing out text effect------*/
var oldText;
var y = 0;
function initDrawText() {
    //createCanvasOnCurrentPage();
    ctx = document.querySelector("canvas").getContext("2d"),
        dashLen = 220,
        dashOffset = dashLen,
        speed = 5,
        txt = "夜 神 月 ライト",
        x = 30,
        i = 0;

    oldText = txt;
    ctx.font = "15px Comic Sans MS, cursive, TSCu_Comic, sans-serif";
    ctx.lineWidth = 1;
    //ctx.lineJoin = "round";
    ctx.globalAlpha = 2 / 3;
    //ctx.strokeStyle = ctx.fillStyle = "#1f2f90";
}

function createCanvasOnCurrentPage(){
    $("#flipPg"+$("#flipbook").turn("page")).append("<canvas width='470'></canvas>")
}

(function loop() {
    console.log("Current page: "+$("#flipbook").turn("page"));
    ctx.clearRect(x, y, 60 /*width*/ , 150 /*height*/ );
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, 90); // stroke letter

    if (dashOffset > 0){ requestAnimationFrame(loop);} // animate
    else {
        console.log("CUrrent letter: " + txt[i]);
        console.log("Last letter: "+txt[txt.length - 1])
        ctx.fillText(txt[i], x, 90); // fill final letter
        dashOffset = dashLen; // prep next char
        x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
        ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
        ctx.rotate(Math.random() * 0.005); // random rotation
        if (i < txt.length) requestAnimationFrame(loop);
        if (txt[i] == txt[txt.length]) {
            console.log("AT LAST LETTER")
            txt = "new text";
            y=y+20;
            dashOffset = dashLen;
            x=30;
        }

        if (oldText != txt) {
            console.log("New text");
        }

    }
})();
