var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');

var cubeDepth = 2.3;

$(document).ready(function() {
    generateBars();
})

function generateBars() {
    var firstLeftCoords;
    var firstRightCoords;
    //left coming in
    for (var i = 0; i < 15; i++) {
        var leftcoords = generateCoordinatesFromLinearEqn(0.5, i * 30, i, canvas.width / cubeDepth);
        animateLines("left" + i, ctx, leftcoords, 1, "white", 1, 0);

        var rightcoords = generateCoordinatesFromLinearEqn(-0.5, i * 30 + canvas.width / cubeDepth, canvas.width / cubeDepth, canvas.width);
        if (i == 0) {
            firstLeftCoords = leftcoords;
            firstRightCoords = rightcoords;

            console.log(leftcoords)
        }
        animateLines("right" + i, ctx, rightcoords, 1, "white", 1, 0);
    }
    //vertical bars
    for (var j = 0; j < 20; j++) {
        animateLines("vertical" + j, ctx, generateCoordinates(firstLeftCoords[j][1], canvas.height, step = 1, false, 15 * j), 1, "white", 1, 0);
    }
}


function generateCoordinatesFromLinearEqn(slope, xintercept, start, end) {
    var coords = [];
    for (var i = start; i < end; i++) {
        var y = slope * i + xintercept;
        coords.push([i, y]);
    }
    //console.log(coords[0]);
    return coords;
}
