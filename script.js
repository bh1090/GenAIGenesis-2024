let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (event) {
    recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = async function () {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);

    // Create an anchor element to trigger the download
    const a = document.createElement("a");
    a.href = url;
    a.download = "recording.webm";
    a.click(); // Simulate a click to trigger the download
    window.URL.revokeObjectURL(url); // Clean up the URL object
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
