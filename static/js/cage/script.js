var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


const cageCorner = canvas.width / 2.3;

const clearArea = 20;

const cubeWidth = 20;

const cubeDepth = cubeWidth / 2;

$(document).ready(function() {
  //generateBars();
  setMouseHover();
})

function generateBars() {
  var firstLeftCoords;
  var firstRightCoords;
  //left coming in
  for (var i = 0; i < 24; i++) {
    var leftcoords = generateCoordinatesFromLinearEqn(0.5, i * 30, i, cageCorner);
    animateLines("left" + i, ctx, leftcoords, 1, "grey", 1, 0);

    var rightcoords = generateCoordinatesFromLinearEqn(-0.5, i * 30 + cageCorner, cageCorner, canvas.width);
    if (i == 0) {
      firstLeftCoords = leftcoords;
      firstRightCoords = rightcoords;
    }
    animateLines("right" + i, ctx, rightcoords, 1, "DarkGrey", 1, 0);

  }

  for (let k = 0; k < 14; k++) {
    // The top
    let topcoords = generateCoordinatesFromLinearEqn(-0.5, k * 30, k + 29 * k, canvas.width);

    //console.log(topcoords)
    animateLines("top" + k, ctx, topcoords, 1, "white", 1, 0);
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

function getXIntercept(m, x, y) {
  return y - m * x;
}

function setMouseHover() {
  canvas.onmousemove = function(e) {
    // important: correct mouse position:
    let rect = this.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      i = 0,
      r;
    ctx.clearRect(x, y, clearArea, clearArea);

    // Create an "X"
    let xinterceptpos = getXIntercept(0.5, x, y);
    let xinterceptneg = getXIntercept(-0.5, x, y);

    let posCoords = generateCoordinatesFromLinearEqn(0.5, xinterceptpos, x - 20, x + 24);
    let negCoords = generateCoordinatesFromLinearEqn(-0.5, xinterceptneg, x - 20, x + 24);
    animateLines("diag" + x, ctx, posCoords, 1, "red", 1, 0);
    animateLines("diag" + y, ctx, negCoords, 1, "red", 1, 0);

    // Create a cube
    let bottomCoords1 = generateCoordinates(x - 1, x + cubeWidth + 2, step = 1, horizontal = true, extraCoord = y);
    let topCoords1 = generateCoordinates(x - 1, x + cubeWidth + 2, step = 1, horizontal = true, extraCoord = (y + cubeWidth));
    let leftCoords1 = generateCoordinates(y, y + cubeWidth, step = 1, horizontal = false, extraCoord = x);
    let rightCoords1 = generateCoordinates(y, y + cubeWidth, step = 1, horizontal = false, x + cubeWidth);

    let bottomCoords2 = bottomCoords1.map((val, index, arr) => {
      return [val[0] + cubeDepth, val[1] + cubeDepth];
    })

    let topCoords2 = topCoords1.map((val, index, arr) => {
      return [val[0] + cubeDepth, val[1] + cubeDepth];
    })

    let leftCoords2 = leftCoords1.map((val, index, arr) => {
      return [val[0] + cubeDepth, val[1] + cubeDepth];
    })

    let rightCoords2 = rightCoords1.map((val, index, arr) => {
      return [val[0] + cubeDepth, val[1] + cubeDepth];
    })

    let diagSlope = 1;

    let xintercept1 = getXIntercept(diagSlope, x, y);
    let diag1 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept1, x, x + cubeDepth);

    let xintercept2 = getXIntercept(diagSlope, x + cubeWidth, y);
    let diag2 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept2, x + cubeWidth, x + cubeWidth + cubeDepth);

    let xintercept3 = getXIntercept(diagSlope, x, y + cubeWidth);
    let diag3 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept3, x, x + cubeDepth);

    let xintercept4 = getXIntercept(diagSlope, x + cubeWidth, y + cubeWidth);
    let diag4 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept4, x + cubeWidth, x + cubeWidth + cubeDepth);

    let cubeDiagonals = function() {
      animateLines("cubeDiag1" + x, ctx, diag1, 1, "white", 1, 0);
      animateLines("cubeDiag2" + x, ctx, diag2, 1, "white", 1, 0);
      animateLines("cubeDiag3" + x, ctx, diag3, 1, "white", 1, 0);
      animateLines("cubeDiag4" + x, ctx, diag4, 1, "white", 1, 0);
    }

    let secondCube = function() {
      animateLines("cubeBot2" + x, ctx, bottomCoords2, 1, "white", 1, 0);
      animateLines("cubeTop2" + x, ctx, topCoords2, 1, "white", 1, 0);
      animateLines("cubeLeft2" + y, ctx, leftCoords2, 1, "white", 1, 0);
      animateLines("cubeRight2" + y, ctx, rightCoords2, 1, "white", 1, 0, cubeDiagonals);
    }

    let firstCube = function() {
      animateLines("cubeBot1" + x, ctx, bottomCoords1, 1, "white", 1, 0);
      animateLines("cubeTop1" + x, ctx, topCoords1, 1, "white", 1, 0);
      animateLines("cubeLeft1" + y, ctx, leftCoords1, 1, "white", 1, 0);
      animateLines("cubeRight1" + y, ctx, rightCoords1, 1, "white", 1, 0, secondCube);
    }

    firstCube();




  }
}