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

async function stopRecording() {
  mediaRecorder.stop();

  const blob = new Blob(recordedChunks, { type: "audio/webm" });

  const ffmpeg = FFmpeg.createFFmpeg({ log: true }); // Use FFmpeg.createFFmpeg instead of createFFmpeg
  await ffmpeg.load();
  await ffmpeg.write("recording.webm", await fetch(blob));
  await ffmpeg.run("-i", "recording.webm", "output.mp3");
  const data = ffmpeg.read("output.mp3");

  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );
  const a = document.createElement("a");
  document.body.appendChild(a);
  a.style = "display: none";
  a.href = url;
  a.download = "recording.mp3";
  a.click();
  window.URL.revokeObjectURL(url);
}

document.querySelector(".start").addEventListener("click", function () {
  startRecording();
});

document.querySelector(".stop").addEventListener("click", function () {
  stopRecording();
});
