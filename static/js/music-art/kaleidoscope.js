var snowflakeCount = 8;
var crystalCount = 50;

function setup() {
  createElements();
  analyser.getByteTimeDomainData(timeDomainData);

  // Start animation frame
  window.requestAnimationFrame(render);
}

function createElements() {
  // Create HTML elements
  for (let i = 0; i < snowflakeCount; i++) {
    $("#snowflake").append("<div class='crystal'></div>");
    for (let j = 0; j < crystalCount; j++) {
      $(".crystal").last().append("<div class='ice'><i></i></div>");
    }
  }

  applyCSS();
}

function applyCSS(crystalDegree=45, iceDegree = 3.6, iceDelay=-0.05) {
  $(".crystal").each(function(index) {
  	let degree = crystalDegree * index;
    $(this).css({
      "-webkit-transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)",
      "transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)"
    });
  });

  $(".ice").each(function(index) {
    let degree = index * 3.6;
    $(this).css({
      "-webkit-transform": "rotate( " + degree + " deg) translate3d(100%, 0, 0)",
      "transform": "rotate(" + degree + "deg) translate3d(100%, 0, 0)"
    });
  });


  $(".ice i").each(function(index) {
    let seconds = index * iceDelay;
    let color = ColorLuminance("2b00ff", index / 100); // "#7ab8f5" - 20% lighter
    $(this).css({
      "-webkit-animation-delay": seconds + "s",
      "animation-delay": seconds + "s",
      "background-color": color
      //"hsla(250 - (" + index + " * 50 /" + crystalCount + "),100%,50%,1)" //hsla(250 - ($i * 50 / $crystal-count),100%,50%,1);
    });
  });
}

function render() {
  freqAnalyser.getByteFrequencyData(frequencyData); // Array of 16
  analyser.getByteTimeDomainData(timeDomainData);

  console.log(frequencyData);
  // $(".crystal").each(function(index) {
  // 	let degree = frequencyData[index];
  //   $(this).css({
  //     "-webkit-transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)",
  //     "transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)"
  //   });
  // });

  // $(".ice").each(function(index) {
  //   let degree = frequencyData[index];
  //   $(this).css({
  //     "-webkit-transform": "rotate( " + degree + " deg) translate3d(100%, 0, 0)",
  //     "transform": "rotate(" + degree + "deg) translate3d(100%, 0, 0)"
  //   });
  // });


  $(".ice i").each(function(index) {
    let seconds = frequencyData[index % frequencyData.length]/500 * -1;
    console.log("Delay: " + seconds);
    let color = ColorLuminance("2b00ff", index / 100); // "#7ab8f5" - 20% lighter
    $(this).css({
      "-webkit-animation-delay": seconds + "s",
      "animation-delay": seconds + "s",
      "background-color": color
      //"hsla(250 - (" + index + " * 50 /" + crystalCount + "),100%,50%,1)" //hsla(250 - ($i * 50 / $crystal-count),100%,50%,1);
    });
  });


  window.requestAnimationFrame(render);
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

  return rgb;
}