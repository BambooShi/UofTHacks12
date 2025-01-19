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
    //console.log("We predicting..");
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

            // detecting landmarks

            // to actually see if it's the person 1 (left side) or person 2 (right side),
            // before sending over move, check if the person's one part is less of the x component or wtv 
            // to see if they're on left side or right side.. then send over correspondingly that they're the 1st person..

            // a person
            const landmarks1 = result.landmarks[0];
            if (landmarks1){
                const leftHipY1 = landmarks1[23].y;
                const rightHipY1 = landmarks1[24].y;
                const leftKneeY1 = landmarks1[25].y;
                const rightKneeY1 = landmarks1[26].y;
                const leftHandY1 = landmarks1[21].y;
                //console.log("leftHandY is: ", leftHandY1);
                const rightHandY1 = landmarks1[22].y;
        
                const isJumping1 = leftHipY1 < 0.4 && rightHipY1 < 0.4;
                const isSquatting1 = leftKneeY1 - leftHipY1 < 0.1 && rightKneeY1 - rightHipY1 < 0.1;
                const isLeftHandUp1 = leftHandY1 < 0.5;
                const isRightHandUp1 = rightHandY1 < 0.5;
        
                if (isJumping1){
                    // triggerAnimation("jump");
                    console.log("person 1 jumping");
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                    
                } else if (isSquatting1){
                    // triggerAnimation("squat");
                    console.log("person 1 squatting");
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                
                } 
                 if (isLeftHandUp1){
                    // triggerAnimation("jump");
                    console.log("person 1 squat");
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                }  if (isRightHandUp1){
                    console.log("person 1 jump");
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                }
                // Only overwrite missing pixels.
            }

            // another person
            const landmarks2 = result.landmarks[1];
            if (landmarks2){
                const leftHipY2 = landmarks2[23].y;
                const rightHipY2 = landmarks2[24].y;
                const leftKneeY2 = landmarks2[25].y;
                const rightKneeY2 = landmarks2[26].y;
                const leftHandY2 = landmarks2[21].y;
                //console.log("leftHandY of person 2 is: ", leftHandY2);
                const rightHandY2 = landmarks2[22].y;
        
                const isJumping2 = leftHipY2 < 0.4 && rightHipY2 < 0.4;
                const isSquatting2 = leftKneeY2 - leftHipY2 < 0.1 && rightKneeY2 - rightHipY2 < 0.1;
                const isLeftHandUp2 = leftHandY2 < 0.5;
                const isRightHandUp2 = rightHandY2 < 0.5;
        
                if (isJumping2){
                    // triggerAnimation("jump");
                    console.log("person 2 jumping");
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                    
                } else if (isSquatting2){
                    // triggerAnimation("squat");
                    console.log("person 2 squatting");
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                
                } 
                 if (isLeftHandUp2){
                    // triggerAnimation("jump");
                    console.log("person 2 squat");
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                }  if (isRightHandUp2){
                    console.log("person 2 jump");
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                }
                // Only overwrite missing pixels.
            }

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
