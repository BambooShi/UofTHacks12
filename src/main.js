const { startCamera } = require('./camera/capture');
const { detectPose } = require('./tracking/poseEstimation');

// Main function to run the program
(async function main() {
    console.log("Starting Human Movement Tracker...");
    await startCamera(detectPose);
})();