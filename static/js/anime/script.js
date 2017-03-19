var mySpeed = 1000;

var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


setTimeout(function() {
    //animateLines(context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null) 
    animateLines(0, ctx, generateCoordinates(0, $(document).width(), 20, true, 282), 1, "white", 1, 0, function() {
    	console.log("Entered callback");
    	//animateLines(ctx, generateCoordinates(0, $(document).width(), 20, true, 0), 282, "white", 1, 0);
        ctx.fillRect(0, 0, 500, 282);
    });
    
    animateLines(1, ctx, generateCoordinates(0, $(document).width(), 20, true, 411), 1, "white", 1, 0, function() {
    	console.log("Entered callback 2");
    	//animateLines(ctx, generateCoordinates(0, $(document).width(), 20, true, 0), 282, "white", 1, 0);
        ctx.fillRect(0, 411, 500, 200);
        animateLines(2, ctx, generateCoordinates(0, $(document).height(), 20, false, 401), 1, "white", 1, 0);
    });



}, 1000);



$(document).click(function(e) {
    console.log(e.pageX + "," + e.pageY);
})
