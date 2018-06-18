var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');

const cubeDepth = 2.3;

const cageCorner = canvas.width / cubeDepth;

$(document).ready(function() {
  generateBars();
})

function generateBars() {
  var firstLeftCoords;
  var firstRightCoords;
  //left coming in
  for (var i = 0; i < 24; i++) {
    var leftcoords = generateCoordinatesFromLinearEqn(0.5, i * 30, i, cageCorner);
    animateLines("left" + i, ctx, leftcoords, 1, "white", 1, 0);

    var rightcoords = generateCoordinatesFromLinearEqn(-0.5, i * 30 + cageCorner, cageCorner, canvas.width);
    if (i == 0) {
      firstLeftCoords = leftcoords;
      firstRightCoords = rightcoords;
    }
    animateLines("right" + i, ctx, rightcoords, 1, "white", 1, 0);

  }

  for (let k = 0; k < 14; k++) {
    // The top
    let topcoords = generateCoordinatesFromLinearEqn(-0.5, k * 30, k + 29*k, canvas.width);

    //console.log(topcoords)
    animateLines("top" + k, ctx, topcoords, 1, "blue", 1, 0);
  }
  //vertical bars
  for (var j = 0; j < 70; j++) {
    animateLines("vertical" + j, ctx, generateCoordinates(0, canvas.height, step = 1.5, false, 15 * j), 1, "white", 1, 0);
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