var mySpeed = 1000;

var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


function begin() {
    //pokemon
    setTimeout(function() {
        animateLines(0, ctx, generateCoordinates(0, $(document).width(), 20, true, 282), 1, "white", 1, 0, function() {
            console.log("Entered callback");
            //animateLines(ctx, generateCoordinates(0, $(document).width(), 20, true, 0), 282, "white", 1, 0);
            ctx.fillRect(0, 0, 500, 280);
        });
        animateLines(1, ctx, generateCoordinates(0, $(document).width(), 20, true, 411), 1, "white", 1, 0, function() {
            console.log("Entered callback 2");
            //animateLines(2, ctx, generateCoordinates(0, 402, 5, true, 460), 100, "black", 1, 0);
            ctx.fillRect(0, 411, 500, 202);
            animateLines(3, ctx, generateCoordinates(0, $(document).height(), 20, false, 401), 1, "white", 1, 0);
            showNaruto();

        });

    }, 1000);
}

function redrawOrigPokeLines() {
    animateLines(0, ctx, generateCoordinates(0, $(document).width(), 20, true, 282), 1, "white");
    animateLines(1, ctx, generateCoordinates(0, $(document).width(), 20, true, 411), 1, "white");
}

function showNaruto() {
    $("#naruto").fadeIn(1000, function() {


        $(this).animate({ zoom: '150%', "-moz-transform": "scale(1.0)", "-webkit-transform": "scale(1.0)" }, "slow");
        ctx.fillRect(800, 0, 200, 500);
        animateLines(4, ctx, generateCoordinates(0, $(document).width(), 20, true, 77), 1, "white", 1, 0, function() {
            ctx.fillRect(1001, 80, 200, 400);
            animateLines(5, ctx, generateCoordinates(0, $(document).height(), 20, false, 1180), 1, "white");
            redrawOrigPokeLines();
        });

        animateLines(5, ctx, generateCoordinates(0, $(document).height(), 20, false, 1000), 1, "white");

    });

}


$(document).click(function(e) {
    console.log(e.pageX + "," + e.pageY);
})
