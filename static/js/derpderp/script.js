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
const fishLimit = 100;

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
  $("#body").append("<img class='fish' id = '" + id + "' src='/static/img/derpderp/bigger-fish.gif'>")
  fish.push({});
}

function animateFish() {
  $(".fish").each(function(i) {
  	var fish = this;
    setInterval(function() {
    	//console.log(this);
      var moveRight = 5;
      var position = $(fish).offset();//position();
      console.log(position);
      if (position.left < 0) {
        moveRight = 5;
      } else if (position.left > $(document).width()) {
        moveRight = -5;
      }
      console.log("New pos: " + (position.left + moveRight));
      $(fish).offset({ left: (position.left + moveRight)});
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
    while (i < fishLimit) {
      drawFish();
      i++;
    }
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