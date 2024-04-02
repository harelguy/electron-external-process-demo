startProcess = () => {
  document.getElementById("status").innerHTML = "Started";
  console.log("Starting");
  window.electronAPI.startProcess();
};

stopProcess = () => {
  console.log("Stopping");
  window.electronAPI.stopProcess();
};

document.getElementById("startButton").addEventListener("click", startProcess);
document.getElementById("stopButton").addEventListener("click", stopProcess);

const counter = document.getElementById("counter");

window.electronAPI.onUpdateStatus((status) => {
  document.getElementById("status").innerHTML = status;
});
