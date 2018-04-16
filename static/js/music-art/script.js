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
const COLOURS = ['#ffa300', '#cf0060', '#ff00ff', '#444444', '#555555'] // Colours will be sampled
const MOVEMENT = 2



function playMusic() {
  if (firstTimePlay) {
    firstTimePlay = false;
    audioCtx = new AudioContext();
    audio = document.getElementById('sound');

    duration = audio.duration;
    var audioSrc = audioCtx.createMediaElementSource(audio);
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 64; //2048;
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


  //console.log(timeDomainData);
  


}

function pauseMusic() {
  console.log('Pause!');
  cancelAnimationFrame(animationID);
}



// Sample item from array
function sample(collection){
	return collection[Math.floor(Math.random() * collection.length)]
}
//var sample = (collection) => collection[Math.floor(Math.random() * collection.length)]

function setup() {
  // Setup canvas
  canvas = document.getElementById('wobble');
  ctx = canvas.getContext('2d');
  WIDTH = canvas.width;
  HEIGHT = canvas.height;

  // Prepare items
  items = generateItems(CHUNKS);

  // Start animation frame
  window.requestAnimationFrame(render);
}

// Randomly reassigns values to point
var randomlyGeneratePoint = (item) => {
  item.color = sample(COLOURS)
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
      color: sample(COLOURS),
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
  ctx.beginPath();

  console.log('Render items length: ' + renderItems.length);
  console.log('FFT length: ' + frequencyData.length);
  renderItems.forEach((item, index) => {
    if (index === 0) ctx.moveTo(0, HEIGHT / 2) // start at zero point
    if (index + 1 !== renderItems.length) ctx.lineTo(renderItems[index + 1].current.x, items[index + 1].current.y); // move current to target
    if (index + 1 === renderItems.length) ctx.lineTo(canvas.width, canvas.height / 2) // move last point to center end of canvas

    /*
      current is under target, move up
      current is above target, move down
      current is equal or around target, randomlyGeneratePoint()
    */
    if (item.current.y < item.target.y) {
      item.current.y += item.current.speed
    } else if (item.current.y >= item.target.y && item.current.y <= item.target.y + SPEED) {
      ctx.strokeStyle = item.color
      randomlyGeneratePoint(item) // generate new target points to move to
    } else {
      item.current.y -= item.current.speed
    }
  });

  ctx.stroke()

  window.requestAnimationFrame(render);
}