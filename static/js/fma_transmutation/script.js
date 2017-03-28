$(document).load(function() {


    var canvas = document.getElementById('canvas');
    canvas.width = $(document).width();
    canvas.height = $(document).height();
    var ctx = canvas.getContext('2d');

})
animateLines(0, ctx, generateCoordinates(0, $(document).width(), 20, true, 282), 1, "black", 1, 0, function() {
    console.log("Entered callback");
    //animateLines(ctx, generateCoordinates(0, $(document).width(), 20, true, 0), 282, "white", 1, 0);
    ctx.fillRect(0, 0, 500, 280);
});


//animateLines(reqID, context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null)
//generateCoordinates(start, end, step = 1, horizontal, extraCoord)
