const { spawn, exec } = require("child_process");
let processInstance = null;
let lastLineOfOutput = "";

let statusCallback = null;

startExternalProcess = async (cb) => {
  statusCallback = cb;
  if (processInstance !== null) {
    console.warn("Process is already running.");
    return;
  }
  console.log("externalProcess manager starting");
  const command = "while true; do date; sleep 1; done";
  processInstance = spawn(command, [], { shell: true });

  processInstance.stdout.on("data", (data) => {
    const output = data.toString();
    console.log(output); // For debugging, can be removed
    lastLineOfOutput = output.trim().split("\n").pop();
    if (statusCallback !== null) {
      statusCallback(processInstance.pid + ": " + lastLineOfOutput);
    }
  });

  processInstance.stderr.on("data", (data) => {
    console.error(`stderr: ${data}`);
    statusCallback(processInstance.pid + ": " + data);
  });

  processInstance.on("close", (code) => {
    console.log(`Child process exited with code ${code}`);
    if (code == null) statusCallback(`Stopped`);
    else statusCallback(`Exited with error code ${code}`);

    processInstance = null; // Reset process instance for restart.
  });
  console.log("externalProcess manager started");
};

stopExternalProcess = async () => {
  console.log("externalProcess manager stopping");
  if (processInstance === null) {
    console.warn("No process is running.");
    return;
  }

  processInstance.kill("SIGTERM"); // Or 'SIGKILL' for a force stop
  console.log("externalProcess manager stopped");
};

function getLastLineOfOutput() {
  return lastLineOfOutput;
}

module.exports = {
  startExternalProcess,
  stopExternalProcess,
  getLastLineOfOutput,
};
