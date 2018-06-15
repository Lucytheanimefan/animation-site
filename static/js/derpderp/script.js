// const canvas = document.getElementById("canvas");
// const context = canvas.getContext("2d");
// const img = document.getElementById("fish");
// const rect = canvas.getBoundingClientRect();
// context.canvas.width = window.innerWidth;
// context.canvas.height = window.innerHeight;
// const fishWidth = img.width;
// const fishHeight = img.height;
// var fishLocations = [];


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

// function drawFish(x = 0, y = 0, width = fishWidth, height = fishHeight) {
//   if (width && height) {
//     context.drawImage(img, x, y, width, height);
//   } else {
//     context.drawImage(img, x, y);
//   }
//   fishLocations.push({ x: x, y: y })
// }

// function testFish(numFish = 10) {
//   for (let i = 0; i < numFish; i++) {
//     let posx = (Math.random() * $(document).width()).toFixed();
//     let posy = (Math.random() * $(document).height()).toFixed();
//     drawFish(posx, posy);
//   }
//   console.log(fishLocations);
// }

// function setFishClickEvent() {
//   $("#canvas").on("click", function(event) {
//     var x = event.clientX - rect.left;
//     var y = event.clientY - rect.top;
//     for (let i = 0, len = fishLocations.length; i < len; i++) {
//       let fishLocation = fishLocations[i];
//       if (x < (fishLocation.x + fishWidth) && (x > fishLocation.x) &&
//         y < (fishLocation.y + fishHeight) && (y > fishLocation.y)) {
//         console.log(location);
//         console.log("Clicked the fish!" + x + "," + y);
//       }
//     }
//   })
// }