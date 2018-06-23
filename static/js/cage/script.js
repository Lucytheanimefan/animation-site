var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
var ctx = canvas.getContext('2d');


const cageCorner = canvas.width / 2.3;

const clearArea = 20;

const cubeWidth = 40;

const cubeDepth = cubeWidth / 2;

var count = 0;

const backgroundImageClearArea = 2 * clearArea;

// Spirograph
// The parameter 0<=l<=1 represents how far the point A is located from the center of Ci. At the same time, 0<=k<=1 represents how big the inner circle Ci is with respect to the outer one Co.
const k = 0.1;
const l = 0.9;
const R = 400;

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
    count += 1;
    // important: correct mouse position:
    let rect = this.getBoundingClientRect(),
      x = e.clientX - rect.left,
      y = e.clientY - rect.top,
      i = 0,
      r;

    // Check for background spirograph
    // Normalize
    let nX = x - canvas.width / 2;
    let nY = y - canvas.height / 2;
    let rad = Math.atan2(nY, nX); // radians

    // Draw the spirograph
    x_t = R * ((1 - k) * Math.cos(rad) + l * k * Math.cos(((1 - k) * rad) / k));
    y_t = R * ((1 - k) * Math.sin(rad) + l * k * Math.sin(((1 - k) * rad) / k));

    // Unnormalize
    x_t += canvas.width/2;
    y_t += canvas.height/2;

    let drawSpirograph = function(x, y) {
      //let diff = Math.abs(x - y);
      if (count % 9 == 0) {
        ctx.fillStyle = "#F7BDBC";
      } else if (count % 8 == 0) {
        ctx.fillStyle = "#B2F2D3";
      } else if (count % 7 == 0) {
        ctx.fillStyle = "#B3E6D6";
      } else if (count % 6 == 0) {
        ctx.fillStyle = "#B4BCB5";
      }
      ctx.globalAlpha = 0.1;
      ctx.fillRect(x, y, backgroundImageClearArea, backgroundImageClearArea);
      ctx.globalAlpha = 1;
    }

    // let diff = Math.abs(x - y);
    // if (diff < 100) {
    // if (diff < 20){
    //   ctx.fillStyle = "#F7BDBC";
    // }
    // else if (diff < 40){
    //   ctx.fillStyle = "#B2F2D3";
    // }
    // else if (diff < 60){
    //   ctx.fillStyle = "#B3E6D6";
    // }
    // else if (diff < 80){
    //   ctx.fillStyle = "#B4BCB5";
    // }
    // ctx.globalAlpha = 0.2;
    // ctx.fillRect(x, y, backgroundImageClearArea, backgroundImageClearArea);
    // ctx.globalAlpha = 1;
    // } else {
    ctx.clearRect(x, y, clearArea, clearArea);
    ctx.clearRect(y, x, clearArea, clearArea);

    drawSpirograph(x_t, y_t);

    // Create an "X"
    let xinterceptpos = getXIntercept(1, x, y);
    let xinterceptneg = getXIntercept(-1, x, y);

    let posCoords = generateCoordinatesFromLinearEqn(1, xinterceptpos, x - 20, x + 24);
    let negCoords = generateCoordinatesFromLinearEqn(-1, xinterceptneg, x - 20, x + 24);
    animateLines("diag" + x, ctx, posCoords, 1, "red", 1, 0);
    animateLines("diag" + y, ctx, negCoords, 1, "red", 1, 0);

    let cubeX = y;
    let cubeY = x;

    let createCube = function() {
      // Create a cube
      let bottomCoords1 = generateCoordinates(cubeX - 1, cubeX + cubeWidth + 2, step = 1, horizontal = true, extraCoord = cubeY);
      let topCoords1 = generateCoordinates(cubeX - 1, cubeX + cubeWidth + 2, step = 1, horizontal = true, extraCoord = (cubeY + cubeWidth));
      let leftCoords1 = generateCoordinates(cubeY, cubeY + cubeWidth, step = 1, horizontal = false, extraCoord = cubeX);
      let rightCoords1 = generateCoordinates(cubeY, cubeY + cubeWidth, step = 1, horizontal = false, cubeX + cubeWidth);

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

      let xintercept1 = getXIntercept(diagSlope, cubeX, cubeY);
      let diag1 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept1, cubeX, cubeX + cubeDepth);

      let xintercept2 = getXIntercept(diagSlope, cubeX + cubeWidth, cubeY);
      let diag2 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept2, cubeX + cubeWidth, cubeX + cubeWidth + cubeDepth);

      let xintercept3 = getXIntercept(diagSlope, cubeX, cubeY + cubeWidth);
      let diag3 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept3, cubeX, cubeX + cubeDepth);

      let xintercept4 = getXIntercept(diagSlope, cubeX + cubeWidth, cubeY + cubeWidth);
      let diag4 = generateCoordinatesFromLinearEqn(slope = diagSlope, xintercept4, cubeX + cubeWidth, cubeX + cubeWidth + cubeDepth);

      let cubeDiagonals = function() {
        animateLines("cubeDiag1" + cubeX, ctx, diag1, 1, "white", 1, 0);
        animateLines("cubeDiag2" + cubeX, ctx, diag2, 1, "white", 1, 0);
        animateLines("cubeDiag3" + cubeX, ctx, diag3, 1, "white", 1, 0);
        animateLines("cubeDiag4" + cubeX, ctx, diag4, 1, "white", 1, 0);
      }

      let secondCube = function() {
        animateLines("cubeBot2" + cubeX, ctx, bottomCoords2, 1, "white", 1, 0);
        animateLines("cubeTop2" + cubeX, ctx, topCoords2, 1, "white", 1, 0);
        animateLines("cubeLeft2" + cubeY, ctx, leftCoords2, 1, "white", 1, 0);
        animateLines("cubeRight2" + cubeY, ctx, rightCoords2, 1, "white", 1, 0, cubeDiagonals);
      }

      let firstCube = function() {
        animateLines("cubeBot1" + cubeX, ctx, bottomCoords1, 1, "white", 1, 0);
        animateLines("cubeTop1" + cubeX, ctx, topCoords1, 1, "white", 1, 0);
        animateLines("cubeLeft1" + cubeY, ctx, leftCoords1, 1, "white", 1, 0);
        animateLines("cubeRight1" + cubeY, ctx, rightCoords1, 1, "white", 1, 0, secondCube);
      }

      firstCube();
    }

    if (count % 4 == 0) {
      createCube();
    }
    // }


  }
}