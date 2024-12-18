const startButton = document.getElementById('start');
const transcriptionDiv = document.getElementById('transcription');

startButton.addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mediaRecorder = new MediaRecorder(stream);
  const socket = new WebSocket('ws://localhost:3001'); // Ensure this matches the server port

  socket.onmessage = (event) => {
    const transcript = event.data;
    transcriptionDiv.innerHTML += `<p>${transcript}</p>`;
  };

  mediaRecorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      socket.send(event.data);
    }
  };

  mediaRecorder.start(1000);
});