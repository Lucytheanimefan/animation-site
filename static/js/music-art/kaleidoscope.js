var crystals = 8;
var ice = 50;
var snowflakeCount = 8;
var crystalCount = 50;

// Create HTML elements
for (let i = 0; i < crystals; i++) {
  $("#snowflake").append("<div class='crystal'></div>");
  for (let j = 0; j < ice; j++) {
    $(".crystal").last().append("<div class='ice'><i></i></div>");
  }
}

applyCSS();

function applyCSS() {
  $(".crystal").each(function(index) {
  	let degree = 45 * index;
  	console.log(index + ": " + degree);
      $(this).css({
        "-webkit-transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)",
        "transform": "rotate(" + degree + "deg) translate3d(100px, 0, 0)"
      });
    console.log(index + ": " + $(this).text());
  });

  $(".ice").each(function(index) {
  	let degree = index * 3.6;
      $(this).css({
        "-webkit-transform": "rotate( " + degree + " deg) translate3d(100%, 0, 0)",
        "transform": "rotate(" + degree + "deg) translate3d(100%, 0, 0)"
      });
    console.log(index + ": " + $(this).text());
  });


  $(".ice i").each(function(index) {
  	let seconds = index * -0.05;
  	let color = ColorLuminance("2b00ff", index/100);	// "#7ab8f5" - 20% lighter
      $(this).css({
        "-webkit-animation-delay": seconds + "s",
          "animation-delay": seconds + "s",
  		"background-color": color
  		//"hsla(250 - (" + index + " * 50 /" + crystalCount + "),100%,50%,1)" //hsla(250 - ($i * 50 / $crystal-count),100%,50%,1);
      });
    console.log(index + ": " + $(this).text());
  });
}

function render() {
  const renderItems = items;
  freqAnalyser.getByteFrequencyData(frequencyData);
  analyser.getByteTimeDomainData(timeDomainData);
  ctx.beginPath();

  renderItems.forEach((item, index) => {
    if (index === 0) {
      ctx.moveTo(0, HEIGHT / 2); // start at zero point
    }
    if (index + 1 !== renderItems.length) {
      ctx.lineTo(renderItems[index + 1].current.x, items[index + 1].current.y); // move current to target
    }
    if (index + 1 === renderItems.length) {
      ctx.lineTo(canvas.width, canvas.height / 2); // move last point to center end of canvas
    }

    /*
      current is under target, move up
      current is above target, move down
      current is equal or around target, randomlyGeneratePoint()
    */
    var yFreq = frequencyData[index] //Math.pow(frequencyData[index], 2);
    if (item.current.y < item.target.y) {
      item.current.y += yFreq; //item.current.speed
    } else if (item.current.y >= item.target.y && item.current.y <= item.target.y + SPEED) {
      ctx.strokeStyle = item.color
      //randomlyGeneratePoint(item); // generate new target points to move to
    } else {
      item.current.y -= yFreq; //item.current.speed
    }
  });

  ctx.stroke()

  window.requestAnimationFrame(render);
}

function ColorLuminance(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}

	return rgb;
}