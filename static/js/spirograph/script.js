var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
const ctx = canvas.getContext('2d');


var count = 0;

const squareArea = 20;

const clearArea = squareArea / 2;

const diagonalDistance = Math.sqrt(Math.pow(Math.abs(canvas.width / 2), 2) + Math.pow(Math.abs(canvas.height / 2), 2));

// Spirograph
// The parameter 0<=l<=1 represents how far the point A is located from the center of Ci. At the same time, 0<=k<=1 represents how big the inner circle Ci is with respect to the outer one Co.
const k = 0.1;
const l = 0.99;
const R = 300;

$(document).ready(function() {
  //generateBars();
  setMouseHover();
})

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
    x_t = R * ((1 - k) * Math.cos(rad) + (l * k) * Math.cos(((1 - k) * rad) / k));
    y_t = R * ((1 - k) * Math.sin(rad) + (l * k) * Math.sin(((1 - k) * rad) / k));

    // Unnormalize
    x_t += canvas.width / 2;
    y_t += canvas.height / 2;

    var distFactor = Math.sqrt(Math.pow(Math.abs(x - canvas.width / 2), 2) + Math.pow(Math.abs(y - canvas.height / 2), 2)) / diagonalDistance;

    if (distFactor < 0.5) {
      distFactor *= -1;
    }

    //console.log("distFactor: " + distFactor);
    let drawSpirograph = function(x, y) {
      if (count % 9 == 0) {
        ctx.fillStyle = ColorLuminance("#F7BDBC", distFactor);
      } else if (count % 8 == 0) {
        ctx.fillStyle = ColorLuminance("#B2F2D3", distFactor);
      } else if (count % 7 == 0) {
        ctx.fillStyle = ColorLuminance("#B3E6D6", distFactor);
      } else if (count % 6 == 0) {
        ctx.fillStyle = ColorLuminance("#B4BCB5", distFactor);
      }
      ctx.globalAlpha = 0.1;
      ctx.fillRect(x, y, squareArea, squareArea);
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
  }
}

function ColorLuminance(hex, lum) {

  // validate hex string
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#",
    c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i * 2, 2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00" + c).substr(c.length);
  }
  //console.log(rgb);
  return rgb;
}