var names = ["エル・ローライト" /*L*/ , "夜 神 月 ライト" /*Light*/ ]
var noteBookText = ["エル・ローライト" /*L*/ , "夜 神 月 ライト" /*Light*/ ];

var rulesPages = howToUse.length;
console.log("Num rules pages: " + rulesPages)
generatePages(rulesPages + 4, function() {
    $("#flipbook").turn({
        width: 1000,
        height: 600,
        autoCenter: true
    });
})



function generatePages(numPages, callback) {
    console.log("Generate pages");
    for (var i = 0; i < numPages; i++) {
        if (i < rulesPages /*&& i>0*/ ) { //rules pages
            initRulesPages(i);
        } else {
            if (i % 2 == 0) {
                $("#flipbook").append('<div class="hard"><span class="pgNum"></span><canvas class = "canvasPage" id="flipPg' + i + '"></canvas>' + '</div>');
            } else {
                $("#flipbook").append('<div class="hard"><span class="pgNum"></span><textarea cols="50" rows="30" onkeyup="auto_grow(this)"></textarea></div>');
            }
        }
    }
    callback();
}

function auto_grow(element) {
    if (element.scrollHeight < 600) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }
}

function initRulesPages(i) {
    $("#flipbook").append('<div class="hard" class = "rules" id="pg' + i + '"><span class="pgNum"></span><h1>' +
        romanize(i + 1) + '</h1><div id = "rules' + i + '"></div></div>');
    for (var j = 0; j < howToUse[i].length; j++) {
        $("#rules" + i).append("<p class='rulesText'>" + howToUse[i][j] + "</p>");
    }

}

function romanize(num) {
    var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 },
        roman = '',
        i;
    for (i in lookup) {
        while (num >= lookup[i]) {
            roman += i;
            num -= lookup[i];
        }
    }
    return roman;
}

var colors = ["white", "black"]
var backgroundDelay = 1500;

function updateCSS(rulesPage = 0) {
    $(".page").css("background-color", colors[0 + rulesPage]);
    $("#flipbook").css("color", colors[1 - rulesPage]);
    console.log("Background should become: " + colors[rulesPage])
    $("body").animate({
        backgroundColor: colors[Math.abs(rulesPage - 1)],
    }, backgroundDelay)
}

function flipToPage() {
    console.log("currently: " + $("#flipOption").attr("value"))
    if ($("#flipOption").attr("value") == "notebook") {
        $("#flipbook").turn("page", rulesPages + 3);
        $("#flipOption").html("rules pages");
        $("#flipOption").attr("value", "rules");
        initHandWriting();
        //update css
        updateCSS();

    } else { //flip to rules
        $("#flipbook").turn("page", 2);
        $("#flipOption").html("notebook pages");
        $("#flipOption").attr("value", "notebook");


        //update css
        updateCSS(1);
    }
}

/*--------writing out text effect------*/
var oldText;
var y = 0;

function initDrawText() {
    //createCanvasOnCurrentPage();
    initCanvasVariables();

    oldText = txt;
    ctx.font = "15px Death Note Font"; //'Carrois Gothic', sans-serif";
    ctx.lineWidth = 0.1;
    //ctx.lineJoin = "round";
    ctx.globalAlpha = 0.9;
    ctx.strokeStyle = ctx.fillStyle = "black";
    ctx.fill = "black"
}

var nameCount = 0;

function initCanvasVariables() {
    textArray = noteBookText;
    query = ".canvasPage"
        //}
    console.log(document.querySelector(query))
    ctx = document.querySelector(query).getContext("2d"),
        dashLen = 220,
        dashOffset = dashLen,
        speed = 5,
        txt = textArray[nameCount],
        x = 0,
        i = 0;
    nameCount++;
}

function createCanvasOnCurrentPage() {
    $("#flipPg" + $("#flipbook").turn("page")).append("<canvas width='470'></canvas>")
}

var lineHeight = 10;
var lineWidth = 60;
var y = 90;

function animateHandWriting() {
    ctx.clearRect(x, 0, lineWidth /*width*/ , lineHeight /*height*/ );
    ctx.setLineDash([dashLen - dashOffset, dashOffset - speed]); // create a long dash mask
    dashOffset -= speed; // reduce dash length
    ctx.strokeText(txt[i], x, y); // stroke letter

    if (dashOffset > 0) { requestAnimationFrame(animateHandWriting); } // animate
    else {
        //console.log("CUrrent letter: " + txt[i]);
        //console.log("Last letter: " + txt[txt.length - 1])
        ctx.fillText(txt[i], x, y); // fill final letter
        dashOffset = dashLen; // prep next char
        x += ctx.measureText(txt[i++]).width + ctx.lineWidth * Math.random();
        ctx.setTransform(1, 0, 0, 1, 0, 3 * Math.random()); // random y-delta
        ctx.rotate(Math.random() * 0.005); // random rotation
        if (i < txt.length) requestAnimationFrame(animateHandWriting);
        if (txt[i] == txt[txt.length]) {
            if (noteBookText.length <= 0) {
                stop();
            } else {
                console.log("AT LAST LETTER")
                y = y + 20;
                initCanvasVariables();
                animateHandWriting();
            }
        }

    }

}

function initHandWriting() {
    nameCount = 0;
    canvas = document.querySelector(".canvasPage");
    if ($("#flipbook").turn("page") > (rulesPages + 1)) {
        y = 90;
        initDrawText();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animateHandWriting();
    }

}

function stop() {
    //console.log("STOP")

}
