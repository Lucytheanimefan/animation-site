// Create HTML elements
for (let i = 0; i<8; i++)
{
	$("#snowflake").append("<div class='crystal'></div>");
	for (let j = 0; j<50; j++)
	{
		$(".crystal").last().append("<div class='ice'><i></i></div>");
	}
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