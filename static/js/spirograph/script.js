var canvas = document.getElementById('canvas');
canvas.width = $(document).width();
canvas.height = $(document).height();
const ctx = canvas.getContext('2d');


var count = 0;

const squareArea = 20;

const clearArea = squareArea / 2;

const diagonalDistance = Math.sqrt(Math.pow(Math.abs(canvas.width / 2), 2) + Math.pow(Math.abs(canvas.height / 2), 2));

var currentColorHex = "#B4BCB5";

// Spirograph
// The parameter 0<=l<=1 represents how far the point A is located from the center of Ci. At the same time, 0<=k<=1 represents how big the inner circle Ci is with respect to the outer one Co.
const k = 0.1;
const l = 0.99;
const R = 300;
const R2 = 150;
const R3 = 40;

const n = 7;
const k2 = 9;
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

    // Second one
    // x_t2 = R2 * ((1 - k) * Math.cos(rad) + (l * k) * Math.cos(((1 - k) * rad) / k));
    // y_t2 = R2 * ((1 - k) * Math.sin(rad) + (l * k) * Math.sin(((1 - k) * rad) / k));


    // Other cool lines
    let t = (rad * 46.284) / (2 * Math.PI);
    x_l1 = R2*(Math.cos(t) + 0.25 * Math.cos(12*t) - (1/9) * Math.sin(-28 * t));
    y_l1 = R2*(Math.sin(t) + 0.25 * Math.sin(12*t) + (1/9) * Math.cos(-28 * t));


    let t2 = (rad * 6.3) / (2 * Math.PI);
    x_l2 = R3 * ((n-k2) * Math.cos(k2 * t2) + k2 * Math.cos((n-k2) * t2))/n;
    y_l2 = R3 * ((n-k2) * Math.sin(k2 * t2) + k2 * Math.sin((n-k2) * t2))/n;

    // Unnormalize
    x_t += canvas.width / 2;
    y_t += canvas.height / 2;

    // x_t2 += canvas.width / 2;
    // y_t2 += canvas.height / 2;

    x_l1 += canvas.width / 2;
    y_l1 += canvas.height / 2;

    x_l2 += canvas.width / 2;
    y_l2 += canvas.height / 2;

    var distFactor = Math.sqrt(Math.pow(Math.abs(x - canvas.width / 2), 2) + Math.pow(Math.abs(y - canvas.height / 2), 2)) / diagonalDistance;

    if (distFactor < 0.5) {
      distFactor *= -1;
    }

    //console.log("distFactor: " + distFactor);
    let drawPoint = function(x, y, area = squareArea) {
      if (count % 9 == 0) {
        currentColorHex = "#F7BDBC";
        //ctx.fillStyle = ColorLuminance("#F7BDBC", distFactor);
      } else if (count % 8 == 0) {
        currentColorHex = "#B2F2D3";
        //ctx.fillStyle = ColorLuminance("#B2F2D3", distFactor);
      } else if (count % 7 == 0) {
        currentColorHex = "#B3E6D6";
        //ctx.fillStyle = ColorLuminance("#B3E6D6", distFactor);
      } else if (count % 6 == 0) {
        currentColorHex = "#B4BCB5"
        //ctx.fillStyle = ColorLuminance("#B4BCB5", distFactor);
      } else {
        currentColorHex = hexToComplimentary(currentColorHex);
        //console.log('Complimentary color: ' + currentColorHex);
      }
      ctx.fillStyle = ColorLuminance(currentColorHex, distFactor);
      ctx.globalAlpha = 0.1;
      ctx.fillRect(x, y, area, area);
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

    // Spirographs
    drawPoint(x_t, y_t);
    //drawPoint(x_t2, y_t2);

    // Other stuff
    drawPoint(x_l1, y_l1, 7);

    drawPoint(x_l2, y_l2, 7);
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

function hexAverage() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(previousValue, currentValue) {
      return currentValue
        .replace(/^#/, '')
        .match(/.{2}/g)
        .map(function(value, index) {
          return previousValue[index] + parseInt(value, 16);
        });
    }, [0, 0, 0])
    .reduce(function(previousValue, currentValue) {
      return previousValue + padToTwo(Math.floor(currentValue / args.length).toString(16));
    }, '#');
}

/* hexToComplimentary : Converts hex value to HSL, shifts
 * hue by 180 degrees and then converts hex, giving complimentary color
 * as a hex value
 * @param  [String] hex : hex value  
 * @return [String] : complimentary color as hex value
 */
function hexToComplimentary(hex) {

  // Convert hex to rgb
  // Credit to Denis http://stackoverflow.com/a/36253499/4939630
  var rgb = 'rgb(' + (hex = hex.replace('#', '')).match(new RegExp('(.{' + hex.length / 3 + '})', 'g')).map(function(l) { return parseInt(hex.length % 2 ? l + l : l, 16); }).join(',') + ')';

  // Get array of RGB values
  rgb = rgb.replace(/[^\d,]/g, '').split(',');

  var r = rgb[0],
    g = rgb[1],
    b = rgb[2];

  // Convert RGB to HSL
  // Adapted from answer by 0x000f http://stackoverflow.com/a/34946092/4939630
  r /= 255.0;
  g /= 255.0;
  b /= 255.0;
  var max = Math.max(r, g, b);
  var min = Math.min(r, g, b);
  var h, s, l = (max + min) / 2.0;

  if (max == min) {
    h = s = 0; //achromatic
  } else {
    var d = max - min;
    s = (l > 0.5 ? d / (2.0 - max - min) : d / (max + min));

    if (max == r && g >= b) {
      h = 1.0472 * (g - b) / d;
    } else if (max == r && g < b) {
      h = 1.0472 * (g - b) / d + 6.2832;
    } else if (max == g) {
      h = 1.0472 * (b - r) / d + 2.0944;
    } else if (max == b) {
      h = 1.0472 * (r - g) / d + 4.1888;
    }
  }

  h = h / 6.2832 * 360.0 + 0;

  // Shift hue to opposite side of wheel and convert to [0-1] value
  h += 180;
  if (h > 360) { h -= 360; }
  h /= 360;

  // Convert h s and l values into r g and b values
  // Adapted from answer by Mohsen http://stackoverflow.com/a/9493060/4939630
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var hue2rgb = function hue2rgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  r = Math.round(r * 255);
  g = Math.round(g * 255);
  b = Math.round(b * 255);

  // Convert r b and g values to hex
  rgb = b | (g << 8) | (r << 16);
  return "#" + (0x1000000 | rgb).toString(16).substring(1);
}