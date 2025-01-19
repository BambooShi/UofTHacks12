import {
    PoseLandmarker,
    FilesetResolver,
    DrawingUtils,
} from "https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0";

export { createPoseLandmarker, hasGetUserMedia, predictWebcam };

let poseLandmarker;
let lastVideoTime = -1;
let runningMode = "IMAGE";
const videoHeight = "640px";
const videoWidth = "480px";

async function createPoseLandmarker() {
    const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `/models/pose_landmarker_full.task`,
            delegate: "GPU",
        },
        runningMode: runningMode,
        numPoses: 2,
    });

    //demosSection.classList.remove("invisible");
}
//createPoseLandmarker();
// pt 1 out
// Check if webcam access is supported.
const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;

// pt. 2 out

async function predictWebcam(video, canvasElement, callback) {
    console.log("We predicting..");
    const canvasCtx = canvasElement.getContext("2d");
    const drawingUtils = new DrawingUtils(canvasCtx);

    canvasElement.style.height = videoHeight;
    video.style.height = videoHeight;
    canvasElement.style.width = videoWidth;
    video.style.width = videoWidth;
    // Now let's start detecting the stream.
    if (runningMode === "IMAGE") {
        runningMode = "VIDEO";
        await poseLandmarker.setOptions({ runningMode: "VIDEO" });
    }
    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
            canvasCtx.save();
            canvasCtx.clearRect(
                0,
                0,
                canvasElement.width,
                canvasElement.height
            );
            for (const landmark of result.landmarks) {

                drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => {
                        if (data.from && typeof data.from.z !== "undefined") {
                            return DrawingUtils.lerp(
                                data.from.z,
                                -0.15,
                                0.1,
                                5,
                                1
                            );
                        }
                        // Provide fallback value if data.from is undefined or doesn't have z
                        return 0; // Or another default value
                    },
                });
                drawingUtils.drawConnectors(
                    landmark,
                    PoseLandmarker.POSE_CONNECTIONS
                );
            }
            callback(result);
            canvasCtx.restore();
        });
    }

    // Call this function again to keep predicting when the browser is ready.
    window.requestAnimationFrame(() => {predictWebcam(video, canvasElement, callback);});
}
