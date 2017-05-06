var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


$(document).ready(function() {
    generateBars();
})

function generateBars() {
    for (var i = 0; i < 10; i++) {
        var coords = generateCoordinatesFromLinearEqn(0.5, i*20, i, canvas.width/2);
        console.log(coords);
        animateLines(i, ctx, coords, 1, "white", 1, 0);
    }
}


function generateCoordinatesFromLinearEqn(slope, xintercept, start, end){
	var coords = [];
	for (var i=start; i<end; i++){
		var y = slope*i + xintercept;
		coords.push([i,y]);
	}
	console.log(coords[0]);
	return coords;
}