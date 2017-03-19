var mySpeed = 1000;

var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


setTimeout(function() {
    //animateLines(context, coordinates, width = 1, color = "black", opacity = 1, i = 0, callback = null) 
    animateLines(ctx, generateCoordinates(0, 500, 10, true, 282), 1, "white", 1, 0, function() {
    	console.log("Entered callback");
        ctx.fillRect(0, 0, 500, 282);
    });
    //ctx.fillRect(0, 0, 500, 282);
}, 1000);



$(document).click(function(e) {
    console.log(e.pageX + "," + e.pageY);
})
