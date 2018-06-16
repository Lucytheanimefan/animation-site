var fish = [];
var originalFishClicked = false;
const maxNumFish = 70;
var fishSpeeds = [];
const fishSpeedLimit = 20;

const fishTypes = ["bigger-fish.gif", "fat-fish.gif", "foot-fish.gif"]

document.addEventListener("DOMContentLoaded", function(event) {
  drawFish(true);
  animateFish();
  setFishClickEvent();
});

function drawFish(originalFish = false) {
  var id = "fish" + fish.length;
  if (Math.random() <= 0.017) {
    // Foot fish
    $("#body").append("<img class='footfish fish' src='/static/img/derpderp/" + fishTypes[2] + "'>");
  } else {
    let fishType = (Math.random() < 0.5 ? fishTypes[0] : fishTypes[1]);
    if (originalFish) {
      $("#body").append("<div class='fish' id='originalFish'><img id = 'originalFish' src='/static/img/derpderp/" + fishType + "'><div id='clickMe'>Click me</p></div>");
    } else {
      $("#body").append("<img class='fish' src='/static/img/derpderp/" + fishType + "'>");
    }
  }
  fish.push({});
  fishSpeeds.push({ x: Math.random() * fishSpeedLimit, y: Math.random() * fishSpeedLimit, ycoord: Math.random() * $(document).height() });
}

function animateFish() {
  $(".fish").each(function(i) {
    var fish = this;
    var fishIndex = i;
    setInterval(function() {
      let speed = fishSpeeds[i];
      var position = $(fish).offset(); //position();
      var topPos = 0;
      var leftPos = 0;

      if ($(fish).hasClass("footfish")) {
        if (position.left < 0) {

          leftPos = $(document).width();
          topPos = Math.random() * $(document).height();

        } else {
          leftPos = position.left - 50;
          topPos = speed.ycoord;
        }


      } else {
        if (position.left < 0) {
          speed.x = (speed.x < 0) ? -1 * speed.x : speed.x;
        } else if (position.left > $(document).width()) {
          speed.x = (speed.x > 0) ? -1 * speed.x : speed.x;
        }

        if (position.top < 0) {
          speed.y = (speed.y < 0) ? -1 * speed.y : speed.y;
        } else if (position.top > $(document).height()) {
          speed.y = (speed.y > 0) ? -1 * speed.y : speed.y;
        }
        topPos = position.top + speed.y
        leftPos = position.left + speed.x
      }

      $(fish).offset({
        left: leftPos,
        top: topPos,
      });
    }, 10);
  });
}

function setFishClickEvent() {
  $("#originalFish").click(function() {
    if (originalFishClicked) {
      return
    }

    $("#clickMe").remove();
    var i = 0;
    // Start spawning fish
    while (i < maxNumFish) {
      drawFish();
      i++;
    }
    animateFish();
    originalFishClicked = true;
  })
}

/* ----------- TANK -------------- */
var canvas = null;
var context = null;
var bufferCanvas = null;
var bufferCanvasCtx = null;
var bubbleArray = [];
var bubbleTimer = null;
var maxBubbles = (window.innerWidth / 10); // Here you may set max bubbles to be created

function sizeCanvas(height, width) {
  bufferCanvas = document.createElement("canvas");
  bufferCanvas.width = canvas.width = width;
  bufferCanvas.height = canvas.height = height;
  bufferCanvasCtx = bufferCanvas.getContext("2d");
}

function init() {
  bubbleTimer = null;
  canvas = document.getElementById("glCanvas");
  context = canvas.getContext("2d");
  sizeCanvas(window.innerHeight, window.innerWidth);
  bubbleTimer = setInterval(addBubble, 200);

  DrawBubble();

  setInterval(animate, 30);
}

function animate() {
  context.save();
  blank();
  UpdateBubble();
  DrawBubble();
  context.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height);
  context.font = '80px sans-serif';
  // context.fillText('Want to find out how I drew this fish?', bufferCanvas.width / 2 - 750, 100);
  context.restore();
}

function addBubble() {
  bubbleArray[bubbleArray.length] = new Bubble();
  if (bubbleArray.length == maxBubbles) {
    clearInterval(bubbleTimer);
  }
}

function blank() {
  bufferCanvasCtx.fillStyle = "#8789C0";
  bufferCanvasCtx.fillRect(0, 0, canvas.width, canvas.height);
}

function UpdateBubble() {
  for (var i = 0; i < bubbleArray.length; i++) {
    if (bubbleArray[i].y <= context.canvas.height) {
      bubbleArray[i].y -= bubbleArray[i].speed;
      if (bubbleArray[i].y <= 0)
        bubbleArray[i].y = context.canvas.height;
      bubbleArray[i].x += bubbleArray[i].drift;
      if (bubbleArray[i].x > context.canvas.width)
        bubbleArray[i].x = 0;
    }
  }
}


function Bubble() {
  this.x = Math.round(Math.random() * context.canvas.width);
  this.y = context.canvas.height - 10;
  this.drift = Math.random();
  this.speed = Math.round(Math.random() * 3) + 1;
  this.width = (Math.random() * 5) + 10;
  this.height = this.width;
}


function DrawBubble() {
  for (var i = 0; i < bubbleArray.length; i++) {
    bufferCanvasCtx.beginPath();
    bufferCanvasCtx.arc(bubbleArray[i].x, bubbleArray[i].y, bubbleArray[i].width, 0, Math.PI * 2, true);
    bufferCanvasCtx.strokeStyle = "white";
    bufferCanvasCtx.lineWidth = 1;
    bufferCanvasCtx.fillStyle = "rgba(255,255,255,.15)";
    bufferCanvasCtx.stroke();
    bufferCanvasCtx.fill();

  }
  // context.drawImage(bufferCanvas, 0, 0, bufferCanvas.width, bufferCanvas.height);
  // context.restore();
}

window.addEventListener('DOMContentLoaded', function() {
  init();
});

//Set up logic to resize!
if (typeof window.orientation !== 'undefined') {
  window.addEventListener("orientationchange", function() {
    sizeCanvas(document.body.clientHeight, document.body.clientWidth);
  });
} else {
  window.onresize = (function() {
    sizeCanvas(window.innerHeight, window.innerWidth);
  });
}