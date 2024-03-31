let mediaRecorder;
let recordedChunks = [];
const FFmpeg = require("@ffmpeg/ffmpeg");

async function startRecording() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);

  mediaRecorder.ondataavailable = function (event) {
    recordedChunks.push(event.data);
  };

  mediaRecorder.onstop = function () {
    const blob = new Blob(recordedChunks, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    a.href = url;
    a.download = "recording.webm";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  mediaRecorder.start();
}

async function stopRecording() {
  mediaRecorder.stop();

  const ffmpeg = FFmpeg.createFFmpeg({ log: true }); // Corrected usage of FFmpeg.createFFmpeg
  await ffmpeg.load();
  ffmpeg.FS("writeFile", "recording.webm", await fetchBlob(recordedChunks));
  await ffmpeg.run("-i", "recording.webm", "output.mp3");
  const data = ffmpeg.FS("readFile", "output.mp3");

  const url = URL.createObjectURL(
    new Blob([data.buffer], { type: "audio/mp3" })
  );
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = "recording.mp3";
  downloadLink.textContent = "Click here to download the recording as MP3";
  document.body.appendChild(downloadLink);
}

document.getElementById("recordButton").addEventListener("click", function () {
  startRecording();
  document.getElementById("recordButton").disabled = true;
  document.getElementById("stopButton").disabled = false;
  document.getElementById("downloadButton").disabled = true;
});

document.getElementById("stopButton").addEventListener("click", function () {
  stopRecording();
  document.getElementById("recordButton").disabled = false;
  document.getElementById("stopButton").disabled = true;
  document.getElementById("downloadButton").disabled = false;
});

async function fetchBlob(recordedChunks) {
  const blob = new Blob(recordedChunks, { type: "audio/webm" });
  return new Uint8Array(await blob.arrayBuffer());
}

// Function to handle file upload to Google Drive
async function uploadToDrive(file) {
  const accessToken = "YOUR_ACCESS_TOKEN"; // Replace with the access token obtained after authentication
  const metadata = {
    name: file.name,
    mimeType: file.type,
  };

  const formData = new FormData();
  formData.append(
    "metadata",
    new Blob([JSON.stringify(metadata)], { type: "application/json" })
  );
  formData.append("file", file);

  try {
    const response = await fetch(
      "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );

    if (response.ok) {
      const data = await response.json();
      console.log("File uploaded successfully. File ID:", data.id);
      return data.id;
    } else {
      console.error(
        "Failed to upload file to Google Drive:",
        response.statusText
      );
      return null;
    }
  } catch (error) {
    console.error("Error uploading file to Google Drive:", error);
    return null;
  }
}

// Example usage:
const fileInput = document.getElementById("fileInput");
fileInput.addEventListener("change", async (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileId = await uploadToDrive(file);
    if (fileId) {
      alert("File uploaded successfully!");
    } else {
      alert("Failed to upload file to Google Drive. Please try again.");
    }
  }
});
