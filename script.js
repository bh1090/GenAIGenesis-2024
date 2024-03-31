let mediaRecorder;
let recordedChunks = [];
let recordedAudioData; // Variable to store the recorded audio data

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (event) {
    recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = async function () {
    recordedAudioData = new Blob(recordedChunks, { type: "audio/webm" });

    // You can now use the recordedAudioData variable to further process or manipulate the recorded audio
    console.log("Recorded audio data:", recordedAudioData);

    // Clear recordedChunks for the next recording
    recordedChunks = [];
  };

  mediaRecorder.start();
}

function stopRecording() {
  mediaRecorder.stop();
}

document.querySelector(".start").addEventListener("click", function () {
  startRecording();
});

document.querySelector(".stop").addEventListener("click", function () {
  stopRecording();
});
