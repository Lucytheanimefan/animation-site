var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser;
var freqAnalyser;
var bufferLength;
var timeDomainData;
var frequencyData;

var animationID;

var firstTimePlay = true;

var canvas;
var WIDTH, HEIGHT;

var items = [];

const CHUNKS = 32; // 3 ~ 30
var SPEED = 2; // 1 ~ 30
var COLORS = []; //['#ffa300', '#cf0060', '#ff00ff', '#444444', '#555555'] // Colors will be sampled

const schemeTypes = ['mono', 'contrast', 'triade', 'tetrade', 'analogic'];
const variations = ['default', 'pastel', 'soft', 'light', 'hard', 'pale'];

var SCHEME = schemeTypes[Math.floor(Math.random() * schemeTypes.length)];
var VARIATION = variations[Math.floor(Math.random() * variations.length)];

var oldTimeDomainTotal = 0;
var oldMax = 0;
//var oldTimeDomainData = Array.apply(null, Array(CHUNKS)).map(Number.prototype.valueOf, 0);;

const MAX_HUE = 239;
var COLOR_THRESHOLD = 50;

var regularClear = true;

$("#color-threshold").change(function() {
  COLOR_THRESHOLD = $(this).val();
  console.log("New color threshold: " + COLOR_THRESHOLD);
})

$("#clear-canvas").click(function() {
  clearCanvas();
})

$("#speed").change(function() {
  SPEED = $(this).val();
  console.log('Speed: ' + SPEED);
})

function clearCanvas() {
  let canvas = document.getElementById('wobble');
  let ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

$("#regularClear").click(function() {
  regularClear = $(this).is(':checked');
  console.log('Regular clear: ' + regularClear);
})

function playMusic() {
  console.log(SCHEME);
  console.log(VARIATION);
  if (!firstTimePlay) return;
  firstTimePlay = false;
  audioCtx = new AudioContext();
  audio = document.getElementById('sound');

  duration = audio.duration;
  var audioSrc = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  analyser.fftSize = CHUNKS; //2048;
  audioSrc.connect(audioCtx.destination);
  audioSrc.connect(analyser);

  bufferLength = analyser.frequencyBinCount;

  freqAnalyser = audioCtx.createAnalyser();
  freqAnalyser.fftSize = CHUNKS;
  audioSrc.connect(freqAnalyser);
  // frequencyBinCount tells you how many values you'll receive from the analyser
  frequencyData = new Uint8Array(freqAnalyser.frequencyBinCount); // Not being used
  timeDomainData = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize 

  setup();

}


function pauseMusic() {
  console.log('Pause!');
}



// Sample item from array
function sample(collection) {
  return collection[Math.floor(Math.random() * collection.length)]
}

function add(a, b) {
  return a + b;
}

function generateNewColors() {
  //console.log(timeDomainData);
  var newMax = Math.max(...timeDomainData);

  // Generate colors
  if (Math.abs(newMax - oldMax) < COLOR_THRESHOLD) return;

  var hueVal = MAX_HUE * oldMax / newMax;
  if (hueVal == null || isNaN(hueVal)) hueVal = 21;

  var distance = 0; //The value must be a float from 0 to 1
  if (SCHEME == 'triade' || SCHEME == 'tetrade' || SCHEME == 'analogic') {
    distance = Math.random();
  }
  //console.log("hueVal: " + hueVal);
  var scheme = new ColorScheme;
  scheme.from_hue(hueVal)
    .scheme(SCHEME)
    .distance(distance)
    .variation(VARIATION);
  COLORS = scheme.colors();

  oldMax = newMax;

  if (regularClear) {
    clearCanvas();
  }
}

function setup() {
  // Setup canvas
  canvas = document.getElementById('wobble');
  ctx = canvas.getContext('2d');
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  analyser.getByteTimeDomainData(timeDomainData);

  generateNewColors();

  // Prepare items
  items = generateItems(CHUNKS / 2);

  // Start animation frame
  window.requestAnimationFrame(render);
}

// Randomly reassigns values to point
var randomlyGeneratePoint = (item) => {
  generateNewColors();
  item.color = "#" + sample(COLORS)
  item.speed = SPEED
  item.target.y = HEIGHT * Math.random()
}

// Initialise and generate items.
function generateItems(amount) {
  let ary = new Array(amount);
  ary.fill(1);

  return ary.fill({}).map((_item, index) => {
    let x = WIDTH * index / ary.length
    let y = HEIGHT * Math.random()
    let speed = SPEED * Math.random();

    return {
      color: "#" + sample(COLORS),
      target: {
        x: x,
        y: y,
        speed: speed
      },
      current: {
        x: WIDTH * index / ary.length,
        y: HEIGHT * Math.random(),
        speed: speed
      }
    }
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
      randomlyGeneratePoint(item); // generate new target points to move to
    } else {
      item.current.y -= yFreq; //item.current.speed
    }
  });

  ctx.stroke()

  window.requestAnimationFrame(render);
}


function canvasToImage() {
  var c = document.getElementById("wobble");
  var d = c.toDataURL("image/png");
  var w = window.open('about:blank', 'image from canvas');
  w.document.write("<img src='" + d + "' alt='from canvas'/>");
}