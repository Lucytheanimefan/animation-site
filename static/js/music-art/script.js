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
const SPEED = 4; // 1 ~ 30
var COLORS = []; //['#ffa300', '#cf0060', '#ff00ff', '#444444', '#555555'] // Colors will be sampled
const MOVEMENT = 2

const SEED_COLOR = { 'r': 255, 'g': 255, 'b': 255 };

function playMusic() {
  if (firstTimePlay) {
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

  renderFrame();
}

function renderFrame() {

  animationID = requestAnimationFrame(renderFrame);
  // update data in frequencyData

  //analyser.getByteFrequencyData(frequencyData);
  // render frame based on values in frequencyData

  //The byte values do range between 0-255, and yes, that maps to -1 to +1, so 128 is zero. (It's not volts, but full-range unitless values.)
  analyser.getByteTimeDomainData(timeDomainData); // fill the Uint8Array with data returned from getByteTimeDomainData()


  console.log('Time domain data length: ' + timeDomainData.length);



}

function pauseMusic() {
  console.log('Pause!');
  cancelAnimationFrame(animationID);
}



// Sample item from array
function sample(collection) {
  return collection[Math.floor(Math.random() * collection.length)]
}
//var sample = (collection) => collection[Math.floor(Math.random() * collection.length)]

function generateNewColors() {
  let factor = 255 / 128;
  console.log('Factor: ' + factor);
  // Generate colors
  for (let i = 0; i < timeDomainData.length - 3; i++) {
    let d = timeDomainData[i];
    COLORS.push('rgb(' + Math.round(d * factor * Math.random()) +
      ',' + Math.round(d * factor * Math.random()) +
      ',' + Math.round(d * factor * Math.random()) + ')');
  }
  // console.log(timeDomainData);
  console.log(COLORS);
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
  item.color = sample(COLORS)
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
      color: sample(COLORS),
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

  // console.log('Render items length: ' + renderItems.length);
  // console.log('FFT length: ' + frequencyData.length);
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