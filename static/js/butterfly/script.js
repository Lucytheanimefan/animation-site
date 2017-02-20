var canvas = $("canvas");

var spread = 50;


var ctx = canvas[0].getContext("2d"),
    width = $(document).width(),
    height = $(document).height(),
    a, b;

canvas.attr("width", width);
canvas.attr("height", height);

var requestAnimationFrame = window.requestAnimationFrame || 
                            window.mozRequestAnimationFrame || 
                            window.webkitRequestAnimationFrame || 
                            window.msRequestAnimationFrame;


$("canvas").click(function(e) {
    console.log("Canvas click: X: " + e.pageX + "  Y: " + e.pageY);
    //ctx.fillStyle = "rgb(0,0,0)";
    //ctx.fillRect(e.pageX, e.pageY, 10, 10);
    spawnBlackness(e.pageX, e.pageY, 5, 5, 0);
    //requestAnimationFrame(spawnBlackness);
})


/* //REcursive exampe
// Animate.
function animate(highResTimestamp) {
  requestAnimationFrame(animate);
  // Animate something...
}

// Start the animation.
requestAnimationFrame(animate);
 */

function spawnBlackness(x, y, width, height,alpha) {
	console.log("width: "+width+"; height: "+height)
	ctx.fillRect(x,y,width,height);
	ctx.fillStyle = "rgba(0,0,0,"+alpha+")";
	width++;
	height++;
	alpha +=1;
	requestID =requestAnimationFrame(function(){
		spawnBlackness(x,y,width,height,alpha);
	});
	if (width>spread){
		cancelAnimationFrame(requestID);
	}

}

