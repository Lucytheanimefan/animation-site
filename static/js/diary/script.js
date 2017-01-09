//var names = ["エル・ローライト" /*L*/ , "夜 神 月 ライト" /*Light*/ ]
var noteBookText = ["レイ=ペンバー" /*Rei Penbā*/ , "南空ナオミ" /*Naomi Misora*/ , "リンド=L=テイラー" /*Lind L Tailor*/ , "エル・ローライト" /*L*/ , "高田=清美" /*Kiyomi Takada*/ , "夜 神 月 ライト" /*Light*/ ];

var rulesPages = howToUse.length;
console.log("Num rules pages: " + rulesPages)
generatePages(rulesPages + 3, function() {
    $("#flipbook").turn({
        width: 900,
        height: 600,
        autoCenter: true
    });
    initClickableTypeablePage();
})



function generatePages(numPages, callback) {
    console.log("Generate pages");
    for (var i = 0; i < numPages; i++) {
        if (i < rulesPages /*&& i>0*/ ) { //rules pages
            initRulesPages(i);
        } else if (i==(numPages-1)) { //last page = credits
            $("#flipbook").append('<div class="hard shadow" id = "creditsPage"><span class="pgNum"></span>' +'<h2>Credits</h2>'+
                '<p>Music: Light\'s theme (composed by Yoshihisa Hirano and Hideki Taniuchi)</p>'+
                '<p>All of the Death Note rules and names are courtesy of the source itself and its wiki page</p>'+
             '</div>');
        } else {
            if (i % 2 == 0) {
                $("#flipbook").append('<div class="hard shadow"><span class="pgNum"></span><canvas class = "canvasPage" height = "600" id="flipPg' + i + '"></canvas>' + '</div>');
            } else {
                $("#flipbook").append('<div class = "typablePage hard shadow"><span class="pgNum"></span>' +
                    '<div class = "names">' + '<div class = "inputNames"></div>' +
                    '<input onkeypress="addNameToNotebook()" type="text" id = "nameInput"></input></div></div>');
            }
        }
    }
    callback();
}

function initClickableTypeablePage() {
    $(document).click(function() {
        console.log("Typable page clicked");
        $('#nameInput').focus();
    });
}

function auto_grow(element) {
    if (element.scrollHeight < 600) {
        element.style.height = "5px";
        element.style.height = (element.scrollHeight) + "px";
    }
}

var pageFull = false;

function addNameToNotebook() {
    event = window.event;
    if (event.keyCode == 13 && !pageFull) {
        console.log("Clicked enter!")
        $(".inputNames").append("<p>" + $('#nameInput').val() + "</p>");
        $("#nameInput").val("");
        //move it down
        var tp = $('#nameInput').position().top;
        console.log("TOP: " + tp)
        $('#nameInput').css("top", (tp + 10));
        console.log("New top: " + $('#nameInput').position().top);
        if (tp > 540) {
            pageFull = true;
            $("#nameInput").prop('disabled', true);
            console.log("PAGE FULL!");
        }

    }
}


function initRulesPages(i) {
    $("#flipbook").append('<div class="hard rules" id="pg' + i + '"><span class="pgNum"></span>' + '<div class="rulesContent">' + '<h2>' +
        romanize(i + 1) + '</h2><div id = "rules' + i + '"></div></div></div>');
    $("#rules" + i).append("<ul class = 'rulesBullets'></ul>");
    for (var j = 0; j < howToUse[i].length; j++) {
        $("#rules" + i + " .rulesBullets").append("<li class='rulesText'> " + howToUse[i][j] + "</li>");
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
    //$(".page").css("background-color", colors[0 + rulesPage]);
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
        speed = 7,
        txt = textArray[nameCount],
        x = 0,
        i = 0;
    nameCount++;
}

function createCanvasOnCurrentPage() {
    $("#flipPg" + $("#flipbook").turn("page")).append("<canvas width='470' height='500'></canvas>")
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
