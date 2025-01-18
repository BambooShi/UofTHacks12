import DeviceDetector from "https://cdn.skypack.dev/device-detector-js@2.2.10";
// import { triggerAnimation } from "./gaming.js";
// Usage: testSupport({client?: string, os?: string}[])
// Client and os are regular expressions.
// See: https://cdn.jsdelivr.net/npm/device-detector-js@2.2.10/README.md for
// legal values for client and os
testSupport([
    { client: 'Chrome' },
]);
function testSupport(supportedDevices) {
    const deviceDetector = new DeviceDetector();
    const detectedDevice = deviceDetector.parse(navigator.userAgent);
    let isSupported = false;
    for (const device of supportedDevices) {
        if (device.client !== undefined) {
            const re = new RegExp(`^${device.client}$`);
            if (!re.test(detectedDevice.client.name)) {
                continue;
            }
        }
        if (device.os !== undefined) {
            const re = new RegExp(`^${device.os}$`);
            if (!re.test(detectedDevice.os.name)) {
                continue;
            }
        }
        isSupported = true;
        break;
    }
}
const controls = window;
const drawingUtils = window;
const mpPose = window;
const options = {
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@${mpPose.VERSION}/${file}`;
    }
};
// Our input frames will come from here.
const videoElement = document.getElementsByClassName('input_video')[0];
const canvasElement = document.getElementsByClassName('output_canvas')[0];
const controlsElement = document.getElementsByClassName('control-panel')[0];
const canvasCtx = canvasElement.getContext('2d');

// Optimization: Turn off animated spinner after its hiding animation is done.
const spinner = document.querySelector('.loading');
spinner.ontransitionend = () => {
    spinner.style.display = 'none';
};
function onResults(results) {
    // Hide the spinner.
    document.body.classList.add('loaded');

    const landmarks = results.poseLandmarks;

    if (landmarks){
        const leftHipY = landmarks[23].y;
        const rightHipY = landmarks[24].y;
        const leftKneeY = landmarks[25].y;
        const rightKneeY = landmarks[26].y;
        const leftHandY = landmarks[21].y;
        const rightHandY = landmarks[22].y;

        const isJumping1 = leftHipY < 0.4 && rightHipY < 0.4;
        const isSquatting1 = leftKneeY - leftHipY < 0.1 && rightKneeY - rightHipY < 0.1;
        const isLeftHandUp = leftHandY < 0.5;
        const isRightHandUp = rightHandY < 0.5;


        if (isJumping1){
            // triggerAnimation("jump");
            console.log("jumping");
            sendMotionData({ player2: "", player1: "jump" }); //temporary hardcoded
            
        } else if (isSquatting1){
            // triggerAnimation("squat");
            console.log("squatting");
            sendMotionData({ player2: "", player1: "squat" }); //temporary hardcoded
        
        } 
         if (isLeftHandUp){
            // triggerAnimation("jump");
            console.log("idle");
            sendMotionData({ player2: "jump", player1: "squat" }); //temporary hardcoded
        }  if (isRightHandUp){
            console.log("squat");
            sendMotionData({ player2: "squat", player1: "jump" }); //temporary hardcoded
        }
    }

    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

}
const pose = new mpPose.Pose(options);
pose.onResults(onResults);

// Present a control panel through which the user can manipulate the solution
// options.
new controls
    .ControlPanel(controlsElement, {
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
    effect: 'background',
})
    .add([
    new controls.SourcePicker({
        
        onFrame: async (input, size) => {
            const aspect = size.height / size.width;
            let width, height;
            if (window.innerWidth > window.innerHeight) {
                height = window.innerHeight;
                width = height / aspect;
            }
            else {
                width = window.innerWidth;
                height = width * aspect;
            }
            canvasElement.width = width;
            canvasElement.height = height;
            await pose.send({ image: input });
        },
    }),
])
    .on(x => {
    const options = x;
    pose.setOptions(options);
});

function sendMotionData(data){
    localStorage.setItem("motionData", JSON.stringify(data));
}