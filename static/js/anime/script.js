var mySpeed = 1000;

var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');

setTimeout(function(){
	drawLine(ctx, 0, 150, $(document).width(), 150, "white", 1);
}, 1000);
