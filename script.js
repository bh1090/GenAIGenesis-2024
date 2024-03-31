let mediaRecorder;
let recordedChunks = [];

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = function (event) {
      recordedChunks.push(event.data);
    };

    mediaRecorder.onstop = async function () {
      const blob = new Blob(recordedChunks, { type: "audio/webm" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "recording.webm";
      a.click();
      window.URL.revokeObjectURL(url);

      recordedChunks = []; // Reset chunks for next recording
    };

    mediaRecorder.start();

    // Optionally, provide UI feedback for recording started
    // For example: document.querySelector(".status").textContent = "Recording...";
  } catch (err) {
    console.error("Error accessing microphone:", err);
    // Optionally, provide user feedback about the error
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
    // Optionally, provide UI feedback for recording stopped
    // For example: document.querySelector(".status").textContent = "Recording stopped";
  }
}

document.querySelector(".start").addEventListener("click", function () {
  startRecording();
});

document.querySelector(".stop").addEventListener("click", function () {
  stopRecording();
});
