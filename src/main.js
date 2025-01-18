import { startCamera } from './camera/capture.js';
import { setupPoseDetection } from './tracking/poseEstimation.js';

(async function main() {
    console.log("Starting Human Movement Tracker...");

    // Initialize MediaPipe Pose Detector
    const poseDetector = setupPoseDetection();

    // Start the camera feed and pass frames to pose detection
    await startCamera(poseDetector.onResults);
})();
