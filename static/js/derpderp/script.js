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
const maxNumFish = 100;
var fishSpeeds = [];
const fishSpeedLimit = 20;

const fishTypes = ["bigger-fish.gif", "fat-fish.gif"]

document.addEventListener("DOMContentLoaded", function(event) {
  drawFish(true);
  animateFish();
  setFishClickEvent();
});

function drawFish(originalFish = false) {
  var id = "fish" + fish.length;
  if (originalFish) {
    id = "originalFish"
  }
  let fishType = Math.random() < 0.5 ? fishTypes[0] : fishTypes[1];
  $("#body").append("<img class='fish' id = '" + id + "' src='/static/img/derpderp/" + fishType + "'>")
  fish.push({});
  fishSpeeds.push(Math.random() * fishSpeedLimit);
}

function animateFish() {
  $(".fish").each(function(i) {
    var fish = this;
    var fishIndex = i;
    setInterval(function() {
      //console.log(this);
      var position = $(fish).offset(); //position();
      // console.log(position);
      // console.log($(document).width());
      if (position.left < 0) {
        fishSpeeds[i] = (fishSpeeds[i] < 0) ? -1 * fishSpeeds[i] : fishSpeeds[i];
      } else if (position.left > $(document).width()) {
        fishSpeeds[i] = (fishSpeeds[i] > 0) ? -1 * fishSpeeds[i] : fishSpeeds[i];
      }
      // console.log("New pos: " + (position.left + fishSpeeds[fishIndex]));
      $(fish).offset({ left: (position.left + fishSpeeds[fishIndex]) });
    }, 10);
  });
}

function setFishClickEvent() {
  $("#originalFish").click(function() {
    if (originalFishClicked) {
      return
    }
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