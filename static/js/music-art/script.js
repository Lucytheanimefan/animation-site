var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser;
var freqAnalyser;
var bufferLength;
var timeDomainData;
var frequencyData;

var firstTimePlay = true;
const CHUNKS = 32; // 3 ~ 30

function handleSelect(elm) {
  window.location = window.location + "/" + elm.value;
}

function playMusic() {
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