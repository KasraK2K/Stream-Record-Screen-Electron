// buttons
const videoElement = document.querySelector('video');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const videoSelectBtn = document.getElementById('videoSelectBtn');
const { desktopCapturer, remote } = require('electron');
const { Menu, dialog } = remote;
const { writeFile } = require('fs');

videoSelectBtn.onclick = getVideoSource;

startBtn.onclick = e => {
  mediaRecorder.start();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording 🕐';
  animateRecording(100); // inimate with interval
};

stopBtn.onclick = e => {
  mediaRecorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
  clearInterval(myInterval); // clear interval animate
};

// animate function
let myInterval;
function animateRecording(time) {
  myInterval = setInterval(() => {
    switch (startBtn.innerText) {      
      case 'Recording 🕐':
        startBtn.innerText = 'Recording 🕑'
        break;

      case 'Recording 🕑':
        startBtn.innerText = 'Recording 🕒'
        break;
      
      case 'Recording 🕒':
        startBtn.innerText = 'Recording 🕓'
        break;

      case 'Recording 🕓':
        startBtn.innerText = 'Recording 🕔'
        break;

      case 'Recording 🕔':
        startBtn.innerText = 'Recording 🕕'
        break;

      case 'Recording 🕕':
        startBtn.innerText = 'Recording 🕖'
        break;

      case 'Recording 🕖':
        startBtn.innerText = 'Recording 🕗'
        break;

      case 'Recording 🕗':
        startBtn.innerText = 'Recording 🕘'
        break;
        
      case 'Recording 🕘':
        startBtn.innerText = 'Recording 🕙'
        break;

      case 'Recording 🕙':
        startBtn.innerText = 'Recording 🕚'
        break;

      case 'Recording 🕚':
        startBtn.innerText = 'Recording 🕛'
        break;

      case 'Recording 🕛':
        startBtn.innerText = 'Recording 🕐'
        break;
    
      default:
        break;
    }
  }, time);
}

// Get the available video source
async function getVideoSource() {
  const inputSources = await desktopCapturer.getSources({types: ['window', 'screen']});

  const videoOptionMenu = Menu.buildFromTemplate(
    inputSources.map(source => {
      return {
        label: source.name,
        click: () => selectSource(source)
      }
    })
  );

  videoOptionMenu.popup();
}

let mediaRecorder; // MediaRecorder instance to capture footage
const recordedChunks = [];

// Change the videoSource window to record
async function selectSource(source) {
  videoSelectBtn.innerHTML = `<span class="success">Streaming:</span> ${source.name}`;

  const constraints = {
    audio: false,
    video: {
      mandatory: {
        chromeMediaSource: 'desktop',
        chromeMediaSourceId: source.id,
      }
    }
  }

  // Create a Stream
  const stream = await navigator.mediaDevices.getUserMedia(constraints);

  // Preview the source in a video element
  videoElement.srcObject = stream;
  videoElement.play();

  // Create the media recorder
  const options = { mimeType: 'video/webm; codecs=vp9' };
  mediaRecorder = new MediaRecorder(stream, options);

  // Register Event Handlers
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstop = handleStop;
}

// Captures all recorded Chunks
function handleDataAvailable(e) {
  console.log('video data available');
  recordedChunks.push(e.data);
}

// Saves the video on stop
async function handleStop(e) {
  const options = { type: 'video/webm; codecs=vp9' };
  const blob = new Blob(recordedChunks, options);
  const buffer = Buffer.from(await blob.arrayBuffer());

  const { filePath } = await dialog.showSaveDialog({
    buttonLabel: 'Save Video',
    defaultPath: `vid-${Date.now()}.webm`,
  });

  writeFile(filePath, buffer, () => console.log('video saved successfully!'));
}