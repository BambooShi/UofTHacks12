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

const currentTime = Date.now();
let lastJumpTime1 = 0;
let lastJumpTime2 = 0;
const jumpCooldown = 500;

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

            // Person 1 fs
            const landmarks1 = result.landmarks[0];

            if (landmarks1){
                let person;
                if (landmarks1[0].x < 0.5){
                    person = 1;
                }
                else{
                    person = 2;
                }
                //console.log(`You're person #: ${person}`);
                const leftHipY1 = landmarks1[23].y;
                const rightHipY1 = landmarks1[24].y;
                const leftKneeY1 = landmarks1[25].y;
                const rightKneeY1 = landmarks1[26].y;
                const leftHandY1 = landmarks1[21].y;
                //console.log("leftHandY is: ", leftHandY1);
                const rightHandY1 = landmarks1[22].y;
        
                const isJumping1 = leftHipY1 < 0.4 && rightHipY1 < 0.4 && leftHipY1 > 0.0 && rightHipY1 > 0.0 ;
                const isSquatting1 = leftKneeY1 - leftHipY1 < 0.1 && rightKneeY1 - rightHipY1 < 0.1;
                const isLeftHandUp1 = leftHandY1 < 0.5;
                const isRightHandUp1 = rightHandY1 < 0.5;
        
                const currentTime = Date.now();
                if (isJumping1 && (currentTime - lastJumpTime1 > jumpCooldown)) {
                    console.log(`person ${person} jumping`);
                    //sendMotionData({ player1: "jump" });

                    lastJumpTime1 = currentTime; 
                } else if (isSquatting1){
                    // triggerAnimation("squat");
                    console.log(`person ${person} squatting`);
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                
                } 
                /* 
                 if (isLeftHandUp1 && (currentTime - lastJumpTime1 > jumpCooldown)){
                    // triggerAnimation("jump");
                    console.log(`person ${person} squat`);
                    lastJumpTime1 = currentTime; 
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                }  if (isRightHandUp1 && (currentTime - lastJumpTime1 > jumpCooldown)){
                    console.log(`person ${person} jump`);
                    lastJumpTime1 = currentTime; 
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                }
                    */
            }

            // another person
            const landmarks2 = result.landmarks[1];
            if (landmarks2){
                let person;
                if (landmarks2[0].x < 0.5){
                    person = 1;
                }
                else{
                    person = 2;
                }

                const leftHipY2 = landmarks2[23].y;
                const rightHipY2 = landmarks2[24].y;
                const leftKneeY2 = landmarks2[25].y;
                const rightKneeY2 = landmarks2[26].y;
                const leftHandY2 = landmarks2[21].y;
                //console.log("leftHandY of person 2 is: ", leftHandY2);
                const rightHandY2 = landmarks2[22].y;
        
                const isJumping2 = leftHipY2 < 0.4 && rightHipY2 < 0.4 && leftHipY2 > 0.1 && rightHipY2 > 0.1;
                const isSquatting2 = leftKneeY2 - leftHipY2 < 0.1 && rightKneeY2 - rightHipY2 < 0.1;
                const isLeftHandUp2 = leftHandY2 < 0.5;
                const isRightHandUp2 = rightHandY2 < 0.5;
        
                const currentTime = Date.now();
                if (isJumping2 && (currentTime - lastJumpTime2 > jumpCooldown)) {
                    console.log(`person ${person} jumping`);
                    // Send data for person 2's jump
                    //sendMotionData({ player2: "jump" });

                    lastJumpTime2 = currentTime; // Update the last jump time for person 1
                } else if (isSquatting2){
                    // triggerAnimation("squat");
                    console.log(`person ${person} squatting`);
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                    lastJumpTime2 = currentTime;
                } 
                /* 
                 if (isLeftHandUp2 && (currentTime - lastJumpTime1 > jumpCooldown)){
                    // triggerAnimation("jump");
                    console.log(`person ${person} squat`);
                    //sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
                }  if (isRightHandUp2 && (currentTime - lastJumpTime1 > jumpCooldown)){
                    console.log(`person ${person} jump`);
                    lastJumpTime2 = currentTime;
                    //sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
                }
                */
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
