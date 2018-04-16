var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var analyser;
var bufferLength;
var timeDomainData;
var frequencyData;

var animationID;

var firstTimePlay = true;

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
    freqAnalyser.fftSize = 64;
    audioSrc.connect(freqAnalyser);
    // frequencyBinCount tells you how many values you'll receive from the analyser
    frequencyData = new Uint8Array(freqAnalyser.frequencyBinCount); // Not being used
    timeDomainData = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize 
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


  console.log(timeDomainData)


}

function pauseMusic() {
  console.log('Pause!');
  cancelAnimationFrame(animationID);
}