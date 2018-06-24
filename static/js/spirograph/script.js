var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
const ctx = canvas.getContext('2d');


var count = 0;

const squareArea = 40;

const clearArea = squareArea/2;

// Spirograph
// The parameter 0<=l<=1 represents how far the point A is located from the center of Ci. At the same time, 0<=k<=1 represents how big the inner circle Ci is with respect to the outer one Co.
const k = 0.1;
const l = 0.9;
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